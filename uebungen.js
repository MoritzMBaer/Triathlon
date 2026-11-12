/* Übungsbibliothek: Anleitung, Technikpunkt und zwei Posen für die Animation.
   Posen: 13 Punkte (optional 14. = Wirbelsäulen-Kontrollpunkt), Reihenfolge:
   Kopf, Hals, Hüfte, Knie vorn, Knöchel vorn, Zehen vorn, Knie hinten, Knöchel hinten, Zehen hinten,
   Ellbogen vorn, Hand vorn, Ellbogen hinten, Hand hinten.  Ansicht von der Seite, Boden bei y = 72. */
(function () {
  const J = ['H', 'N', 'P', 'Kn', 'An', 'Tn', 'Kf', 'Af', 'Tf', 'En', 'Wn', 'Ef', 'Wf', 'C'];
  const P = s => {
    const pts = s.trim().split(/\s*,\s*/).map(p => p.split(/\s+/).map(Number));
    const o = {};
    pts.forEach((p, i) => { o[J[i]] = p; });
    return o;
  };
  const STAND = '60 13,60 21,60 46,61 59,60 72,68 72,59 59,58 72,65 72,61 34,61 46,59 34,59 46';

  const LIB = [
    { re: /^goblet/i, m: ['quad','adduktoren','gesaess'], t: 'w', inc: 2,
      how: 'Hantel senkrecht vor der Brust halten, Füße etwas weiter als hüftbreit. Gesäß nach hinten unten sinken lassen, bis die Oberschenkel waagerecht sind. Über die ganze Fußsohle wieder hochdrücken.',
      cue: 'Brust bleibt oben, Knie zeigen Richtung Zehen.',
      A: P('61 13,60 21,60 46,63 59,61 72,69 72,60 59,58 72,65 72,67 33,63 27,64 34,61 27'),
      B: P('57 30,55 38,45 56,64 56,61 72,69 72,61 57,58 72,65 72,64 49,60 43,61 50,58 43'),
      props: ['khv'] },
    { re: /^rumänisch|kreuzheben/i, m: ['hamstrings','gesaess','lws'], t: 'w', inc: 2,
      how: 'Hanteln vor den Oberschenkeln, Knie leicht gebeugt. Hüfte nach hinten schieben und die Hanteln nah an den Beinen bis knapp unter die Knie senken. Gesäß anspannen und aufrichten.',
      cue: 'Rücken gerade, die Bewegung kommt aus der Hüfte.',
      A: P(STAND), B: P('82 28,76 31,44 40,48 56,46 72,54 72,46 56,44 72,51 72,72 43,70 55,70 43,68 55'),
      props: ['kh2'] },
    { re: /^ausfallschritt/i, m: ['quad','gesaess'], t: 'w', inc: 2,
      how: 'Aufrecht stehen, Hanteln seitlich. Ein Bein weit nach hinten setzen und das hintere Knie knapp über den Boden absenken. Über die vordere Ferse zurück in den Stand.',
      cue: 'Vorderes Knie bleibt über dem Fuß, Oberkörper aufrecht.',
      A: P(STAND), B: P('56 18,56 25,56 48,70 56,70 72,78 72,44 70,32 69,27 72,57 37,56 50,55 37,54 50'),
      props: ['kh2'] },
    { re: /^wadenheben/i, m: ['wade','soleus'], t: 'w', inc: 2,
      how: 'Auf einem Bein mit dem Vorfuß auf eine Stufe stellen, eine Hand an der Wand. Ferse langsam unter Stufenhöhe senken, dann so hoch wie möglich auf die Zehen drücken.',
      cue: 'Oben kurz halten, langsam absenken (3 Sekunden).',
      A: P('62 12,62 19,62 40,62 51,60 64,70 62,58 50,54 57,56 59,79 26,95 27,63 30,64 41'),
      B: P('62 7,62 14,62 35,62 46,63 56,70 62,58 45,54 52,56 54,79 22,95 26,63 25,64 36'),
      props: ['stufe', 'wand', 'khf'], hl: [['Kn', 'An']] },
    { re: /^unterarmstütz/i, m: ['bauch','schulter'], t: 'time', inc: 5,
      how: 'Auf Unterarme und Zehenspitzen stützen, Ellbogen unter den Schultern. Der Körper bildet eine gerade Linie von Kopf bis Ferse.',
      cue: 'Bauch und Gesäß fest, die Hüfte hängt nicht durch.',
      A: P('20 50,27 53,66 59,85 62,102 66,104 72,85 62,101 66,103 72,28 72,42 72,30 72,44 72'),
      B: P('20 49,27 52,66 57,85 61,102 66,104 72,85 61,101 66,103 72,28 72,42 72,30 72,44 72'), dur: 4 },
    { re: /^seitstütz/i, m: ['bauch','schulter','gesaess'], t: 'time', inc: 5,
      how: 'Seitlich auf einen Unterarm stützen, Ellbogen unter der Schulter, Beine gestreckt übereinander. Hüfte anheben, bis der Körper eine Linie bildet.',
      cue: 'Hüfte hoch, nicht nach vorn kippen.',
      A: P('24 40,30 45,66 62,84 66,102 70,106 72,84 65,102 69,106 71,32 72,44 72,40 36,42 26'),
      B: P('24 38,30 43,66 54,84 60,102 68,106 72,84 59,102 67,106 71,32 72,44 72,40 34,42 24') },
    { re: /^bulgarian|split squat/i, m: ['quad','gesaess'], t: 'w', inc: 2,
      how: 'Mit dem Rücken zu einer Bank, hinteren Fuß mit dem Spann darauf ablegen. Senkrecht nach unten sinken, bis der vordere Oberschenkel waagerecht ist, dann über die vordere Ferse hochdrücken.',
      cue: 'Etwa 70 % des Gewichts auf dem vorderen Bein.',
      A: P('54 12,54 19,54 42,44 56,40 72,48 72,64 58,80 52,86 50,55 30,54 44,53 30,52 44'),
      B: P('53 22,53 29,53 52,41 54,40 72,48 72,62 68,80 53,86 50,54 40,53 54,52 40,51 54'),
      props: ['bank', 'kh2'] },
    { re: /^hip thrust|glute bridge/i, m: ['gesaess','hamstrings'], t: 'w', inc: 2.5,
      how: 'Oberer Rücken an einer Bank, Füße hüftbreit aufgestellt, Gewicht auf der Hüfte. Hüfte nach oben drücken, bis Oberkörper und Oberschenkel eine Linie bilden. Oben das Gesäß fest anspannen.',
      cue: 'Kinn leicht zur Brust, nicht ins Hohlkreuz drücken.',
      A: P('20 36,26 41,46 58,66 50,70 72,78 72,64 50,68 72,76 72,36 52,44 56,34 52,42 56'),
      B: P('20 36,26 41,50 42,68 44,70 72,78 72,66 44,68 72,76 72,38 46,48 41,36 46,46 41'),
      props: ['bankl', 'scheibe'] },
    { re: /^step-?ups?/i, m: ['quad','gesaess'], t: 'w', inc: 2,
      how: 'Einen Fuß komplett auf eine stabile Bank oder Stufe setzen. Über dieses Bein hochdrücken, bis du oben stehst, dann kontrolliert zurück. Das untere Bein hilft möglichst wenig.',
      cue: 'Druck über die Ferse des oberen Beins.',
      A: P('54 12,54 19,54 42,68 48,70 60,78 60,50 57,48 72,55 72,55 31,54 45,53 31,52 45'),
      B: P('72 10,72 17,72 38,73 49,72 60,80 60,70 49,70 60,77 60,73 27,72 40,71 27,70 40'),
      props: ['box', 'kh2'] },
    { re: /^einarmig|rudern/i, m: ['lat','bws','schulterh','bizeps'], t: 'w', inc: 2,
      how: 'Eine Hand und ein Knie auf die Bank, Rücken gerade und waagerecht. Die Hantel mit dem freien Arm zur Hüfte ziehen, Ellbogen nah am Körper, dann langsam absenken.',
      cue: 'Schulterblatt zuerst nach hinten ziehen, nicht aufdrehen.',
      A: P('38 32,46 36,80 37,82 48,96 48,98 46,88 54,92 72,99 72,56 46,56 58,52 37,54 48'),
      B: P('38 32,46 36,80 37,82 48,96 48,98 46,88 54,92 72,99 72,66 30,60 41,52 37,54 48'),
      props: ['bankr', 'kh1'] },
    { re: /^liegestütz/i, m: ['brust','schulter','trizeps'], t: 'bw', inc: 1,
      how: 'Hände etwas weiter als schulterbreit, Körper gerade. Brust kontrolliert bis knapp über den Boden senken und wieder hochdrücken. Zu schwer? Knie aufsetzen.',
      cue: 'Ellbogen etwa 45° vom Körper, Bauch fest.',
      A: P('20 44,27 48,66 57,85 61,102 66,104 72,85 61,101 66,103 72,28 60,28 72,30 60,30 72'),
      B: P('20 58,27 62,66 64,85 66,102 67,104 72,85 66,101 67,103 72,40 64,28 72,42 64,30 72') },
    { re: /^dead bug/i, m: ['bauch','hueftbeuger'], t: 'bw', inc: 1,
      how: 'Auf dem Rücken liegen, Arme senkrecht nach oben, Hüfte und Knie 90° gebeugt. Gegengleich einen Arm nach hinten und das andere Bein nach vorn strecken, zurück, Seite wechseln.',
      cue: 'Der untere Rücken bleibt die ganze Zeit am Boden.',
      A: P('22 64,29 66,68 66,68 48,84 48,87 46,66 48,82 48,85 46,36 52,36 40,34 52,34 40'),
      B: P('22 64,29 66,68 66,86 62,104 62,107 60,66 48,82 48,85 46,36 52,36 40,22 56,12 60') },
    { re: /^hüftbeuger/i, m: ['hueftbeuger','quad'], t: 'stretch',
      how: 'Halber Kniestand, das hintere Knie auf einer weichen Unterlage. Gesäß der hinteren Seite anspannen und die Hüfte leicht nach vorn schieben, bis vorn an der Leiste ein Zug kommt. Die ganze Zeit halten, dann Bein wechseln.',
      cue: 'Nicht ins Hohlkreuz fallen, Becken aufrichten.',
      A: P('54 12,54 19,54 44,70 48,70 72,78 72,46 70,30 71,26 72,55 30,58 44,53 30,56 44'),
      B: P('56 13,56 20,58 46,72 50,70 72,78 72,48 70,30 71,26 72,57 31,60 45,55 31,58 45'),
      hl: [['P', 'Kf']] },
    { re: /^wade an der wand|^wade/i, m: ['wade','soleus'], t: 'stretch', sides: 2,
      how: 'Hände an die Wand, ein Bein weit nach hinten, Ferse am Boden. Zwei getrennte Abschnitte mit je voller Zeit: zuerst hinteres Knie gestreckt halten (Zug oben in der Wade), dann – ohne den Fuß zu versetzen – das hintere Knie beugen und erneut halten (Zug tiefer, Richtung Achillessehne). Danach Seite wechseln.',
      cue: 'Hintere Ferse bleibt am Boden, der Fuß zeigt nach vorn.',
      A: P('77 16,74 23,60 46,76 56,78 72,86 72,45 59,30 71,37 72,87 27,99 23,86 28,99 25'),
      B: P('76 17,73 24,61 49,77 58,78 72,86 72,48 64,31 71,38 72,86 28,99 24,85 29,99 26'),
      props: ['wand2'], hl: [['Kf', 'Af']], dur: 3.6 },
    { re: /^oberschenkelrückseite/i, m: ['hamstrings'], t: 'stretch',
      how: 'Ein Bein gestreckt auf eine niedrige Erhöhung legen, Zehen zeigen nach oben. Mit geradem Rücken aus der Hüfte nach vorn neigen, bis hinten im Oberschenkel ein Zug kommt. Die ganze Zeit halten, dann Bein wechseln.',
      cue: 'Rücken lang lassen, nicht rund ziehen.',
      A: P('66 18,62 24,44 44,70 50,96 56,98 52,43 58,42 72,50 72,66 34,74 44,64 34,72 44'),
      B: P('76 30,70 33,43 45,70 50,96 56,98 52,43 58,42 72,50 72,76 44,84 50,74 44,82 50'),
      props: ['box2'], hl: [['P', 'Kn'], ['Kn', 'An']] },
    { re: /^taube/i, m: ['gesaess'], t: 'stretch',
      how: 'Aus dem Vierfüßlerstand ein Knie nach vorn zwischen die Hände bringen und den Unterschenkel schräg ablegen. Das andere Bein gestreckt nach hinten schieben. Oberkörper aufrecht oder nach vorn ablegen und die ganze Zeit halten, dann Seite wechseln.',
      cue: 'Hüfte gerade ausrichten, nicht zur Seite kippen.',
      A: P('40 32,40 38,44 64,58 66,46 70,40 70,78 68,104 70,110 72,36 50,34 71,38 50,36 71'),
      B: P('58 52,54 56,44 64,58 66,46 70,40 70,78 68,104 70,110 72,62 64,70 71,64 64,72 71'),
      hl: [['P', 'Kn']] },
    { re: /^offenes buch/i, m: ['bws','brust'], t: 'rep',
      how: 'Seitlich liegen, Knie angewinkelt übereinander, Arme nach vorn gestreckt. Den oberen Arm in einem Bogen zur anderen Seite öffnen, mit dem Blick folgen, zurück – das ist eine Wiederholung. Alle Wiederholungen auf einer Seite, dann umdrehen.',
      cue: 'Beim Öffnen ausatmen, 2 Sekunden halten.',
      A: P('22 62,28 64,66 64,82 54,96 62,99 64,82 56,96 64,99 66,16 62,8 62,16 64,8 64'),
      B: P('22 60,28 64,66 64,82 54,96 62,99 64,82 56,96 64,99 66,30 50,44 56,16 64,8 64'),
      hl: [['N', 'En']] },
    { re: /^brustdehnung|türrahmen/i, m: ['brust','schulter'], t: 'stretch',
      how: 'Unterarm senkrecht an den Türrahmen legen, Ellbogen auf Schulterhöhe. Mit einem Schritt nach vorn den Oberkörper durch die Tür lehnen, bis vorn an der Brust ein Zug kommt. Die ganze Zeit halten, dann Arm wechseln.',
      cue: 'Schulter tief halten, nicht hochziehen.',
      A: P('58 16,57 22,58 48,62 60,66 72,73 72,52 60,48 72,55 72,40 28,40 12,62 32,64 44'),
      B: P('62 16,61 22,60 48,64 60,66 72,73 72,54 60,48 72,55 72,42 29,40 12,66 32,68 44'),
      props: ['tuer'], hl: [['N', 'En']] },
    { re: /^armkreisen/i, m: ['schulter','schulterh'], t: 'rep',
      how: 'Aufrecht stehen, Arme seitlich gestreckt. Große, langsame Kreise: die angegebene Anzahl vorwärts, danach dieselbe Anzahl rückwärts. Das lockert die Schultern fürs Schwimmen.',
      cue: 'Kreise groß und ruhig, Schultern locker lassen.',
      A: P('60 12,60 19,60 46,56 59,54 72,50 72,64 59,66 72,70 72,72 18,84 14,48 18,36 14'),
      B: P('60 12,60 19,60 46,56 59,54 72,50 72,64 59,66 72,70 72,74 26,86 32,46 26,34 32'),
      props: ['kreise'], dur: 2.2 },
    { re: /^katze/i, m: ['lws','bws'], t: 'rep',
      how: 'Vierfüßlerstand, Hände unter den Schultern, Knie unter der Hüfte. Im Wechsel den Rücken langsam rund machen und den Kopf sinken lassen, dann den Rücken sanft durchhängen lassen und nach vorn schauen.',
      cue: 'Langsam und mit dem Atem, Bewegung Wirbel für Wirbel.',
      A: P('24 40,32 44,72 44,74 72,92 72,96 70,72 72,90 72,94 70,32 58,32 72,34 58,34 72,52 52'),
      B: P('28 52,32 46,72 46,74 72,92 72,96 70,72 72,90 72,94 70,32 59,32 72,34 59,34 72,52 32'),
      hl: [['N', 'P']], dur: 4.4 },
    { re: /^kindhaltung/i, m: ['lws','lat','gesaess'], t: 'stretch',
      how: 'Auf die Knie setzen, Gesäß Richtung Fersen und Oberkörper nach vorn ablegen. Arme lang nach vorn, Stirn Richtung Boden. Ruhig in den unteren Rücken atmen.',
      cue: 'Locker lassen, nicht ziehen, ruhig atmen.',
      A: P('34 62,40 62,70 60,64 70,84 71,88 70,64 70,84 71,88 70,26 66,14 70,28 66,16 70,55 54'),
      B: P('32 64,38 63,72 58,64 70,84 71,88 70,64 70,84 71,88 70,24 67,12 70,26 67,14 70,55 52'),
      hl: [['N', 'P']], dur: 5 },
    { re: /^oberschenkelvorderseite/i, t: 'stretch', m: ['quad', 'hueftbeuger'],
      how: 'Aufrecht stehen, bei Bedarf eine Hand an der Wand. Ein Knie beugen und den Fuß mit der Hand Richtung Gesäß ziehen, bis vorn im Oberschenkel ein Zug kommt. Knie zeigt nach unten, die ganze Zeit halten, dann Bein wechseln.',
      cue: 'Knie neben dem Standbein, Becken leicht nach vorn schieben.',
      A: P('62 13,62 21,61 46,61 59,60 72,68 72,60 60,47 52,44 47,64 34,70 42,56 36,48 50'),
      B: P('63 13,63 21,62 46,61 59,60 72,68 72,61 61,46 50,42 46,65 34,71 42,56 36,47 48'),
      hl: [['P', 'Kf']], dur: 4 },
    { re: /^schmetterling/i, t: 'stretch', m: ['adduktoren'],
      how: 'Aufrecht sitzen, Fußsohlen aneinander und die Fersen nah zum Körper ziehen. Knie locker nach außen sinken lassen, mit den Händen die Füße halten. Für mehr Zug mit geradem Rücken aus der Hüfte nach vorn neigen.',
      cue: 'Rücken lang, Knie nicht mit den Ellbogen nach unten drücken.',
      A: P('46 28,45 36,44 64,63 60,56 70,62 71,62 61,55 70,61 71,50 50,56 68,49 51,55 68'),
      B: P('55 33,52 40,44 64,63 63,56 70,62 71,62 64,55 70,61 71,56 54,57 68,55 55,56 68'),
      hl: [['P', 'Kn']], dur: 4.4 },
    { re: /^knie zur wand/i, t: 'rep', m: ['soleus', 'wade'],
      how: 'Halber Kniestand vor einer Wand, der vordere Fuß eine Handbreit davor. Das vordere Knie langsam Richtung Wand schieben, ohne dass die Ferse abhebt, kurz halten und zurück – das ist eine Wiederholung. Alle Wiederholungen, dann Seite wechseln.',
      cue: 'Ferse bleibt am Boden, Knie zielt über die Zehen.',
      A: P('60 12,60 19,60 44,75 49,80 72,88 72,52 70,36 71,32 72,72 29,92 31,70 30,92 33'),
      B: P('66 13,65 20,63 45,85 51,80 72,88 72,54 70,36 71,32 72,77 30,94 32,75 31,94 34'),
      props: ['wand'], hl: [['Kn', 'An']], dur: 3 },
    { re: /^lat-?dehnung|welpe/i, t: 'stretch', m: ['lat', 'schulter', 'brust'],
      how: 'Vierfüßlerstand, dann die Hände weit nach vorn wandern lassen. Hüfte bleibt über den Knien, die Brust sinkt Richtung Boden, Arme lang. Ruhig atmen und den Zug unter den Achseln spüren.',
      cue: 'Hüfte nicht nach hinten setzen, Ellbogen vom Boden lassen.',
      A: P('30 62,37 60,66 50,66 70,86 71,90 70,66 70,86 71,90 70,25 64,12 69,27 64,14 69,52 56'),
      B: P('30 66,37 64,66 50,66 70,86 71,90 70,25 66,12 69,27 66,14 69,52 62'),
      hl: [['N', 'En']], dur: 5 },
    { re: /^nacken/i, t: 'stretch', m: ['nacken'],
      how: 'Aufrecht sitzen oder stehen, Schultern locker. Den Kopf langsam zur Seite neigen, Ohr Richtung Schulter, und die Hand sanft auf den Kopf legen. Die andere Schulter aktiv nach unten schieben, halten, dann Seite wechseln.',
      cue: 'Nur sanft ziehen, Kopf nicht drehen.',
      A: P('60 13,60 21,60 46,61 59,60 72,68 72,59 59,58 72,65 72,68 18,63 9,59 34,59 46'),
      B: P('63 15,60 21,60 46,61 59,60 72,68 72,59 59,58 72,65 72,69 19,65 11,59 34,59 46'),
      hl: [['H', 'N']], dur: 4.4 },
    { re: /^vierfüßler/i, mh: 'Trainiert', m: ['lws','gesaess','schulterh'], t: 'rep',
      how: 'Vierfüßlerstand, Rücken gerade. Gleichzeitig einen Arm nach vorn und das gegenüberliegende Bein nach hinten strecken, 2 Sekunden halten, zurück, dann die andere Diagonale. Beide Seiten zusammen zählen als eine Wiederholung.',
      cue: 'Becken bleibt waagerecht, nicht ins Hohlkreuz.',
      A: P('24 40,32 44,72 44,74 72,92 72,96 70,72 72,90 72,94 70,32 58,32 72,34 58,34 72'),
      B: P('24 40,32 44,72 44,74 72,92 72,96 70,90 46,108 44,112 44,20 40,8 38,34 58,34 72'),
      dur: 3.4 }
  ];

  function lib(name) { return LIB.find(e => e.re.test(name)) || null; }

  /* ---------- Zeichnen ---------- */
  const lerp = (a, b, t) => a + (b - a) * t;
  function pose(ex, t) {
    const o = {};
    J.forEach(k => {
      const a = ex.A[k], b = ex.B[k] || a;
      if (a) o[k] = [lerp(a[0], b[0], t), lerp(a[1], b[1], t)];
    });
    o.S = [lerp(o.N[0], o.P[0], 0.18), lerp(o.N[1], o.P[1], 0.18)];
    return o;
  }
  const f = n => n.toFixed(1);
  const pl = (p, ks) => 'M' + ks.map(k => f(p[k][0]) + ' ' + f(p[k][1])).join(' L');
  function torso(p) {
    return p.C ? `M${f(p.N[0])} ${f(p.N[1])} Q${f(p.C[0])} ${f(p.C[1])} ${f(p.P[0])} ${f(p.P[1])}` : pl(p, ['N', 'P']);
  }
  function khAt(x, y, vertical) {
    return vertical
      ? `<rect x="${f(x - 4.5)}" y="${f(y - 6)}" width="9" height="13" rx="2.5" fill="var(--c)"/><rect x="${f(x - 6)}" y="${f(y - 7)}" width="12" height="3.2" rx="1.6" fill="var(--c-d)"/><rect x="${f(x - 6)}" y="${f(y + 4.8)}" width="12" height="3.2" rx="1.6" fill="var(--c-d)"/>`
      : `<rect x="${f(x - 7)}" y="${f(y - 2)}" width="14" height="4" rx="2" fill="var(--c)"/><rect x="${f(x - 8)}" y="${f(y - 4)}" width="3.5" height="8" rx="1.5" fill="var(--c-d)"/><rect x="${f(x + 4.5)}" y="${f(y - 4)}" width="3.5" height="8" rx="1.5" fill="var(--c-d)"/>`;
  }
  function staticProps(ex) {
    const s = [];
    const pr = ex.props || [];
    if (pr.includes('stufe')) s.push('<rect x="48" y="62" width="30" height="11" rx="2" fill="var(--fill)"/>');
    if (pr.includes('wand')) s.push('<rect x="96" y="6" width="5" height="67" rx="1.5" fill="var(--fill)"/>');
    if (pr.includes('wand2')) s.push('<rect x="100" y="6" width="5" height="67" rx="1.5" fill="var(--fill)"/>');
    if (pr.includes('bank')) s.push('<rect x="78" y="50" width="36" height="7" rx="2" fill="var(--fill)"/><path d="M82 57V72M110 57V72" stroke="var(--fill)" stroke-width="3"/>');
    if (pr.includes('bankl')) s.push('<rect x="4" y="40" width="26" height="7" rx="2" fill="var(--fill)"/><path d="M8 47V72M26 47V72" stroke="var(--fill)" stroke-width="3"/>');
    if (pr.includes('bankr')) s.push('<rect x="46" y="48" width="58" height="6" rx="2" fill="var(--fill)"/><path d="M50 54V72M100 54V72" stroke="var(--fill)" stroke-width="3"/>');
    if (pr.includes('box')) s.push('<rect x="62" y="60" width="34" height="13" rx="2" fill="var(--fill)"/>');
    if (pr.includes('box2')) s.push('<rect x="80" y="58" width="28" height="15" rx="2" fill="var(--fill)"/>');
    if (pr.includes('tuer')) s.push('<rect x="34" y="4" width="5" height="69" rx="1.5" fill="var(--fill)"/>');
    return s.join('');
  }
  function moving(ex, p) {
    const pr = ex.props || [], s = [];
    if (pr.includes('khv')) s.push(khAt(p.Wn[0] + 1, p.Wn[1], true));
    if (pr.includes('kh2')) { s.push(khAt(p.Wf[0], p.Wf[1] + 3)); }
    if (pr.includes('khf')) s.push(khAt(p.Wf[0], p.Wf[1] + 3));
    if (pr.includes('scheibe')) s.push(`<rect x="${f(p.P[0] - 8)}" y="${f(p.P[1] - 9)}" width="16" height="6" rx="3" fill="var(--c)"/>`);
    return s.join('');
  }
  function movingFront(ex, p) {
    const pr = ex.props || [], s = [];
    if (pr.includes('kh2') || pr.includes('kh1')) s.push(khAt(p.Wn[0], p.Wn[1] + 3));
    if (pr.includes('kreise')) s.push(`<circle cx="${f(p.Wn[0])}" cy="${f(p.Wn[1])}" r="7" fill="none" stroke="var(--c)" stroke-width="1.6" stroke-dasharray="3 3"/><circle cx="${f(p.Wf[0])}" cy="${f(p.Wf[1])}" r="7" fill="none" stroke="var(--c)" stroke-width="1.6" stroke-dasharray="3 3"/>`);
    return s.join('');
  }
  function inner(ex, t) {
    const p = pose(ex, t);
    const hl = (ex.hl || []).map(([a, b]) => `<path d="${pl(p, [a, b])}" stroke="var(--c)" stroke-width="3.2" stroke-opacity=".95"/>`).join('');
    return `<g stroke-linecap="round" stroke-linejoin="round" fill="none">
      <path d="${pl(p, ['P', 'Kf', 'Af', 'Tf'])}" stroke="var(--fig-2)" stroke-width="5.5"/>
      <path d="${pl(p, ['S', 'Ef', 'Wf'])}" stroke="var(--fig-2)" stroke-width="5"/>
      ${moving(ex, p)}
      <path d="${torso(p)}" stroke="var(--fig)" stroke-width="8"/>
      <path d="${pl(p, ['P', 'Kn', 'An', 'Tn'])}" stroke="var(--fig)" stroke-width="6"/>
      ${hl}
      <path d="${pl(p, ['S', 'En', 'Wn'])}" stroke="var(--fig)" stroke-width="5"/>
      ${movingFront(ex, p)}
      <circle cx="${f(p.H[0])}" cy="${f(p.H[1])}" r="5.8" fill="var(--fig)" stroke="none"/>
    </g>`;
  }
  function svg(ex, opts) {
    opts = opts || {};
    const t = opts.t == null ? 0 : opts.t;
    const label = opts.label ? ` role="img" aria-label="${opts.label}"` : ' aria-hidden="true"';
    const ys = [];
    ['A', 'B'].forEach(k => Object.values(ex[k]).forEach(pt => ys.push(pt[1])));
    const top = Math.max(0, Math.min(...ys) - 9);
    return `<svg viewBox="0 ${top} 120 ${80 - top}"${label} data-fig="${opts.id || ''}" style="--fig:var(--fg);--fig-2:var(--faint)">
      <line x1="6" y1="73" x2="114" y2="73" stroke="var(--line)" stroke-width="1.5"/>
      ${staticProps(ex)}<g class="fig-live">${inner(ex, t)}</g></svg>`;
  }

  /* ---------- Animation (nur aktive Figur, respektiert „Bewegung reduzieren“) ---------- */
  const live = new Map();
  let raf = 0;
  const reduce = () => window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function tick(now) {
    raf = 0;
    live.forEach((ex, el) => {
      if (!el.isConnected) { live.delete(el); return; }
      const dur = (ex.dur || 2.8) * 1000;
      const ph = (now % dur) / dur;
      const t = 0.5 - 0.5 * Math.cos(ph * 2 * Math.PI);
      el.innerHTML = inner(ex, t);
    });
    if (live.size) raf = requestAnimationFrame(tick);
  }
  function animate(root) {
    live.clear();
    if (reduce()) return;
    root.querySelectorAll('svg[data-fig^="live:"]').forEach(s => {
      const ex = lib(decodeURIComponent(s.getAttribute('data-fig').slice(5)));
      const g = s.querySelector('.fig-live');
      if (ex && g) live.set(g, ex);
    });
    if (live.size && !raf) raf = requestAnimationFrame(tick);
  }


  /* ---------- Muskelkarte: vorn und hinten, beanspruchte Bereiche hervorgehoben ---------- */
  /* vereinfacht nach anatomischer Vorlage; rechte Körperhälfte (Mitte x = 0), gespiegelt außer bei Einzelformen */
  const MUSC = {
    brust: ['Brust', { v: ["M0.7 22.7C1.32 21.06 2.46 22.04 3.8 22C5.14 21.96 6.38 21.98 7.4 22.5C8.42 23.02 8.52 23.58 8.9 24.6C9.28 25.62 9.42 26.52 9.3 27.6C9.18 28.68 9.04 29.28 8.3 30C7.56 30.72 6.78 30.96 5.6 31.2C4.42 31.44 3.38 31.4 2.4 31.2C1.42 31 1.04 31.9 0.7 30.2C0.36 28.5 0.08 24.34 0.7 22.7Z"] }],
    schulter: ['Schulter', { v: ["M9.2 21.7C9.67 21.62 10.92 21.55 11.6 21.9C12.28 22.25 12.92 22.98 13.3 23.8C13.68 24.62 13.82 25.83 13.9 26.8C13.98 27.77 13.97 28.9 13.8 29.6C13.63 30.3 13.27 31.1 12.9 31C12.53 30.9 12.02 29.8 11.6 29C11.18 28.2 10.78 27.05 10.4 26.2C10.02 25.35 9.57 24.53 9.3 23.9C9.03 23.27 8.82 22.77 8.8 22.4C8.78 22.03 8.73 21.78 9.2 21.7Z"] }],
    bizeps: ['Bizeps', { v: ["M14.37 35.8C14.48 36.74 14.59 37.97 14.63 38.63C14.68 39.29 14.66 39.47 14.63 39.77C14.6 40.06 14.59 40.26 14.45 40.4C14.31 40.53 14.02 40.6 13.78 40.6C13.55 40.6 13.23 40.53 13.03 40.4C12.83 40.26 12.74 40.06 12.59 39.77C12.44 39.47 12.33 39.29 12.14 38.63C11.95 37.97 11.63 36.74 11.45 35.8C11.26 34.86 11.08 33.63 11.02 32.97C10.95 32.31 11 32.13 11.06 31.83C11.11 31.54 11.14 31.34 11.34 31.2C11.53 31.07 11.92 31 12.22 31C12.53 31 12.93 31.07 13.17 31.2C13.4 31.34 13.49 31.54 13.62 31.83C13.76 32.13 13.85 32.31 13.97 32.97C14.1 33.63 14.26 34.86 14.37 35.8Z"] }],
    bauch: ['Bauch', { v: ["M1.65 32.3L2.8 32.3Q3.9 32.3 3.9 33.4L3.9 35.2Q3.9 36.3 2.8 36.3L1.65 36.3Q0.55 36.3 0.55 35.2L0.55 33.4Q0.55 32.3 1.65 32.3Z", "M1.65 37.2L2.8 37.2Q3.9 37.2 3.9 38.3L3.9 39.7Q3.9 40.8 2.8 40.8L1.65 40.8Q0.55 40.8 0.55 39.7L0.55 38.3Q0.55 37.2 1.65 37.2Z", "M1.65 41.7L2.75 41.7Q3.85 41.7 3.85 42.8L3.85 44.1Q3.85 45.2 2.75 45.2L1.65 45.2Q0.55 45.2 0.55 44.1L0.55 42.8Q0.55 41.7 1.65 41.7Z", "M0.55 46.2C0.89 45.2 1.57 45.96 2.2 46C2.83 46.04 3.42 45.8 3.7 46.4C3.98 47 3.78 47.8 3.6 49C3.42 50.2 3.22 51.16 2.8 52.4C2.38 53.64 1.95 54.56 1.5 55.2C1.05 55.84 0.75 56.44 0.55 55.6C0.35 54.76 0.5 52.88 0.5 51C0.5 49.12 0.21 47.2 0.55 46.2Z"] }],
    hueftbeuger: ['Hüftbeuger', { v: ["M3.1 56.8C3.23 56.07 3.72 54.82 4.5 53.9C5.28 52.98 7.15 51.52 7.8 51.3C8.45 51.08 8.4 52.05 8.4 52.6C8.4 53.15 8.28 53.87 7.8 54.6C7.32 55.33 6.18 56.38 5.5 57C4.82 57.62 4.1 58.33 3.7 58.3C3.3 58.27 2.97 57.53 3.1 56.8Z"] }],
    quad: ['Oberschenkelvorderseite', { v: ["M9.72 67.9C9.54 69.65 9.14 72.03 8.95 73.14C8.77 74.26 8.71 74.23 8.6 74.6C8.49 74.97 8.45 75.19 8.3 75.36C8.16 75.53 7.9 75.6 7.73 75.6C7.55 75.6 7.33 75.53 7.23 75.36C7.14 75.19 7.16 74.97 7.15 74.6C7.14 74.23 7.14 74.26 7.18 73.14C7.21 72.03 7.32 69.65 7.38 67.9C7.43 66.15 7.45 63.77 7.51 62.66C7.56 61.54 7.62 61.57 7.69 61.2C7.76 60.83 7.75 60.61 7.94 60.44C8.13 60.27 8.53 60.2 8.83 60.2C9.12 60.2 9.53 60.27 9.72 60.44C9.91 60.61 9.92 60.83 9.97 61.2C10.03 61.57 10.08 61.54 10.04 62.66C10 63.77 9.9 66.15 9.72 67.9Z", "M6.97 67.5C7 69.34 6.93 71.84 6.89 73.02C6.86 74.19 6.81 74.16 6.76 74.55C6.71 74.94 6.69 75.17 6.6 75.35C6.51 75.52 6.34 75.6 6.22 75.6C6.09 75.6 5.93 75.52 5.85 75.35C5.76 75.17 5.75 74.94 5.7 74.55C5.65 74.16 5.66 74.19 5.52 73.02C5.39 71.84 5.11 69.34 4.9 67.5C4.68 65.66 4.35 63.16 4.25 61.98C4.14 60.81 4.24 60.84 4.27 60.45C4.3 60.06 4.28 59.83 4.45 59.65C4.62 59.48 5.01 59.4 5.3 59.4C5.59 59.4 5.99 59.48 6.19 59.65C6.39 59.83 6.41 60.06 6.5 60.45C6.58 60.84 6.61 60.81 6.69 61.98C6.77 63.16 6.94 65.66 6.97 67.5Z", "M5.03 74.6C5.04 75.55 5.02 76.83 5 77.46C4.97 78.08 4.94 78.13 4.88 78.36C4.83 78.6 4.81 78.74 4.66 78.85C4.51 78.95 4.21 79 4 79C3.78 79 3.49 78.95 3.35 78.85C3.21 78.74 3.22 78.6 3.15 78.36C3.08 78.13 3.02 78.08 2.94 77.46C2.85 76.83 2.71 75.55 2.63 74.6C2.55 73.65 2.49 72.37 2.48 71.74C2.46 71.12 2.51 71.07 2.57 70.84C2.62 70.6 2.63 70.46 2.8 70.35C2.97 70.25 3.33 70.2 3.6 70.2C3.87 70.2 4.23 70.25 4.42 70.35C4.6 70.46 4.63 70.6 4.71 70.84C4.79 71.07 4.84 71.12 4.89 71.74C4.94 72.37 5.01 73.65 5.03 74.6Z"] }],
    adduktoren: ['Adduktoren', { v: ["M3.91 64.4C3.75 65.44 3.54 66.83 3.42 67.52C3.31 68.2 3.28 68.25 3.22 68.51C3.15 68.76 3.13 68.92 3.05 69.03C2.96 69.15 2.83 69.2 2.72 69.2C2.61 69.2 2.47 69.15 2.38 69.03C2.3 68.92 2.27 68.76 2.2 68.51C2.14 68.25 2.1 68.2 1.99 67.52C1.88 66.83 1.62 65.44 1.53 64.4C1.44 63.36 1.41 61.97 1.43 61.28C1.45 60.6 1.55 60.55 1.65 60.29C1.74 60.04 1.77 59.88 2.01 59.77C2.24 59.65 2.71 59.6 3.05 59.6C3.39 59.6 3.85 59.65 4.06 59.77C4.27 59.88 4.28 60.04 4.33 60.29C4.38 60.55 4.42 60.6 4.35 61.28C4.28 61.97 4.06 63.36 3.91 64.4Z"] }],
    schienbein: ['Schienbein', { v: ["M7.53 88.8C7.3 90.12 6.89 91.8 6.67 92.77C6.45 93.74 6.35 94.13 6.23 94.61C6.11 95.09 6.05 95.42 5.98 95.66C5.9 95.89 5.84 96 5.79 96C5.74 96 5.69 95.89 5.67 95.66C5.66 95.42 5.66 95.09 5.68 94.61C5.69 94.13 5.71 93.74 5.75 92.77C5.79 91.8 5.87 90.12 5.94 88.8C6 87.48 6.07 85.8 6.13 84.83C6.19 83.86 6.23 83.47 6.3 82.99C6.37 82.51 6.42 82.18 6.54 81.94C6.66 81.71 6.87 81.6 7.04 81.6C7.21 81.6 7.42 81.71 7.56 81.94C7.69 82.18 7.79 82.51 7.86 82.99C7.94 83.47 8.06 83.86 8 84.83C7.95 85.8 7.75 87.48 7.53 88.8Z"] }],
    nacken: ['Nacken', { v: ["M3.2 18.7C3.55 18.63 4.55 19.25 5.4 19.6C6.25 19.95 8.08 20.53 8.3 20.8C8.52 21.07 7.33 21.2 6.7 21.2C6.07 21.2 5.07 21 4.5 20.8C3.93 20.6 3.52 20.35 3.3 20C3.08 19.65 2.85 18.77 3.2 18.7Z"], h: ["M0 15.3C0.8 15.3 1.87 15.1 2.4 15.5C2.93 15.9 2.67 17.03 3.2 17.7C3.73 18.37 4.53 18.88 5.6 19.5C6.67 20.12 9.12 20.9 9.6 21.4C10.08 21.9 9.17 22.2 8.5 22.5C7.83 22.8 6.55 23.03 5.6 23.2C4.65 23.37 3.73 23.43 2.8 23.5C1.87 23.57 0.93 23.6 0 23.6C-0.93 23.6 -1.87 23.57 -2.8 23.5C-3.73 23.43 -4.65 23.37 -5.6 23.2C-6.55 23.03 -7.83 22.8 -8.5 22.5C-9.17 22.2 -10.08 21.9 -9.6 21.4C-9.12 20.9 -6.67 20.12 -5.6 19.5C-4.53 18.88 -3.73 18.37 -3.2 17.7C-2.67 17.03 -2.93 15.9 -2.4 15.5C-1.87 15.1 -0.8 15.3 0 15.3Z"] }],
    schulterh: ['Schulter hinten', { h: ["M9.2 21.7C9.67 21.62 10.92 21.55 11.6 21.9C12.28 22.25 12.92 22.98 13.3 23.8C13.68 24.62 13.82 25.83 13.9 26.8C13.98 27.77 13.97 28.9 13.8 29.6C13.63 30.3 13.27 31.1 12.9 31C12.53 30.9 12.02 29.8 11.6 29C11.18 28.2 10.78 27.05 10.4 26.2C10.02 25.35 9.57 24.53 9.3 23.9C9.03 23.27 8.82 22.77 8.8 22.4C8.78 22.03 8.73 21.78 9.2 21.7Z"] }],
    bws: ['Brustwirbelsäule', { h: ["M0 24.6C1.07 24.6 2.55 24.47 3.2 24.7C3.85 24.93 3.87 25.12 3.9 26C3.93 26.88 3.6 28.58 3.4 30C3.2 31.42 3 33.1 2.7 34.5C2.4 35.9 2.05 37.55 1.6 38.4C1.15 39.25 0.53 39.6 0 39.6C-0.53 39.6 -1.15 39.25 -1.6 38.4C-2.05 37.55 -2.4 35.9 -2.7 34.5C-3 33.1 -3.2 31.42 -3.4 30C-3.6 28.58 -3.93 26.88 -3.9 26C-3.87 25.12 -3.85 24.93 -3.2 24.7C-2.55 24.47 -1.07 24.6 0 24.6Z"] }],
    lat: ['Latissimus', { h: ["M4.6 27.8C4.92 26.7 5.38 25.47 6.1 24.9C6.82 24.33 8.32 23.95 8.9 24.4C9.48 24.85 9.62 26.25 9.6 27.6C9.58 28.95 9.05 30.77 8.8 32.5C8.55 34.23 8.35 36.25 8.1 38C7.85 39.75 7.62 41.4 7.3 43C6.98 44.6 6.6 47.5 6.2 47.6C5.8 47.7 5.23 45.37 4.9 43.6C4.57 41.83 4.32 39.02 4.2 37C4.08 34.98 4.13 33.03 4.2 31.5C4.27 29.97 4.28 28.9 4.6 27.8Z"] }],
    trizeps: ['Trizeps', { h: ["M14.39 35.9C14.5 36.86 14.61 38.11 14.65 38.79C14.7 39.46 14.7 39.65 14.67 39.95C14.64 40.25 14.63 40.45 14.49 40.59C14.35 40.73 14.06 40.8 13.83 40.8C13.59 40.8 13.27 40.73 13.07 40.59C12.87 40.45 12.78 40.25 12.63 39.95C12.48 39.65 12.37 39.46 12.18 38.79C11.98 38.11 11.66 36.86 11.47 35.9C11.27 34.94 11.09 33.69 11.02 33.01C10.96 32.34 11.01 32.15 11.06 31.85C11.11 31.55 11.15 31.35 11.34 31.21C11.53 31.07 11.92 31 12.22 31C12.53 31 12.93 31.07 13.17 31.21C13.4 31.35 13.49 31.55 13.62 31.85C13.76 32.15 13.85 32.34 13.98 33.01C14.11 33.69 14.27 34.94 14.39 35.9Z"] }],
    lws: ['unterer Rücken', { h: ["M0 41C0.87 41 1.97 40.83 2.6 41.2C3.23 41.57 3.65 42.43 3.8 43.2C3.95 43.97 3.82 45.03 3.5 45.8C3.18 46.57 2.48 47.33 1.9 47.8C1.32 48.27 0.63 48.6 0 48.6C-0.63 48.6 -1.32 48.27 -1.9 47.8C-2.48 47.33 -3.18 46.57 -3.5 45.8C-3.82 45.03 -3.95 43.97 -3.8 43.2C-3.65 42.43 -3.23 41.57 -2.6 41.2C-1.97 40.83 -0.87 41 0 41Z"] }],
    gesaess: ['Gesäß', { h: ["M0.7 49.6C1.28 48.2 2.42 48.88 3.6 48.8C4.78 48.72 5.7 48.72 6.6 49.2C7.5 49.68 7.74 50.24 8.1 51.2C8.46 52.16 8.52 52.96 8.4 54C8.28 55.04 8.18 55.7 7.5 56.4C6.82 57.1 6.1 57.34 5 57.5C3.9 57.66 2.86 57.54 2 57.2C1.14 56.86 0.96 57.32 0.7 55.8C0.44 54.28 0.12 51 0.7 49.6Z"] }],
    hamstrings: ['Oberschenkelrückseite', { h: ["M8.97 68.6C8.78 70.33 8.32 72.62 8.07 73.8C7.82 74.97 7.66 75.18 7.46 75.66C7.26 76.14 7.15 76.45 6.86 76.67C6.57 76.9 6.09 77 5.71 77C5.34 77 4.87 76.9 4.59 76.67C4.32 76.45 4.24 76.14 4.07 75.66C3.89 75.18 3.79 74.97 3.54 73.8C3.29 72.62 2.83 70.33 2.58 68.6C2.33 66.87 2.07 64.58 2.04 63.4C2.01 62.23 2.2 62.02 2.4 61.54C2.6 61.06 2.72 60.75 3.25 60.53C3.78 60.3 4.82 60.2 5.6 60.2C6.39 60.2 7.43 60.3 7.97 60.53C8.51 60.75 8.62 61.06 8.83 61.54C9.04 62.02 9.21 62.23 9.23 63.4C9.25 64.58 9.16 66.87 8.97 68.6Z"] }],
    wade: ['Wade', { v: ["M4.97 87.9C4.99 89.06 4.97 90.53 4.95 91.37C4.94 92.22 4.9 92.56 4.87 92.98C4.84 93.4 4.82 93.7 4.79 93.9C4.75 94.1 4.69 94.2 4.64 94.2C4.59 94.2 4.53 94.1 4.47 93.9C4.41 93.7 4.37 93.4 4.3 92.98C4.23 92.56 4.17 92.22 4.04 91.37C3.9 90.53 3.63 89.06 3.49 87.9C3.34 86.74 3.2 85.27 3.17 84.43C3.13 83.58 3.24 83.24 3.3 82.82C3.37 82.4 3.43 82.1 3.55 81.9C3.67 81.7 3.86 81.6 4.01 81.6C4.16 81.6 4.35 81.7 4.46 81.9C4.57 82.1 4.62 82.4 4.69 82.82C4.75 83.24 4.8 83.58 4.85 84.43C4.9 85.27 4.96 86.74 4.97 87.9Z"], h: ["M7.48 87.8C7.3 89.05 6.89 90.63 6.67 91.55C6.45 92.46 6.31 92.83 6.16 93.29C6.01 93.74 5.92 94.06 5.78 94.27C5.64 94.49 5.47 94.6 5.32 94.6C5.17 94.6 5.01 94.49 4.9 94.27C4.78 94.06 4.72 93.74 4.61 93.29C4.51 92.83 4.43 92.46 4.27 91.55C4.12 90.63 3.82 89.05 3.68 87.8C3.54 86.55 3.42 84.97 3.44 84.05C3.47 83.14 3.67 82.77 3.83 82.31C3.99 81.86 4.13 81.54 4.42 81.33C4.71 81.11 5.19 81 5.57 81C5.96 81 6.44 81.11 6.74 81.33C7.03 81.54 7.17 81.86 7.34 82.31C7.51 82.77 7.74 83.14 7.76 84.05C7.78 84.97 7.66 86.55 7.48 87.8Z"] }],
    soleus: ['Achillessehne', { h: ["M5.81 98.1C5.75 98.7 5.67 99.49 5.62 99.89C5.57 100.3 5.55 100.37 5.5 100.54C5.46 100.7 5.44 100.81 5.36 100.89C5.29 100.96 5.15 101 5.05 101C4.95 101 4.82 100.96 4.75 100.89C4.67 100.81 4.66 100.7 4.63 100.54C4.59 100.37 4.57 100.3 4.54 99.89C4.52 99.49 4.49 98.7 4.48 98.1C4.48 97.5 4.48 96.71 4.5 96.31C4.52 95.9 4.56 95.83 4.6 95.66C4.65 95.5 4.68 95.39 4.79 95.31C4.91 95.24 5.13 95.2 5.29 95.2C5.45 95.2 5.67 95.24 5.78 95.31C5.88 95.39 5.9 95.5 5.93 95.66C5.96 95.83 5.99 95.9 5.97 96.31C5.95 96.71 5.87 97.5 5.81 98.1Z"] }],
  };
  /* Flächen ohne eigene Gruppe (Halsschatten, Unterarme, seitlicher Bauch) */
  const DECO = { v: ["M0 15.4C0.8 15.4 1.97 14.6 2.4 14.9C2.83 15.2 2.73 16.62 2.6 17.2C2.47 17.78 2.03 18.13 1.6 18.4C1.17 18.67 0.53 18.8 0 18.8C-0.53 18.8 -1.17 18.67 -1.6 18.4C-2.03 18.13 -2.47 17.78 -2.6 17.2C-2.73 16.62 -2.83 15.2 -2.4 14.9C-1.97 14.6 -0.8 15.4 0 15.4Z", "M16.82 49C16.9 50.1 16.89 51.53 16.88 52.3C16.88 53.07 16.83 53.28 16.79 53.63C16.76 53.97 16.75 54.2 16.67 54.36C16.6 54.52 16.48 54.6 16.36 54.6C16.25 54.6 16.11 54.52 16 54.36C15.89 54.2 15.82 53.97 15.7 53.63C15.59 53.28 15.52 53.07 15.3 52.3C15.08 51.53 14.67 50.1 14.37 49C14.07 47.9 13.67 46.47 13.51 45.7C13.34 44.93 13.37 44.72 13.39 44.37C13.41 44.03 13.43 43.8 13.6 43.64C13.77 43.48 14.13 43.4 14.43 43.4C14.72 43.4 15.12 43.48 15.36 43.64C15.61 43.8 15.74 44.03 15.91 44.37C16.07 44.72 16.22 44.93 16.38 45.7C16.53 46.47 16.73 47.9 16.82 49Z", "M4.8 32.6C5.22 31.2 6.78 31.72 7.3 32.2C7.82 32.68 7.87 34.3 7.9 35.5C7.93 36.7 7.77 38.45 7.5 39.4C7.23 40.35 6.75 41 6.3 41.2C5.85 41.4 5.05 42.03 4.8 40.6C4.55 39.17 4.38 34 4.8 32.6Z", "M4.7 42.6C5.12 41.2 6.72 41.73 7.2 42.2C7.68 42.67 7.6 44.37 7.6 45.4C7.6 46.43 7.68 47.53 7.2 48.4C6.72 49.27 5.12 51.57 4.7 50.6C4.28 49.63 4.28 44 4.7 42.6Z"], h: ["M16.82 49C16.9 50.1 16.89 51.53 16.88 52.3C16.88 53.07 16.83 53.28 16.79 53.63C16.76 53.97 16.75 54.2 16.67 54.36C16.6 54.52 16.48 54.6 16.36 54.6C16.25 54.6 16.11 54.52 16 54.36C15.89 54.2 15.82 53.97 15.7 53.63C15.59 53.28 15.52 53.07 15.3 52.3C15.08 51.53 14.67 50.1 14.37 49C14.07 47.9 13.67 46.47 13.51 45.7C13.34 44.93 13.37 44.72 13.39 44.37C13.41 44.03 13.43 43.8 13.6 43.64C13.77 43.48 14.13 43.4 14.43 43.4C14.72 43.4 15.12 43.48 15.36 43.64C15.61 43.8 15.74 44.03 15.91 44.37C16.07 44.72 16.22 44.93 16.38 45.7C16.53 46.47 16.73 47.9 16.82 49Z"] };
  /* weiche Silhouette ohne Umriss: Kopf und Rumpf symmetrisch, Arm und Bein werden gespiegelt */
  const BODY = ["M0 2.2C0.83 2.2 1.82 2.3 2.5 2.8C3.18 3.3 3.77 4.23 4.1 5.2C4.43 6.17 4.48 7.5 4.5 8.6C4.52 9.7 4.43 10.8 4.2 11.8C3.97 12.8 3.55 13.87 3.1 14.6C2.65 15.33 2.02 15.88 1.5 16.2C0.98 16.52 0.5 16.5 0 16.5C-0.5 16.5 -0.98 16.52 -1.5 16.2C-2.02 15.88 -2.65 15.33 -3.1 14.6C-3.55 13.87 -3.97 12.8 -4.2 11.8C-4.43 10.8 -4.52 9.7 -4.5 8.6C-4.48 7.5 -4.43 6.17 -4.1 5.2C-3.77 4.23 -3.18 3.3 -2.5 2.8C-1.82 2.3 -0.83 2.2 0 2.2Z", "M0 13C0.9 13 2.24 12.83 2.7 13.4C3.16 13.97 2.68 15.57 2.75 16.4C2.82 17.23 2.62 17.85 3.1 18.4C3.58 18.95 4.62 19.28 5.6 19.7C6.58 20.12 8.07 20.52 9 20.9C9.93 21.28 10.8 21.32 11.2 22C11.6 22.68 11.57 23.92 11.4 25C11.23 26.08 10.53 27.5 10.2 28.5C9.87 29.5 9.62 30 9.4 31C9.18 32 9.09 33.25 8.9 34.5C8.71 35.75 8.44 37.17 8.25 38.5C8.06 39.83 7.81 41.17 7.75 42.5C7.69 43.83 7.82 45.5 7.9 46.5C7.98 47.5 8.15 47.83 8.25 48.5C8.35 49.17 8.79 49.75 8.5 50.5C8.21 51.25 7.92 52.5 6.5 53C5.08 53.5 2.17 53.5 0 53.5C-2.17 53.5 -5.08 53.5 -6.5 53C-7.92 52.5 -8.21 51.25 -8.5 50.5C-8.79 49.75 -8.35 49.17 -8.25 48.5C-8.15 47.83 -7.98 47.5 -7.9 46.5C-7.82 45.5 -7.69 43.83 -7.75 42.5C-7.81 41.17 -8.06 39.83 -8.25 38.5C-8.44 37.17 -8.71 35.75 -8.9 34.5C-9.09 33.25 -9.18 32 -9.4 31C-9.62 30 -9.87 29.5 -10.2 28.5C-10.53 27.5 -11.23 26.08 -11.4 25C-11.57 23.92 -11.6 22.68 -11.2 22C-10.8 21.32 -9.93 21.28 -9 20.9C-8.07 20.52 -6.58 20.12 -5.6 19.7C-4.62 19.28 -3.58 18.95 -3.1 18.4C-2.62 17.85 -2.82 17.23 -2.75 16.4C-2.68 15.57 -3.16 13.97 -2.7 13.4C-2.24 12.83 -0.9 13 0 13Z"];
  const LIMB = ["M10.2 21.2C10.75 21.17 11.57 21.8 12.1 22.3C12.63 22.8 13.07 23.33 13.4 24.2C13.73 25.07 13.92 26.37 14.1 27.5C14.28 28.63 14.37 29.75 14.5 31C14.63 32.25 14.76 33.67 14.9 35C15.04 36.33 15.18 37.83 15.35 39C15.52 40.17 15.67 41 15.9 42C16.13 43 16.52 44 16.75 45C16.98 46 17.17 46.83 17.3 48C17.43 49.17 17.51 50.75 17.55 52C17.59 53.25 17.52 54.58 17.55 55.5C17.58 56.42 17.63 56.75 17.75 57.5C17.87 58.25 18.15 59.17 18.25 60C18.35 60.83 18.41 61.73 18.35 62.5C18.29 63.27 18.09 64.05 17.9 64.6C17.71 65.15 17.43 65.52 17.2 65.8C16.97 66.08 16.75 66.33 16.5 66.3C16.25 66.27 15.92 66.15 15.7 65.6C15.48 65.05 15.31 63.93 15.2 63C15.09 62.07 15.03 60.92 15.05 60C15.08 59.08 15.3 58.25 15.35 57.5C15.4 56.75 15.49 56.42 15.35 55.5C15.21 54.58 14.81 53.25 14.5 52C14.19 50.75 13.79 49.17 13.5 48C13.21 46.83 12.96 46 12.75 45C12.54 44 12.45 43 12.25 42C12.05 41 11.82 40.17 11.55 39C11.28 37.83 10.92 36.33 10.65 35C10.38 33.67 10.11 32.08 9.95 31C9.79 29.92 9.82 29.42 9.7 28.5C9.57 27.58 9.35 26.5 9.2 25.5C9.05 24.5 8.63 23.22 8.8 22.5C8.97 21.78 9.65 21.23 10.2 21.2Z", "M0 43.5L7.5 43.5C7.57 44 7.77 45.67 7.9 46.5C8.03 47.33 8.17 47.92 8.3 48.5C8.43 49.08 8.55 49.42 8.7 50C8.85 50.58 9.02 51.25 9.2 52C9.38 52.75 9.58 53.58 9.75 54.5C9.92 55.42 10.1 56.42 10.2 57.5C10.3 58.58 10.35 59.58 10.35 61C10.35 62.42 10.3 64.33 10.2 66C10.1 67.67 9.94 69.5 9.75 71C9.56 72.5 9.3 73.75 9.05 75C8.8 76.25 8.38 77.5 8.25 78.5C8.12 79.5 8.23 80.08 8.3 81C8.38 81.92 8.64 83 8.7 84C8.76 85 8.77 85.83 8.65 87C8.53 88.17 8.26 89.67 8 91C7.74 92.33 7.35 93.75 7.1 95C6.85 96.25 6.63 97.5 6.5 98.5C6.37 99.5 6.23 100.22 6.3 101C6.37 101.78 6.62 102.43 6.9 103.2C7.18 103.97 7.81 104.98 8 105.6C8.19 106.22 8.17 106.57 8.05 106.9C7.93 107.23 7.88 107.47 7.3 107.6C6.72 107.73 5.22 107.77 4.6 107.7C3.98 107.63 3.8 107.52 3.6 107.2C3.4 106.88 3.38 106.43 3.4 105.8C3.42 105.17 3.63 104.2 3.7 103.4C3.77 102.6 3.79 101.82 3.8 101C3.81 100.18 3.8 99.5 3.75 98.5C3.7 97.5 3.62 96.25 3.5 95C3.38 93.75 3.16 92.33 3 91C2.84 89.67 2.63 88.17 2.55 87C2.47 85.83 2.45 85 2.5 84C2.55 83 2.77 81.92 2.85 81C2.93 80.08 3.03 79.5 2.95 78.5C2.88 77.5 2.62 76.42 2.4 75C2.17 73.58 1.84 71.67 1.6 70C1.36 68.33 1.13 66.67 0.95 65C0.77 63.33 0.61 61.23 0.5 60C0.39 58.77 0.33 58 0.3 57.6L0 56.6Z"];
  function figure(cx) {
    const f = 'fill="var(--mm-body)"';
    return `<g transform="translate(${cx} 0)">` + BODY.map(d => `<path d="${d}" ${f}/>`).join('') + LIMB.map(d => `<path d="${d}" ${f}/><path d="${d}" transform="scale(-1 1)" ${f}/>`).join('') + '</g>';
  }
  function bodyMap(ex) {
    if (!ex || !ex.m || !ex.m.length) return '';
    const on = new Set(ex.m), cx = { v: 30, h: 90 };
    const st = act => `fill="${act ? 'var(--mm-act)' : 'var(--mm-in)'}" stroke="var(--mm-body)" stroke-width=".5" stroke-linejoin="round"`;
    /* Pfade mit negativen x-Werten sind schon symmetrisch, alle anderen werden gespiegelt */
    const put = (sd, path, act) => { g[sd] += `<path d="${path}" ${st(act)}/>` + (path.includes('-') ? '' : `<path d="${path}" transform="scale(-1 1)" ${st(act)}/>`); };
    let g = { v: '', h: '' };
    ['v', 'h'].forEach(sd => DECO[sd].forEach(d => put(sd, d, false)));
    Object.keys(MUSC).forEach(k => { if (k === 'soleus' && !on.has(k)) return; const [, sides] = MUSC[k]; Object.keys(sides).forEach(sd => sides[sd].forEach(d => put(sd, d, on.has(k)))); });
    const names = ex.m.map(k => MUSC[k] && MUSC[k][0]).filter(Boolean);
    const head = ex.mh || (ex.t === 'stretch' ? 'Gedehnt' : ex.t === 'rep' ? 'Mobilisiert' : 'Trainiert');
    return `<div class="musc"><svg viewBox="0 0 120 109" role="img" aria-label="${head}: ${names.join(', ')}">${figure(cx.v)}${figure(cx.h)}<g transform="translate(${cx.v} 0)">${g.v}</g><g transform="translate(${cx.h} 0)">${g.h}</g></svg>
      <div class="musc-tx"><small>${head}</small><b>${names.join(' · ')}</b></div></div>`;
  }

  window.UEBUNGEN = { LIB, lib, svg, animate, bodyMap };
})();
