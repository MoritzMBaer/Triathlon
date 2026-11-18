/**
 * Triathlon-Sync: Google Sheet <-> intervals.icu
 *
 * Blatt "Plan":      geplante Einheiten -> intervals.icu -> Garmin / Zwift
 * Blatt "Trainings": absolvierte Aktivitäten aus intervals.icu
 * Blatt "Fitness":   Fitness, Ermüdung, Form, Ruhepuls, HRV, Schlaf
 * Blatt "Log":       Protokoll der Durchläufe
 *
 * Bedienung über das Menü "Triathlon" im Sheet.
 * Geheimes liegt nur in den Skript-Eigenschaften (Projekteinstellungen → Skripteigenschaften):
 *   ICU_KEY      API-Schlüssel von intervals.icu
 *   APP_KEY      Schlüssel der App (appSchluesselErzeugen)
 *   DRK_KALENDER Kalender-ID für die Dienste
 *
 * Diese Datei ist die Quelle im Repo. Nach Änderungen komplett in den Apps-Script-Editor kopieren
 * und unter Bereitstellen → Bereitstellungen verwalten eine neue Version der Web-App bereitstellen.
 */

const CFG = {
  BASE: 'https://intervals.icu/api/v1/athlete/0',
  TZ: 'Europe/Berlin',
  TAGE_SYNC: 14,       // so weit zurück wird bei jedem Durchlauf abgeglichen
  TAGE_VERLAUF: 365,   // einmaliger Import der Historie
  LOG_MAX: 300         // so viele Log-Zeilen bleiben erhalten
};

// Sportart im Sheet -> Typ bei intervals.icu (Kraft und Ruhe bleiben nur im Sheet)
const SPORT = {
  'Laufen': 'Run',
  'Rad': 'Ride',
  'Rad (Zwift)': 'VirtualRide',
  'Schwimmen': 'Swim'
};

// Typ bei intervals.icu -> Anzeige im Sheet
const SPORT_REV = {
  Run: 'Laufen', TrailRun: 'Laufen', VirtualRun: 'Laufen',
  Ride: 'Rad', GravelRide: 'Rad', MountainBikeRide: 'Rad', VirtualRide: 'Rad (Zwift)',
  Swim: 'Schwimmen', OpenWaterSwim: 'Schwimmen',
  WeightTraining: 'Kraft', Walk: 'Gehen', Hike: 'Wandern'
};

/* ---------- Menü ---------- */

function onOpen() {
  SpreadsheetApp.getUi().createMenu('Triathlon')
    .addItem('Jetzt synchronisieren', 'syncAlles')
    .addItem('Verlauf importieren (1 Jahr)', 'verlaufImportieren')
    .addSeparator()
    .addItem('API-Schlüssel eintragen', 'schluesselEintragen')
    .addItem('Automatik einschalten (alle 30 Min.)', 'automatikEin')
    .addItem('Automatik ausschalten', 'automatikAus')
    .addToUi();
}

function schluesselEintragen() {
  const ui = SpreadsheetApp.getUi();
  const r = ui.prompt('intervals.icu API-Schlüssel',
    'Zu finden auf intervals.icu unter Settings → Developer Settings → API Key.',
    ui.ButtonSet.OK_CANCEL);
  if (r.getSelectedButton() !== ui.Button.OK) return;
  const key = r.getResponseText().trim();
  if (!key) return;
  PropertiesService.getScriptProperties().setProperty('ICU_KEY', key);
  const test = api_('get', '', null, true);
  if (test.ok) {
    ui.alert('Verbindung klappt' + (test.data && test.data.name ? ': ' + test.data.name : '') + '.');
    log_('Einrichtung', 'API-Schlüssel gespeichert, Verbindung ok');
  } else {
    ui.alert('Verbindung fehlgeschlagen (' + test.code + '). Bitte den Schlüssel prüfen.');
  }
}

function automatikEin() {
  automatikAus_();
  ScriptApp.newTrigger('syncAlles').timeBased().everyMinutes(30).create();
  log_('Automatik', 'eingeschaltet (alle 30 Min.)');
  SpreadsheetApp.getUi().alert('Automatik ist an. Das Sheet gleicht sich jetzt alle 30 Minuten mit intervals.icu ab.');
}

