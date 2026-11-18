# Hinweise für die Arbeit an der App

- Bei jeder Änderung die Version erhöhen, und zwar an zwei Stellen gleich: `CACHE` in `sw.js` und `<meta name="app-version">` in `index.html` (z. B. `sed -i "s/tri-v148/tri-v149/" sw.js index.html`). Unter Fortschritt zeigt die App „Version N“, bei abweichender Seite „· Seite …“.
- Neue Fassung auf dem iPhone: die Homescreen-App ganz schließen und neu öffnen. Der Lade-Knopf in der App holt nur Daten, nicht die App.
- iOS zeichnet den Rand unter der Statusleiste weich (direkt nach dem Start breiter, bis zum ersten Scrollen). Scharf erst ab 18 px + safe-area Abstand (16, 14, 10 px leicht unscharf). Seit tri-v154 läuft ein Test mit 6 px, Unschärfe bewusst in Kauf genommen; Entscheidung steht noch aus (Nachfrage am 25.11.2026). Siehe Kommentar in `index.html` beim `.app`-Padding für Handys.
- Keine Geheimnisse ins Repo (es ist öffentlich): API-Schlüssel und App-Schlüssel liegen nur in den Skripteigenschaften des Apps Script.
