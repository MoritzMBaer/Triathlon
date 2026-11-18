/* Triathlon Tübingen – Web-App. Liest und schreibt das Google Sheet über die Apps-Script-Schnittstelle. */
(function () {
  'use strict';
  const U = window.UEBUNGEN;
  /* Wettkampf: Vorgabe hier, maßgeblich sind die Zeilen „Wettkampf …“ im Blatt „Einstellungen“ */
  let RACE = new Date(2027, 6, 18), RACE_NAME = 'Mey Triathlon Tübingen';
  const DEFAULT_URL = 'https://script.google.com/macros/s/AKfycbxk0WWmaVVCV35hJURxHAzAiwMnXU2E5ki5ZC622Aj_rdhHVkBJBAxeXa3kCGsYp8uC/exec';

  /* ---------- Hilfen ---------- */
  const $ = s => document.querySelector(s);
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
  const pad = n => String(n).padStart(2, '0');
  const iso = d => d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
  const normDate = s => { s = String(s || '').trim(); const m = s.match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})/); return m ? `${m[3]}-${pad(m[2])}-${pad(m[1])}` : s.slice(0, 10); };
  const parseISO = s => { const [y, m, d] = String(s).split('-').map(Number); return new Date(y, m - 1, d); };
  const addDays = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };
  const monday = d => { const x = new Date(d.getFullYear(), d.getMonth(), d.getDate()); return addDays(x, -((x.getDay() + 6) % 7)); };
  const num = v => { if (v == null || v === '') return null; let s = String(v).trim(); if (s.includes(',')) s = s.replace(/\./g, '').replace(',', '.'); const n = parseFloat(s); return isNaN(n) ? null : n; };
  const mean = xs => xs.reduce((a, b) => a + b, 0) / xs.length;
  const sdev = xs => { const m = mean(xs); return Math.sqrt(mean(xs.map(x => (x - m) ** 2))); };
  const de1 = x => (Math.round(x * 10) / 10).toLocaleString('de-DE');
  const fmtKg = k => k == null ? '–' : String(k).replace('.', ',') + ' kg';
  const fmtH = min => { min = Math.round(min || 0); const h = Math.floor(min / 60), m = min % 60; return h ? h + ':' + pad(m) + ' h' : m + ' min'; };
  const WDL = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];
  const WDS = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];
  const MON = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];
  const fmtDay = d => d.getDate() + '. ' + MON[d.getMonth()];
  const fmtShort = d => d.getDate() + '.' + (d.getMonth() + 1) + '.';
  const isoWeek = d => { const t = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate())); const day = t.getUTCDay() || 7; t.setUTCDate(t.getUTCDate() + 4 - day); const y = new Date(Date.UTC(t.getUTCFullYear(), 0, 1)); return Math.ceil(((t - y) / 864e5 + 1) / 7); };
  const today = () => iso(new Date());
  const ls = {
    get(k, d) { try { const v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* voll oder gesperrt */ } },
    del(k) { try { localStorage.removeItem(k); } catch (e) { /* egal */ } }
  };

  /* ---------- Sportarten ---------- */
  const ICON = {
    bike: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="5" cy="16.5" r="4"/><circle cx="19" cy="16.5" r="4"/><path d="M5 16.5h6.6L16 9.2M9.6 9.2H16M9.6 9.2 5 16.5M11.6 16.5 9.3 7.2M16 9.2l3 7.3M7.8 7.2h3.4M16 9.2l-.6-2.4h2.1c1.1 0 1.8.7 1.8 1.7v.6c0 .8-.6 1.3-1.3 1.3"/></svg>',
    run: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="15.5" cy="4.2" r="1.9" fill="currentColor" stroke="none"/><path d="M13.6 7.6 11 13.2M13.6 7.6l3 2.6 2.6-.9M13.6 7.6l-3.4.9-1.7 2.8M11 13.2l3.2 2.3-.9 4.7M11 13.2l-2 3.9-3.6.6"/></svg>',
    swim: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="15.6" cy="11.4" r="1.9" fill="currentColor" stroke="none"/><path d="M12.4 12.6 16 8.2h5"/><path d="M12.6 13.4H4.4"/><path d="M2.5 17.2c1.6 1.1 3.2 1.1 4.8 0s3.2-1.1 4.8 0 3.2 1.1 4.8 0 3.2-1.1 4.8 0"/></svg>',
    kraft: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2.5" y="9" width="3" height="6" rx="1"/><rect x="5.5" y="6.5" width="3.2" height="11" rx="1.2"/><rect x="15.3" y="6.5" width="3.2" height="11" rx="1.2"/><rect x="18.5" y="9" width="3" height="6" rx="1"/><path d="M8.7 12h6.6"/></svg>',
    mob: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="3.8" r="1.9" fill="currentColor" stroke="none"/><path d="M4 7.5c2.6 1.2 5.3 1.7 8 1.7s5.4-.5 8-1.7M12 9.2v5.3M12 14.5 8.2 21M12 14.5l3.8 6.5"/></svg>'
  };
  const CHECK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>';
  const CHEV_D = '<svg class="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>';
  const CHEV_L = '<svg class="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" aria-hidden="true"><path d="m15 18-6-6 6-6"/></svg>';
  const CHEV_R = '<svg class="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" aria-hidden="true"><path d="m9 18 6-6-6-6"/></svg>';
  const SPORT = {
    'Schwimmen': { k: 'swim', fam: 'Schwimmen', ring: true, o: 0 },
    'Rad': { k: 'bike', fam: 'Rad', ring: true, o: 1 },
    'Rad (Zwift)': { k: 'bike', fam: 'Rad', ring: true, o: 1 },
    'Laufen': { k: 'run', fam: 'Laufen', ring: true, o: 2 },
    'Kraft': { k: 'kraft', fam: 'Kraft', ring: true, o: 3 },
    'Mobility': { k: 'mob', fam: 'Mobility', ring: false, o: 9 }
  };
  const sp = s => SPORT[s] || { k: 'mob', fam: s, ring: false, o: 8 };
  const cv = k => `--c:var(--${k});--c-t:var(--${k}-t);--c-d:var(--${k}-d);--c-l:var(--${k}-l);--c-hl:var(--${k}-hl);--c-sep:var(--${k}-sep);--c-mu:var(--${k}-mu);--c-s:var(--${k}-s);--c-mm:var(--${k}-mm,var(--mm-act))`;
  const RINGS = [['Rad', 'bike'], ['Laufen', 'run'], ['Schwimmen', 'swim'], ['Kraft', 'kraft']];

  /* ---------- Zustand ---------- */
  const state = {
    cfg: ls.get('tri:cfg', null),
    data: ls.get('tri:data', null),
    loading: false, err: null, busy: {}, msgs: {},
    weekOff: 0, sheetId: null, active: {}, drafts: {}, open: {}, slide: 0, started: {},
    drillOpen: {}, warmOpen: {}, rirEdit: null, rest: null, timer: null, timerSeen: {}, checkDraft: null, checkEdit: false, checkBusy: false, checkMsg: ''
  };

  /* ---------- Schnittstelle ---------- */
  async function api(action, payload) {
    const cfg = state.cfg;
    if (!cfg || !cfg.url || !cfg.key) throw new Error('nicht eingerichtet');
    const res = await fetch(cfg.url, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify(Object.assign({ action, key: cfg.key }, payload || {})) });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const j = await res.json();
    if (!j.ok) { const err = new Error(j.fehler || 'Fehler'); err.server = true; throw err; }
    return j.data;
  }
  /* Endgültig abgelehnt (falscher Schlüssel, Einheit fehlt …) – anders als kein Netz oder ein gerade beschäftigtes Sheet */
  const refused = e => e.server && !/Beschäftigt|Lock|Sperre|timeout|Zeitüberschreitung/i.test(e.message || '');
  /* ---------- Ausgang: was ohne Netz nicht gespeichert werden konnte, wird später nachgereicht ---------- */
  let outbox = ls.get('tri:outbox', []), flushing = false;
  function enqueue(action, payload, key) { outbox = outbox.filter(o => o.key !== key).concat({ action, payload, key }); ls.set('tri:outbox', outbox); }
  async function flush() {
    if (flushing || !outbox.length) return;
    flushing = true;
    while (outbox.length) {
      const o = outbox[0];
      try { await api(o.action, o.payload); }
      catch (e) { if (!refused(e) || /Kein Zugriff/.test(e.message)) break; /* vom Server abgelehnt: nicht endlos wiederholen */ }
      outbox = outbox.filter(x => x !== o); ls.set('tri:outbox', outbox);
    }
    flushing = false;
  }
  /* Noch nicht übertragene Änderungen über frisch geladene Daten legen */
  function applyOutbox(d) {
    outbox.forEach(o => {
      if (o.action === 'erledigt') { const r = (d.plan || []).find(r => r[0] === o.payload.id); if (r) { while (r.length < 12) r.push(''); r[11] = o.payload.wert; } }
      if (o.action === 'check') putCheck(d, o.payload);
      if (o.action === 'notiz') putNote(d, o.payload);
      if (o.action === 'kraft') putKraft(d, o.payload);
    });
  }
  function putNote(d, n) {
    const rows = d.geraete && d.geraete.length ? d.geraete : (d.geraete = [['Übung', 'Einstellung', 'Geändert']]);
    const i = rows.findIndex((r, k) => k > 0 && r[0] === n.uebung);
    if (i > 0) rows[i][1] = n.text; else rows.push([n.uebung, n.text, '']);
  }
  async function saveNote(name, text, msg) {
    const M = model(); if (!M || (M.notes[name] || '') === text) return;
    const n = { uebung: name, text };
    putNote(state.data, n); state.data._at = Date.now(); ls.set('tri:data', state.data);
    try { await api('notiz', n); outbox = outbox.filter(o => o.key !== 'note:' + name); ls.set('tri:outbox', outbox); toast(msg || 'Einstellung gemerkt'); }
    catch (e) { if (refused(e)) toast('Notiz konnte nicht gespeichert werden'); else { enqueue('notiz', n, 'note:' + name); toast('Gemerkt – wird übertragen, sobald du online bist'); } }
    render();
  }
  function putCheck(d, c) {
    const rows = d.check || (d.check = [['Datum']]);
    const i = rows.findIndex(r => normDate(r[0]) === c.datum);
    const row = [c.datum, String(c.beine), String(c.energie), String(c.motivation), c.uhrzeit || '', c.schlaf != null ? String(c.schlaf) : ''];
    if (i > 0) rows[i] = row; else rows.push(row);
  }
  /* Aufräumen: Zwischenstände zu Einheiten, die älter als 14 Tage oder aus dem Plan verschwunden sind, und alte Schlafwerte */
  function tidy(d) {
    if (!d.plan || d.plan.length < 2) return;
    const cut = iso(addDays(new Date(), -14)), keep = new Set();
    d.plan.slice(1).forEach(r => { if (r[0] && normDate(r[1]) >= cut) keep.add(String(r[0])); });
    const pending = new Set(outbox.filter(o => o.action === 'kraft').map(o => String(o.payload.id)));
    try {
      for (let i = localStorage.length - 1; i >= 0; i--) {
        const m = /^tri:(draft|start|mob|warm):(.+)$/.exec(localStorage.key(i) || '');
        if (m && !keep.has(m[2]) && !pending.has(m[2])) localStorage.removeItem(m[0]);
      }
    } catch (e) { /* Speicher gesperrt */ }
    const sl = ls.get('tri:schlaf', null), scut = iso(addDays(new Date(), -120));
    if (sl) { const n = {}; Object.keys(sl).forEach(k => { if (k >= scut) n[k] = sl[k]; }); ls.set('tri:schlaf', n); }
  }
  async function load(force) {
    if (!state.cfg || state.loading) return;
    if (!force && state.data && Date.now() - (state.data._at || 0) < 60000) return;
    state.loading = true; render();
    try {
      await flush();
      const d = await api('lesen');
      applyOutbox(d);
      d._at = Date.now();
      state.data = d; state.err = null;
      ls.set('tri:data', d);
      tidy(d);
    } catch (e) {
      state.err = String(e.message || e);
    }
    state.loading = false; render();
  }

  /* ---------- Daten aufbereiten ---------- */
  let cache = { at: -1 };
  function model() {
    const d = state.data;
    if (!d) return null;
    if (cache.at === d._at && cache.day === today()) return cache;
    setRefs(d.einstellungen);
    const rows = v => (v || []).slice(1);
    const plan = rows(d.plan).map((r, i) => ({
      id: r[0], date: normDate(r[1]), sport: r[2] || '', title: r[3] || '', workout: r[4] || '', dur: num(r[5]) || 0,
      note: r[6] || '', status: String(r[7] || '').toLowerCase(), done: r[11] || ''
    })).filter(p => p.id && p.date && !['gelöscht', 'löschen'].includes(p.status))
      .sort((a, b) => a.date.localeCompare(b.date) || sp(a.sport).o - sp(b.sport).o);
    const trainings = rows(d.trainings).filter(r => r[0] && r[1]).map(r => ({
      id: r[0], date: normDate(r[1]), time: r[2] || '', sport: r[3] || '', name: r[4] || '', dur: num(r[5]), km: num(r[6]),
      load: num(r[7]), hr: num(r[8]), watt: num(r[9]), np: num(r[10]), pace: r[11] || ''
    }));
    const fitness = rows(d.fitness).filter(r => r[0]).map(r => ({
      date: normDate(r[0]), ctl: num(r[1]), atl: num(r[2]), tsb: num(r[3]), rhr: num(r[4]), hrv: num(r[5]), sleep: num(r[6]), score: num(r[8]), ready: num(r[9]), vo2: num(r[10])
    })).sort((a, b) => a.date.localeCompare(b.date));
    const seen = new Set();
    const klog = rows(d.kraftlog).filter(r => {
      if (!r[1] || !r[3]) return false;
      const k = [r[1], r[3], r[4], r[9]].join('|'); /* Einheit, Übung, Satz, Speicherzeit – doppelt übertragene Sätze nur einmal zählen */
      if (r[9] && seen.has(k)) return false;
      seen.add(k); return true;
    }).map(r => ({
      date: normDate(r[0]), pid: r[1], unit: r[2], ex: r[3], set: num(r[4]), reps: num(r[5]), secs: num(r[6]), kg: num(r[7]), target: r[8] || '', rir: (/RIR (\d)/.exec(r[8] || '') || [])[1] != null ? +/RIR (\d)/.exec(r[8])[1] : null, saved: r[9] || ''
    }));
    const check = rows(d.check).filter(r => r[0] && r[1] !== '').map(r => ({ date: normDate(r[0]), legs: num(r[1]), energy: num(r[2]), mot: num(r[3]), sleep: num(r[5]) != null ? num(r[5]) : (ls.get('tri:schlaf') || {})[normDate(r[0])] ?? null }));
    const shifts = {}, nights = new Set();
    (d.dienste || []).forEach(e => {
      const k = e.start.slice(0, 10), h = +e.start.slice(11, 13), he = +(e.ende || '').slice(11, 13);
      if (h >= 17) nights.add(k);
      shifts[k] = (shifts[k] ? shifts[k] + ', ' : '') + e.titel + ' ' + h + '–' + he + ' Uhr';
    });
    /* Einheiten mit absolvierten Trainings verbinden: gleiche Sportart und mindestens die halbe geplante Dauer
       (eine kurze Fahrt zum Bäcker hakt keine 60-Minuten-Einheit ab). Erst der geplante Tag, danach
       verschobene Ausdauereinheiten: bis zu 3 Tage später oder 1 Tag früher. */
    const used = new Set(), match = {};
    const fits = (p, t) => !used.has(t.id) && sp(t.sport).fam === sp(p.sport).fam && (!p.dur || t.dur == null || t.dur >= p.dur * 0.5);
    const gap = (p, t) => Math.abs((t.dur == null ? p.dur : t.dur) - p.dur);
    plan.forEach(p => {
      const t = trainings.filter(t => t.date === p.date && fits(p, t)).sort((a, b) => gap(p, a) - gap(p, b))[0];
      if (t) { used.add(t.id); match[p.id] = t; }
    });
    const days = (a, b) => Math.round((parseISO(a) - parseISO(b)) / 864e5);
    trainings.slice().sort((a, b) => a.date.localeCompare(b.date)).forEach(t => {
      if (used.has(t.id) || !['Schwimmen', 'Rad', 'Laufen'].includes(sp(t.sport).fam)) return;
      const p = plan.filter(p => !match[p.id] && !p.done && fits(p, t) && days(t.date, p.date) >= -1 && days(t.date, p.date) <= 3)
        .sort((a, b) => (Math.abs(days(t.date, a.date)) * 30 + gap(a, t)) - (Math.abs(days(t.date, b.date)) * 30 + gap(b, t)))[0];
      if (p) { used.add(t.id); match[p.id] = t; }
    });
    const notes = {}; rows(d.geraete).forEach(r => { if (r[0]) notes[r[0]] = r[1] || ''; });
    readSwaps(notes);
    const sh0 = (d.saison && d.saison[0]) || [], col = n => sh0.findIndex(h => String(h).trim().toLowerCase() === n);
    const sc = { swim: col('schwimmen'), bike: col('rad'), run: col('laufen'), kraft: col('kraft') };
    const saison = rows(d.saison).filter(r => /^\d{4}-\d{2}-\d{2}$/.test(normDate(r[1])) && /^\d{4}-\d{2}-\d{2}$/.test(normDate(r[2])))
      .map(r => ({ name: r[0], von: normDate(r[1]), bis: normDate(r[2]), fokus: r[3] || '', std: r[4] || '', sp: Object.fromEntries(Object.entries(sc).map(([k, i]) => [k, i >= 0 ? String(r[i] || '').trim() : ''])) }))
      .sort((a, b) => a.von.localeCompare(b.von));
    cache = { at: d._at, day: today(), notes, saison, plan, trainings, fitness, klog, check, shifts, nights, match };
    return cache;
  }
  function statusOf(p, M) {
    if (M.match[p.id] || p.done) return 'done';
    if (p.date < today()) return canCatch(p) ? 'catch' : 'miss';
    return 'open';
  }
  /* Verpasste Kraft-/Mobility-Einheiten der laufenden Woche bleiben nachholbar */
  function canCatch(p) {
    return ['Kraft', 'Mobility'].includes(sp(p.sport).fam) && p.date >= iso(monday(new Date()));
  }

  /* ---------- Tagesform ---------- */
  function readiness(M) {
    const F = M.fitness;
    if (!F.length) return null;
    const raw = F[F.length - 1], before = F.filter(f => f.date < raw.date);
    /* Fehlen heute noch Werte (Uhr noch nicht synchronisiert), die vom Vortag nehmen und kennzeichnen */
    const prev = before[before.length - 1], old = [];
    const last = Object.assign({}, raw);
    if (prev && prev.date === iso(addDays(parseISO(raw.date), -1))) ['sleep', 'score', 'hrv', 'rhr'].forEach(k => { if (last[k] == null && prev[k] != null) { last[k] = prev[k]; old.push(k); } });
    const flags = [], notes = [];
    const afterNight = M.nights.has(iso(addDays(new Date(), -1)));
    const from60 = iso(addDays(parseISO(last.date), -60));
    const base = before.filter(f => f.date >= from60 && f.hrv != null).map(f => f.hrv);
    let range = null;
    if (base.length >= 14) {
      const m = mean(base), s = sdev(base); range = [Math.round(m - s), Math.round(m + s)];
      const two = F.filter(f => f.hrv != null).slice(-2);
      if (afterNight) { /* Nach dem Nachtdienst zählt die HRV nicht */ }
      else if (two.length === 2 && two.every(f => f.hrv < m - s)) flags.push(`HRV seit 2 Tagen unter deinem Normalbereich (${range[0]}–${range[1]})`);
      else if (raw.hrv != null && raw.hrv < m - s) notes.push('HRV heute niedrig, noch kein Trend');
    }
    const rh = before.slice(-7).map(f => f.rhr).filter(x => x != null);
    if (!afterNight && last.rhr != null && rh.length >= 3 && last.rhr > mean(rh) + 5) flags.push(`Ruhepuls ${last.rhr}, Schnitt ${Math.round(mean(rh))}`);
    if (old.length && !afterNight) { const nm = { sleep: 'Schlaf', score: 'Score', hrv: 'HRV', rhr: 'Ruhepuls' }, ns = old.map(k => nm[k]); notes.push(`${ns.length > 1 ? ns.slice(0, -1).join(', ') + ' und ' + ns[ns.length - 1] : ns[0]} von heute ${ns.length > 1 ? 'fehlen' : 'fehlt'} noch`); }
    const sl = afterNight ? null : last.sleep, sc = afterNight ? null : last.score;
    if (sl != null && sl < 6) flags.push(`Schlaf ${de1(sl)} h`);
    if (sc != null && sc < 60) flags.push(`Schlafscore ${Math.round(sc)}`);
    if (last.tsb != null && last.tsb < -25) flags.push(`Form ${de1(last.tsb)}`);
    const ck = M.check.find(c => c.date === today());
    let feelRed = false;
    if (ck) {
      const a = mean([ck.legs, ck.energy, ck.mot].filter(x => x != null));
      if (a <= 1.5) { feelRed = true; flags.push(`Gefühl ${de1(a)} von 5`); } else if (a <= 2.5) flags.push(`Gefühl ${de1(a)} von 5`);
    }
    if (afterNight && ck && ck.sleep != null && ck.sleep <= 2) flags.push(`Schlaf ${ck.sleep} von 5`);
    const lvl = feelRed || flags.length >= 2 ? 'r' : flags.length === 1 ? 'y' : afterNight && !ck ? 'n' : 'g';
    return { lvl, flags, notes, last, old, range, afterNight, stale: last.date !== today() };
  }
  /* Harte Einheit: Tests und Intervalle am Titel, sonst mindestens 10 min im Tempo- oder Schwellenbereich.
     Ab 76 % FTP am Rad, ab 89 % Schwellenpuls oder 90 % der Schwellengeschwindigkeit beim Laufen. Kurze Steigerungen zählen nicht. */
  const INTENSE = /test|rampe|vo2|intervall|schwelle|renntempo|wettkampftempo/i;
  function isHard(p) {
    if (p.sport === 'Kraft') return /Schwerer/.test(p.note);
    if (INTENSE.test(p.title)) return true;
    let min = 0;
    blocks(p).forEach(b => b.steps.forEach(st => {
      if (st.pause || !st.v || /mtr$/.test(st.raw)) return;
      const lim = /^HF/.test(st.tgt) ? 0.89 : /\/km/.test(st.tgt) ? 0.9 : / W$/.test(st.tgt) ? 0.76 : 9;
      if (st.v >= lim) min += amount(st.raw) * (b.rep || 1);
    }));
    return min >= 10;
  }
  function advice(r, units) {
    if (r.lvl === 'g' || r.lvl === 'n') return '';
    const train = units.filter(p => sp(p.sport).fam !== 'Mobility');
    if (r.lvl === 'r') return train.length ? 'Lass die Einheiten heute aus. Mobility tut trotzdem gut.' : 'Heute ist ohnehin frei. Gönn dir die Pause.';
    const hard = train.filter(isHard);
    if (hard.length) return hard.map(p => p.sport === 'Kraft' ? `${p.title}: mit dem Gewicht vom letzten Mal, ohne Steigerung.` : `Statt „${p.title}“: gleiche Dauer ganz locker im Grundlagenbereich.`).join(' ');
    return train.length ? 'Lockere Einheiten wie geplant, eher kürzer und nicht ausreizen.' : '';
  }

  /* ---------- Workout lesbar machen ---------- */
  function fmtDur(t) {
    let m;
    if ((m = t.match(/^(\d+)mtr$/))) return m[1] + ' m';
    if ((m = t.match(/^(\d+)m(\d+)s$/))) return m[1] + ':' + pad(m[2]) + ' min';
    if ((m = t.match(/^(\d+)m$/))) return m[1] + ' min';
    if ((m = t.match(/^(\d+)s$/))) return m[1] + ' s';
    return t;
  }
  const r5 = x => Math.round(x / 5) * 5;
  const paceAt = pct => { const sec = r5(TPACE / (pct / 100)); return Math.floor(sec / 60) + ':' + pad(sec % 60); };
  function splitTarget(s, cue) {
    let m;
    cue = (cue || '').trim();
    /* Lauf nach Puls: intervals.icu bekommt % LTHR, auf der Uhr steht der bpm-Bereich als Hinweis davor */
    const bpm = cue.match(/^(\d+)\s*[-–]\s*(\d+)\s*bpm$/);
    if ((m = s.match(/^(\d+)-(\d+)%\s*LTHR\s*(.*)$/))) return bpm ? { t: 'HF ' + bpm[1] + '–' + bpm[2], l: m[3], v: +bpm[1] / LTHR } : { t: 'HF ' + Math.round(m[1] * LTHR / 100) + '–' + Math.round(m[2] * LTHR / 100), l: m[3] || cue, v: m[1] / 100 };
    if ((m = s.match(/^(\d+)-(\d+)w\b\s*(.*)$/))) return { t: m[1] + '–' + m[2] + ' W', l: m[3] || cue, v: +m[1] / FTP };
    if ((m = s.match(/^(\d+)w\b\s*(.*)$/))) return { t: m[1] + ' W', l: m[2] || cue, v: +m[1] / FTP };
    if ((m = s.match(/^(\d+)-(\d+)bpm HR\s*(.*)$/))) return { t: 'HF ' + m[1] + '–' + m[2], l: m[3] || cue, v: +m[1] / LTHR };
    /* Lauf nach Pace in % der Schwellenpace: die Pace steht als Hinweis davor („4:40–5:00/km 20s 108-116% Pace“) */
    const pc = cue.match(/^(\d+):(\d+)\s*[-–]\s*(\d+:\d+)\s*\/km$/);
    if ((m = s.match(/^(\d+)-(\d+)%\s*Pace\s*(.*)$/))) return pc ? { t: pc[1] + ':' + pc[2] + '–' + pc[3] + ' /km', l: m[3], v: TPACE / (+pc[1] * 60 + +pc[2]) } : { t: paceAt(m[2]) + '–' + paceAt(m[1]) + ' /km', l: m[3] || cue, v: m[2] / 100 };
    /* Rad in % der FTP: Watt aus dem Blatt „Einstellungen“, auf 5 W gerundet (wie beim Senden an intervals.icu) */
    if ((m = s.match(/^(\d+)-(\d+)%\s*(.*)$/))) return { t: r5(m[1] * FTP / 100) + '–' + r5(m[2] * FTP / 100) + ' W', l: m[3] || cue, v: m[1] / 100 };
    if ((m = s.match(/^([\d:]+)-([\d:]+)\/km Pace\s*(.*)$/))) { const [mm, ss] = m[1].split(':').map(Number); return { t: m[1] + '–' + m[2] + ' /km', l: m[3] || cue, v: TPACE / ((mm || 7) * 60 + (ss || 0)) }; }
    const pm = s.match(/^(.*?)\.?\s*(\d+) s Pause\s*$/);
    if (pm) return { t: 'Pause ' + pm[2] + ' s', l: pm[1], pause: true, v: 0 };
    return { t: '', l: [cue, s].filter(Boolean).join(' '), v: 0 };
  }
  /* Bezugswerte, damit Puls-, Pace- und Wattangaben in einer Einheit vergleichbar hoch dargestellt werden */
  /* Bezugswerte für die Balkenhöhen. Vorgabe hier, maßgeblich ist das Blatt „Einstellungen“ im Sheet. */
  let LTHR = 182, FTP = 210, TPACE = 325;
  function setRefs(rows) {
    (rows || []).slice(1).forEach(r => {
      const k = String(r[0] || '').toLowerCase(), v = String(r[1] || '').trim();
      if (!v) return;
      if (/wettkampf|rennen/.test(k)) {
        if (/name/.test(k)) { RACE_NAME = v; return; }
        const d = normDate(v); if (/^\d{4}-\d{2}-\d{2}$/.test(d)) RACE = parseISO(d);
        return;
      }
      if (/pace/.test(k)) { const m = v.match(/(\d+):(\d+)/); const sec = m ? +m[1] * 60 + +m[2] : 0; if (sec >= 150 && sec <= 600) TPACE = sec; }
      else if (/ftp/.test(k)) { const n = num(v); if (n >= 80 && n <= 500) FTP = n; }
      else if (/puls/.test(k)) { const n = num(v); if (n >= 120 && n <= 220) LTHR = n; }
    });
  }
  const DUR_RE = /(^|\s)(\d+m\d+s|\d+mtr|\d+m|\d+s)(?=\s|$)/;
  function blocks(p) {
    const out = []; let cur = null;
    p.workout.split('\n').forEach(raw => {
      const l = raw.trim();
      if (!l) { cur = null; return; }
      /* Schritt: „- [Hinweis] Dauer Ziel“ – die Dauer muss nicht vorn stehen */
      const st = /^-\s*/.test(l) && l.replace(/^-\s*/, '').match(DUR_RE);
      if (st) {
        if (!cur) { cur = { h: '', rep: 0, steps: [] }; out.push(cur); }
        const body = l.replace(/^-\s*/, ''), cue = body.slice(0, st.index + st[1].length), rest = body.slice(st.index + st[0].length).trim();
        /* Echter Pausen-Schritt für die Uhr („- 20s intensity=rest“): in der App an die vorige Übung hängen, wie bisher „Pause 20 s“ */
        if (/\bintensity=rest\b/.test(rest)) {
          const pt = 'Pause ' + fmtDur(st[2]), prev = cur.steps[cur.steps.length - 1];
          if (prev && !prev.pause && !prev.tgt) { prev.tgt = pt; prev.pause = true; }
          else cur.steps.push({ dur: '', raw: st[2], tgt: pt, lab: '', pause: true, v: 0 });
          return;
        }
        const tg = splitTarget(rest, cue);
        cur.steps.push({ dur: fmtDur(st[2]), raw: st[2], tgt: tg.t, lab: tg.l, pause: tg.pause, v: tg.v });
      } else {
        const rep = l.match(/^(.*?)\s+(\d+)x$/);
        cur = { h: rep ? rep[1] : l, rep: rep ? +rep[2] : 0, steps: [] };
        out.push(cur);
      }
    });
    return out;
  }
  function amount(raw) { let m; if ((m = raw.match(/^(\d+)mtr$/))) return +m[1]; if ((m = raw.match(/^(\d+)m(\d+)s$/))) return +m[1] + m[2] / 60; if ((m = raw.match(/^(\d+)m$/))) return +m[1]; if ((m = raw.match(/^(\d+)s$/))) return m[1] / 60; return 1; }
  function intensityOf(st) { return st.v || 0; }
  function flowBar(bl, k) {
    const flat = [];
    bl.forEach(b => { const n = b.rep || 1; for (let i = 0; i < n; i++) b.steps.forEach(s => flat.push(s)); });
    if (!flat.length) return '';
    const ints = flat.map(s => intensityOf(s));
    const max = Math.max(...ints), min = Math.min(...ints.filter(x => x > 0), max);
    const mainIdx = mainStep(bl);
    return `<div class="flow" role="img" aria-label="Ablauf der Einheit">${flat.map((s, i) => {
      const v = ints[i], h = !v || max === min ? (s.pause || !v ? 45 : 70) : 35 + 65 * (v - min) / (max - min || 1);
      const hard = h > 80;
      return `<i style="flex:${Math.max(amount(s.raw), 0.35).toFixed(2)};height:${Math.round(h)}%;background:var(--c${hard ? '-hl' : h > 55 ? '' : '-l'})"></i>`;
    }).join('')}</div>`;
  }
  function mainStep(bl) {
    let best = null, bv = -1;
    bl.forEach((b, bi) => b.steps.forEach((s, si) => { const v = intensityOf(s) * (b.rep ? 1.2 : 1) + amount(s.raw) / 1000; if (v > bv && !s.pause) { bv = v; best = bi + ':' + si; } }));
    return best;
  }
  /* Schwimm-Technikübungen: kurze Erklärung direkt unter dem Block */
  const DRILLS = {
    'abschlag': ['Abschlag', 'Ein Arm bleibt vorn gestreckt, bis der andere nach dem Zug vorn ankommt und ihn „abschlägt“. Erst dann zieht der vordere Arm.', 'Lange Gleitphase und ruhiges Timing zwischen beiden Armen.'],
    'fäuste': ['Fäuste', 'Kraul mit geschlossenen Fäusten. Danach wieder mit offener Hand weiterschwimmen.', 'Du ziehst mit dem ganzen Unterarm und hältst den Ellbogen hoch. Mit offener Hand spürst du danach deutlich mehr Druck am Wasser.'],
    'einarmig': ['Einarmig', 'Nur ein Arm zieht, der andere bleibt vorn gestreckt liegen. Zur Seite des ziehenden Arms atmen, nach jeder Bahn den Arm wechseln.', 'Ein vollständiger Zug bis zur Hüfte und eine Körperdrehung, die mit dem Zug mitgeht.'],
    'wriggen': ['Wriggen', 'Pullbuoy zwischen die Oberschenkel, Gesicht im Wasser, Arme vor dem Kopf gestreckt. Die Hände drücken in kleinen, flachen Achterbewegungen abwechselnd nach außen und innen, dadurch kommst du langsam voran. Nach 25 m in normales Kraul übergehen.', 'Gefühl für den Wasserdruck an Hand und Unterarm. Das ist die Grundlage für einen Zug, der früh greift.'],
    'seitlage-kick': ['Seitlage-Kick', 'Mit Flossen. Auf der Seite liegen, der untere Arm vorn gestreckt, der obere an der Hüfte, Gesicht im Wasser. 6 Beinschläge, dann ein Zug und auf die andere Seite rollen. Zum Atmen nur den Kopf drehen, mit Schnorchel einfach weiteratmen.', 'Gleichgewicht in Seitlage und eine Rotation, die aus der Hüfte kommt. Genau diese Position hast du bei jedem Kraulzug.'],
    'reißverschluss': ['Reißverschluss', 'Normales Kraul, aber in der Rückholphase streifen die Daumen seitlich am Körper entlang von der Hüfte bis zur Achsel, wie beim Hochziehen eines Reißverschlusses. Dann vor der Schulter eintauchen.', 'Hoher Ellbogen in der Rückholphase und ein Eintauchen vor der Schulter statt über die Körpermitte.'],
    'rechts-links': ['Rechts-Links', '3 Züge nur mit dem rechten Arm, der linke bleibt vorn gestreckt. Dann 3 Züge nur links, dann 3 Züge normales Kraul. So im Wechsel weiter.', 'Jeder Arm wird einzeln sauber, danach setzt du beide wieder zusammen. Gleicht Unterschiede zwischen den Seiten aus.'],
    'rückenbeine': ['Rückenbeine', 'In Rückenlage, das Brett flach auf der Brust umarmen. Beinschlag aus der Hüfte, die Knie bleiben unter der Wasseroberfläche, Fußspitzen gestreckt.', 'Lockerer Beinschlag aus der Hüfte statt aus dem Knie. Das hält die Beine oben und stabilisiert die Wasserlage.'],
    'rotation': ['Rotation', 'Kraul mit Pullbuoy, ohne Beinschlag. Bei jedem Zug drehen Hüfte und Schulter gemeinsam zur Seite, bis die Schulter des ziehenden Arms aus dem Wasser kommt.', 'Rotation aus dem Rumpf. Der Zug wird länger und das Atmen fällt leichter.'],
    'wechselatmung': ['Wechselatmung', 'Die ersten 25 m alle 3 Züge atmen, die zweiten 25 m alle 5 Züge. Unter Wasser gleichmäßig durch Nase und Mund ausatmen.', 'Beidseitiges Atmen und ruhiges Ausatmen. Im Freiwasser kannst du so zur Seite ohne Wellen und Sonne atmen.'],
    'kopf hoch': ['Kopf hoch', 'Normales Kraul. Alle 6 Züge für einen Zug den Blick nach vorn heben, nur die Augen knapp über Wasser, und kurz ein Ziel anpeilen. Danach Kopf wieder runter und wie gewohnt zur Seite atmen.', 'Orientierung im Freiwasser, ohne dass die Beine absinken.']
  };
  function drillsOf(lab) {
    const m = (lab || '').match(/^Technik(?:übung(?:en)?)?(?:\s+im Wechsel)?:\s*(.+)$/i);
    if (!m) return null;
    const names = m[1].split(/,\s*|\s+und\s+/).map(x => x.trim().replace(/\.$/, '')).filter(Boolean);
    return names.map(n => DRILLS[n.toLowerCase()] || [n.charAt(0).toUpperCase() + n.slice(1), '', '']);
  }
  const INFO_I = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 11v5"/><circle cx="12" cy="7.6" r=".6" fill="currentColor"/></svg>';
  /* Pausen einheitlich zweizeilig („Pause“ klein über der Dauer), damit Info-Buttons und Zielspalte bündig bleiben */
  function tgtHTML(s) {
    return s.pause && /^Pause /.test(s.tgt) ? `<span class="t tp"><small>Pause</small>${esc(s.tgt.slice(6))}</span>` : `<span class="t">${esc(s.tgt)}</span>`;
  }
  function stepsHTML(p) {
    const bl = blocks(p), main = mainStep(bl);
    return bl.map((b, bi) => {
      let extra = '';
      const rows = b.steps.map((s, si) => {
        const isMain = (bi + ':' + si) === main;
        let lab = esc(s.lab || (b.rep ? '' : b.h));
        const dr = drillsOf(s.lab);
        if (dr) {
          lab = dr.length > 1 ? `Alle ${esc(s.dur)} die nächste Übung` : 'Technik';
          extra = `<ol class="drill-list" aria-label="Übungen der Reihe nach">${dr.map(([n, t, why], di) => {
            const key = p.id + ':' + bi + ':' + si + ':' + di, open = !!state.drillOpen[key];
            return `<li class="${open ? 'open' : ''}">${t ? `<button class="dr-h" data-drill="${esc(key)}" aria-expanded="${open}"><b>${esc(n)}</b><span class="info${open ? ' on' : ''}" aria-hidden="true">${INFO_I}</span><span class="sr">${open ? 'Erklärung ausblenden' : 'Erklärung anzeigen'}</span></button>` : `<div class="dr-h"><b>${esc(n)}</b></div>`}${open && t ? `<div class="dr-x"><p>${esc(t)}</p>${why ? `<p class="why"><span>Wofür</span>${esc(why)}</p>` : ''}</div>` : ''}</li>`;
          }).join('')}</ol>`;
        }
        /* Einzelne Übung als eigener Schritt (z. B. „50mtr Abschlag. 20 s Pause“): Info-Button direkt hinter der Übung */
        const one = !dr && DRILLS[(s.lab || '').trim().replace(/\.$/, '').toLowerCase()];
        if (one) {
          const [n, t, why] = one, key = p.id + ':' + bi + ':' + si, open = !!state.drillOpen[key];
          return `<div class="st st-dr${s.pause ? ' ps' : ''}${open ? ' open' : ''}"><span class="d">${esc(s.dur)}</span><button class="l dr-in" data-drill="${esc(key)}" aria-expanded="${open}"><b>${esc(n)}</b><span class="info${open ? ' on' : ''}" aria-hidden="true">${INFO_I}</span><span class="sr">${open ? 'Erklärung ausblenden' : 'Erklärung anzeigen'}</span></button>${tgtHTML(s)}</div>${open ? `<div class="dr-x dr-st"><p>${esc(t)}</p>${why ? `<p class="why"><span>Wofür</span>${esc(why)}</p>` : ''}</div>` : ''}`;
        }
        return `<div class="st${isMain ? ' main' : ''}${s.pause ? ' ps' : ''}"><span class="d">${esc(s.dur)}</span><span class="l">${lab}</span>${tgtHTML(s)}</div>`;
      }).join('');
      if (b.rep) return `<div class="rep"><div class="rep-h">${esc(b.h)} <b>${b.rep}×</b></div>${rows}${extra}</div>`;
      return rows + extra;
    }).join('');
  }
  function unitMeta(p) {
    const k = sp(p.sport).k;
    if (k === 'swim') { const m = p.title.match(/([\d.]+)\s*m\b/); return m ? m[1].replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' m' : fmtH(p.dur); }
    return fmtH(p.dur);
  }
  function cleanTitle(p) {
    const k = sp(p.sport).k;
    if (k === 'bike' || k === 'run') return p.title.replace(/\s+\d+\s*min$/, '') || p.title;
    if (k === 'swim') return p.title.replace(/\s+[\d.]+\s*m$/, '') || p.title;
    return p.title;
  }
  function sportLabel(p) {
    if (p.sport === 'Rad (Zwift)') return 'Rad · Zwift';
    if (p.sport === 'Schwimmen') return 'Schwimmen · Echazbad';
    if (p.sport === 'Kraft') return 'Kraft · ' + exercises(p).length + ' Übungen';
    return p.sport;
  }

  /* ---------- Bildschirm wachhalten, solange Kraft oder Mobility läuft ---------- */
  let wake = null, wakeBusy = false;
  async function syncWake(M) {
    if (!('wakeLock' in navigator)) return;
    const want = document.visibilityState === 'visible' && !!(M && M.plan.some(p => p.date <= today() && ['Kraft', 'Mobility'].includes(sp(p.sport).fam) && isStarted(p)));
    if (want && !wake && !wakeBusy) {
      wakeBusy = true;
      try { wake = await navigator.wakeLock.request('screen'); wake.addEventListener('release', () => { wake = null; }); } catch (e) { wake = null; }
      wakeBusy = false;
    } else if (!want && wake) { const w = wake; wake = null; try { await w.release(); } catch (e) {} }
  }

  /* ---------- Übersicht vor dem Start (Kraft & Mobility) ---------- */
  const isStarted = p => !p.done && (state.started[p.id] != null ? state.started[p.id] : !!ls.get('tri:start:' + p.id, false));
  function setStarted(pid, on) { state.started[pid] = on; if (on) ls.set('tri:start:' + pid, true); else ls.del('tri:start:' + pid); }
  function overviewBody(M, p, isKraft) {
    let rows = [], doneN = 0, label, setsOk = 0, setsAll = 0;
    if (isKraft) {
      const exs = exercises(p), d = draft(M, p);
      rows = exs.map((e, i) => {
        const lb = U.lib(e.name), t2 = target(p, e, lb), k2 = kind(lb, e), s2 = d.ex[i] || [];
        const okS = s2.filter(x => x.ok), allOk = s2.length && s2.every(x => x.ok);
        if (allOk) doneN++;
        setsOk += okS.length; setsAll += s2.length;
        let sub = `${t2.sets} × ${t2.reps}${k2 === 'time' ? ' s' : ''}${t2.side ? ' je Seite' : ''}`;
        if (p.done && okS.length) { const kgs = okS.map(x => x.kg).filter(x => x != null); sub = `${okS.length} Sätze${k2 === 'w' && kgs.length ? ' · ' + fmtKg(Math.max(...kgs)) : ''}`; }
        else if (!p.done) { const sg = suggest(lb, e, t2, lastFor(M, e.name, p.id)); if (k2 === 'w' && sg.kg != null) sub += ' · ' + fmtKg(sg.kg); }
        return { name: e.name, sub, on: !!allOk || !!p.done, part: !allOk && okS.length > 0, lib: lb };
      });
      label = 'Training starten';
    } else {
      const items = mobItems(p), ticks = p.done ? items.map((_, i) => i) : ls.get('tri:mob:' + p.id, []);
      rows = items.map((it, i) => { const on = ticks.includes(i); if (on) doneN++; return { name: it.name, sub: it.dose, on, mob: true, lib: it.lib }; });
      label = 'Mobility starten';
    }
    const begun = doneN > 0 || rows.some(r => r.part);
    let h = '';
    if (p.done) h += isKraft ? `<button class="btn ghost" data-act="undo" data-id="${esc(p.id)}">Training bearbeiten</button>` : '';
    else h += `<button class="btn" style="background:var(--c-d);color:var(--card)" data-start="${esc(p.id)}|-1">${begun ? 'Weitermachen' : label}</button>`;
    if (state.msgs[p.id]) h += `<div class="msg">${esc(state.msgs[p.id])}</div>`;
    return { html: h, progress: isKraft ? [setsOk, setsAll] : [doneN, rows.length], names: rows.map(r => r.name), rows };
  }
  /* Übungsliste auf der Karte vor dem Start: Figur, Name, Dosis; lange Listen ab der 6. Übung aufklappbar */
  function exList(rows) {
    /* Mobility: knappe Liste ohne Figuren, Name links, Dosis rechts */
    if (rows.length && rows[0].mob) {
      /* Mobility: nur eine Figur mit allen Muskeln, die heute gedehnt werden – die Übungen kommen nach dem Start */
      const m = [...new Set(rows.flatMap(r => (r.lib && r.lib.m) || []))];
      const map = m.length ? U.bodyMap({ m, mh: rows.length + ' Übungen · gedehnt' }) : '';
      return map ? map.replace('class="musc"', 'class="musc big"').replace(/<div class="musc-tx">[\s\S]*?<\/div>/, '') : `<p class="u-sum">${rows.length} Übungen</p>`;
    }
    const li = (r, i) => `<li${r.on ? ' class="on"' : ''}><span class="el-fig">${r.lib ? U.svg(r.lib, { t: 0.6 }) : `<b>${i + 1}</b>`}</span><span class="el-tx"><b>${esc(r.name)}</b><small>${esc(r.sub || '')}</small></span>${r.on ? `<span class="el-ok" aria-label="erledigt">${CHECK}</span>` : ''}</li>`;
    const MAX = 6, head = rows.slice(0, MAX), rest = rows.slice(MAX);
    let h = `<ol class="exlist-c" aria-label="${rows.length} Übungen">${head.map(li).join('')}</ol>`;
    if (rest.length) h += `<details class="el-more"><summary>${rest.length} weitere Übung${rest.length > 1 ? 'en' : ''}</summary><ol class="exlist-c" start="${MAX + 1}">${rest.map((r, k) => li(r, MAX + k)).join('')}</ol></details>`;
    return h;
  }
  const backBar = (p, txt) => `<div class="run-top"><button class="link" data-stop="${esc(p.id)}">${CHEV_L}Übersicht</button><small>${txt}</small></div>`;

  /* ---------- Kraft ---------- */
  /* Umstellung auf eine schwerere Variante: im Blatt „Geräte“ als „Variante: <Übung>“ → „ab JJJJ-MM-TT: <Variante> 3×30 s“.
     Gilt für alle noch offenen Einheiten ab diesem Tag; der Plan im Sheet bleibt unverändert. */
  let SWAPS = {};
  const swapKey = name => 'Variante: ' + name;
  function readSwaps(notes) {
    SWAPS = {};
    Object.keys(notes).forEach(k => {
      const m = k.startsWith('Variante: ') && /^ab (\d{4}-\d{2}-\d{2}):\s*(.+)$/.exec(notes[k] || '');
      if (m) { const ex = parseExercise('1. ' + m[2]); if (ex.sets) SWAPS[k.slice(10)] = { ab: m[1], ex, text: m[2] }; }
    });
  }
  const swapped = (p, ex) => { const w = SWAPS[ex.name]; return w && !p.done && p.date >= w.ab ? Object.assign({}, w.ex, { side: w.ex.side || ex.side }) : ex; };
  const exercises = p => p.workout.split('\n').map(s => s.trim()).filter(l => /^\d+\./.test(l)).map(parseExercise).map(ex => swapped(p, ex));
  function parseExercise(line) {
    const s = line.replace(/^\d+\.\s*/, '');
    const m = s.match(/^(.+?)\s+(\d+)×(\d+)(\s*s)?(\s+je Seite)?\s*$/);
    if (m) return { name: m[1].trim(), sets: +m[2], reps: +m[3], secs: !!m[4], side: !!m[5], raw: s };
    return { name: s, raw: s };
  }
  function target(p, ex, lib) {
    const t = { sets: ex.sets || 1, reps: ex.reps || 10, secs: ex.secs, side: ex.side };
    const h = (p.note || '').match(/Schwerer:\s*(\d+)×(\d+)/);
    if (h && lib && lib.t === 'w' && !lib.noHeavy) { t.sets = +h[1]; t.reps = +h[2]; t.heavy = true; }
    return t;
  }
  function sessions(M) {
    const by = {};
    M.klog.forEach(r => {
      const s = by[r.pid] || (by[r.pid] = { pid: r.pid, date: r.date, saved: '', rows: [] });
      if (r.saved > s.saved) { s.saved = r.saved; s.rows = []; s.date = r.date; }
      if (r.saved === s.saved) s.rows.push(r);
    });
    return Object.values(by).sort((a, b) => (a.date + a.saved).localeCompare(b.date + b.saved));
  }
  function lastFor(M, name, excl) {
    const S = sessions(M).filter(s => s.pid !== excl);
    for (let i = S.length - 1; i >= 0; i--) {
      const rows = S[i].rows.filter(r => r.ex === name).sort((a, b) => a.set - b.set);
      if (rows.length) return { date: S[i].date, target: rows[0].target, sets: rows };
    }
    return null;
  }
  const kind = (lib, ex) => lib ? (lib.t === 'time' ? 'time' : lib.t === 'bw' ? 'bw' : 'w') : (ex.secs ? 'time' : 'bw');
  const roundKg = x => Math.max(0, Math.round(x * 2) / 2);
  /* Wiederholungen in Reserve (RIR): wie viele saubere Wiederholungen am Satzende noch gehen sollen */
  const rir = () => 2; /* Ziel: 2 Wiederholungen in Reserve (2–3 ist der gute Bereich) */
  const e1 = (reps, res) => 1 + (reps + res) / 30; /* Epley: Last in Abhängigkeit von Wdh. + Reserve */
  const fmtR = x => String(Math.round(x * 10) / 10).replace('.', ',');
  const stepKg = (x, inc) => { inc = inc || 2; return Math.max(inc, Math.round(x / inc) * inc); };
  /* Startgewicht ohne Verlauf: Referenz = 10 Wdh. mit 3 in Reserve, auf Ziel-Wdh. und eingestellte Reserve umgerechnet */
  const startKg = (lib, reps) => lib && lib.start ? stepKg(lib.start * e1(10, 3) / e1(reps, rir()), lib.inc) : null;
  function suggest(lib, ex, tg, hist) {
    const k = kind(lib, ex);
    /* Obergrenze: Länger halten oder mehr Wiederholungen bringen ab hier kaum noch etwas – dann lieber eine schwerere Variante */
    const capMsg = (cap, unit) => `Obergrenze von ${cap}${unit} erreicht. Mehr bringt hier kaum noch etwas. Nächste Stufe: ${lib && lib.next ? lib.next : 'eine schwerere Variante'}.`;
    if (k === 'time') {
      if (!hist) return { s: tg.reps, why: '' };
      const cap = Math.max((lib && lib.cap) || 60, tg.reps);
      const best = Math.max(...hist.sets.map(s => s.secs || 0));
      if (!hist.sets.every(s => (s.secs || 0) >= tg.reps)) return { s: tg.reps, why: '' };
      if (best >= cap) return { s: cap, why: capMsg(cap, ' s'), cap: true };
      const s = Math.min(cap, best + 5);
      return { s, why: `Letztes Mal ${best} s gehalten: heute ${s - best} s länger.` };
    }
    if (k === 'bw') {
      if (!hist) return { r: tg.reps, why: '' };
      const cap = Math.max((lib && lib.cap) || 15, tg.reps);
      const best = Math.max(...hist.sets.map(s => s.reps || 0));
      const rr = hist.sets.map(s => s.rir).filter(x => x != null), ar = rr.length ? mean(rr) : null;
      if (!hist.sets.every(s => (s.reps || 0) >= tg.reps)) return { r: tg.reps, why: '' };
      if (best >= cap) return { r: cap, why: capMsg(cap, ' Wdh.'), cap: true };
      if (ar != null && ar >= 4) { const r = Math.min(cap, Math.max(tg.reps, best + 2)); return { r, why: `Letztes Mal noch ${fmtR(ar)} in Reserve: ${r - best > 1 ? 'zwei Wiederholungen' : 'eine Wiederholung'} mehr pro Satz.` }; }
      if (ar != null && ar < 1.5) return { r: Math.max(tg.reps, best), why: 'Letztes Mal fast am Limit: Wiederholungen halten.' };
      return { r: Math.min(cap, Math.max(tg.reps, best + 1)), why: 'Letztes Mal alles geschafft: eine Wiederholung mehr pro Satz.' };
    }
    if (!hist) { const kg = startKg(lib, tg.reps); return { r: tg.reps, kg, first: true, why: kg != null ? `Geschätztes Startgewicht für ${tg.reps} Wdh. mit ${rir()} in Reserve. Zu leicht oder zu schwer? Einfach anpassen, ab dann rechnet die App mit deinem Wert.` : `Gewicht wählen, bei dem noch ${rir()} Wiederholungen gehen würden.` }; }
    const kgs = hist.sets.map(s => s.kg).filter(x => x != null);
    const lastKg = kgs.length ? Math.max(...kgs) : null;
    if (lastKg == null) return { r: tg.reps, kg: null, why: '' };
    const lt = (hist.target.match(/×(\d+)/) || [])[1];
    if (lt && +lt !== tg.reps) {
      const avg = mean(hist.sets.map(s => s.reps || 0));
      return { r: tg.reps, kg: roundKg(lastKg * e1(avg, rir()) / e1(tg.reps, rir())), why: `Umgerechnet von ${hist.target} mit ${fmtKg(lastKg)} auf ${tg.reps} Wiederholungen mit ${rir()} in Reserve.` };
    }
    const need = +(hist.target.match(/^(\d+)/) || [])[1] || 1;
    /* Reserve gemeldet: daraus die Leistung schätzen und das Gewicht anpassen */
    const rs = hist.sets.filter(s => s.rir != null && s.kg != null && s.reps);
    if (rs.length) {
      const ar = mean(rs.map(s => s.rir)), allReps = hist.sets.length >= need && hist.sets.every(s => (s.reps || 0) >= tg.reps);
      const est = Math.min(...rs.map(s => s.kg * e1(s.reps, s.rir))), fit = stepKg(est / e1(tg.reps, rir()), lib.inc);
      if (allReps && ar >= 4) { const lo = lastKg + lib.inc, hi = Math.max(lo, stepKg(lastKg * 1.15, lib.inc)), kg = Math.min(hi, Math.max(lo, fit)); /* höchstens ca. 15 % Sprung */ return { r: tg.reps, kg, why: `Letztes Mal noch ${fmtR(ar)} Wdh. in Reserve, das war zu leicht: ${fmtKg(kg)}.` }; }
      if (allReps && ar >= 2) return { r: tg.reps, kg: roundKg(lastKg + lib.inc), why: `Letztes Mal alle Sätze mit ${fmtR(ar)} in Reserve, also ${String(lib.inc).replace('.', ',')} kg mehr.` };
      if (ar < 1 || hist.sets.some(s => (s.reps || 0) < tg.reps - 2)) { const kg = Math.min(lastKg, Math.max(lib.inc, fit)); return { r: tg.reps, kg, why: kg < lastKg ? `Letztes Mal am Limit: etwas leichter, damit wieder ${rir()} Wdh. Reserve bleiben.` : 'Letztes Mal am Limit: Gewicht halten.' }; }
      return { r: tg.reps, kg: lastKg, why: `Letztes Mal ${fmtR(ar)} in Reserve: Gewicht halten, bis 2–3 Wdh. Reserve bleiben.` };
    }
    if (hist.sets.length >= need && hist.sets.every(s => (s.reps || 0) >= tg.reps)) return { r: tg.reps, kg: roundKg(lastKg + lib.inc), why: `Letztes Mal alle Sätze geschafft, also ${String(lib.inc).replace('.', ',')} kg mehr.` };
    return { r: tg.reps, kg: lastKg, why: hist.sets.some(s => (s.reps || 0) < tg.reps - 2) ? 'Letztes Mal deutlich unter dem Ziel: Gewicht halten und sauber ausführen.' : 'Gewicht halten, bis alle Sätze sitzen.' };
  }
  /* Knopf unter dem Obergrenzen-Hinweis: ab dem nächsten Training die schwerere Variante */
  function upText(ex, lib) {
    const up = lib.up, ul = U.lib(up.name), t = ul && ul.t === 'time';
    return `${up.name} ${ex.sets || 3}×${up.reps}${t ? ' s' : ''}${ex.side ? ' je Seite' : ''}`;
  }
  function swapHTML(ex, lib) {
    if (!lib || !lib.up) return '';
    const w = SWAPS[ex.name];
    if (w) return `<div class="swap"><span>${CHECK} Ab ${fmtDay(parseISO(w.ab))}: ${esc(w.text)}</span><button class="linkbtn" data-swap="${esc(ex.name)}|">Rückgängig</button></div>`;
    return `<button class="btn swap-btn" data-swap="${esc(ex.name)}|${esc(upText(ex, lib))}">Nächstes Mal ${esc(lib.up.name)}</button>`;
  }
  function draft(M, p) {
    if (state.drafts[p.id]) return state.drafts[p.id];
    let d = ls.get('tri:draft:' + p.id, null);
    /* Der Entwurf gehört zu einer bestimmten Übungsliste. Wurde der Plan geändert (z. B. Geräte statt Hanteln),
       gelten die alten Gewichte nicht mehr: ohne abgehakte Sätze neu aufbauen, sonst offene Sätze neu vorschlagen. */
    const sig = exercises(p).map(e => e.name + '#' + target(p, e, U.lib(e.name)).sets + 'x' + target(p, e, U.lib(e.name)).reps).join('|');
    if (d && (d.v === 3 || d.v === 4) && d.n !== sig) {
      const exs = exercises(p);
      if (d.ex.length !== exs.length || !d.ex.some(st => st.some(x => x.ok))) d = null;
      else { d.ex.forEach((st, i) => { const tg = target(p, exs[i], U.lib(exs[i].name)); st.forEach(x => { if (!x.ok) { x.kg = null; x.a = true; x.r = tg.reps; } }); }); d.v = 4; d.n = sig; autoKg(M, p, d, true); ls.set('tri:draft:' + p.id, d); }
    }
    if (!d || d.v !== 4) {
      const own = (sessions(M).find(s => s.pid === p.id) || { rows: [] }).rows;
      d = { v: 4, n: sig, ex: exercises(p).map(ex => {
        const lib = U.lib(ex.name), tg = target(p, ex, lib);
        const mine = own.filter(r => r.ex === ex.name).sort((a, b) => a.set - b.set);
        if (mine.length) return mine.map(r => ({ r: r.reps, s: r.secs, kg: r.kg, ok: true }));
        const sg = suggest(lib, ex, tg, lastFor(M, ex.name, p.id));
        return Array.from({ length: tg.sets }, () => ({ r: sg.r != null ? sg.r : tg.reps, s: sg.s != null ? sg.s : null, kg: sg.kg != null ? sg.kg : null, a: true, ok: false }));
      }) };
    } else autoKg(M, p, d, true);
    state.drafts[p.id] = d;
    return d;
  }
  /* Automatisch gesetzte Gewichte offener Sätze an den aktuellen Vorschlag anpassen (z. B. nach Änderung der Reserve) */
  function autoKg(M, p, d, onlyEmpty) {
    exercises(p).forEach((ex, i) => {
      const lib = U.lib(ex.name); if (kind(lib, ex) !== 'w' || !d.ex[i]) return;
      const sg = suggest(lib, ex, target(p, ex, lib), lastFor(M, ex.name, p.id));
      if (sg.kg == null) return;
      d.ex[i].forEach(s => { if (!s.ok && (onlyEmpty ? s.kg == null : s.a !== false)) { s.kg = sg.kg; s.a = true; } });
    });
  }
  const putDraft = (pid, d) => { state.drafts[pid] = d; ls.set('tri:draft:' + pid, d); };
  function histText(h, lib, ex) {
    const k = kind(lib, ex);
    const vals = h.sets.map(s => k === 'time' ? (s.secs || 0) + ' s' : (s.reps || 0)).join(' · ');
    const kgs = h.sets.map(s => s.kg).filter(x => x != null);
    return `Letztes Mal (${fmtShort(parseISO(h.date))}): ${vals}${k === 'w' && kgs.length ? ' mit ' + fmtKg(Math.max(...kgs)) : ''}`;
  }

  function strengthBody(M, p) {
    const exs = exercises(p), d = draft(M, p);
    const total = d.ex.reduce((a, s) => a + s.length, 0), ok = d.ex.reduce((a, s) => a + s.filter(x => x.ok).length, 0);
    const done = !!p.done;
    /* Die Übungen bleiben in der geplanten Reihenfolge: die aktive klappt an ihrer Stelle auf */
    const exRow = (e, i) => {
      const lb = U.lib(e.name), t2 = target(p, e, lb), k2 = kind(lb, e), s2 = d.ex[i] || [];
      const allOk = s2.length && s2.every(x => x.ok);
      const sg2 = suggest(lb, e, t2, lastFor(M, e.name, p.id));
      const today2 = k2 === 'w' && sg2.kg != null ? ' · heute ' + fmtKg(sg2.kg) : k2 === 'time' && sg2.s ? ' · heute ' + sg2.s + ' s' : '';
      return `<button class="exrow${allOk ? ' done' : ''}" data-ex="${p.id}|${i}"><span class="thumb">${lb ? U.svg(lb, { t: 0.75 }) : ''}</span><span class="tx"><b>${esc(e.name)}</b><small>${t2.sets} × ${t2.reps}${k2 === 'time' ? ' s' : ''}${t2.side ? ' je Seite' : ''}${today2}</small>${lb ? `<span>${esc(lb.cue)}</span>` : ''}</span>${allOk ? `<span class="pill">✓ ${s2.length}</span>` : CHEV_R}</button>`;
    };
    const tail = () => {
      let t = '';
      const note = p.workout.split('\n').map(s => s.trim()).filter(l => l && !/^\d+\./.test(l));
      if (note.length) t += `<p class="note" style="padding:0 4px;margin:0">${esc(note.join(' '))}</p>`;
      t += done
        ? `<button class="btn ghost" data-act="undo" data-id="${esc(p.id)}">Training bearbeiten</button>`
        : `<button class="btn" style="background:var(--c-d);color:var(--card)" data-act="kraft" data-id="${esc(p.id)}" ${state.busy[p.id] ? 'disabled' : ''}>${state.busy[p.id] ? 'Speichere …' : 'Training speichern'}</button>`;
      if (state.msgs[p.id]) t += `<div class="msg">${esc(state.msgs[p.id])}</div>`;
      return t;
    };
    let act = state.active[p.id];
    if (act == null) { act = d.ex.findIndex(s => s.some(x => !x.ok)); if (act < 0) act = 0; }
    if (act === -1) {
      const n = exs.filter((_, i) => (d.ex[i] || []).length && d.ex[i].every(x => x.ok)).length;
      let h = backBar(p, `${n} von ${exs.length} Übungen`) + (done ? '' : warmupHTML(p, exs, d));
      h += '<div class="exlist">' + exs.map(exRow).join('') + '</div>';
      return { html: h + tail(), progress: [ok, total] };
    }
    const ex = exs[act], lib = U.lib(ex.name), tg = target(p, ex, lib), k = kind(lib, ex);
    const hist = lastFor(M, ex.name, p.id), sg = suggest(lib, ex, tg, hist);
    const sets = d.ex[act] || [];
    const goal = `${tg.sets} × ${tg.reps}${k === 'time' ? ' s' : ''}${tg.side ? ' je Seite' : ''}`;
    const firstOpen = sets.findIndex(s => !s.ok);
    let h = backBar(p, `Übung ${act + 1} von ${exs.length}`) + (done ? '' : warmupHTML(p, exs, d));
    if (act > 0) h += '<div class="exlist">' + exs.slice(0, act).map(exRow).join('') + '</div>';
    h += `<div class="ex-card"><button class="ex-head" data-ex="${p.id}|${act}" aria-expanded="true" aria-label="${esc(ex.name)} zuklappen"><span class="exh-tx"><b>${esc(ex.name)}</b><span>Ziel ${goal}${hist ? ' · ' + esc(histText(hist, lib, ex)) : ''}</span></span>${CHEV_D}</button>`;
    h += `<div class="ex-body${lib ? '' : ' solo'}"><div class="ex-l">`;
    if (lib) h += `<button class="fig zoomable" data-zoom="${esc(ex.name)}" aria-label="Skizze ${esc(ex.name)} vergrößern">${U.svg(lib, { id: 'live:' + encodeURIComponent(ex.name), label: 'Animation: ' + ex.name })}</button>${zoomMap(U.bodyMap(lib), ex.name)}<p class="howto">${esc(lib.how)}</p><p class="cue"><b>Achte darauf:</b> ${esc(lib.cue)}</p>`;
    /* Eigene Notiz je Übung, z. B. Sitz- und Polstereinstellung am Gerät: bleibt für jedes weitere Training stehen */
    h += `<label class="exnote" for="note-${esc(p.id)}-${act}"><span>Meine Einstellung</span><input type="text" id="note-${esc(p.id)}-${act}" data-note="${esc(ex.name)}" value="${esc(M.notes[ex.name] || '')}" placeholder="z. B. Sitz 4, Lehne 2" maxlength="120" autocomplete="off" enterkeyhint="done"></label>`;
    h += '</div><div class="ex-r">';
    if (!done && sg.why) h += `<div class="sugg">${k === 'w' && sg.kg != null ? `<b>Heute ${fmtKg(sg.kg)}${lib && lib.per ? ' ' + lib.per : ''}.</b> ` : ''}${esc(sg.why)}${sg.cap ? swapHTML(ex, lib) : ''}</div>`;
    if (!done && k === 'w' && firstOpen === 0) h += rampHTML(exs, act, lib, sets[0].kg);
    h += `<div class="sets" role="group" aria-label="Sätze ${esc(ex.name)}"><div class="set head"><span>SATZ</span><span>${k === 'time' ? 'SEKUNDEN' : 'WDH'}</span><span>${k === 'w' ? 'KG' : ''}</span><span></span></div>`;
    sets.forEach((s, j) => {
      const f = k === 'time' ? 's' : 'r', v = (k === 'time' ? s.s : s.r) || 0, step = k === 'time' ? 5 : 1, key = `${p.id}|${act}|${j}`;
      h += `<div class="set${s.ok ? ' ok' : ''}${j === firstOpen && !done ? ' cur' : ''}"><span class="n">${j + 1}</span>
        <span class="stp"><button data-step="${key}|${f}|-${step}" aria-label="weniger" ${done ? 'disabled' : ''}>−</button><b>${v}</b><button data-step="${key}|${f}|${step}" aria-label="mehr" ${done ? 'disabled' : ''}>+</button></span>
        ${k === 'w' ? `<input type="number" inputmode="decimal" step="0.5" min="0" id="kg-${esc(p.id)}-${act}-${j}" data-kg="${key}" value="${s.kg == null ? '' : s.kg}" placeholder="kg" aria-label="Gewicht Satz ${j + 1}" ${done ? 'disabled' : ''}>` : '<span class="dash">–</span>'}
        <button class="tick" data-tick="${key}" aria-pressed="${!!s.ok}" aria-label="Satz ${j + 1} erledigt" ${done ? 'disabled' : ''}>${CHECK}</button></div>`;
      if (k !== 'time' && s.ok) {
        const ask = !done && (s.rir == null || state.rirEdit === key);
        h += ask
          ? `<div class="rirq"><span>Wie viele Wdh. wären noch gegangen?</span><div class="rchips" role="radiogroup" aria-label="Reserve Satz ${j + 1}">${[0, 1, 2, 3, 4].map(n => `<button role="radio" aria-checked="${s.rir === n}" data-rirset="${key}|${n}"${n >= 2 && n <= 3 ? ' class="good"' : ''}>${n === 4 ? '4+' : n}</button>`).join('')}</div></div>`
          : s.rir != null ? `<button class="rirv" data-riredit="${key}" ${done ? 'disabled' : ''}>${s.rir === 4 ? '4+' : s.rir} in Reserve</button>` : '';
      }
    });
    h += '</div>';
    if (!done) h += `<div class="set-acts"><button class="link" data-addset="${p.id}|${act}">+ Satz hinzufügen</button>${sets.length > 1 ? `<button class="link" data-delset="${p.id}|${act}">Letzten Satz entfernen</button>` : ''}</div>`;
    h += '</div></div>';
    /* Halteübungen (z. B. Unterarmstütz): Timer für den aktuellen Satz, schwebt unten, während man liest */
    if (k === 'time' && !done && firstOpen >= 0) { const cn = circuitNext(p, d, act); h += kraftTimerHTML(p, act, firstOpen, sets[firstOpen].s || tg.reps, tg.side, sets.length, cn != null ? exs[cn].name : null); }
    h += '</div>';
    if (act < exs.length - 1) h += '<div class="exlist">' + exs.slice(act + 1).map((e, j) => exRow(e, act + 1 + j)).join('') + '</div>';
    h += tail();
    return { html: h, progress: [ok, total] };
  }

  /* ---------- Mobility ---------- */
  function mobItems(p) {
    return p.workout.split('\n').map(s => s.trim()).filter(l => /^\d+\./.test(l)).map(l => {
      const s = l.replace(/^\d+\.\s*/, '');
      const lib = U.lib(s);
      const sec = (s.match(/(\d+)\s*s\b/) || [])[1];
      const sets = +((s.match(/(\d+)×\d+\s*s/) || [])[1] || 1);
      const sides = /je Seite/.test(s) || (lib && lib.sides) ? 2 : 1;
      const vars = /gestreckt und gebeugt/.test(s) ? ['Knie gestreckt', 'Knie gebeugt'] : [''];
      const name = s.replace(/\s+(\d+×)?\d+\s*s.*$/, '').replace(/\s+\d+×.*$/, '').replace(/,.*$/, '').replace(/\s+je(\s.*)?$/, '');
      const dose = s.slice(name.length).replace(/^[,\s]+/, '');
      const parts = [], steps = [];
      const reps = +((s.match(/(\d+)×(?!\d)/) || [])[1] || 0);
      /* Sätze abwechselnd pro Seite: Satz 1 links, Satz 1 rechts, Satz 2 links … */
      if (sec) for (let st = 0; st < sets; st++) for (let sd = 0; sd < sides; sd++) vars.forEach(v => {
        const side = sides === 2 ? (sd ? 'Rechts' : 'Links') : '';
        parts.push([side, v, sets > 1 ? `Satz ${st + 1}` : ''].filter(Boolean).join(' · '));
        steps.push({ set: st, label: [side, v].filter(Boolean).join(' – ') || 'Halten', sub: sec + ' s' });
      });
      else if (reps && sides === 2) ['Links', 'Rechts'].forEach(side => steps.push({ set: 0, label: side, sub: reps + '×' }));
      const stepsSum = sec ? `${steps.length} Teile à ${sec} s` : reps ? `${reps} Wiederholungen je Seite` : '';
      /* Ablauf in Klartext: jeder Teil bekommt seine eigene Zeit */
      const seq = parts.length > 1 ? `${parts.length} × ${sec} s, jeder Teil einzeln: ${parts.join(' → ')}` : (sec ? `${sec} s halten` : '');
      return { raw: s, name, dose, lib, sec: sec ? +sec : 0, parts, seq, steps, stepsSum };
    });
  }
  function mobBody(M, p) {
    const items = mobItems(p), ticks = p.done ? items.map((_, i) => i) : ls.get('tri:mob:' + p.id, []);
    const review = !!p.done; /* erledigt: Übungen zum Nachlesen, ohne Timer und Abhaken */
    let act = state.active[p.id];
    if (act == null) { act = review ? -1 : items.findIndex((_, i) => !ticks.includes(i)); }
    let h = (review ? '' : backBar(p, `${ticks.length} von ${items.length} geschafft`)) + '<div class="exlist">';
    items.forEach((it, i) => {
      const on = ticks.includes(i), open = i === act;
      h += `<div class="mob-ex${on && !review ? ' done' : ''}${open ? ' active' : ''}"><div class="mob-row">
        <button class="open" data-mob-open="${p.id}|${i}" aria-expanded="${open}"><span class="thumb">${it.lib ? U.svg(it.lib, { t: 0.6 }) : ''}</span><span class="tx"><b>${esc(it.name)}</b><small>${esc(it.dose)}${it.sec && !review ? ' · Timer' : ''}</small></span></button>
        ${review ? '' : `<button class="mcheck" data-mob="${p.id}|${i}" aria-pressed="${on}" aria-label="${esc(it.name)} erledigt">${on ? CHECK : ''}</button>`}</div>`;
      if (open) {
        h += `<div class="mob-detail${it.lib ? '' : ' solo'}">`;
        if (it.lib) h += `<div class="mob-l"><button class="fig zoomable" data-zoom="${esc(it.name)}" aria-label="Skizze ${esc(it.name)} vergrößern">${U.svg(it.lib, { id: 'live:' + encodeURIComponent(it.name), label: 'Animation: ' + it.name })}</button>${zoomMap(U.bodyMap(it.lib), it.name)}</div>`;
        h += '<div class="mob-r">';
        if (it.lib) h += `<p class="howto">${esc(it.lib.how)}</p><p class="cue"><b>Achte darauf:</b> ${esc(it.lib.cue)}</p>`;
        h += mobStepsHTML(p, i, it, review);
        h += '</div>';
        /* Timer als eigener Block: bleibt beim Scrollen unten sichtbar, während man die Übung liest */
        if (it.sec && !review) h += timerHTML(p, i, it);
        h += '</div>';
      }
      h += '</div>';
    });
    h += '</div>';
    if (state.msgs[p.id]) h += `<div class="msg">${esc(state.msgs[p.id])}</div>`;
    return { html: h, progress: [ticks.length, items.length] };
  }
  /* Ablauf als Schrittliste: nach Sätzen gruppiert, aktueller Teil hervorgehoben */
  function mobStepsHTML(p, i, it, review) {
    if (!it.steps || it.steps.length < 2) return '';
    const T = state.timer && state.timer.pid === p.id && state.timer.i === i ? state.timer : null;
    const cur = review || !it.sec ? -1 : (T ? T.part : 0);
    const groups = [];
    it.steps.forEach((st, k) => { (groups[st.set] = groups[st.set] || []).push([st, k]); });
    let h = `<div class="mseq"><div class="mseq-h"><b>Ablauf</b><span>${esc(it.stepsSum)}</span></div>`;
    groups.forEach((g, gi) => {
      if (groups.length > 1) h += `<div class="mseq-g">Satz ${gi + 1}</div>`;
      h += '<ol>' + g.map(([st, k]) => {
        const c = k < cur ? 'done' : k === cur ? 'now' : '';
        return `<li${c ? ` class="${c}"` : ''}${c === 'now' ? ' aria-current="step"' : ''}><span class="sn">${c === 'done' ? CHECK : k + 1}</span><span class="sl">${esc(st.label)}</span><span class="ss">${esc(st.sub)}</span></li>`;
      }).join('') + '</ol>';
    });
    return h + '</div>';
  }
  /* Kleiner Knopf am Ring: nur bei angefangenem, pausiertem Timer */
  const timerResetBtn = (T, attr) => T && !T.running && T.left < T.sec ? `<button class="rs" ${attr} aria-label="Timer zurücksetzen"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg></button>` : '';
  function timerHTML(p, i, it) {
    const T = state.timer && state.timer.pid === p.id && state.timer.i === i ? state.timer : null;
    const part = T ? T.part : 0, left = T ? Math.max(0, Math.ceil(T.left)) : it.sec;
    const C = 2 * Math.PI * 36, frac = left / it.sec;
    const k = p.id + '|' + i;
    return `<div class="timer${state.timerSeen[k] ? ' t-free' : ''}" id="timer" data-k="${k}"><svg width="84" height="84" viewBox="0 0 84 84" role="img" aria-label="Timer: noch ${left} Sekunden">
      <circle cx="42" cy="42" r="36" fill="none" stroke="var(--c-t)" stroke-width="7"/>
      <circle id="timer-arc" cx="42" cy="42" r="36" fill="none" stroke="var(--c)" stroke-width="7" stroke-linecap="round" stroke-dasharray="${(C * frac).toFixed(1)} ${C.toFixed(1)}" transform="rotate(-90 42 42)"/>
      <text id="timer-txt" x="42" y="48" text-anchor="middle" font-family="ui-rounded,-apple-system,system-ui,sans-serif" font-size="20" font-weight="700" fill="var(--fg)" style="font-variant-numeric:tabular-nums">${Math.floor(left / 60)}:${pad(left % 60)}</text></svg>${timerResetBtn(T, `data-timer="${p.id}|${i}|reset"`)}
      <div class="tx"><small><b class="now">${esc(it.parts[part] || 'Halten')}</b><br>Teil ${part + 1} von ${it.parts.length}${it.parts[part + 1] ? ' · danach: ' + esc(it.parts[part + 1]) : ''}</small>
      <div class="bts"><button data-timer="${p.id}|${i}|toggle">${T && T.running ? 'Pause' : (T && T.left < it.sec ? 'Weiter' : 'Start')}</button><button class="go" data-timer="${p.id}|${i}|next">${part + 1 < it.parts.length ? 'Nächster Teil' : 'Fertig'}</button></div></div></div>`;
  }
  /* Aufwärmen: aufklappbare Karte vor der ersten Übung, danach schmale Zeile */
  const WARM = [
    ['5 min locker Cardio', 'Rad, Crosstrainer oder Rudergerät. Ruhig anfangen, am Ende leicht schwitzen.'],
    ['2 min dynamisch bewegen', 'Je 10 × Armkreisen und Hüftkreisen pro Richtung, 10 Kniebeugen ohne Gewicht, 5 Ausfallschritte je Seite.']
  ];
  function warmupHTML(p, exs, d) {
    const ok = !!ls.get('tri:warm:' + p.id, false), open = state.warmOpen[p.id] != null ? state.warmOpen[p.id] : !ok;
    const r = rir();
    let h = `<div class="warm${ok ? ' ok' : ''}"><button class="warm-h" data-warm="${esc(p.id)}|fold" aria-expanded="${open}"><span class="warm-ic">${ok ? CHECK : ICON.kraft}</span><span class="tx"><b>Aufwärmen</b><small>${ok ? 'Erledigt' : 'ca. 7 Minuten'}</small></span>${open ? CHEV_D : CHEV_R}</button>`;
    if (open) {
      h += '<ol class="warm-l">' + WARM.map(([t, x]) => `<li><b>${t}</b><span>${x}</span></li>`).join('') + '</ol>';
      h += `<button class="btn${ok ? ' ghost' : ''}" data-warm="${esc(p.id)}|done"${ok ? '' : ' style="background:var(--c-d);color:var(--card)"'}>${ok ? 'Doch nicht erledigt' : 'Aufgewärmt'}</button>`;
    }
    return h + '</div>';
  }
  function rampHTML(exs, act, lib, kg) {
    if (kg == null || kg < 8) return '';
    const firstW = exs.findIndex(e => kind(U.lib(e.name), e) === 'w');
    const inc = (lib && lib.inc) || 2, per = lib && lib.per ? ' ' + lib.per : '';
    const sets = act === firstW ? [[10, stepKg(kg * 0.5, inc)], [5, stepKg(kg * 0.75, inc)]] : [[6, stepKg(kg * 0.6, inc)]];
    const ss = sets.filter(([, w]) => w < kg);
    if (!ss.length) return '';
    return `<div class="ramp"><b>Aufwärmsätze</b><span>${ss.map(([r, w]) => `${r} × ${fmtKg(w)}`).join(' · ')}${per}</span><small>zählen nicht mit</small></div>`;
  }
  function kraftTimerHTML(p, i, j, sec, side, nSets, nextName) {
    let T = state.timer && state.timer.kr && state.timer.pid === p.id && state.timer.i === i && state.timer.j === j ? state.timer : null;
    /* Sekunden wurden vor dem Start geändert: Timer neu aufziehen */
    if (T && !T.running && T.part === 0 && T.left >= T.sec && T.sec !== sec) { T.sec = T.left = T.endLeft = sec; }
    const parts = side ? ['Links', 'Rechts'] : ['Halten'];
    const part = T ? T.part : 0, tsec = T ? T.sec : sec, left = T ? Math.max(0, Math.ceil(T.left)) : sec;
    const C = 2 * Math.PI * 36, frac = left / tsec;
    const k = 'kr|' + p.id + '|' + i;
    const restLeft = state.rest ? Math.ceil((state.rest.end - Date.now()) / 1000) : 0;
    const rest = state.rest ? (restLeft > 0 ? 'Pause ' + Math.floor(restLeft / 60) + ':' + pad(restLeft % 60) : 'Pause vorbei') : '';
    const started = T && (T.running || T.left < T.sec);
    const info = `Satz ${j + 1} von ${nSets}${side ? ' · ' + parts[part] : ''}`;
    const after = side && part === 0 ? 'danach: Rechts' : nextName ? 'danach ' + CIRCUIT_REST / 1000 + ' s Pause, dann ' + nextName : (j + 1 < nSets ? 'danach Pause, dann Satz ' + (j + 2) : 'letzter Satz');
    return `<div class="timer kt${state.timerSeen[k] ? ' t-free' : ''}" id="timer" data-k="${k}"><svg width="84" height="84" viewBox="0 0 84 84" role="img" aria-label="Timer: noch ${left} Sekunden">
      <circle cx="42" cy="42" r="36" fill="none" stroke="var(--c-t)" stroke-width="7"/>
      <circle id="timer-arc" cx="42" cy="42" r="36" fill="none" stroke="var(--c)" stroke-width="7" stroke-linecap="round" stroke-dasharray="${(C * frac).toFixed(1)} ${C.toFixed(1)}" transform="rotate(-90 42 42)"/>
      <text id="timer-txt" x="42" y="48" text-anchor="middle" font-family="ui-rounded,-apple-system,system-ui,sans-serif" font-size="20" font-weight="700" fill="var(--fg)" style="font-variant-numeric:tabular-nums">${Math.floor(left / 60)}:${pad(left % 60)}</text></svg>${timerResetBtn(T, `data-ktimer="${p.id}|${i}|${j}|reset"`)}
      <div class="tx"><small><b class="now">${info}</b><br><span id="kt-rest" class="kt-rest">${rest}</span><span class="kt-after"${rest ? ' hidden' : ''}>${after}</span></small>
      <div class="bts"><button data-ktimer="${p.id}|${i}|${j}|toggle">${T && T.running ? 'Pause' : (started ? 'Weiter' : 'Start')}</button><button class="go" data-ktimer="${p.id}|${i}|${j}|next">${side && part === 0 ? 'Rechts' : 'Satz fertig'}</button></div></div></div>`;
  }
  /* Kraft-Timer abgelaufen oder „Satz fertig“: nächste Seite bereitlegen oder Satz abhaken, Pause starten */
  function finishKraftSet(T, early) {
    T.running = false;
    const M = model(), p = M && M.plan.find(x => x.id === T.pid);
    if (!p) { state.timer = null; return; }
    const ex = exercises(p)[T.i], tg = ex && target(p, ex, U.lib(ex.name));
    if (tg && tg.side && T.part === 0) { T.part = 1; T.left = T.endLeft = T.sec; return; }
    const d = draft(M, p), s = d.ex[T.i] && d.ex[T.i][T.j];
    state.timer = null;
    if (!s) return;
    /* früher aufgehört: tatsächlich gehaltene Zeit eintragen, damit die Steigerung stimmt */
    if (early && !tg.side && T.left > 0 && T.left < T.sec) s.s = Math.max(5, Math.round((T.sec - T.left) / 5) * 5);
    s.ok = true; putDraft(T.pid, d);
    afterSet(p, d, T.i, false);
  }
  /* Aufeinanderfolgende Halteübungen (Unterarmstütz, Seitstütz) im Wechsel: nächste mit offenem Satz */
  function circuitNext(p, d, i) {
    const exs = exercises(p), isT = k => exs[k] && kind(U.lib(exs[k].name), exs[k]) === 'time';
    if (!isT(i)) return null;
    let a = i, b = i;
    while (isT(a - 1)) a--;
    while (isT(b + 1)) b++;
    if (a === b) return null;
    for (let n = 1; n <= b - a; n++) { const k = a + (i - a + n) % (b - a + 1); if ((d.ex[k] || []).some(x => !x.ok)) return k; }
    return null;
  }
  const CIRCUIT_REST = 30000;
  /* Satz abgehakt: Pause starten und ggf. zur nächsten Übung (im Wechsel oder wenn alle Sätze fertig) */
  function afterSet(p, d, i, heavy) {
    const cn = circuitNext(p, d, i);
    if (cn != null) { state.rest = { end: Date.now() + CIRCUIT_REST }; state.active[p.id] = cn; state.scrollEx = p.id; return; }
    state.rest = { end: Date.now() + (heavy ? 150000 : 90000) };
    const ex = exercises(p)[i];
    if (kind(U.lib(ex.name), ex) === 'time' && d.ex[i].every(x => x.ok)) { const nx = d.ex.findIndex(x => x.some(y => !y.ok)); if (nx >= 0) { state.active[p.id] = nx; state.scrollEx = p.id; } }
  }
  let audio = null;
  /* Signal am Ende von Timer und Pause: drei aufsteigende Glockentöne, Vibration wo möglich */
  function beep() {
    try {
      /* iPhone: kurzer Hinweiston, Musik wird nur kurz leiser statt gestoppt */
      if (navigator.audioSession) navigator.audioSession.type = 'transient';
      audio = audio || new (window.AudioContext || window.webkitAudioContext)();
      if (audio.state === 'suspended') audio.resume();
      const t0 = audio.currentTime + 0.02;
      [[0, 784], [0.16, 1047], [0.32, 1319]].forEach(([dt, fq]) => {
        [[1, 0.42], [2, 0.14]].forEach(([mul, vol]) => { /* Grundton plus leiser Oberton klingt wie eine kleine Glocke */
          const o = audio.createOscillator(), g = audio.createGain();
          o.type = 'sine'; o.frequency.value = fq * mul; o.connect(g); g.connect(audio.destination);
          g.gain.setValueAtTime(0.0001, t0 + dt);
          g.gain.exponentialRampToValueAtTime(vol, t0 + dt + 0.012);
          g.gain.exponentialRampToValueAtTime(0.0001, t0 + dt + 0.75);
          o.start(t0 + dt); o.stop(t0 + dt + 0.78);
        });
      });
    } catch (e) { /* kein Ton möglich */ }
    try { if (navigator.vibrate) navigator.vibrate([200, 100, 200, 100, 300]); } catch (e) { /* egal */ }
    const el = document.getElementById('kt-rest') || document.getElementById('restbar') || document.getElementById('timer');
    if (el) { el.classList.remove('ring'); void el.offsetWidth; el.classList.add('ring'); }
  }
  /* Nächster Teil bereitlegen (nicht starten); nach dem letzten Teil Übung abhaken und die nächste öffnen */
  function advanceTimer(T) {
    T.running = false;
    const M = model(), p = M && M.plan.find(x => x.id === T.pid);
    if (!p) { state.timer = null; return; }
    const it = mobItems(p)[T.i];
    if (it && T.part + 1 < it.parts.length) { T.part++; T.left = T.sec; T.endLeft = T.sec; T.running = false; return; }
    state.timer = null;
    const t = ls.get('tri:mob:' + T.pid, []), items = mobItems(p);
    const nt = t.includes(T.i) ? t : t.concat(T.i);
    ls.set('tri:mob:' + T.pid, nt);
    state.active[T.pid] = items.findIndex((_, k) => !nt.includes(k));
    state.scrollEx = T.pid; /* nächste Übung nach oben holen, damit Bild, Text und Timer zusammen im Blick sind */
    if (nt.length === items.length && !p.done) { setDone(p, today()); return true; }
    return false;
  }
  setInterval(() => {
    const T = state.timer;
    if (!T || !T.running) return;
    T.left = T.endLeft - (Date.now() - T.startedAt) / 1000;
    if (T.left <= 0) {
      T.running = false; beep(); /* Timer ist vorbei: anhalten, weiterschalten, aber nicht selbst neu starten */
      if (T.kr) { try { finishKraftSet(T, false); } catch (e) { state.timer = null; } render(); return; }
      try { if (!advanceTimer(T)) render(); } catch (e) { state.timer = null; render(); }
      return;
    }
    const txt = document.getElementById('timer-txt'), arc = document.getElementById('timer-arc');
    if (txt) { const l = Math.ceil(T.left); txt.textContent = Math.floor(l / 60) + ':' + pad(l % 60); }
    if (arc) { const C = 2 * Math.PI * 36; arc.setAttribute('stroke-dasharray', (C * T.left / T.sec).toFixed(1) + ' ' + C.toFixed(1)); }
  }, 250);

  /* ---------- Bausteine ---------- */
  function unitExpanded(M, p, opts) {
    opts = opts || {};
    const S = sp(p.sport), st = statusOf(p, M), t = M.match[p.id];
    const pill = st === 'done' ? `<span class="done-pill">${CHECK}Erledigt</span>` : st === 'miss' ? '<span class="miss-pill">Ausgelassen</span>' : st === 'catch' ? '<span class="catch-pill">Nachholen</span>' : `<span class="u-dur">${esc(unitMeta(p))}</span>`;
    let body = '', prog = null, compact = null, review = false;
    if (S.k === 'mob' && p.done) { body = mobBody(M, p).html; review = true; }
    else if (S.k === 'kraft' || S.k === 'mob') {
      if (!isStarted(p)) { const r = overviewBody(M, p, S.k === 'kraft'); compact = r; }
      else { const r = S.k === 'kraft' ? strengthBody(M, p) : mobBody(M, p); body = r.html; prog = r.progress; }
    }
    const title = cleanTitle(p);
    const top = `<div class="u-sport"><span class="dot-ico">${ICON[S.k]}</span><span>${esc(sportLabel(p))}</span></div><span class="u-right">${pill}${opts.fold ? CHEV_D : ''}</span>`;
    let h = `<section class="unit" style="${cv(S.k)}">${opts.fold ? `<button class="u-top" data-fold="${esc(p.id)}" aria-expanded="true" aria-label="${esc(p.title)} zuklappen">${top}</button>` : `<div class="u-top">${top}</div>`}
      <div class="u-title${title.length > 18 ? ' long' : ''}">${esc(title)}</div>`;
    if (review) {
      h += `<p class="u-sum">${esc(mobItems(p).length + ' Übungen · ' + unitMeta(p))}</p>`;
      if (p.note) h += `<span class="note">${esc(p.note)}</span>`;
      h += `</section><div class="ubody" style="${cv(S.k)}">${body}</div>`;
    } else if (compact) {
      const [a, b] = compact.progress;
      if (a > 0 && !p.done) h += `<div style="height:8px;background:var(--c-l);border-radius:99px;overflow:hidden"><div class="pfill" style="width:${b ? Math.round(a / b * 100) : 0}%;height:100%;background:var(--c);border-radius:99px"></div></div>`;
      h += exList(compact.rows);
      if (p.note) h += `<span class="note">${esc(p.note)}</span>`;
      h += compact.html + '</section>';
    } else if (prog) {
      const [a, b] = prog;
      h += `<div style="display:flex;flex-direction:column;gap:6px"><div style="display:flex;justify-content:space-between;font-size:13px;color:var(--c-mu)"><span>${S.k === 'kraft' ? 'Sätze' : 'Geschafft'}</span><span class="num" style="font-weight:700">${a} von ${b}</span></div><div style="height:8px;background:var(--c-l);border-radius:99px;overflow:hidden"><div class="pfill" style="width:${b ? Math.round(a / b * 100) : 0}%;height:100%;background:var(--c);border-radius:99px"></div></div></div>`;
      if (p.note && S.k !== 'kraft') h += `<span class="note">${esc(p.note)}</span>`;
      if (p.note && S.k === 'kraft') h += `<span class="note">${esc(p.note)}</span>`;
      h += `</section><div class="ubody" style="${cv(S.k)}">${body}</div>`;
    } else {
      const bl = blocks(p);
      h += flowBar(bl, S.k) + `<div class="steps${S.k === 'swim' ? ' swim' : ''}">${stepsHTML(p)}</div>`;
      if (p.note) h += `<span class="note">${esc(p.note)}</span>`;
      if (t && opts.showActual) h += actualHTML(p, t);
      /* Ohne Aufzeichnung trainiert (Uhr vergessen, Akku leer): von Hand abhaken */
      if (!t && p.date <= today() && ['bike', 'run', 'swim'].includes(S.k)) h += `<button class="link manual" data-act="${p.done ? 'undo' : 'done'}" data-id="${esc(p.id)}" ${state.busy[p.id] ? 'disabled' : ''}>${p.done ? 'Doch nicht erledigt' : 'Ohne Aufzeichnung erledigt'}</button>`;
      if (state.msgs[p.id]) h += `<div class="msg">${esc(state.msgs[p.id])}</div>`;
      h += '</section>';
    }
    return opts.fold ? `<div class="uwrap${st === 'catch' ? ' catch' : ''}" data-uid="${esc(p.id)}">${h}</div>` : h;
  }
  function actualHTML(p, t) {
    const c = [];
    if (t.dur) c.push(['Dauer', fmtH(t.dur)]);
    if (t.km) c.push(['Distanz', sp(p.sport).k === 'swim' ? Math.round(t.km * 1000).toLocaleString('de-DE') + ' m' : t.km.toLocaleString('de-DE', { maximumFractionDigits: 1 }) + ' km']);
    if (t.watt) c.push(['Ø Leistung', Math.round(t.watt) + ' W']);
    if (t.np) c.push(['NP', Math.round(t.np) + ' W']);
    if (t.pace) c.push(['Pace', t.pace + ' /km']);
    if (t.hr) c.push(['Ø Puls', Math.round(t.hr)]);
    if (t.load) c.push(['Belastung', Math.round(t.load)]);
    return `<div class="act-h">Deine Werte${t.date !== p.date ? ' · ' + (t.date > p.date ? 'nachgeholt' : 'vorgezogen') + ' am ' + fmtShort(parseISO(t.date)) : ''}</div><div class="actual">${c.slice(0, 6).map(x => `<div><b>${esc(x[1])}</b><small>${x[0]}</small></div>`).join('')}</div>`;
  }
  function tile(M, p, sub) {
    const S = sp(p.sport), st = statusOf(p, M);
    const right = st === 'done' ? `<span class="done-pill">${CHECK}Erledigt</span>` : st === 'miss' ? '<span class="miss-pill">Ausgelassen</span>' : st === 'catch' ? '<span class="catch-pill">Nachholen</span>' : CHEV_D;
    return `<button class="tile" style="${cv(S.k)}" data-open="${esc(p.id)}" data-uid="${esc(p.id)}" aria-expanded="false" aria-label="${esc(p.title)} aufklappen"><span class="ic">${ICON[S.k]}</span><span class="tx"><b>${esc(p.title)}</b><small>${esc(sub || sportLabel(p) + ' · ' + unitMeta(p))}</small></span>${right}</button>`;
  }
  /* Aufgeklappt oder als Kachel, je nachdem was gerade offen ist */
  function isOpen(view, id, def) { const m = state.open[view] || {}; return m[id] !== undefined ? m[id] : id === def; }
  function wide() { return window.innerWidth >= 960; }
  function unitOrTile(M, p, sub, view, def) {
    return isOpen(view, p.id, def) ? unitExpanded(M, p, { fold: true, showActual: statusOf(p, M) === 'done' }) : tile(M, p, sub);
  }
  function statusCard(M, units) {
    const r = readiness(M);
    if (!r) return checkCard(M);
    const L = r.last;
    const head = r.lvl === 'n' ? 'Nach dem Nachtdienst' : r.lvl === 'g' ? 'Bereit für das Training' : r.lvl === 'y' ? 'Heute lieber locker' : 'Heute Pause';
    const adv = advice(r, units);
    const k = [];
    const o = key => r.old.includes(key) ? ' class="old"' : '';
    if (L.sleep != null) k.push([`Schlaf <b>${de1(L.sleep)} h</b>`, o('sleep')]);
    if (L.score != null) k.push([`Score <b>${Math.round(L.score)}</b>`, o('score')]);
    if (L.hrv != null) k.push([`HRV <b>${Math.round(L.hrv)}</b>`, o('hrv')]);
    if (L.rhr != null) k.push([`Ruhepuls <b>${L.rhr}</b>`, o('rhr')]);
    if (r.afterNight) k.length = 0;
    const nt = [r.stale && !r.afterNight ? 'Werte von gestern, die heutigen fehlen noch' : '', ...r.notes].filter(Boolean);
    return `<section class="card stcard" aria-label="Tagesform"><div class="st-h"><span class="st-dot ${r.lvl}" aria-hidden="true"></span><b>${head}</b><span class="st-form">Form <b>${L.tsb == null ? '–' : (L.tsb > 0 ? '+' : '') + de1(L.tsb)}</b></span></div>
      ${r.flags.length ? `<div class="st-fl">${esc(r.flags.join(' · '))}</div>` : ''}
      ${k.length ? `<div class="st-k">${k.map(([x, c]) => `<span${c}>${x}</span>`).join('')}</div>` : ''}
      ${adv ? `<div class="advice ${r.lvl}">${esc(adv)}</div>` : ''}
      ${nt.length ? `<div class="hint">${esc(nt.join('. '))}.</div>` : ''}${checkCard(M, true)}</section>`;
  }
  const afterNightToday = M => M.nights.has(iso(addDays(new Date(), -1)));
  function checkCard(M, inner) {
    const ck = M.check.find(c => c.date === today()), d = state.checkDraft || {}, night = afterNightToday(M);
    if (ck && !state.checkEdit && !(night && ck.sleep == null)) return `<div class="feel${inner ? ' in' : ''}"><span class="ft">${night ? '' : '<span class="fl">Check</span> '}Körper <b>${ck.legs}</b> · Energie <b>${ck.energy}</b> · ${night ? 'Motiv.' : 'Motivation'} <b>${ck.mot}</b>${night ? ` · Schlaf <b>${ck.sleep}</b>` : ''}</span><button class="link" data-checkedit aria-label="Kurz-Check ändern">Ändern</button></div>`;
    const rows = [['legs', 'Körper', 'müde', 'frisch'], ['energy', 'Energie', 'leer', 'voll'], ['mot', 'Motivation', 'keine', 'hoch']];
    if (night) rows.push(['sleep', 'Schlaf', 'schlecht', 'gut']);
    const cur = k => d[k] != null ? d[k] : ck ? ck[k] : null;
    return `<${inner ? 'div' : 'section'} class="${inner ? 'check in' : 'card check'}"><span class="ck-h"><span class="eyebrow">Kurz-Check: wie fühlst du dich?</span>${ck && state.checkEdit ? '<button class="link" data-checkdone>Fertig</button>' : ''}</span>${rows.map(([k, lab, lo, hi]) => `<div class="crow"><span class="lab">${lab}<small>${lo} – ${hi}</small></span><div class="cbt" role="radiogroup" aria-label="${lab}">${[1, 2, 3, 4, 5].map(n => `<button role="radio" aria-checked="${cur(k) === n}" data-check="${k}|${n}">${n}</button>`).join('')}</div></div>`).join('')}
      ${state.checkBusy ? '<span class="tiny">Speichere …</span>' : state.checkMsg ? `<span class="msg">${esc(state.checkMsg)}</span>` : ''}</${inner ? 'div' : 'section'}>`;
  }
  function weekCounts(M, mon) {
    const a = iso(mon), b = iso(addDays(mon, 6));
    const P = M.plan.filter(p => p.date >= a && p.date <= b);
    const c = {};
    RINGS.forEach(([fam]) => { c[fam] = [0, 0]; });
    let doneMin = 0, planMin = 0, doneN = 0, n = 0;
    P.forEach(p => {
      const S = sp(p.sport);
      if (!S.ring) return;
      const st = statusOf(p, M);
      c[S.fam][1]++; n++; planMin += p.dur;
      if (st === 'done') { c[S.fam][0]++; doneN++; doneMin += (M.match[p.id] && M.match[p.id].dur) || p.dur; }
    });
    return { c, doneMin, planMin, doneN, n, P };
  }
  /* id je Woche: beim Wochenwechsel wird das Diagramm ersetzt statt animiert (kein kurzes Auffüllen);
     innerhalb derselben Woche bleibt die Animation beim Abhaken erhalten */
  function ringsSVG(c, key) {
    const R = [33, 25, 17, 9];
    let s = '<svg class="rings"' + (key ? ` id="rings-${key}"` : '') + ' width="76" height="76" viewBox="0 0 76 76" role="img" aria-label="Woche: ' + RINGS.map(([f]) => `${f} ${c[f][0]} von ${c[f][1]}`).join(', ') + '">';
    RINGS.forEach(([f, k], i) => {
      const r = R[i], C = 2 * Math.PI * r, [d, t] = c[f];
      s += `<circle cx="38" cy="38" r="${r}" fill="none" stroke="var(--${k}-tr)" stroke-width="6.5"/>`;
      /* Fortschrittskreis immer zeichnen, damit die Reihenfolge der Kreise gleich bleibt */
      const on = t && d;
      s += `<circle cx="38" cy="38" r="${r}" fill="none" stroke="var(--${k})" stroke-width="6.5" stroke-linecap="round" stroke-dasharray="${on ? (C * Math.min(1, d / t)).toFixed(1) : 0} ${C.toFixed(1)}"${on ? '' : ' opacity="0"'} transform="rotate(-90 38 38)"/>`;
    });
    return s + '</svg>';
  }
  function weekCard(M, mon, strip, noRing, jump) {
    const w = weekCounts(M, mon);
    let h = `<section class="card"><div class="week">${noRing ? '' : ringsSVG(w.c, iso(mon))}<div class="tx"><small>${iso(mon) === iso(monday(new Date())) ? 'Diese Woche' : 'KW ' + isoWeek(mon)}</small><b>${w.doneN} von ${w.n} Einheiten</b><span style="font-size:13px;color:var(--fg-2)">${fmtH(w.doneMin)} von ${fmtH(w.planMin)}</span>
      <div class="legend">${RINGS.map(([f, k]) => `<span><i style="background:var(--${k})"></i>${f} ${w.c[f][1] ? w.c[f][0] + '/' + w.c[f][1] : '–'}</span>`).join('')}</div></div></div>`;
    if (strip) {
      h += '<div class="daystrip">' + [0, 1, 2, 3, 4, 5, 6].map(i => {
        const d = addDays(mon, i), k = iso(d);
        const us = M.plan.filter(p => p.date === k && sp(p.sport).ring);
        const tag = jump ? 'button' : 'div', at = jump ? ` data-jump="${k}" aria-label="Zu ${WDL[d.getDay()]}, ${fmtDay(d)} springen"` : '';
        return `<${tag} class="dsd${k === today() ? ' today' : ''}${d.getDay() % 6 === 0 ? ' we' : ''}"${at}><small>${WDS[d.getDay()]}</small><span class="dn">${d.getDate()}</span><span class="dots">${us.map(p => `<i class="${statusOf(p, M) === 'done' ? '' : 'o'}" style="background:var(--${sp(p.sport).k});--cc:var(--${sp(p.sport).k})"></i>`).join('')}</span></${tag}>`;
      }).join('') + '</div>';
    }
    return h + '</section>';
  }

  /* ---------- Ansichten ---------- */
  /* Dienst rechts in der Datumszeile, kurz (z. B. „1NR 18–6“) */
  function shiftPill(shift) {
    return shift ? `<span class="shift" title="${esc(shift)}">${esc(shift.replace(/ Uhr/g, ''))}</span>` : '';
  }
  /* Ohne Netz, aber mit gespeicherten Daten: nur das kleine Symbol im Kopf statt eines Hinweiskastens */
  const offline = () => !!(state.err && state.data && !/Kein Zugriff/.test(state.err));
  function netInfo() {
    const at = state.data && state.data._at ? new Date(state.data._at) : null;
    return 'Keine Verbindung' + (at ? ` · Stand ${at.toLocaleString('de-DE', { weekday: 'short', hour: '2-digit', minute: '2-digit' })} Uhr` : '');
  }
  function header(title, date, shift, short) {
    return `<header class="head"><div class="date-row"><div class="date"><span class="d-long">${esc(date)}</span><span class="d-short">${esc(short || date)}</span></div>${shiftPill(shift)}</div><h1>${esc(title)}</h1><div class="side">${offline() ? `<button class="iconbtn net" data-netinfo aria-label="Keine Verbindung, Datenstand anzeigen" title="Keine Verbindung"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 19.5h.01"/><path d="M8.8 15.9a4.6 4.6 0 0 1 5.2-.8"/><path d="M5.3 12.4a9.6 9.6 0 0 1 4-2.4"/><path d="M14 9.8a9.6 9.6 0 0 1 4.7 2.6"/><path d="M2 8.8a14.6 14.6 0 0 1 3.9-2.7"/><path d="M10.3 4.6A14.6 14.6 0 0 1 22 8.8"/><path d="M3 3l18 18"/></svg></button>` : ''}<button class="iconbtn${state.loading ? ' spin' : ''}" data-reload aria-label="Aktualisieren" title="Aktualisieren (R)"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 11a8 8 0 1 0-2.3 5.7"/><path d="M20 4v7h-7"/></svg></button></div></header>`;
  }
  function banner() {
    if (!state.err || offline()) return '';
    const noKey = /Kein Zugriff/.test(state.err);
    const at = state.data && state.data._at ? new Date(state.data._at) : null;
    return `<div class="banner err"><b>${noKey ? 'Kein Zugriff auf deine Daten' : 'Gerade keine Verbindung'}</b><span>${noKey ? 'Der App-Schlüssel passt nicht. Prüfe ihn in der Einrichtung.' : at ? `Du siehst den Stand von ${at.toLocaleString('de-DE', { weekday: 'short', hour: '2-digit', minute: '2-digit' })} Uhr. ` + 'Sobald du wieder online bist, aktualisiert sich die App.' : 'Prüfe die Internetverbindung und versuche es noch einmal.'}</span>${noKey ? '<a class="link" href="#einrichtung">Zur Einrichtung</a>' : ''}</div>`;
  }
  /* Muskelkarte antippbar machen, damit sie sich vergrößern lässt */
  function zoomMap(html, name) {
    return html ? html.replace('<div class="musc">', `<div class="musc zoomable" role="button" tabindex="0" data-zoom="${esc(name)}" aria-label="Muskelkarte ${esc(name)} vergrößern">`) : '';
  }
  /* Vergrößerte Ansicht liegt außerhalb der App, damit sie beim Neuzeichnen offen bleibt */
  function openZoom(el) {
    closeZoom(true);
    const src = el.closest('[style*="--c:"]'), bg = document.createElement('div');
    bg.className = 'zoom-bg'; bg.setAttribute('role', 'dialog'); bg.setAttribute('aria-modal', 'true');
    const isMap = el.classList.contains('musc'), name = el.dataset.zoom || '';
    bg.setAttribute('aria-label', (isMap ? 'Muskelkarte ' : 'Skizze ') + name);
    if (src) bg.setAttribute('style', src.getAttribute('style'));
    const body = isMap ? el.outerHTML.replace(/ (role|tabindex|aria-label|data-zoom)="[^"]*"/g, '').replace('musc zoomable', 'musc') : el.innerHTML;
    bg.innerHTML = `<div class="zoom-c"><div class="zoom-h"><b>${esc(name)}</b><button class="zoom-x" aria-label="Schließen"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg></button></div>${body}</div>`;
    bg.addEventListener('click', () => closeZoom());
    document.body.appendChild(bg);
    state.zoomFrom = el;
    U.animate(app);
    bg.querySelector('.zoom-x').focus();
  }
  function closeZoom(now) {
    const bg = document.querySelector('.zoom-bg'); if (!bg) return;
    const back = state.zoomFrom; state.zoomFrom = null;
    const done = () => { bg.remove(); U.animate(app); };
    if (now || reduceMotion()) done(); else { bg.classList.add('closing'); setTimeout(done, 180); }
    if (!now && back && document.contains(back)) back.focus({ preventScroll: true });
  }
  function viewHeute(M) {
    const now = new Date(), tk = today();
    const units = M.plan.filter(p => p.date === tk);
    const cur = units.find(p => statusOf(p, M) !== 'done');
    const tmr = iso(addDays(now, 1));
    const next = M.plan.filter(p => p.date === tmr);
    const nextMain = next.find(p => sp(p.sport).fam !== 'Mobility') || next[0];
    let left = wide() ? '' : statusCard(M, units);
    if (!units.length) left += `<section class="card" style="padding:18px"><b style="font-size:20px">Heute ist trainingsfrei</b><p style="margin:6px 0 0;color:var(--muted)">Erholung gehört zum Plan.</p></section>`;
    const def = cur ? cur.id : null;
    if (units.length && !cur && wide()) {
      left += doneSummary(M, units, now);
      units.forEach(p => { if (isOpen('heute', p.id, null)) left += unitExpanded(M, p, { fold: true, showActual: true }); });
    } else units.forEach(p => {
      if (statusOf(p, M) === 'done' && !isOpen('heute', p.id, def)) { left += doneRow(M, p, 'done-tile').html; return; }
      left += unitOrTile(M, p, statusOf(p, M) !== 'done' ? (p === cur ? 'Heute · ' : 'Danach · ') + unitMeta(p) + (sp(p.sport).k === 'mob' ? ' · ' + mobItems(p).length + ' Übungen' : '') : null, 'heute', def);
    });
    /* Krafteinheiten, die diese Woche liegen geblieben sind, hier zum Nachholen anbieten */
    const late = M.plan.filter(p => p.date < tk && sp(p.sport).fam === 'Kraft' && statusOf(p, M) === 'catch');
    if (late.length) left += `<div class="mhead"><b>Noch offen</b><small>aus dieser Woche</small></div>` + late.map(p => unitOrTile(M, p, 'Nachholen · ' + WDL[parseISO(p.date).getDay()] + ' · ' + unitMeta(p), 'heute', null)).join('');
    if (wide()) left += morgenWide(M, now);
    let right = wide() ? statusCard(M, units) : '';
    if (!wide()) right += morgenCard(M, now); /* Handy: was morgen ansteht statt Wochenkarte */
    else {
      right += weekCard(M, monday(now), true, true, true);
    }
    return header('Heute', WDL[now.getDay()] + ', ' + fmtDay(now), M.shifts[tk], WDS[now.getDay()] + ', ' + now.getDate() + '. ' + MON[now.getMonth()].slice(0, 3)) + banner() + `<div class="grid2"><div class="col">${left}</div><div class="col">${right}</div></div>`;
  }
  /* Erledigte Einheit: Werte statt Plan, mit Haken */
  function doneRow(M, p, cls) {
    let total = 0;
    const S = sp(p.sport), t = M.match[p.id];
    const bits = [];
    if (t) {
      total += t.dur || p.dur || 0;
      if (t.dur) bits.push(fmtH(t.dur));
      if (t.km) bits.push(S.k === 'swim' ? Math.round(t.km * 1000).toLocaleString('de-DE') + ' m' : t.km.toLocaleString('de-DE', { maximumFractionDigits: 1 }) + ' km');
      if (t.watt) bits.push('Ø ' + Math.round(t.watt) + ' W');
      else if (t.pace) bits.push(t.pace + ' /km');
      if (t.hr) bits.push('Ø ' + Math.round(t.hr) + ' bpm');
    } else if (S.k === 'kraft') {
      total += p.dur || 0;
      const ses = sessions(M).filter(x => x.pid === p.id).pop();
      if (ses) {
        const exs = new Set(ses.rows.map(r => r.ex)), vol = ses.rows.reduce((a, r) => a + (r.kg || 0) * (r.reps || 0), 0);
        bits.push(exs.size + ' Übungen', ses.rows.length + ' Sätze');
        if (vol) bits.push(Math.round(vol).toLocaleString('de-DE') + ' kg bewegt');
      } else bits.push(unitMeta(p));
    } else if (S.k === 'mob') { total += p.dur || 0; bits.push(mobItems(p).length + ' Übungen', unitMeta(p)); }
    else { total += p.dur || 0; bits.push(unitMeta(p)); }
    return { dur: total, html: `<button class="sum-row${cls ? ' ' + cls : ''}" style="${cv(S.k)}" data-open="${esc(p.id)}" data-uid="${esc(p.id)}" aria-label="${esc(p.title)} öffnen"><span class="ic">${ICON[S.k]}</span><span class="tx"><b>${esc(cleanTitle(p))}</b><small>${esc(bits.filter(Boolean).join(' · '))}</small></span><span class="ok">${CHECK}</span></button>` };
  }
  /* Alles erledigt: kurzer Rückblick auf den Tag statt leerer Seite */
  function doneSummary(M, units, now) {
    let total = 0;
    const rows = units.map(p => { const r = doneRow(M, p); total += r.dur; return r.html; }).join('');
    const nx = M.plan.find(p => p.date > today() && sp(p.sport).fam !== 'Mobility');
    const nd = nx && parseISO(nx.date), tmr = iso(addDays(now, 1));
    const nxLabel = nx ? (nx.date === tmr ? 'Morgen' : WDL[nd.getDay()]) : '';
    return `<section class="card sum">
      <div class="sum-h"><span class="sum-ic">${CHECK}</span><span class="tx"><b>Heute geschafft</b><small>${units.length === 1 ? '1 Einheit' : units.length + ' Einheiten'}${total ? ' · ' + fmtH(total) : ''}</small></span></div>
      <div class="sum-list">${rows}</div>
      ${nx ? `<div class="sum-next" style="${cv(sp(nx.sport).k)}"><span class="ic">${ICON[sp(nx.sport).k]}</span><span class="tx"><small>Als Nächstes · ${esc(nxLabel)}${M.shifts[nx.date] ? ' · Dienst ' + esc(M.shifts[nx.date]) : ''}</small><b>${esc(cleanTitle(nx))}</b></span><span class="r">${esc(unitMeta(nx))}</span></div>` : ''}
    </section>`;
  }
  /* Handy: alles, was morgen ansteht (inkl. Dienst und Mobility) */
  function morgenCard(M, now) {
    const d = addDays(now, 1), k = iso(d);
    const us = M.plan.filter(p => p.date === k);
    /* gleiche Kacheln wie heute: tippen klappt die Einheit auf und wieder zu */
    let h = `<div class="mhead"><b>Morgen</b><small>${WDL[d.getDay()]}, ${fmtShort(d)}</small>${M.shifts[k] ? `<span class="shift">${esc(M.shifts[k])}</span>` : ''}</div>`;
    if (!us.length) return h + '<section class="card" style="padding:16px"><span class="free">Trainingsfrei</span></section>';
    return h + us.map(p => unitOrTile(M, p, 'Morgen · ' + unitMeta(p) + (sp(p.sport).k === 'mob' ? ' · ' + mobItems(p).length + ' Übungen' : ''), 'heute', null)).join('');
  }
  /* Laptop: nur der morgige Tag, groß im Stil der Einheiten; Tippen öffnet die Details */
  function morgenWide(M, now) {
    const d = addDays(now, 1), k = iso(d);
    const us = M.plan.filter(p => p.date === k);
    let h = `<div class="mwrap"><div class="mhead wide"><b>Morgen</b><small>${WDL[d.getDay()]}, ${fmtShort(d)}</small>${M.shifts[k] ? `<span class="shift">${esc(M.shifts[k])}</span>` : ''}</div>`;
    if (!us.length) return h + '<section class="card" style="padding:18px"><span class="free">Trainingsfrei</span></section></div>';
    return h + us.map(p => {
      const S = sp(p.sport), mob = S.k === 'mob', n = mob ? mobItems(p).length : 0;
      return `<button class="mu${mob ? ' sm' : ''}" style="${cv(S.k)}" data-sheet="${esc(p.id)}" aria-label="${esc(p.title)} für morgen ansehen"><span class="mu-top"><span class="u-sport"><span class="dot-ico">${ICON[S.k]}</span><span>${esc(sportLabel(p))}</span></span><span class="u-dur">${esc(unitMeta(p))}${mob ? ' · ' + n + (n === 1 ? ' Übung' : ' Übungen') : ''}</span></span>${mob ? '' : `<span class="mu-t">${esc(cleanTitle(p))}</span>`}${p.note && !mob ? `<span class="mu-n">${esc(p.note)}</span>` : ''}</button>`;
    }).join('') + '</div>';
  }
  /* Laptop: Blick auf die kommenden Tage */
  function nextDays(M, now) {
    let h = '<section class="card ndays"><span class="eyebrow">Die nächsten Tage</span><div class="nd-list">';
    for (let i = 1; i <= 4; i++) {
      const d = addDays(now, i), k = iso(d);
      const us = M.plan.filter(p => p.date === k && sp(p.sport).fam !== 'Mobility');
      h += `<div class="nd-day"><div class="nd-h"><b>${i === 1 ? 'Morgen' : WDL[d.getDay()]}</b><small>${fmtShort(d)}</small>${M.shifts[k] ? `<span class="shift">${esc(M.shifts[k])}</span>` : ''}</div>`;
      h += us.length ? us.map(p => { const S = sp(p.sport); return `<button class="nd-u" style="${cv(S.k)}" data-sheet="${esc(p.id)}"><span class="ic">${ICON[S.k]}</span><span class="tx"><b>${esc(cleanTitle(p))}</b><small>${esc(sportLabel(p))} · ${esc(unitMeta(p))}</small></span></button>`; }).join('') : '<span class="free">Trainingsfrei</span>';
      h += '</div>';
    }
    return h + '</div></section>';
  }
  function viewWoche(M) {
    const mon = addDays(monday(new Date()), state.weekOff * 7), sun = addDays(mon, 6);
    const chev = d => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="${d}"/></svg>`;
    const when = state.weekOff === 0 ? 'Diese Woche' : state.weekOff === 1 ? 'Nächste Woche' : state.weekOff === -1 ? 'Letzte Woche' : 'KW ' + isoWeek(mon);
    let h = header('Woche', 'KW ' + isoWeek(mon)) + banner();
    h += `<div class="wnav"><button data-week="-1" aria-label="Vorige Woche" title="Vorige Woche (←)">${chev('m15 18-6-6 6-6')}</button><div><b>${when}</b><small>${fmtShort(mon)} – ${fmtShort(sun)}</small></div><button data-week="1" aria-label="Nächste Woche" title="Nächste Woche (→)">${chev('m9 18 6-6-6-6')}</button></div>`;
    h += weekCard(M, mon, !wide(), false, true) + '<div class="wgrid">';
    /* Handy, aktuelle Woche: vergangene Tage ausgegraut ans Ende */
    const order = [0, 1, 2, 3, 4, 5, 6];
    const isPast = i => iso(addDays(mon, i)) < today();
    if (!wide() && state.weekOff === 0) order.sort((a, b) => (isPast(a) - isPast(b)) || a - b);
    let pastHead = false;
    for (const i of order) {
      const d = addDays(mon, i), k = iso(d);
      const us = M.plan.filter(p => p.date === k);
      if (!wide() && state.weekOff === 0 && isPast(i) && !pastHead) { pastHead = true; h += '<div class="past-h">Schon vorbei</div>'; }
      h += `<section class="card day${k === today() ? ' today' : ''}${d.getDay() % 6 === 0 ? ' we' : ''}${state.weekOff === 0 && isPast(i) ? ' past' : ''}" id="tag-${k}"><div class="day-h"><b><span class="dl">${WDL[d.getDay()]}, ${fmtDay(d)}${k === today() ? '<em class="tday">Heute</em>' : ''}</span><span class="ds">${WDL[d.getDay()]} <span>${fmtShort(d)}</span></span></b>${M.shifts[k] ? `<span class="shift">${esc(M.shifts[k])}</span>` : '<span class="shift none">Kein Dienst</span>'}</div>`;
      h += us.length ? us.map(p => !wide() && isOpen('woche', p.id, null) ? unitExpanded(M, p, { fold: true, showActual: true }) : rowHTML(M, p)).join('') : '<span class="free">Trainingsfrei</span>';
      h += '</section>';
    }
    return h + '</div>';
  }
  function rowHTML(M, p) {
    const S = sp(p.sport), st = statusOf(p, M);
    const right = st === 'done' ? `<span class="ok" style="background:var(--${S.k})">${CHECK}</span>` : st === 'miss' ? '<span class="r">Ausgelassen</span>' : st === 'catch' ? '<span class="catch-pill">Nachholen</span>' : `<span class="r">${esc(unitMeta(p))}</span>`;
    return `<button class="row${st === 'catch' ? ' catch' : ''}" style="${cv(S.k)}" data-open="${esc(p.id)}" data-uid="${esc(p.id)}" aria-expanded="false"><span class="ic">${ICON[S.k]}</span><span class="tx"><b>${esc(p.title)}</b><small>${esc(p.sport)}</small><small class="mt">${st === 'miss' ? 'Ausgelassen' : esc(unitMeta(p))}</small></span>${right}</button>`;
  }
  /* Saisonplan aus dem Blatt „Saison“: Phasen zum Antippen, die aktuelle ist vorausgewählt */
  function saisonCard(M) {
    const ph = M.saison;
    if (!ph.length) return '';
    const tk = today(), start = parseISO(ph[0].von), days = p => (parseISO(p.bis) - parseISO(p.von)) / 864e5 + 1;
    const total = (parseISO(ph[ph.length - 1].bis) - start) / 864e5 + 1;
    const ci = Math.max(0, ph.findIndex(p => tk >= p.von && tk <= p.bis) >= 0 ? ph.findIndex(p => tk >= p.von && tk <= p.bis) : (tk < ph[0].von ? 0 : ph.length - 1));
    const si = state.phase != null && ph[state.phase] ? state.phase : ci, sel = ph[si];
    const wk = Math.max(1, Math.floor((parseISO(tk) - start) / 864e5 / 7) + 1), wks = Math.round(total / 7);
    const short = n => n.replace(/^Grundlage/, 'Grund').replace(/^Spitze und Taper$/, 'Taper');
    const segs = ph.map((p, i) => {
      const len = days(p), cur = i === ci, past = p.bis < tk;
      const fill = cur ? Math.min(100, Math.max(4, ((parseISO(tk) - parseISO(p.von)) / 864e5 + 1) / len * 100)) : past ? 100 : 0;
      return `<button class="phs${i === si ? ' on' : ''}${cur ? ' cur' : ''}" style="flex:1 1 0" data-phase="${i}" aria-pressed="${i === si}" aria-label="${esc(p.name)}, ${fmtShort(parseISO(p.von))} bis ${fmtShort(parseISO(p.bis))}${cur ? ', aktuell' : ''}">
        <span class="phs-bar">${fill ? `<i style="width:max(8px,${fill.toFixed(0)}%)"></i>` : ''}</span><span class="phs-n">${esc(short(p.name))}</span></button>`;
    }).join('');
    const fmtLong = s => parseISO(s).toLocaleDateString('de-DE', { day: 'numeric', month: 'long' });
    const SPN = { swim: 'Schwimmen', bike: 'Rad', run: 'Laufen', kraft: 'Kraft' };
    const rowsSp = P => ['swim', 'bike', 'run', 'kraft'].filter(k => P.sp[k]).map(k => {
      const um = P.sp[k].split(' · ')[0].replace(/\s*pro Woche,\s*(?:je |zusammen )?/, ' · ').replace(/^letzte Einheit /, 'bis ');
      return `<div class="ph-sp" style="${cv(k)}"><span class="ph-sp-n"><i aria-hidden="true"></i>${SPN[k]}</span><span class="um">${esc(um).replace(/ (m|min|h)\b/g, '\u00a0$1')}</span></div>`;
    }).join('');
    return `<section class="card pcard saison" style="order:3"><div class="ph-top"><span class="eyebrow">Saison</span><span class="ph-wk">Woche ${Math.min(wk, wks)} von ${wks}</span></div>
      <div class="phs-row" role="group" aria-label="Phasen bis zum Rennen">${segs}</div>
      <div class="ph-ds">${ph.map((P, i) => `<div class="ph-d${i === si ? ' on' : ''}">
        <div class="ph-h"><b>${esc(P.name)}</b>${i === ci ? '<span class="ph-now">Jetzt</span>' : ''}</div>
        <small class="ph-meta">${i === ci ? 'Bis ' + fmtLong(P.bis) : fmtLong(P.von) + ' – ' + fmtLong(P.bis)} · ${esc(P.std)}</small>
        ${rowsSp(P) ? `<div class="ph-sps">${rowsSp(P)}</div>` : ''}
      </div>`).join('')}</div></section>`;
  }
  function viewFortschritt(M) {
    const F = M.fitness, last = F[F.length - 1] || {};
    /* Garmin meldet VO2max nur an manchen Tagen: darum der letzte bekannte Wert */
    const vo2 = F.reduce((v, f) => f.vo2 != null ? f.vo2 : v, null);
    const from = M.plan.length ? M.plan.reduce((a, p) => p.date < a ? p.date : a, M.plan[0].date) : iso(addDays(new Date(), -28));
    const fit0 = F.find(f => f.date >= from && f.ctl != null);
    const fitD = fit0 && last.ctl != null ? Math.round(last.ctl) - Math.round(fit0.ctl) : null;
    const fitTxt = fitD == null ? '' : ` ${fitD > 0 ? '+' + fitD : fitD < 0 ? '−' + -fitD : '±0'}`;
    let h = header('Fortschritt', 'Seit dem Planstart', null, 'Seit Planstart') + banner();
    h += `<section class="card pcard"><span class="eyebrow">Stand heute</span><div class="big3"><div><b>${vo2 == null ? '–' : Math.round(vo2)}</b><small>VO₂max</small></div><div><b>${last.ctl == null ? '–' : Math.round(last.ctl)}</b><small>Fitness${fitTxt}</small></div><div><b>${last.tsb == null ? '–' : (last.tsb > 0 ? '+' : '') + Math.round(last.tsb)}</b><small>Form</small></div></div></section>`;
    h = h.replace('<section class="card pcard"><span class="eyebrow">Stand heute', '<div class="pgrid"><div class="pcol"><section class="card pcard" style="order:1"><span class="eyebrow">Stand heute');
    h += '<!--A-->';
    h += '</div><div class="pcol">';
    h += `<section class="card pcard chart" style="order:2"><span class="eyebrow">Trainingslast und Ermüdung · 12 Wochen</span>${fitChart(F.slice(-84))}<div class="clegend"><span><i style="background:var(--bike)"></i>Trainingslast</span><span><i style="background:var(--faint)"></i>Ermüdung</span></div></section>`;
    h += saisonCard(M);
    const stunden = `<section class="card pcard chart" style="order:4"><span class="eyebrow">Stunden pro Woche</span>${weekChart(M)}<div class="clegend"><span><i style="background:var(--fill)"></i>Geplant</span><span><i style="background:var(--fg)"></i>Absolviert</span></div></section>`;
    const rec = M.trainings.filter(t => t.date >= from && t.date <= today());
    h = h.replace('<!--A-->', `<section class="card pcard" style="order:5"><span class="eyebrow">Seit Planstart · ${fmtShort(parseISO(from))}</span>${[['Schwimmen', 'swim'], ['Rad', 'bike'], ['Laufen', 'run']].map(([f, k]) => {
      const xs = rec.filter(t => sp(t.sport).fam === f), km = xs.reduce((a, t) => a + (t.km || 0), 0), min = xs.reduce((a, t) => a + (t.dur || 0), 0);
      return `<div class="sprow" style="${cv(k)}"><span class="ic">${ICON[k]}</span><span><b>${f}</b><small>${xs.length === 1 ? '1 Einheit' : xs.length + ' Einheiten'}</small></span><span class="spv"><b class="num">${f === 'Schwimmen' ? Math.round(km * 1000).toLocaleString('de-DE') + ' m' : Math.round(km).toLocaleString('de-DE') + ' km'}</b><small class="num">${xs.length ? fmtH(min) : '–'}</small></span></div>`;
    }).join('')}</section>`);
    h += '</div><div class="pcol pk">' + stunden + '</div></div>';
    if (state.ver) h += `<p class="appver">Version ${state.ver}</p>`;
    return h;
  }

  function fitChart(F) {
    if (F.length < 2) return '<p class="tiny">Noch zu wenige Tage im Sheet.</p>';
    const W = 600, H = wide() ? 330 : 200, pl = 34, pr = 10, pt = 10, pb = 24;
    const vals = F.flatMap(f => [f.ctl, f.atl]).filter(v => v != null);
    const max = Math.ceil(Math.max(...vals, 10) / 20) * 20;
    const x = i => pl + i * (W - pl - pr) / (F.length - 1), y = v => pt + (H - pt - pb) * (1 - v / max);
    const line = k => F.map((f, i) => f[k] == null ? '' : `${i && F[i - 1][k] != null ? 'L' : 'M'}${x(i).toFixed(1)},${y(f[k]).toFixed(1)}`).join('');
    const area = `M${x(0)},${y(0)}` + F.map((f, i) => f.ctl == null ? '' : `L${x(i).toFixed(1)},${y(f.ctl).toFixed(1)}`).join('') + `L${x(F.length - 1)},${y(0)}Z`;
    let g = '';
    for (let v = 0; v <= max; v += 20) g += `<line x1="${pl}" x2="${W - pr}" y1="${y(v)}" y2="${y(v)}" stroke="var(--line)"/><text x="${pl - 6}" y="${y(v) + 4}" text-anchor="end" font-size="11" fill="var(--muted)">${v}</text>`;
    const lbl = [0, Math.floor((F.length - 1) / 2), F.length - 1].map((i, j) => `<text x="${x(i)}" y="${H - 6}" text-anchor="${j === 0 ? 'start' : j === 2 ? 'end' : 'middle'}" font-size="11" fill="var(--muted)">${fmtShort(parseISO(F[i].date))}</text>`).join('');
    const L = F[F.length - 1];
    const cw = (W - pl - pr) / (F.length - 1);
    const hits = F.map((f, i) => `<rect class="hit" x="${(x(i) - cw / 2).toFixed(1)}" y="${pt}" width="${cw.toFixed(1)}" height="${H - pt - pb}" fill="transparent" data-gx="${x(i).toFixed(1)}" data-gy="${f.ctl == null ? '' : y(f.ctl).toFixed(1)}" data-tip="${esc(WDS[parseISO(f.date).getDay()] + ', ' + fmtShort(parseISO(f.date)) + '|Trainingslast ' + (f.ctl == null ? '–' : Math.round(f.ctl)) + ' · Ermüdung ' + (f.atl == null ? '–' : Math.round(f.atl)) + ' · Form ' + (f.ctl == null || f.atl == null ? '–' : (f.ctl - f.atl > 0 ? '+' : '') + Math.round(f.ctl - f.atl)))}"/>`).join('');
    return `<svg viewBox="0 0 ${W} ${H}" role="img" tabindex="0" data-chart data-scrub aria-label="Verlauf von Trainingslast und Ermüdung. Mit den Pfeiltasten durch die Tage gehen.">${g}<path d="${area}" fill="var(--bike-t)"/><path d="${line('atl')}" fill="none" stroke="var(--faint)" stroke-width="1.5" stroke-dasharray="4 3"/><path d="${line('ctl')}" fill="none" stroke="var(--bike)" stroke-width="2.5"/>${L.ctl != null ? `<circle cx="${x(F.length - 1)}" cy="${y(L.ctl)}" r="4" fill="var(--bike)"/>` : ''}${lbl}<line class="guide" x1="0" x2="0" y1="${pt}" y2="${H - pb}" stroke="var(--muted)" stroke-width="1" opacity="0"/><circle class="gdot" r="4.5" fill="var(--bike)" stroke="var(--card)" stroke-width="2" opacity="0"/>${hits}</svg>`;
  }
  function weekChart(M) {
    const start = addDays(monday(new Date()), -5 * 7), weeks = [];
    for (let w = 0; w < 9; w++) {
      const a = addDays(start, w * 7), b = addDays(a, 6), A = iso(a), B = iso(b);
      const plan = M.plan.filter(p => p.date >= A && p.date <= B && sp(p.sport).ring).reduce((s, p) => s + p.dur, 0) / 60;
      const act = A <= today() ? (M.trainings.filter(t => t.date >= A && t.date <= B && sp(t.sport).ring).reduce((s, t) => s + (t.dur || 0), 0) + M.plan.filter(p => p.date >= A && p.date <= B && sp(p.sport).fam === 'Kraft' && p.done && !M.match[p.id]).reduce((s, p) => s + p.dur, 0)) / 60 : 0;
      weeks.push({ a, plan, act, cur: today() >= A && today() <= B });
    }
    const W = 600, H = wide() ? 330 : 200, pl = 30, pr = 6, pt = 10, pb = 24;
    const max = Math.max(2, Math.ceil(Math.max(...weeks.map(w => Math.max(w.plan, w.act)))));
    const bw = (W - pl - pr) / weeks.length, y = v => pt + (H - pt - pb) * (1 - v / max);
    let g = '';
    for (let v = 0; v <= max; v += max > 8 ? 4 : 2) g += `<line x1="${pl}" x2="${W - pr}" y1="${y(v)}" y2="${y(v)}" stroke="var(--line)"/><text x="${pl - 6}" y="${y(v) + 4}" text-anchor="end" font-size="11" fill="var(--muted)">${v}</text>`;
    weeks.forEach((w, i) => {
      const x0 = pl + i * bw + bw * 0.18, wd = bw * 0.64;
      if (w.plan) g += `<rect x="${x0}" y="${y(w.plan)}" width="${wd}" height="${y(0) - y(w.plan)}" rx="5" fill="var(--fill)"/>`;
      if (w.act) g += `<rect x="${x0 + wd * 0.22}" y="${y(w.act)}" width="${wd * 0.56}" height="${y(0) - y(w.act)}" rx="4" fill="var(--fg)"/>`;
      g += `<text x="${x0 + wd / 2}" y="${H - 6}" text-anchor="middle" font-size="11" fill="${w.cur ? 'var(--fg)' : 'var(--muted)'}" font-weight="${w.cur ? 700 : 400}">KW${isoWeek(w.a)}</text>`;
      g += `<rect class="hit bar" x="${pl + i * bw}" y="${pt}" width="${bw}" height="${H - pt - pb}" rx="8" data-gx="${(x0 + wd / 2).toFixed(1)}" data-tip="${esc('KW ' + isoWeek(w.a) + ' · ' + fmtShort(w.a) + '|Geplant ' + fmtH(Math.round(w.plan * 60)) + ' · Absolviert ' + fmtH(Math.round(w.act * 60)))}"/>`;
    });
    return `<svg viewBox="0 0 ${W} ${H}" role="img" tabindex="0" data-chart aria-label="Wochenstunden geplant und absolviert. Mit den Pfeiltasten durch die Wochen gehen.">${g}</svg>`;
  }
  function viewSetup() {
    const c = state.cfg || {};
    return `<div class="setup"><h1>Einrichtung</h1><p>Die App liest deinen Trainingsplan aus dem Google Sheet. Dafür braucht sie die Web-App-Adresse deines Skripts und deinen App-Schlüssel. Beides bleibt nur auf diesem Gerät gespeichert.</p>
      <form id="setup" class="setup" style="padding:0">
        <label for="cfg-url">Web-App-Adresse<input id="cfg-url" type="url" required autocomplete="off" value="${esc(c.url || DEFAULT_URL)}"></label>
        <label for="cfg-key">App-Schlüssel<input id="cfg-key" type="password" required autocomplete="off" value="${esc(c.key || '')}" placeholder="aus dem Ausführungsprotokoll"></label>
        <button class="btn" type="submit">${state.loading ? 'Verbinde …' : 'Verbinden'}</button>
        ${state.err && /Kein Zugriff/.test(state.err) ? '<span class="msg">Der Schlüssel passt nicht. Bitte prüfen.</span>' : state.err && !state.data ? `<span class="msg">Verbindung fehlgeschlagen: ${esc(state.err)}</span>` : ''}
      </form>${c.key ? '<a class="link" href="#heute">Zurück</a>' : ''}</div>`;
  }

  /* ---------- Rendern ---------- */
  /* Zum Tag in der Wochenansicht scrollen und ihn kurz hervorheben */
  function jumpTo(k) {
    const t = document.getElementById('tag-' + k);
    if (!t) return false;
    t.scrollIntoView({ behavior: reduceMotion() ? 'auto' : 'smooth', block: t.offsetHeight > window.innerHeight * .7 ? 'start' : 'center' });
    t.classList.remove('flash'); void t.offsetWidth; t.classList.add('flash');
    return true;
  }
  function current() { const h = location.hash.slice(1); return ['heute', 'woche', 'fortschritt', 'einrichtung'].includes(h) ? h : 'heute'; }
  let lastRender = '', lastView = '', lastSheet = '';
  const ORDER = ['heute', 'woche', 'fortschritt', 'einrichtung'];
  const reduceMotion = () => window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function morph(el, html) {
    if (!window.morphdom) { el.innerHTML = html; return; }
    const wrap = el.cloneNode(false); wrap.innerHTML = html;
    window.morphdom(el, wrap, {
      childrenOnly: true,
      onBeforeElUpdated(from, to) {
        if (from.isEqualNode(to)) return false;
        if (from.tagName === 'svg' && from.hasAttribute('data-fig') && from.getAttribute('data-fig') === to.getAttribute('data-fig') && from.getAttribute('data-fig')) return false;
        if (from === document.activeElement && from.tagName === 'INPUT') return false;
        return true;
      }
    });
  }
  function placeIndicator() {
    const nav = document.querySelector('nav.tabs'), ind = nav && nav.querySelector('.tab-ind');
    const a = nav && nav.querySelector('a[aria-current="page"]');
    if (!ind) return;
    if (!a) { ind.style.width = '0px'; return; }
    ind.style.width = a.offsetWidth + 'px';
    ind.style.transform = `translateX(${a.offsetLeft}px)`;
  }
  function sideCount() {
    const el = $('#side-count'); if (!el) return;
    const days = Math.ceil((RACE - new Date(new Date().toDateString())) / 864e5);
    const html = `<small>${esc(RACE_NAME)}</small><b class="num">${days}</b><span>Tage · ${fmtDay(RACE)} ${RACE.getFullYear()}</span>`;
    if (el.innerHTML !== html) el.innerHTML = html;
  }
  function render() {
    const v = state.cfg && state.cfg.key ? current() : 'einrichtung';
    sideCount();
    document.querySelectorAll('nav a[data-v]').forEach(a => { if (a.dataset.v === v) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current'); });
    placeIndicator();
    const app = $('#app');
    app.dataset.view = v;
    let html;
    const M = model();
    syncWake(M);
    if (v === 'einrichtung') html = viewSetup();
    else if (!M) html = header('Heute', 'Lade deine Daten …', null, 'Lädt …') + banner() + '<div class="skel"></div>';
    else html = v === 'woche' ? viewWoche(M) : v === 'fortschritt' ? viewFortschritt(M) : viewHeute(M);
    if (v !== lastView) {
      app.innerHTML = html; lastRender = html;
      app.style.transition = ''; app.style.transform = ''; app.style.opacity = '';
      if (!reduceMotion() && state.slide) {
        const cls = state.slide > 0 ? 'slide-l' : 'slide-r';
        app.classList.remove('slide-l', 'slide-r', 'view-in'); void app.offsetWidth; app.classList.add(cls);
        setTimeout(() => app.classList.remove(cls), 300);
      } else if (!reduceMotion() && lastView) {
        app.classList.remove('view-in'); void app.offsetWidth; app.classList.add('view-in');
        setTimeout(() => app.classList.remove('view-in'), 400);
      }
      window.scrollTo(0, 0);
      lastView = v; state.slide = 0;
      U.animate(app);
    } else if (html !== lastRender) {
      morph(app, html); lastRender = html;
      U.animate(app);
    }
    if (state.sheetId) renderSheet(); else if (!$('#sheet').hidden && !state.sheetClosing) closeSheetNow();
    tickRest();
    if (window.TRI_STUCK) requestAnimationFrame(window.TRI_STUCK);
    if (state.scrollEx) {
      const pid = state.scrollEx, check = state.scrollCheck; state.scrollEx = null; state.scrollCheck = false;
      const root = state.sheetId === pid ? $('#sheet') : app;
      const stop = root.querySelector(`[data-stop="${CSS.escape(pid)}"]`), box = stop ? stop.closest('.run-top').parentElement : root; /* nur in dieser Einheit suchen */
      const el = box.querySelector('.mob-ex.active') || box.querySelector('.ex-card') || box.querySelector('.run-top'); /* genau zur aktiven Übung, nicht zur Kopfzeile */
      if (el && check) { /* hat sich die Seite beim Scrollen noch verschoben, einmal nachrücken; Antippen bricht das ab */
        const run = scrollRun;
        setTimeout(() => {
          if (run !== scrollRun || !el.isConnected) return;
          if (Math.abs(el.getBoundingClientRect().top - (parseFloat(getComputedStyle(el).scrollMarginTop) || 0)) > 4) el.scrollIntoView({ behavior: reduceMotion() ? 'auto' : 'smooth', block: 'start' });
        }, 800);
      }
      if (el) el.scrollIntoView({ behavior: reduceMotion() ? 'auto' : 'smooth', block: 'start' });
    }
  }
  function renderSheet() {
    const M = model(); const p = M && M.plan.find(x => x.id === state.sheetId);
    const s = $('#sheet');
    if (!p) { state.sheetId = null; closeSheetNow(); return; }
    const d = parseISO(p.date);
    const inner = `<div class="grab" aria-hidden="true"></div><div class="sheet-top"><small>${WDL[d.getDay()]}, ${fmtDay(d)}${M.shifts[p.date] ? ' · ' + esc(M.shifts[p.date]) : ''}</small><button data-close>Schließen</button></div>${unitExpanded(M, p, { showActual: true })}`;
    const sheet = s.querySelector('.sheet');
    if (!sheet || s.hidden || s.dataset.id !== p.id) {
      s.innerHTML = `<div class="sheet-bg" data-close><div class="sheet" role="dialog" aria-modal="true" aria-label="${esc(p.title)}">${inner}</div></div>`;
      s.dataset.id = p.id; s.hidden = false; lastSheet = inner;
      document.documentElement.style.overflow = 'hidden';
      U.animate(s); bindSwipe(s.querySelector('.sheet'));
      const btn = s.querySelector('button[data-close]'); if (btn) btn.focus({ preventScroll: true });
    } else if (inner !== lastSheet) {
      morph(sheet, inner); lastSheet = inner; U.animate(s);
    }
  }
  function closeSheet() {
    const s = $('#sheet'), bg = s.querySelector('.sheet-bg');
    state.sheetId = null;
    if (!bg || reduceMotion()) { closeSheetNow(); render(); return; }
    state.sheetClosing = true;
    bg.classList.add('closing');
    setTimeout(() => { state.sheetClosing = false; closeSheetNow(); render(); }, 230);
  }
  function closeSheetNow() {
    const s = $('#sheet'); s.hidden = true; s.innerHTML = ''; s.dataset.id = ''; lastSheet = '';
    document.documentElement.style.overflow = '';
  }
  function bindSwipe(sheet) {
    if (!sheet) return;
    let y0 = null, dy = 0, t0 = 0;
    sheet.addEventListener('touchstart', e => { if (sheet.scrollTop > 0) { y0 = null; return; } y0 = e.touches[0].clientY; dy = 0; t0 = Date.now(); sheet.style.transition = 'none'; }, { passive: true });
    sheet.addEventListener('touchmove', e => { if (y0 == null) return; dy = Math.max(0, e.touches[0].clientY - y0); if (dy > 0) sheet.style.transform = `translateY(${dy}px)`; }, { passive: true });
    sheet.addEventListener('touchend', () => {
      if (y0 == null) return;
      const fast = dy / Math.max(1, Date.now() - t0) > 0.6;
      sheet.style.transition = 'transform var(--t-med) var(--ease-out)';
      if (dy > 120 || (fast && dy > 40)) { sheet.style.transform = 'translateY(100%)'; setTimeout(() => { state.sheetId = null; closeSheetNow(); render(); }, 200); }
      else sheet.style.transform = '';
      y0 = null;
    });
  }
  /* Aufklappen an Ort und Stelle: Höhe gleitet, der Rest rutscht mit */
  function heightOf(id) { const el = id && document.querySelector(`[data-uid="${CSS.escape(id)}"]`); return el ? el.offsetHeight : 0; }
  function glide(id, h0) {
    const el = id && document.querySelector(`[data-uid="${CSS.escape(id)}"]`);
    if (!el || !h0 || reduceMotion() || !el.animate) return;
    const h1 = el.offsetHeight; if (Math.abs(h1 - h0) < 2) return;
    const a = el.animate([{ height: h0 + 'px', overflow: 'hidden' }, { height: h1 + 'px', overflow: 'hidden' }], { duration: 340, easing: 'cubic-bezier(.22,1,.36,1)' });
    if (h1 > h0) el.animate([{ opacity: .4 }, { opacity: 1 }], { duration: 260, easing: 'ease-out' });
    return a;
  }
  /* Gleiche Kurve wie die Höhenanimation (cubic-bezier .22,1,.36,1) */
  const bez = (x1, y1, x2, y2) => t => {
    let u = t;
    for (let n = 0; n < 8; n++) {
      const x = 3 * (1 - u) * (1 - u) * u * x1 + 3 * (1 - u) * u * u * x2 + u * u * u - t;
      const dx = 3 * (1 - u) * (1 - u) * x1 + 6 * (1 - u) * u * (x2 - x1) + 3 * u * u * (1 - x2);
      if (Math.abs(x) < 1e-5 || Math.abs(dx) < 1e-6) break;
      u = Math.min(1, Math.max(0, u - x / dx));
    }
    return 3 * (1 - u) * (1 - u) * u * y1 + 3 * (1 - u) * u * u * y2 + u * u * u;
  };
  const EASE = bez(.22, 1, .36, 1);
  let scrollRun = 0;
  function glideScroll(target, dur) {
    const y0 = window.scrollY, d = target - y0;
    if (Math.abs(d) < 1) return;
    if (reduceMotion()) { window.scrollTo(0, target); return; }
    const run = ++scrollRun, t0 = performance.now();
    const step = now => {
      if (run !== scrollRun) return;
      const k = Math.min(1, (now - t0) / dur);
      window.scrollTo(0, y0 + d * EASE(k));
      if (k < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }
  /* Antippen oder Wischen während der Fahrt hält sie an, wie bei iOS */
  ['touchstart', 'wheel'].forEach(ev => window.addEventListener(ev, () => { scrollRun++; }, { passive: true }));
  /* Aufgeklapptes Feld ganz zeigen: steht es schon ganz im Bild, bleibt alles stehen;
     ragt es unten raus, rückt es in die Mitte des freien Bereichs (wie beim Aufklappen einer Einheit) */
  /* Holt ein Element (optional bis einschließlich endEl) ganz ins Bild; passt es nicht, beginnt es oben */
  function bringIntoView(el, endEl) {
    const r0 = el.getBoundingClientRect(), r1 = endEl ? endEl.getBoundingClientRect() : r0;
    const r = { top: r0.top, bottom: Math.max(r0.bottom, r1.bottom) }; r.height = r.bottom - r.top;
    const smooth = !matchMedia('(prefers-reduced-motion: reduce)').matches;
    let box = el.parentElement;
    while (box && box !== document.body && !(/(auto|scroll)/.test(getComputedStyle(box).overflowY) && box.scrollHeight > box.clientHeight)) box = box.parentElement;
    if (box && box !== document.body) {
      const b = box.getBoundingClientRect(), t = b.top + 12, bt = b.bottom - 12, rm = bt - t;
      let d = 0;
      if (r.top < t) d = r.top - t; else if (r.bottom > bt) d = r.height <= rm ? r.bottom - bt : r.top - t;
      if (d) box.scrollBy({ top: d, behavior: smooth ? 'smooth' : 'auto' });
      return;
    }
    const sb = $('.statusbg'), top = (sb ? sb.offsetHeight : 0) + 16;
    const nav = $('nav.tabs'), nr = nav && nav.getBoundingClientRect();
    const bottom = nr && nr.height ? nr.top - 16 : window.innerHeight - 16;
    const room = bottom - top;
    let dy = 0;
    if (r.top < top) dy = r.top - top;
    else if (r.bottom > bottom) dy = r.height <= room ? (r.top + r.height / 2) - (top + room / 2) : r.top - top;
    if (dy) glideScroll(Math.max(0, Math.min(window.scrollY + dy, document.documentElement.scrollHeight - window.innerHeight)), 300);
  }
  function toggleUnit(id, open) {
    const v = current();
    /* Laptop-Woche: Einheit groß im Fenster statt in der schmalen Tagesspalte */
    if (open && v === 'woche' && wide()) { state.sheetId = id; render(); return; }
    const h0 = heightOf(id);
    (state.open[v] = state.open[v] || {})[id] = open;
    state.lastOpen = open ? id : null;
    render();
    /* Ziel-Layout messen, bevor die Höhenanimation startet */
    const el = open && document.querySelector(`[data-uid="${CSS.escape(id)}"]`);
    const r = el && el.getBoundingClientRect();
    const maxEnd = document.documentElement.scrollHeight - window.innerHeight;
    const anim = glide(id, h0);
    if (el) {
      /* Karte bleibt stehen, solange sie ganz sichtbar ist. Ragt sie unten raus,
         rückt sie in die Mitte des freien Bereichs; ist sie höher als der Bildschirm,
         rückt ihr Kopf direkt unter die Statusleiste. */
      const sb = $('.statusbg'), top = (sb ? sb.offsetHeight : 0) + 16;
      const nav = $('nav.tabs'), nr = nav && nav.getBoundingClientRect();
      const bottom = nr && nr.height ? nr.top - 16 : window.innerHeight - 16;
      const room = bottom - top;
      let dy = 0;
      if (r.top < top) dy = r.top - top;
      else if (r.bottom > bottom) dy = r.height <= room ? (r.top + r.height / 2) - (top + room / 2) : r.top - top;
      if (dy) {
        const target = Math.max(0, Math.min(window.scrollY + dy, maxEnd));
        /* Scrollen läuft gleichzeitig mit dem Aufklappen und mit derselben Kurve.
           Ein Platzhalter am Seitenende hält das Ziel erreichbar, solange die Karte noch wächst. */
        if (anim && r.height > h0) {
          const sp = document.createElement('div');
          sp.style.cssText = `height:${Math.ceil(r.height - h0)}px;pointer-events:none`;
          document.body.appendChild(sp);
          const done = () => sp.remove();
          anim.finished ? anim.finished.then(done, done) : setTimeout(done, 400);
        }
        glideScroll(target, 340);
      }
    }
  }

  /* Wischen zwischen Heute, Woche und Fortschritt */
  const TABS = ['heute', 'woche', 'fortschritt'];
  (function swipeTabs() {
    const app = $('#app');
    let x0 = 0, y0 = 0, t0 = 0, dx = 0, mode = null;
    const blocked = t => t.closest('input,textarea,select,.cbt,[data-step],.sets,.timer,.nosw,svg[data-scrub]') || !$('#sheet').hidden;
    app.addEventListener('touchstart', e => {
      mode = null;
      if (e.touches.length !== 1 || blocked(e.target) || !TABS.includes(current()) || !(state.cfg && state.cfg.key)) { mode = 'off'; return; }
      x0 = e.touches[0].clientX; y0 = e.touches[0].clientY; t0 = Date.now(); dx = 0;
      if (x0 < 24 || x0 > window.innerWidth - 24) mode = 'off'; /* Bildschirmrand gehört dem System */
    }, { passive: true });
    app.addEventListener('touchmove', e => {
      if (mode === 'off') return;
      const mx = e.touches[0].clientX - x0, my = e.touches[0].clientY - y0;
      if (!mode) {
        if (Math.abs(mx) < 10 && Math.abs(my) < 10) return;
        mode = Math.abs(mx) > Math.abs(my) * 1.5 ? 'x' : 'off';
        if (mode === 'x') app.style.transition = 'none';
      }
      if (mode !== 'x') return;
      e.preventDefault();
      const i = TABS.indexOf(current());
      const edge = (mx > 0 && i === 0) || (mx < 0 && i === TABS.length - 1);
      dx = edge ? mx * 0.15 : mx;
      app.style.transform = `translateX(${dx}px)`;
    }, { passive: false });
    const end = () => {
      if (mode !== 'x') { mode = null; return; }
      mode = null;
      const i = TABS.indexOf(current()), v = Math.abs(dx) / Math.max(1, Date.now() - t0);
      const dir = dx < 0 ? 1 : -1, j = i + dir;
      if ((Math.abs(dx) > 60 || (v > 0.35 && Math.abs(dx) > 20)) && j >= 0 && j < TABS.length) {
        if (reduceMotion()) { state.slide = dir; location.hash = '#' + TABS[j]; return; }
        app.style.transition = 'transform 110ms var(--ease-in), opacity 110ms linear';
        app.style.transform = `translateX(${dx - dir * 40}px)`; app.style.opacity = '0';
        setTimeout(() => { state.slide = dir; location.hash = '#' + TABS[j]; }, 100);
      } else {
        app.style.transition = 'transform var(--t-med) var(--ease-out), opacity var(--t-med) var(--ease-out)';
        app.style.transform = ''; app.style.opacity = '';
      }
    };
    app.addEventListener('touchend', end);
    app.addEventListener('touchcancel', end);
  })();

  let toastTimer = 0;
  function toast(msg) {
    document.querySelectorAll('.toast').forEach(t => t.remove());
    const t = document.createElement('div');
    t.className = 'toast'; t.setAttribute('role', 'status');
    t.innerHTML = CHECK + '<span></span>'; t.querySelector('span').textContent = msg;
    document.body.appendChild(t);
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { t.classList.add('out'); setTimeout(() => t.remove(), 220); }, 1800);
  }

  /* ---------- Speichern ---------- */
  async function setDone(p, val) {
    state.busy[p.id] = true; delete state.msgs[p.id]; render();
    const apply = () => {
      p.done = val; patchPlan(p.id, val); if (val) setStarted(p.id, false);
      if (val && state.open.heute) delete state.open.heute[p.id];
    };
    try {
      await api('erledigt', { id: p.id, wert: val });
      outbox = outbox.filter(o => o.key !== 'erl:' + p.id); ls.set('tri:outbox', outbox);
      apply(); if (val) toast(p.title + ' erledigt');
    } catch (e) {
      if (refused(e)) state.msgs[p.id] = 'Speichern hat nicht geklappt: ' + (e.message || e);
      else { enqueue('erledigt', { id: p.id, wert: val }, 'erl:' + p.id); apply(); toast('Gemerkt – wird übertragen, sobald du online bist'); }
    }
    state.busy[p.id] = false; render();
  }
  function patchPlan(id, val) {
    const rows = state.data && state.data.plan; if (!rows) return;
    const r = rows.find(r => r[0] === id); if (!r) return;
    while (r.length < 12) r.push('');
    r[11] = val; state.data._at = Date.now(); ls.set('tri:data', state.data);
  }
  /* Kraftsätze in die geladenen Daten legen – doppelte (gleiche Einheit, gleicher Speicherzeitpunkt) überspringen */
  function putKraft(d, k) {
    const rows = d.kraftlog || (d.kraftlog = [['Datum']]);
    if (!k.zeilen.length || rows.some(r => r[1] === k.id && r[9] === k.zeilen[0].gespeichert)) return;
    k.zeilen.forEach(z => rows.push([z.datum, k.id, z.einheit, z.uebung, String(z.satz), String(z.wdh), String(z.sek), String(z.kg), z.ziel, z.gespeichert]));
  }
  async function saveKraft(M, p) {
    const d = draft(M, p), exs = exercises(p);
    const stamp = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const zeilen = [];
    exs.forEach((ex, i) => {
      const lib = U.lib(ex.name), tg = target(p, ex, lib), k = kind(lib, ex);
      (d.ex[i] || []).filter(s => s.ok).forEach((s, j) => zeilen.push({ datum: today(), einheit: p.title, uebung: ex.name, satz: j + 1, wdh: k === 'time' ? '' : (s.r == null ? '' : s.r), sek: k === 'time' ? (s.s == null ? '' : s.s) : '', kg: k === 'w' ? (s.kg == null ? '' : s.kg) : '', ziel: `${tg.sets}×${tg.reps}${k === 'time' ? ' s' : ''}${k !== 'time' && s.rir != null ? ' · RIR ' + s.rir : ''}`, gespeichert: stamp }));
    });
    if (!zeilen.length) { state.msgs[p.id] = 'Hake mindestens einen Satz ab, bevor du speicherst.'; render(); return; }
    state.busy[p.id] = true; delete state.msgs[p.id]; render();
    const k = { id: p.id, zeilen };
    const apply = () => {
      putKraft(state.data, k);
      patchPlan(p.id, today()); ls.del('tri:draft:' + p.id); delete state.drafts[p.id]; state.rest = null; delete state.active[p.id]; setStarted(p.id, false);
      if (state.open.heute) delete state.open.heute[p.id];
    };
    try {
      await api('kraft', k);
      apply(); toast('Training gespeichert');
    } catch (e) {
      if (refused(e)) state.msgs[p.id] = 'Speichern hat nicht geklappt: ' + (e.message || e) + '. Deine Sätze bleiben erhalten.';
      else { enqueue('kraft', k, 'kraft:' + p.id + ':' + stamp); apply(); toast('Gemerkt – wird übertragen, sobald du online bist'); }
    }
    state.busy[p.id] = false; render();
  }
  async function saveCheck(M) {
    const d = state.checkDraft; if (!d || d.legs == null || d.energy == null || d.mot == null || (afterNightToday(M) && d.sleep == null)) return;
    const now = new Date();
    state.checkBusy = true; state.checkMsg = ''; render();
    const c = { datum: today(), beine: d.legs, energie: d.energy, motivation: d.mot, schlaf: d.sleep, uhrzeit: pad(now.getHours()) + ':' + pad(now.getMinutes()) };
    if (d.sleep != null) ls.set('tri:schlaf', { ...(ls.get('tri:schlaf') || {}), [c.datum]: d.sleep });
    const apply = () => { putCheck(state.data, c); state.data._at = Date.now(); ls.set('tri:data', state.data); state.checkDraft = null; state.checkEdit = false; };
    try {
      await api('check', c);
      outbox = outbox.filter(o => o.key !== 'check:' + c.datum); ls.set('tri:outbox', outbox);
      apply(); toast('Kurz-Check gespeichert');
    } catch (e) {
      if (refused(e)) state.checkMsg = 'Speichern hat nicht geklappt: ' + (e.message || e);
      else { enqueue('check', c, 'check:' + c.datum); apply(); toast('Gemerkt – wird übertragen, sobald du online bist'); }
    }
    state.checkBusy = false; render();
  }

  /* ---------- Pausen-Timer Kraft ---------- */
  function tickRest() {
    const b = $('#restbar'), kt = document.getElementById('kt-rest');
    if (!state.rest) { b.hidden = true; if (kt) { kt.textContent = ''; const a = kt.nextElementSibling; if (a) a.hidden = false; } return; }
    const left = Math.ceil((state.rest.end - Date.now()) / 1000);
    /* Bei Halteübungen zeigt der Timer-Block die Pause, die Leiste würde ihn verdecken */
    if (kt) { b.hidden = true; kt.textContent = left > 0 ? 'Pause ' + Math.floor(left / 60) + ':' + pad(left % 60) : 'Pause vorbei'; const a = kt.nextElementSibling; if (a) a.hidden = true; if (left <= 0 && !state.rest.beeped) { state.rest.beeped = true; beep(); setTimeout(() => { state.rest = null; tickRest(); }, 4000); } return; }
    b.hidden = false;
    if (left <= 0) { b.querySelector('b').textContent = 'Pause vorbei'; if (!state.rest.beeped) { state.rest.beeped = true; beep(); setTimeout(() => { state.rest = null; tickRest(); }, 4000); } return; }
    b.querySelector('b').textContent = 'Pause ' + Math.floor(left / 60) + ':' + pad(left % 60);
  }
  setInterval(() => { if (state.rest) tickRest(); }, 1000);

  /* ---------- Bedienung ---------- */
  document.addEventListener('click', e => {
    const M = model();
    const q = sel => e.target.closest(sel);
    let el;
    /* Diagramme: Tipp zeigt den Wert genau dieser Säule, zweiter Tipp oder Tipp daneben schließt ihn */
    const hit = q('svg[data-chart] .hit'), chart = hit && hit.closest('svg');
    document.querySelectorAll('svg[data-chart]').forEach(s => { if (s !== chart) chartTip(s, null); });
    if (hit) {
      if (Date.now() - scrubEnd < 350) return;
      chartTip(chart, chartPointer !== 'mouse' && hit.classList.contains('on') ? null : hit);
      return;
    }
    /* Kurz-Check ändern: Tipp außerhalb oder auf „Fertig“ schließt ohne Änderung */
    if (state.checkEdit && (q('[data-checkdone]') || !q('.check'))) {
      state.checkEdit = false; state.checkDraft = null; render();
      if (q('[data-checkdone]') || !q('button,a,input,[data-jump]')) return;
    }
    if (q('a.skip')) { e.preventDefault(); const m = $('#app'); m.focus({ preventScroll: true }); const f = m.querySelector('button,[href],input,[tabindex="0"]'); if (f) f.focus(); return; }
    if (q('[data-netinfo]')) { toast(netInfo()); return; }
    if (q('[data-reload]')) { load(true); return; }
    if ((el = q('[data-drill]'))) {
      e.stopPropagation(); const k = el.dataset.drill, opening = !state.drillOpen[k];
      /* Immer nur eine Erklärung offen: beim Aufklappen alle anderen schließen */
      state.drillOpen = opening ? { [k]: true } : {}; render();
      if (opening) {
        const b = document.querySelector(`[data-drill="${CSS.escape(k)}"]`);
        if (b) { const li = b.closest('li'); if (li) bringIntoView(li); else { const row = b.closest('.st') || b, x = row.nextElementSibling; bringIntoView(row, x && x.classList.contains('dr-x') ? x : null); } }
      }
      return;
    }
    if ((el = q('[data-jump]'))) {
      if (!jumpTo(el.dataset.jump)) { state.weekOff = Math.round((monday(parseISO(el.dataset.jump)) - monday(new Date())) / (7 * 864e5)); state.pendingJump = el.dataset.jump; if (location.hash === '#woche') { render(); requestAnimationFrame(() => jumpTo(state.pendingJump)); state.pendingJump = null; } else location.hash = '#woche'; }
      return;
    }
    if ((el = q('.zoomable'))) { openZoom(el); return; }
    if ((el = q('[data-phase]'))) { const i = +el.dataset.phase; state.phase = i; render(); const c = $('.saison'); if (c) bringIntoView(c); return; }
    if ((el = q('[data-week]'))) { state.weekOff += +el.dataset.week; render(); return; }
    if ((el = q('[data-sheet]'))) { state.sheetId = el.dataset.sheet; render(); return; }
    if ((el = q('[data-open]'))) { toggleUnit(el.dataset.open, true); return; }
    if ((el = q('[data-fold]'))) { toggleUnit(el.dataset.fold, false); return; }
    if (q('[data-close]') && (e.target.matches('[data-close]') || e.target.closest('button[data-close]'))) { closeSheet(); return; }
    if (q('[data-skiprest]')) { state.rest = null; tickRest(); return; }
    if (!M) return;
    const plan = id => M.plan.find(p => p.id === id);
    if ((el = q('[data-act]'))) {
      const p = plan(el.dataset.id); if (!p) return;
      if (el.dataset.act === 'kraft') saveKraft(M, p);
      if (el.dataset.act === 'undo') setDone(p, '');
      if (el.dataset.act === 'done') setDone(p, today());
      return;
    }
    if ((el = q('[data-step]'))) { if (holdUsed) { holdUsed = false; return; } doStep(el); return; }
    if ((el = q('[data-tick]'))) {
      const [pid, i, j] = el.dataset.tick.split('|'); const p = plan(pid); if (!p) return;
      const d = draft(M, p), s = d.ex[+i][+j]; s.ok = !s.ok; if (!s.ok) s.rir = null; putDraft(pid, d); state.active[pid] = +i;
      if (state.timer && state.timer.kr && state.timer.pid === pid) state.timer = null;
      if (s.ok) {
        /* Halteübungen springen gleich weiter; sonst erst, wenn die Reserve des letzten Satzes eingetragen ist */
        const ex = exercises(p)[+i];
        /* schwere Sätze (4×6) brauchen längere Pausen als die 90 s der Technikphase */
        afterSet(p, d, +i, target(p, ex, U.lib(ex.name)).heavy);
        beepInit();
      }
      render(); return;
    }
    if ((el = q('[data-addset]'))) {
      const [pid, i] = el.dataset.addset.split('|'); const p = plan(pid); if (!p) return;
      const d = draft(M, p), a = d.ex[+i], l = a[a.length - 1] || { r: 10, s: null, kg: null };
      a.push({ r: l.r, s: l.s, kg: l.kg, ok: false }); putDraft(pid, d); render(); return;
    }
    if ((el = q('[data-delset]'))) {
      const [pid, i] = el.dataset.delset.split('|'); const p = plan(pid); if (!p) return;
      const d = draft(M, p); d.ex[+i].pop(); putDraft(pid, d); render(); return;
    }
    if ((el = q('[data-start]'))) {
      const [pid, i] = el.dataset.start.split('|'); const p = plan(pid); if (!p) return;
      setStarted(pid, true);
      if (+i >= 0) state.active[pid] = +i; else delete state.active[pid];
      state.scrollEx = pid; state.scrollCheck = true; /* Kraft und Mobility: direkt zur ersten offenen Übung */
      render(); return;
    }
    if ((el = q('[data-stop]'))) { setStarted(el.dataset.stop, false); state.timer = null; render(); return; }
    if ((el = q('[data-ex]'))) { const [pid, i] = el.dataset.ex.split('|'); const wasOpen = el.classList.contains('ex-head'); state.active[pid] = wasOpen ? -1 : +i; if (wasOpen) { render(); return; } if (state.timer && state.timer.kr && state.timer.pid === pid && !state.timer.running) state.timer = null; state.scrollEx = pid; render(); return; }
    if ((el = q('[data-mob-open]'))) { const [pid, i] = el.dataset.mobOpen.split('|'); state.active[pid] = state.active[pid] === +i ? -1 : +i; if (state.active[pid] >= 0) state.scrollEx = pid; render(); return; }
    if ((el = q('[data-mob]'))) {
      const [pid, i] = el.dataset.mob.split('|'); const p = plan(pid); if (!p) return;
      const items = mobItems(p);
      let t = p.done ? items.map((_, k) => k) : ls.get('tri:mob:' + pid, []);
      t = t.includes(+i) ? t.filter(x => x !== +i) : t.concat(+i);
      ls.set('tri:mob:' + pid, t);
      if (t.includes(+i)) { const nx = items.findIndex((_, k) => !t.includes(k)); state.active[pid] = nx; }
      if (t.length === items.length && !p.done) setDone(p, today());
      else if (t.length < items.length && p.done) setDone(p, '');
      else render();
      return;
    }
    if ((el = q('[data-swap]'))) {
      const i = el.dataset.swap.indexOf('|'), name = el.dataset.swap.slice(0, i), text = el.dataset.swap.slice(i + 1);
      saveNote(swapKey(name), text ? 'ab ' + iso(addDays(new Date(), 1)) + ': ' + text : '', text ? 'Ab dem nächsten Mal: ' + text : 'Variante zurückgenommen');
      return;
    }
    if ((el = q('[data-warm]'))) {
      const [pid, what] = el.dataset.warm.split('|'), k = 'tri:warm:' + pid, ok = !!ls.get(k, false);
      if (what === 'fold') state.warmOpen[pid] = !(state.warmOpen[pid] != null ? state.warmOpen[pid] : !ok);
      else { if (ok) ls.del(k); else ls.set(k, true); state.warmOpen[pid] = ok; if (!ok) { state.scrollEx = pid; } }
      render(); return;
    }
    if ((el = q('[data-rirset]'))) {
      const [pid, i, j, n] = el.dataset.rirset.split('|'); const p = plan(pid); if (!p) return;
      const d = draft(M, p), s = d.ex[+i][+j], first = s.rir == null; s.rir = +n; putDraft(pid, d); state.rirEdit = null;
      if (first && d.ex[+i].every(x => x.ok)) { const nx = d.ex.findIndex(x => x.some(y => !y.ok)); if (nx >= 0) { state.active[pid] = nx; state.scrollEx = pid; } }
      render(); return;
    }
    if ((el = q('[data-riredit]'))) { state.rirEdit = el.dataset.riredit; render(); return; }
    if ((el = q('[data-ktimer]'))) {
      const [pid, i, j, what] = el.dataset.ktimer.split('|'); const p = plan(pid); if (!p) return;
      const d = draft(M, p), s = d.ex[+i] && d.ex[+i][+j]; if (!s) return;
      const ex = exercises(p)[+i], sec = s.s || target(p, ex, U.lib(ex.name)).reps;
      let T = state.timer;
      if (!T || !T.kr || T.pid !== pid || T.i !== +i || T.j !== +j) T = state.timer = { kr: true, pid, i: +i, j: +j, part: 0, sec, left: sec, endLeft: sec, running: false };
      if (what === 'toggle') {
        if (T.running) { T.running = false; }
        else { if (T.left <= 0) T.left = T.sec; T.endLeft = T.left; T.startedAt = Date.now(); T.running = true; state.rest = null; beepInit(); }
      } else if (what === 'reset') { T.running = false; T.left = T.endLeft = T.sec; }
      else finishKraftSet(T, true);
      render(); tickRest(); return;
    }
    if ((el = q('[data-timer]'))) {
      const [pid, i, what] = el.dataset.timer.split('|'); const p = plan(pid); if (!p) return;
      const it = mobItems(p)[+i];
      let T = state.timer;
      if (!T || T.pid !== pid || T.i !== +i) T = state.timer = { pid, i: +i, part: 0, sec: it.sec, left: it.sec, running: false };
      if (what === 'toggle') {
        if (T.running) { T.running = false; } else { if (T.left <= 0) T.left = T.sec; T.endLeft = T.left; T.startedAt = Date.now(); T.running = true; beepInit(); }
      } else if (what === 'reset') { T.running = false; T.left = T.endLeft = T.sec; }
      else {
        if (advanceTimer(T)) return;
      }
      render(); return;
    }
    if ((el = q('[data-check]'))) {
      const [k, n] = el.dataset.check.split('|'); const ck = M.check.find(c => c.date === today());
      state.checkDraft = Object.assign(ck ? { legs: ck.legs, energy: ck.energy, mot: ck.mot, sleep: ck.sleep } : {}, state.checkDraft || {}, { [k]: +n });
      render(); saveCheck(M); return;
    }
    if (q('[data-checkedit]')) { state.checkEdit = true; render(); return; }
  });

  /* Gedrückt halten am Plus/Minus zählt schneller weiter */
  let holdUsed = false, holdT = 0, holdI = 0;
  function doStep(el) {
    const M = model(); if (!M) return;
    const [pid, i, j, f, dv] = el.dataset.step.split('|'); const p = M.plan.find(x => x.id === pid); if (!p) return;
    const d = draft(M, p), s = d.ex[+i][+j]; s[f] = Math.max(0, (s[f] || 0) + +dv); putDraft(pid, d); render();
  }
  function stopHold() { clearTimeout(holdT); clearInterval(holdI); holdT = holdI = 0; }
  document.addEventListener('pointerdown', e => {
    const el = e.target.closest('[data-step]'); if (!el || el.disabled) return;
    const key = el.dataset.step;
    holdT = setTimeout(() => {
      holdUsed = true;
      holdI = setInterval(() => { const cur = document.querySelector(`[data-step="${key}"]`); if (cur) doStep(cur); else stopHold(); }, 90);
    }, 420);
  });
  ['pointerup', 'pointercancel'].forEach(t => document.addEventListener(t, stopHold));
  function beepInit() { try { audio = audio || new (window.AudioContext || window.webkitAudioContext)(); if (audio.state === 'suspended') audio.resume(); } catch (e) { /* egal */ } }
  document.addEventListener('change', e => {
    if (e.target.dataset && e.target.dataset.note != null) { saveNote(e.target.dataset.note, e.target.value.trim()); return; }
    const el = e.target.closest('[data-kg]'); if (!el) return;
    const M = model(); const [pid, i, j] = el.dataset.kg.split('|'); const p = M.plan.find(x => x.id === pid); if (!p) return;
    const d = draft(M, p), v = num(el.value), a = d.ex[+i];
    a[+j].kg = v; a[+j].a = false;
    for (let k = +j + 1; k < a.length; k++) if (!a[k].ok) { a[k].kg = v; a[k].a = false; }
    putDraft(pid, d); render();
  });
  document.addEventListener('submit', e => {
    if (e.target.id !== 'setup') return;
    e.preventDefault();
    const url = $('#cfg-url').value.trim(), key = $('#cfg-key').value.trim();
    if (!url || !key) return;
    state.cfg = { url, key }; ls.set('tri:cfg', state.cfg);
    state.data = null; ls.del('tri:data'); cache = { at: -1 };
    load(true).then(() => { if (!state.err) location.hash = '#heute'; });
  });
  /* Schwebender Timer: erkennen, ob er gerade unten „klebt“, damit der Bereich darunter verdeckt wird */
  function stuckTimer() {
    document.querySelectorAll('.mob-ex.active .timer,.ex-card>.timer').forEach(t => {
      const d = t.parentElement, r = t.getBoundingClientRect(), dr = d.getBoundingClientRect();
      /* Erst schweben lassen, wenn man einmal bis zum Timer gescrollt hat – vorher in Ruhe lesen */
      if (!t.classList.contains('t-free')) {
        const sh = t.closest('.sheet'), lim = (sh ? sh.getBoundingClientRect().bottom : window.innerHeight) - (parseFloat(getComputedStyle(t).bottom) || 0);
        if (r.bottom <= lim + 1 && r.bottom > 0) { state.timerSeen[t.dataset.k] = true; t.classList.add('t-free'); }
      }
      t.classList.toggle('stuck', t.classList.contains('t-free') && r.bottom < dr.bottom - parseFloat(getComputedStyle(d).paddingBottom) - 1);
    });
  }
  window.TRI_STUCK = stuckTimer;
  const onScroll = () => { document.documentElement.classList.toggle('scrolled', window.scrollY > 24); stuckTimer(); };
  window.addEventListener('scroll', onScroll, { passive: true }); window.addEventListener('resize', stuckTimer); onScroll();
  document.addEventListener('scroll', e => { if (e.target && e.target.id === 'sheet') stuckTimer(); }, { passive: true, capture: true });
  document.addEventListener('keydown', e => {
    if (document.querySelector('.zoom-bg') && e.key === 'Escape') { e.preventDefault(); closeZoom(); return; }
    if ((e.key === 'Enter' || e.key === ' ') && e.target.matches && e.target.matches('div.zoomable')) { e.preventDefault(); openZoom(e.target); return; }
    if (e.key === 'Escape' && state.sheetId) { closeSheet(); return; }
    if (e.metaKey || e.ctrlKey || e.altKey || e.defaultPrevented) return;
    const t = e.target;
    if (t.closest && t.closest('input,textarea,select,[contenteditable],[data-chart],.cbt')) return;
    if (!(state.cfg && state.cfg.key)) return;
    const v = current(), k = e.key;
    if (k === '1' || k === '2' || k === '3') { const to = TABS[+k - 1]; if (to !== v) { state.slide = TABS.indexOf(to) > TABS.indexOf(v) ? 1 : -1; location.hash = '#' + to; } e.preventDefault(); return; }
    if (k === 'r' || k === 'R') { load(true); e.preventDefault(); return; }
    if (v === 'woche' && (k === 'ArrowLeft' || k === 'ArrowRight')) { state.weekOff += k === 'ArrowLeft' ? -1 : 1; render(); e.preventDefault(); return; }
    if (v === 'woche' && (k === 't' || k === 'T') && state.weekOff) { state.weekOff = 0; render(); e.preventDefault(); return; }
    const M = model(), cur = v === 'heute' && M && M.plan.find(p => p.date === today() && statusOf(p, M) !== 'done');
    const vis = M ? M.plan.filter(p => document.querySelector(`[data-fold="${CSS.escape(p.id)}"]`)).map(p => p.id) : [];
    const openNow = vis.includes(state.lastOpen) ? state.lastOpen : vis.includes(cur && cur.id) ? cur.id : vis[0];
    if (k === 'Escape' && openNow) {
      const id = openNow;
      toggleUnit(id, false);
      const el = document.querySelector(`[data-open="${CSS.escape(id)}"]`); if (el) el.focus({ preventScroll: true });
    }
  });

  /* Diagramme: Wert unter dem Mauszeiger bzw. per Pfeiltaste zeigen */
  function chartTip(svg, hit) {
    const box = svg.closest('.chart'); if (!box) return;
    let tip = box.querySelector('.ctip');
    svg.querySelectorAll('.hit.on').forEach(h => h.classList.remove('on'));
    const guide = svg.querySelector('.guide'), dot = svg.querySelector('.gdot');
    if (!hit) { if (tip) tip.hidden = true; if (guide) guide.setAttribute('opacity', 0); if (dot) dot.setAttribute('opacity', 0); return; }
    hit.classList.add('on');
    if (!tip) { tip = document.createElement('div'); tip.className = 'ctip'; tip.setAttribute('role', 'status'); box.appendChild(tip); }
    const [a, b] = hit.dataset.tip.split('|');
    if (!tip.firstChild) tip.innerHTML = '<b></b><span></span>';
    tip.firstChild.textContent = a; tip.lastChild.textContent = b;
    tip.hidden = false;
    const gx = +hit.dataset.gx;
    if (guide) { guide.setAttribute('x1', gx); guide.setAttribute('x2', gx); guide.setAttribute('opacity', .5); }
    if (dot) { if (hit.dataset.gy) { dot.setAttribute('cx', gx); dot.setAttribute('cy', hit.dataset.gy); dot.setAttribute('opacity', 1); } else dot.setAttribute('opacity', 0); }
    const sr = svg.getBoundingClientRect(), br = box.getBoundingClientRect(), vb = svg.viewBox.baseVal;
    const px = sr.left - br.left + gx * sr.width / vb.width;
    const w = tip.offsetWidth;
    const tx = Math.round(Math.max(8, Math.min(br.width - w - 8, px - w / 2))), ty = Math.round(sr.top - br.top - tip.offsetHeight + 4);
    tip.style.transform = `translate3d(${tx}px,${ty}px,0)`;
  }
  let chartPointer = '', scrubEnd = 0;
  document.addEventListener('pointerdown', e => { chartPointer = e.pointerType; }, true);
  /* Fitness-Diagramm: mit dem Finger waagerecht durch die Tage fahren, senkrecht scrollt weiter die Seite */
  (function chartScrub() {
    const app = $('#app');
    let svg = null, hits = [], x0 = 0, y0 = 0, mode = null, box = null, shown = -1, want = -1, raf = 0;
    const paint = () => { raf = 0; if (svg && svg.isConnected && want !== shown && hits[want]) { shown = want; chartTip(svg, hits[want]); } };
    const moveTo = cx => {
      const vb = svg.viewBox.baseVal, k = Math.min(box.width / vb.width, box.height / vb.height);
      const vx = (cx - box.left - (box.width - vb.width * k) / 2) / k, a = +hits[0].dataset.gx, b = +hits[hits.length - 1].dataset.gx;
      want = Math.max(0, Math.min(hits.length - 1, Math.round((vx - a) / (b - a) * (hits.length - 1))));
      if (!raf) raf = requestAnimationFrame(paint);
    };
    app.addEventListener('touchstart', e => {
      svg = e.touches.length === 1 && e.target.closest ? e.target.closest('svg[data-scrub]') : null;
      mode = null; if (!svg) return;
      hits = [...svg.querySelectorAll('.hit')]; box = svg.getBoundingClientRect();
      x0 = e.touches[0].clientX; y0 = e.touches[0].clientY; shown = want = -1;
      if (hits.length < 2) svg = null;
    }, { passive: true });
    app.addEventListener('touchmove', e => {
      if (!svg || mode === 'off') return;
      const t = e.touches[0], mx = Math.abs(t.clientX - x0), my = Math.abs(t.clientY - y0);
      if (!mode) {
        if (mx < 5 && my < 5) return;
        mode = mx > my ? 'x' : 'off';
        if (mode === 'off') return;
        document.querySelectorAll('svg[data-chart]').forEach(s => { if (s !== svg) chartTip(s, null); });
      }
      if (e.cancelable) e.preventDefault();
      moveTo(t.clientX);
    }, { passive: false });
    const end = () => { if (mode === 'x') { if (raf) { cancelAnimationFrame(raf); paint(); } scrubEnd = Date.now(); } svg = null; mode = null; };
    app.addEventListener('touchend', end);
    app.addEventListener('touchcancel', end);
  })();
  document.addEventListener('pointermove', e => {
    if (e.pointerType === 'touch') return;
    const svg = e.target.closest && e.target.closest('svg[data-chart]');
    document.querySelectorAll('svg[data-chart]').forEach(s => { if (s !== svg && s !== document.activeElement) chartTip(s, null); });
    if (!svg) return;
    const hit = e.target.closest('.hit');
    if (hit) chartTip(svg, hit);
  });
  document.addEventListener('focusin', e => {
    const svg = e.target.closest && e.target.closest('svg[data-chart]');
    if (svg && svg.matches(':focus-visible')) { const hs = svg.querySelectorAll('.hit'); chartTip(svg, svg.querySelector('.hit.on') || hs[hs.length - 1]); }
  });
  document.addEventListener('focusout', e => { const svg = e.target.closest && e.target.closest('svg[data-chart]'); if (svg) chartTip(svg, null); });
  document.addEventListener('keydown', e => {
    const svg = e.target.closest && e.target.closest('svg[data-chart]');
    if (!svg || !['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)) return;
    const hs = [...svg.querySelectorAll('.hit')], cur = hs.indexOf(svg.querySelector('.hit.on'));
    let i = e.key === 'Home' ? 0 : e.key === 'End' ? hs.length - 1 : (cur < 0 ? hs.length - 1 : cur) + (e.key === 'ArrowLeft' ? -1 : 1);
    i = Math.max(0, Math.min(hs.length - 1, i));
    chartTip(svg, hs[i]); e.preventDefault();
  });
  /* Tipp auf den Tab, der schon offen ist: sanft nach oben; bei Woche zurück zur aktuellen Woche */
  document.querySelectorAll('nav a[data-v]').forEach(a => a.addEventListener('click', () => {
    if (a.dataset.v !== current()) return;
    if (a.dataset.v === 'woche' && state.weekOff) { state.weekOff = 0; render(); window.scrollTo({ top: 0, behavior: 'auto' }); return; }
    if (window.scrollY > 0) window.scrollTo({ top: 0, behavior: reduceMotion() ? 'auto' : 'smooth' });
  }));
  window.addEventListener('online', () => { load(true); });
  window.addEventListener('hashchange', () => { if (state.sheetId) { state.sheetId = null; closeSheetNow(); } render(); if (state.pendingJump) { const k = state.pendingJump; state.pendingJump = null; requestAnimationFrame(() => setTimeout(() => jumpTo(k), 60)); } });
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') { cache = { at: -1 }; load(false); render(); } });
  let lastW = window.innerWidth;
  window.addEventListener('resize', () => { if ((lastW >= 960) !== (window.innerWidth >= 960)) { lastW = window.innerWidth; lastRender = ''; render(); } placeIndicator(); });

  /* ---------- Start ---------- */
  if ('serviceWorker' in navigator && location.protocol === 'https:') navigator.serviceWorker.register('sw.js').catch(() => {});
  /* Angezeigte Version: die neueste tatsächlich installierte App-Fassung */
  const readVer = () => {
    if (!window.caches) return;
    caches.keys().then(ks => {
      const v = Math.max(0, ...ks.map(k => +(/^tri-v(\d+)$/.exec(k) || [])[1] || 0));
      if (v && v !== state.ver) { state.ver = v; render(); }
    }).catch(() => {});
  };
  if ('serviceWorker' in navigator) navigator.serviceWorker.addEventListener('controllerchange', readVer);
  readVer();
  render();
  load(true);
  window.__tri = { state, model, render };
})();