function automatikAus() {
  automatikAus_();
  log_('Automatik', 'ausgeschaltet');
  SpreadsheetApp.getUi().alert('Automatik ist aus.');
}

function automatikAus_() {
  ScriptApp.getProjectTriggers()
    .filter(t => t.getHandlerFunction() === 'syncAlles')
    .forEach(t => ScriptApp.deleteTrigger(t));
}

/* ---------- Hauptabläufe ---------- */

function syncAlles() {
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(20000)) return;
  try {
    const e = einst_();
    try { einstellungenSenden_(e); } catch (err) { log_('Einstellungen Fehler', String(err.message || err).slice(0, 400)); }
    const p = planSenden_(e);
    const t = trainingsHolen_(CFG.TAGE_SYNC);
    try {
      const tst = testsAuswerten_();
      if (tst) { log_('Test übernommen', tst); einstellungenSenden_(einst_()); }
    } catch (err) { log_('Test Fehler', String(err.message || err).slice(0, 400)); }
    const f = fitnessHolen_(CFG.TAGE_SYNC);
    log_('Sync', p + ' | Trainings: ' + t + ' | Fitness: ' + f);
  } catch (e) {
    log_('Sync Fehler', String(e.message || e).slice(0, 400));
  } finally {
    lock.releaseLock();
  }
}

function verlaufImportieren() {
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(20000)) { SpreadsheetApp.getUi().alert('Gerade läuft ein Abgleich. Bitte in einer Minute nochmal.'); return; }
  try {
    const t = trainingsHolen_(CFG.TAGE_VERLAUF);
    const f = fitnessHolen_(CFG.TAGE_VERLAUF);
    log_('Verlauf-Import', 'Trainings: ' + t + ' | Fitness: ' + f);
    SpreadsheetApp.getUi().alert('Import fertig. Trainings: ' + t + '. Fitness: ' + f + '.');
  } finally {
    lock.releaseLock();
  }
}

/* ---------- Plan -> intervals.icu ---------- */

function planSenden_(e) {
  e = e || einst_();
  const sh = blatt_('Plan');
  const last = sh.getLastRow();
  if (last < 2) return 'Plan: leer';

  const daten = sh.getRange(2, 1, last - 1, 11).getValues();
  const ab = heute_(-1);
  let neu = 0, geaendert = 0, geloescht = 0, fehler = 0, dirty = false;

  daten.forEach(r => {
    const pid = r[0], sport = String(r[2] || '').trim();
    const status = String(r[7] || '').trim().toLowerCase();
    const icuId = String(r[8] || '').trim();
    const d = datum_(r[1]);
    try {
      if (status === 'löschen') {
        if (icuId) {
          const del = api_('delete', '/events/' + icuId, null, true);
          if (!del.ok && del.code !== 404) throw new Error('Löschen ' + del.code + ' ' + del.text);
        }
        r[7] = 'gelöscht'; r[8] = ''; r[9] = jetzt_(); r[10] = '';
        geloescht++; dirty = true;
        return;
      }
      if (status === 'gelöscht' || !d || d < ab) return;
      const typ = SPORT[sport];
      if (!typ) return; // Kraft, Ruhe usw. bleiben nur im Sheet

      const body = {
        category: 'WORKOUT',
        start_date_local: d + 'T00:00:00',
        type: typ,
        name: datumsName_(d, String(r[3] || sport)),
        description: zielText_(r[4], e)
      };
      const dauer = Number(r[5]);
      if (dauer > 0) body.moving_time = Math.round(dauer * 60);

      const summe = pruef_(JSON.stringify(body));
      if (icuId && summe === String(r[10])) return; // unverändert

      if (icuId) {
        const res = api_('put', '/events/' + icuId, body, true);
        if (res.code === 404) {
          r[8] = String(api_('post', '/events', body).data.id); neu++;
        } else if (!res.ok) {
          throw new Error('Ändern ' + res.code + ' ' + res.text);
        } else {
          geaendert++;
        }
      } else {
        r[8] = String(api_('post', '/events', body).data.id); neu++;
      }
      r[7] = 'an Garmin'; r[9] = jetzt_(); r[10] = summe; dirty = true;
    } catch (e) {
      r[7] = 'Fehler'; r[9] = jetzt_(); dirty = true; fehler++;
      log_('Plan ' + pid, String(e.message || e).slice(0, 400));
    }
  });

  // Nur die Spalten Status bis Prüfsumme zurückschreiben, der Rest bleibt unberührt
  if (dirty) sh.getRange(2, 8, daten.length, 4).setValues(daten.map(r => [r[7], r[8], r[9], r[10]]));
  return 'Plan: ' + neu + ' neu, ' + geaendert + ' geändert, ' + geloescht + ' gelöscht, ' + fehler + ' Fehler';
}

