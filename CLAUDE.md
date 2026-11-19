# Hinweise für die Arbeit an der App

- Bei jeder Änderung die Version erhöhen, und zwar an zwei Stellen gleich: `CACHE` in `sw.js` und `<meta name="app-version">` in `index.html` (z. B. `sed -i "s/tri-v148/tri-v149/" sw.js index.html`). Unter Fortschritt zeigt die App „Version N“, bei abweichender Seite „· Seite …“.
- Neue Fassung auf dem iPhone: die Homescreen-App ganz schließen und neu öffnen. Der Lade-Knopf in der App holt nur Daten, nicht die App.
- iOS zeichnet den Rand unter der Statusleiste weich (direkt nach dem Start breiter, bis zum ersten Scrollen). Scharf erst ab 18 px + safe-area Abstand (16, 14, 10 px leicht unscharf). Seit tri-v154 läuft ein Test mit 6 px, Unschärfe bewusst in Kauf genommen; Entscheidung steht noch aus (Nachfrage am 25.11.2026). Siehe Kommentar in `index.html` beim `.app`-Padding für Handys.
- Keine Geheimnisse ins Repo (es ist öffentlich): API-Schlüssel und App-Schlüssel liegen nur in den Skripteigenschaften des Apps Script.

## Trainingsplan planen oder ändern (Blatt „Plan“)

- Vorher immer beide Kalender prüfen: den Dienstkalender und den privaten Hauptkalender. Ganztägige private Termine (Ausflüge, Lehrgänge, Reisen) sind keine Trainingstage, höchstens Mobility.
- Termine am Tag beachten: Schwimmen nur an Tagen, an denen Zeit fürs Bad ist. Ist ein Tag knapp, dort lieber eine kurze Runde Laufen oder Rad statt Schwimmen.
- Beim Verschieben auch den Zieltag gegen beide Kalender prüfen, nicht nur den Ausgangstag.
- Bei Unsicherheit nachfragen statt selbst entscheiden: wenn unklar ist, wie lange ein privater Termin dauert, oder ob an dem Tag trotzdem trainiert werden soll.
- Gibt es in der Woche keinen passenden freien Tag, die Einheit streichen (Status „löschen“ mit kurzer Notiz) statt die Folgewoche zu überladen.
- Kurze oder lockere Läufe an Tagen mit 12-Stunden-Tagdienst sind in Ordnung.
- Nachtdienste (Beginn ab 17 Uhr) schützen:
  - Am Tag nach einem Nachtdienst keine harte Einheit (Intervalle, Tests, Sweet Spot/Tempo, Kraft mit Steigerung). Nur Mobility oder ganz locker.
  - Zwischen zwei Nachtdiensten höchstens kurz und locker, ausdrücklich optional.
  - Nach zwei oder mehr Nächten am Stück ist auch der erste freie Tag nur locker; harte Einheiten frühestens am zweiten Tag.
  - Am Tag des ersten Nachtdienstes ist eine harte Einheit möglich, dann mit Notiz „vormittags“.
- Keine privaten Termindetails ins Repo schreiben (es ist öffentlich), nur allgemeine Regeln.