/* ---------- intervals.icu -> Trainings ---------- */

function trainingsHolen_(tage) {
  const res = api_('get', '/activities?oldest=' + heute_(-tage) + '&newest=' + heute_(0));
  const acts = (res.data || []).filter(a => a && a.id && a.type);

  const zeilen = acts.map(a => {
    const t = String(a.start_date_local || '');
    let pace = '';
    if (a.average_speed && /Run|Walk|Hike/.test(a.type)) {
      const sek = Math.round(1000 / a.average_speed);
      pace = Math.floor(sek / 60) + ':' + ('0' + (sek % 60)).slice(-2);
    }
    return [
      String(a.id),
      t.slice(0, 10),
      t.slice(11, 16),
      SPORT_REV[a.type] || a.type,
      a.name || '',
      a.moving_time ? Math.round(a.moving_time / 60) : '',
      a.distance ? Math.round(a.distance / 10) / 100 : '',
      v_(a.icu_training_load),
      a.average_heartrate ? Math.round(a.average_heartrate) : '',
      a.icu_average_watts ? Math.round(a.icu_average_watts) : '',
      a.icu_weighted_avg_watts ? Math.round(a.icu_weighted_avg_watts) : '',
      pace,
      v_(a.icu_rpe),
      v_(a.feel)
    ];
  });

  const sh = blatt_('Trainings');
  const e = upsert_(sh, zeilen, 14, x => String(x));
  sortieren_(sh, 14, [{ column: 2, ascending: true }, { column: 3, ascending: true }]);
  return e.neu + ' neu, ' + e.aktualisiert + ' aktualisiert';
}

/* ---------- intervals.icu -> Fitness ---------- */

function fitnessHolen_(tage) {
  const res = api_('get', '/wellness?oldest=' + heute_(-tage) + '&newest=' + heute_(0));
  const r1 = x => (x === null || x === undefined) ? '' : Math.round(x * 10) / 10;

  const zeilen = (res.data || []).filter(w => w && w.id).map(w => [
    String(w.id),
    r1(w.ctl),
    r1(w.atl),
    (w.ctl != null && w.atl != null) ? r1(w.ctl - w.atl) : '',
    v_(w.restingHR),
    r1(w.hrv),
    w.sleepSecs ? Math.round(w.sleepSecs / 360) / 10 : '',
    r1(w.weight),
    v_(w.sleepScore),
    v_(w.readiness),
    v_(w.vo2max)
  ]);

  const sh = blatt_('Fitness');
  const e = upsert_(sh, zeilen, 11, datum_);
  sortieren_(sh, 11, [{ column: 1, ascending: true }]);
  return e.neu + ' neu, ' + e.aktualisiert + ' aktualisiert';
}

/* ---------- Hilfsfunktionen ---------- */

function api_(method, path, body, soft) {
  const key = PropertiesService.getScriptProperties().getProperty('ICU_KEY');
  if (!key) throw new Error('Kein API-Schlüssel. Menü Triathlon → API-Schlüssel eintragen.');
  const opt = {
    method: method,
    muteHttpExceptions: true,
    headers: { Authorization: 'Basic ' + Utilities.base64Encode('API_KEY:' + key) }
  };
  if (body) { opt.contentType = 'application/json'; opt.payload = JSON.stringify(body); }
  const res = UrlFetchApp.fetch(CFG.BASE + path, opt);
  const code = res.getResponseCode();
  const text = res.getContentText() || '';
  let data = null;
  try { data = text ? JSON.parse(text) : null; } catch (e) { /* kein JSON */ }
  const ok = code >= 200 && code < 300;
  if (!ok && !soft) throw new Error(method.toUpperCase() + ' ' + path + ' → ' + code + ' ' + text.slice(0, 200));
  return { ok: ok, code: code, text: text.slice(0, 300), data: data };
}

// Fügt Zeilen ein oder aktualisiert sie anhand der ersten Spalte
function upsert_(sh, zeilen, breite, schluessel) {
  const index = {};
  const last = sh.getLastRow();
  if (last >= 2) {
    sh.getRange(2, 1, last - 1, 1).getValues().forEach((r, i) => { index[schluessel(r[0])] = i + 2; });
  }
  const neu = [];
  let aktualisiert = 0;
  zeilen.forEach(z => {
    const row = index[schluessel(z[0])];
    if (row) { sh.getRange(row, 1, 1, breite).setValues([z]); aktualisiert++; }
    else neu.push(z);
  });
  if (neu.length) sh.getRange(sh.getLastRow() + 1, 1, neu.length, breite).setValues(neu);
  return { neu: neu.length, aktualisiert: aktualisiert };
}

function sortieren_(sh, breite, spec) {
  const last = sh.getLastRow();
  if (last > 2) sh.getRange(2, 1, last - 1, breite).sort(spec);
}

function blatt_(name) {
  const sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(name);
  if (!sh) throw new Error('Blatt "' + name + '" fehlt.');
  return sh;
}

function datum_(v) {
  if (v instanceof Date) return Utilities.formatDate(v, CFG.TZ, 'yyyy-MM-dd');
  const s = String(v || '').trim();
  let m = s.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (m) return m[1] + '-' + m[2] + '-' + m[3];
  m = s.match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})$/);
  if (m) return m[3] + '-' + ('0' + m[2]).slice(-2) + '-' + ('0' + m[1]).slice(-2);
  return '';
}

function heute_(offset) {
  const d = new Date();
  d.setDate(d.getDate() + (offset || 0));
  return Utilities.formatDate(d, CFG.TZ, 'yyyy-MM-dd');
}

function jetzt_() {
  return Utilities.formatDate(new Date(), CFG.TZ, 'yyyy-MM-dd HH:mm');
}

function pruef_(s) {
  return Utilities.computeDigest(Utilities.DigestAlgorithm.MD5, s, Utilities.Charset.UTF_8)
    .map(b => ('0' + (b & 0xff).toString(16)).slice(-2)).join('');
}

function v_(x) {
  return (x === null || x === undefined) ? '' : x;
}

function log_(aktion, ergebnis) {
  const sh = blatt_('Log');
  sh.appendRow([jetzt_(), aktion, ergebnis]);
  const ueber = sh.getLastRow() - 1 - CFG.LOG_MAX;
  if (ueber > 0) sh.deleteRows(2, ueber);
}
/* =====================================================================
 * App-Schnittstelle für die Triathlon-App (GitHub Pages)
 *
 * Die App liest hierüber Plan, Trainings, Fitness, Kraftlog, Kurz-Check
 * und Dienste und speichert Häkchen, Kraftsätze und den Kurz-Check.
 * Zugriff nur per POST mit dem App-Schlüssel (liegt in den Skript-Eigenschaften).
 * ===================================================================== */

const APP = {
  BLAETTER: { plan: 'Plan', trainings: 'Trainings', fitness: 'Fitness', kraftlog: 'Kraftlog', check: 'Check', einstellungen: 'Einstellungen', geraete: 'Geräte', saison: 'Saison' }
};

/** Einmal im Editor ausführen: erzeugt den App-Schlüssel und zeigt ihn im Ausführungsprotokoll. */
function appSchluesselErzeugen() {
  const key = Utilities.getUuid().replace(/-/g, '') + Utilities.getUuid().replace(/-/g, '').slice(0, 8);
  PropertiesService.getScriptProperties().setProperty('APP_KEY', key);
  Logger.log('Dein App-Schlüssel: ' + key);
}

/* Kein Lesen per GET: der Schlüssel stünde sonst in der Adresse (Verlauf, Protokolle). Die App nutzt nur POST. */

function appAlles_() {
  const out = {};
  Object.keys(APP.BLAETTER).forEach(k => out[k] = appBlatt_(APP.BLAETTER[k]));
  out.dienste = appDienste_();
  out.stand = Utilities.formatDate(new Date(), 'Europe/Berlin', "yyyy-MM-dd'T'HH:mm:ss");
  return out;
}

function doPost(e) {
  return appAntwort_(() => {
    const b = JSON.parse(e.postData.contents || '{}');
    appPruefen_(b.key);
    if (b.action === 'lesen') return appAlles_();
    /* Eigene Sperre fürs Sheet: Die App schreibt nur in Spalte L des Plans, Kraftlog, Check und Geräte –
       nichts davon fasst der Abgleich mit intervals.icu an. So wartet ein Speichern nicht auf einen langen Abgleich. */
    const lock = LockService.getDocumentLock() || LockService.getScriptLock();
    if (!lock.tryLock(15000)) throw new Error('Beschäftigt, bitte gleich nochmal');
    try {
      if (b.action === 'erledigt') return appErledigt_(b.id, b.wert || '');
      if (b.action === 'kraft') return appKraft_(b.id, b.zeilen || []);
      if (b.action === 'check') return appCheck_(b);
      if (b.action === 'notiz') return appNotiz_(b);
      throw new Error('Unbekannte Aktion');
    } finally {
      lock.releaseLock();
    }
  });
}

/* ---------- intern ---------- */

function appAntwort_(fn) {
  let res;
  try { res = { ok: true, data: fn() }; }
  catch (err) { res = { ok: false, fehler: String(err.message || err) }; }
  return ContentService.createTextOutput(JSON.stringify(res)).setMimeType(ContentService.MimeType.JSON);
}

function appPruefen_(key) {
  const soll = PropertiesService.getScriptProperties().getProperty('APP_KEY');
  if (!soll || !key || key !== soll) throw new Error('Kein Zugriff');
}

function appBlatt_(name) {
  const sh = SpreadsheetApp.getActive().getSheetByName(name);
  if (!sh || sh.getLastRow() < 1) return [];
  return sh.getRange(1, 1, sh.getLastRow(), sh.getLastColumn()).getDisplayValues();
}

function appDienste_() {
  const id = PropertiesService.getScriptProperties().getProperty('DRK_KALENDER');
  const cal = id && CalendarApp.getCalendarById(id);
  if (!cal) return [];
  const von = new Date(); von.setDate(von.getDate() - 14);
  const bis = new Date(); bis.setDate(bis.getDate() + 60);
  return cal.getEvents(von, bis).filter(ev => !ev.isAllDayEvent()).map(ev => ({
    titel: ev.getTitle(),
    start: Utilities.formatDate(ev.getStartTime(), 'Europe/Berlin', "yyyy-MM-dd'T'HH:mm"),
    ende: Utilities.formatDate(ev.getEndTime(), 'Europe/Berlin', "yyyy-MM-dd'T'HH:mm")
  }));
}

function appErledigt_(id, wert) {
  const sh = SpreadsheetApp.getActive().getSheetByName(APP.BLAETTER.plan);
  const ids = sh.getRange(2, 1, Math.max(sh.getLastRow() - 1, 1), 1).getValues().map(r => String(r[0]));
  const i = ids.indexOf(String(id));
  if (i < 0) throw new Error('Einheit nicht gefunden');
  sh.getRange(i + 2, 12).setNumberFormat('@').setValue(wert);
  return { id: id, wert: wert };
}

/* Kraftsätze anhängen. Kommt dieselbe Speicherung ein zweites Mal (Antwort ging im Funkloch verloren,
   die App schickt aus dem Ausgang nach), wird nichts doppelt geschrieben. Die Sperre hält doPost. */
function appKraft_(id, zeilen) {
  if (!zeilen.length) throw new Error('Keine Sätze');
  const sh = SpreadsheetApp.getActive().getSheetByName(APP.BLAETTER.kraftlog);
  const stempel = String(zeilen[0].gespeichert);
  const letzte = sh.getLastRow();
  if (letzte > 1) {
    // Spalte B (Einheit) bis J (Gespeichert): gleiche Einheit + gleicher Speicherzeitpunkt = schon da
    const vorhanden = sh.getRange(2, 2, letzte - 1, 9).getDisplayValues()
      .some(r => r[0] === String(id) && r[8] === stempel);
    if (vorhanden) {
      appErledigt_(id, zeilen[0].datum);
      return { gespeichert: 0, doppelt: true };
    }
  }
  const werte = zeilen.map(z => [z.datum, id, z.einheit, z.uebung, z.satz, z.wdh, z.sek, z.kg, z.ziel, z.gespeichert]);
  const ziel = sh.getRange(letzte + 1, 1, werte.length, 10);
  ziel.setNumberFormat('@');
  ziel.setValues(werte);
  appErledigt_(id, zeilen[0].datum);
  return { gespeichert: werte.length };
}

function appCheck_(b) {
  const sh = SpreadsheetApp.getActive().getSheetByName(APP.BLAETTER.check);
  const zeile = [b.datum, b.beine, b.energie, b.motivation, b.uhrzeit, b.schlaf != null ? String(b.schlaf) : ''];
  const daten = sh.getLastRow() > 1 ? sh.getRange(2, 1, sh.getLastRow() - 1, 1).getDisplayValues().map(r => r[0]) : [];
  const i = daten.indexOf(b.datum);
  const r = i >= 0 ? i + 2 : sh.getLastRow() + 1;
  const ziel = sh.getRange(r, 1, 1, 6);
  ziel.setNumberFormat('@');
  ziel.setValues([zeile]);
  return { datum: b.datum };
}

/* Eigene Notiz je Kraftübung (z. B. Sitz- und Polstereinstellung am Gerät) im Blatt "Geräte" */
function appNotiz_(b) {
  const name = String(b.uebung || '').trim();
  if (!name) throw new Error('Übung fehlt');
  const ss = SpreadsheetApp.getActive();
  let sh = ss.getSheetByName(APP.BLAETTER.geraete);
  if (!sh) { sh = ss.insertSheet(APP.BLAETTER.geraete); sh.getRange(1, 1, 1, 3).setValues([['Übung', 'Einstellung', 'Geändert']]).setFontWeight('bold'); sh.setFrozenRows(1); }
  const namen = sh.getLastRow() > 1 ? sh.getRange(2, 1, sh.getLastRow() - 1, 1).getDisplayValues().map(r => r[0]) : [];
  const i = namen.indexOf(name);
  const ziel = sh.getRange(i >= 0 ? i + 2 : sh.getLastRow() + 1, 1, 1, 3);
  ziel.setNumberFormat('@');
  ziel.setValues([[name, String(b.text || '').slice(0, 200), Utilities.formatDate(new Date(), 'Europe/Berlin', 'yyyy-MM-dd HH:mm')]]);
  return { uebung: name };
}

/* Name in intervals.icu, Zwift und auf den Garmin-Geräten mit Datum vorn, z. B. "Mi 12.11. Lauf GA1" */
function datumsName_(d, titel) {
  const tage = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];
  const t = new Date(d + 'T12:00:00');
  return tage[t.getDay()] + ' ' + d.slice(8, 10) + '.' + d.slice(5, 7) + '. ' + titel;
}

/* =====================================================================
 * Bezugswerte aus dem Blatt "Einstellungen" (FTP, Schwellenpuls, Schwellenpace)
 *
 * - Rad-Einheiten stehen im Plan in % der FTP ("- 60m 59-72%") und gehen als Watt an intervals.icu.
 * - Lauf-Schritte in % LTHR / % Pace bekommen den bpm- bzw. Pace-Bereich als Hinweis davor.
 * - Ändert sich ein Wert im Blatt, gehen FTP, Schwellenpuls und Schwellenpace auch an intervals.icu,
 *   und alle kommenden Einheiten werden beim nächsten Durchlauf neu gesendet.
 * ===================================================================== */

function einst_() {
  const out = { ftp: 0, lthr: 0, pace: 0 };
  const sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Einstellungen');
  if (!sh || sh.getLastRow() < 2) return out;
  sh.getRange(2, 1, sh.getLastRow() - 1, 2).getDisplayValues().forEach(r => {
    const k = String(r[0]).toLowerCase(), v = String(r[1]).trim();
    if (!v) return;
    if (/pace/.test(k)) {
      const m = v.match(/(\d+):(\d+)/); const s = m ? Number(m[1]) * 60 + Number(m[2]) : 0;
      if (s >= 150 && s <= 600) out.pace = s;
    } else if (/ftp/.test(k)) {
      const n = parseFloat(v.replace(',', '.')); if (n >= 80 && n <= 500) out.ftp = Math.round(n);
    } else if (/puls/.test(k)) {
      const n = parseFloat(v.replace(',', '.')); if (n >= 120 && n <= 220) out.lthr = Math.round(n);
    }
  });
  return out;
}

/** Workout-Text aus dem Plan in den Text für intervals.icu umrechnen. */
function zielText_(text, e) {
  const r5 = x => Math.round(x / 5) * 5;
  const mmss = s => Math.floor(s / 60) + ':' + ('0' + (s % 60)).slice(-2);
  return String(text || '').split('\n').map(z => {
    let m;
    if (e.ftp && (m = z.match(/^(- .*?)(\d+)-(\d+)%(?!\s*(?:LTHR|Pace))(.*)$/)))
      return m[1] + r5(m[2] * e.ftp / 100) + '-' + r5(m[3] * e.ftp / 100) + 'w' + m[4];
    if (e.lthr && (m = z.match(/^- ((?:\d+m\d+s|\d+m|\d+s) (\d+)-(\d+)% LTHR.*)$/)))
      return '- ' + Math.round(m[2] * e.lthr / 100) + '–' + Math.round(m[3] * e.lthr / 100) + ' bpm ' + m[1];
    if (e.pace && (m = z.match(/^- ((?:\d+m\d+s|\d+m|\d+s) (\d+)-(\d+)% Pace.*)$/)))
      return '- ' + mmss(r5(e.pace / (m[3] / 100))) + '–' + mmss(r5(e.pace / (m[2] / 100))) + '/km ' + m[1];
    return z;
  }).join('\n');
}

/** Geänderte Bezugswerte an intervals.icu senden. Beim ersten Lauf wird nur der Stand gemerkt. */
function einstellungenSenden_(e) {
  const p = PropertiesService.getScriptProperties();
  const sig = JSON.stringify(e);
  const alt = p.getProperty('EINST');
  if (alt === sig) return;
  if (!alt) { p.setProperty('EINST', sig); log_('Einstellungen', 'Stand gemerkt: FTP ' + e.ftp + ', Schwellenpuls ' + e.lthr + ', Pace ' + e.pace + ' s/km'); return; }
  const was = [];
  if (e.ftp) { api_('put', '/sport-settings/Ride', { ftp: e.ftp }); was.push('FTP ' + e.ftp + ' W'); }
  const lauf = {};
  if (e.lthr) { lauf.lthr = e.lthr; was.push('Schwellenpuls ' + e.lthr); }
  if (e.pace) { lauf.threshold_pace = Math.round(10000000 / e.pace) / 10000; was.push('Schwellenpace ' + Math.floor(e.pace / 60) + ':' + ('0' + (e.pace % 60)).slice(-2)); }
  if (Object.keys(lauf).length) api_('put', '/sport-settings/Run' + (e.lthr ? '?recalcHrZones=true' : ''), lauf);
  p.setProperty('EINST', sig);
  log_('Einstellungen', 'an intervals.icu: ' + was.join(', '));
}

/* =====================================================================
 * Testergebnisse automatisch übernehmen
 * - Rampentest (Rad): FTP = 75 % der besten Minute
 * - Lauftest: Schwellenpuls = Ø Puls, Schwellenpace = Ø Pace der besten 20 Minuten
 * Die Werte landen im Blatt "Einstellungen" und gehen von dort an intervals.icu und in alle kommenden Einheiten.
 * ===================================================================== */

function testsAuswerten_() {
  const sh = blatt_('Trainings');
  const last = sh.getLastRow();
  if (last < 2) return '';
  const p = PropertiesService.getScriptProperties();
  const fertig = JSON.parse(p.getProperty('TESTS_FERTIG') || '[]');
  const ab = heute_(-14);
  const out = [];
  sh.getRange(2, 1, last - 1, 6).getDisplayValues().forEach(r => {
    const id = r[0], datum = r[1], name = r[4], dauer = Number(r[5]) || 0;
    if (!id || datum < ab || fertig.indexOf(id) >= 0) return;
    let erg;
    if (/rampentest/i.test(name) && dauer >= 12) erg = rampe_(id, datum);
    else if (/lauftest/i.test(name) && dauer >= 35) erg = lauftest_(id, datum);
    else return;
    fertig.push(id);
    out.push(erg || name + ': keine verwertbaren Daten, Werte bleiben unverändert');
  });
  p.setProperty('TESTS_FERTIG', JSON.stringify(fertig.slice(-50)));
  return out.join(' | ');
}

function streams_(id, typen) {
  const key = PropertiesService.getScriptProperties().getProperty('ICU_KEY');
  const res = UrlFetchApp.fetch('https://intervals.icu/api/v1/activity/' + id + '/streams.json?types=' + typen.join(','), {
    muteHttpExceptions: true,
    headers: { Authorization: 'Basic ' + Utilities.base64Encode('API_KEY:' + key) }
  });
  if (res.getResponseCode() !== 200) throw new Error('Streams ' + id + ' → ' + res.getResponseCode());
  const out = {};
  (JSON.parse(res.getContentText()) || []).forEach(s => { out[s.type] = s.data || []; });
  return out;
}

/* Bestes Fenster von mindestens "sek" Sekunden: wert(i, j) wird für jedes Fenster berechnet, das größte gewinnt */
function bestesFenster_(zeit, sek, wert) {
  let best = null, i = 0;
  for (let j = 0; j < zeit.length; j++) {
    while (i < j && zeit[j] - zeit[i + 1] >= sek) i++;
    if (zeit[j] - zeit[i] < sek) continue;
    const v = wert(i, j);
    if (v != null && (!best || v > best.v)) best = { v: v, i: i, j: j };
  }
  return best;
}

function mittel_(arr, i, j) {
  let s = 0, n = 0;
  for (let k = i; k <= j; k++) if (arr[k] != null && arr[k] > 0) { s += arr[k]; n++; }
  return n ? s / n : null;
}

function rampe_(id, datum) {
  const st = streams_(id, ['time', 'watts']);
  const t = st.time || [], w = st.watts || [];
  if (t.length < 300 || w.length !== t.length) return null;
  const best = bestesFenster_(t, 60, (i, j) => mittel_(w, i, j));
  if (!best || best.v < 120 || best.v > 600) return null;
  const ftp = Math.round(best.v * 0.75);
  einstSetzen_(/ftp/, ftp, 'Aus dem Rampentest vom ' + tag_(datum) + ' übernommen (beste Minute ' + Math.round(best.v) + ' W).');
  return 'Rampentest ' + tag_(datum) + ': beste Minute ' + Math.round(best.v) + ' W → FTP ' + ftp + ' W';
}

function lauftest_(id, datum) {
  const st = streams_(id, ['time', 'distance', 'heartrate']);
  const t = st.time || [], d = st.distance || [], hr = st.heartrate || [];
  if (t.length < 600 || d.length !== t.length) return null;
  const best = bestesFenster_(t, 1200, (i, j) => (d[j] - d[i]) / (t[j] - t[i]));
  if (!best) return null;
  const pace = Math.round((t[best.j] - t[best.i]) / ((d[best.j] - d[best.i]) / 1000));
  const puls = hr.length === t.length ? Math.round(mittel_(hr, best.i, best.j)) : null;
  if (pace < 180 || pace > 480) return null;
  const txt = 'Aus dem Lauftest vom ' + tag_(datum) + ' übernommen (beste 20 Minuten).';
  einstSetzen_(/pace/, Math.floor(pace / 60) + ':' + ('0' + (pace % 60)).slice(-2), txt);
  if (puls && puls >= 130 && puls <= 215) einstSetzen_(/puls/, puls, txt);
  return 'Lauftest ' + tag_(datum) + ': Ø ' + Math.floor(pace / 60) + ':' + ('0' + (pace % 60)).slice(-2) + ' /km' + (puls ? ', Ø Puls ' + puls : '');
}

function einstSetzen_(muster, wert, hinweis) {
  const sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Einstellungen');
  if (!sh || sh.getLastRow() < 2) return;
  const namen = sh.getRange(2, 1, sh.getLastRow() - 1, 1).getDisplayValues().map(r => String(r[0]).toLowerCase());
  const i = namen.findIndex(n => muster.test(n) && !(muster.source === 'puls' && /pace/.test(n)));
  if (i < 0) return;
  const z = sh.getRange(i + 2, 2, 1, 2);
  if (typeof wert === 'string') sh.getRange(i + 2, 2).setNumberFormat('@');
  z.setValues([[wert, hinweis]]);
}

function tag_(d) { return d.slice(8, 10) + '.' + d.slice(5, 7) + '.'; }
