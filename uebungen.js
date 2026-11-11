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
  const MUSC = {
    /* rechte Körperhälfte in Figur-Koordinaten (Mitte x = 0); wird gespiegelt, außer bei Einzelformen */
    brust: ['Brust', 'v', 'M0.7 20.6C1.4 19.3 3.6 19.8 5.0 19.9C6.4 20.0 8.0 20.2 8.8 21.0C9.6 21.8 9.9 23.2 9.6 24.4C9.3 25.5 8.2 27.2 7.2 27.9C6.2 28.6 4.6 28.6 3.5 28.6C2.4 28.6 1.2 29.1 0.7 27.8C0.2 26.5 -0.0 21.9 0.7 20.6Z'],
    schulter: ['Schulter', 'v', 'M8.6 19.6C9.0 19.2 10.8 19.4 11.6 19.9C12.4 20.4 13.2 21.7 13.6 22.8C14.0 23.9 14.1 25.6 13.9 26.6C13.7 27.6 13.0 28.7 12.4 28.6C11.8 28.5 11.1 27.2 10.6 26.2C10.1 25.2 9.6 23.7 9.3 22.6C9.0 21.5 8.2 20.1 8.6 19.6Z'],
    bizeps: ['Bizeps', 'v', 'M11.3 28.8C11.7 28.1 12.8 28.0 13.3 28.6C13.8 29.2 14.3 31.0 14.4 32.5C14.5 34.0 14.3 36.2 14.1 37.5C13.8 38.8 13.3 40.0 12.9 40.0C12.5 40.0 12.1 38.6 11.8 37.4C11.5 36.2 11.3 34.4 11.2 33.0C11.1 31.6 11.0 29.5 11.3 28.8Z'],
    bauch: ['Bauch', 'v', 'M-4.0 30.0C-3.3 28.5 -1.3 29.2 0.0 29.2C1.3 29.2 3.3 28.5 4.0 30.0C4.7 31.5 4.4 35.5 4.4 38.0C4.4 40.5 4.3 43.0 4.0 45.0C3.7 47.0 3.3 49.0 2.6 50.0C1.9 51.0 0.9 51.0 0.0 51.0C-0.9 51.0 -1.9 51.0 -2.6 50.0C-3.3 49.0 -3.7 47.0 -4.0 45.0C-4.3 43.0 -4.4 40.5 -4.4 38.0C-4.4 35.5 -4.7 31.5 -4.0 30.0Z', 1],
    hueftbeuger: ['Hüftbeuger', 'v', 'M2.6 50.5C3.1 49.2 5.2 48.6 6.3 48.6C7.3 48.6 8.5 49.7 8.9 50.6C9.3 51.5 9.4 53.0 8.8 54.2C8.2 55.4 6.6 57.2 5.6 57.6C4.6 58.0 3.5 57.5 3.0 56.3C2.5 55.1 2.1 51.8 2.6 50.5Z'],
    quad: ['Oberschenkelvorderseite', 'v', 'M3.4 58.4C4.1 57.4 6.1 56.0 7.2 56.2C8.3 56.4 9.3 57.9 9.8 59.5C10.3 61.1 10.2 63.8 10.1 66.0C10.0 68.2 9.6 70.9 9.2 73.0C8.8 75.1 8.3 77.7 7.6 78.8C6.9 79.9 5.9 80.1 5.2 79.6C4.5 79.0 3.8 77.4 3.4 75.5C3.0 73.6 2.8 70.2 2.7 68.0C2.6 65.8 2.7 63.6 2.8 62.0C2.9 60.4 2.7 59.4 3.4 58.4Z'],
    adduktoren: ['Adduktoren', 'v', 'M0.9 60.0C1.1 58.4 2.5 58.1 2.9 58.8C3.3 59.5 3.4 62.0 3.4 64.0C3.4 66.0 3.3 69.3 3.1 71.0C2.9 72.7 2.5 74.4 2.2 74.0C1.9 73.6 1.7 70.8 1.5 68.5C1.3 66.2 0.7 61.6 0.9 60.0Z'],
    schienbein: ['Schienbein', 'v', 'M5.8 83.4C6.2 82.2 7.5 83.1 7.9 84.0C8.3 84.9 8.4 87.1 8.4 89.0C8.4 90.9 8.1 93.7 7.8 95.5C7.5 97.3 6.9 99.5 6.6 100.0C6.2 100.5 5.9 100.0 5.7 98.5C5.5 97.0 5.4 93.5 5.4 91.0C5.4 88.5 5.4 84.6 5.8 83.4Z'],
    nacken: ['Nacken', 'h', 'M-2.4 15.4C-1.1 14.9 1.1 14.9 2.4 15.4C3.7 15.9 4.2 17.6 5.4 18.4C6.6 19.2 9.5 19.5 9.6 20.2C9.7 20.9 7.3 21.8 6.0 22.8C4.7 23.8 3.0 25.3 2.0 26.0C1.0 26.7 0.7 27.0 0.0 27.0C-0.7 27.0 -1.0 26.7 -2.0 26.0C-3.0 25.3 -4.7 23.8 -6.0 22.8C-7.3 21.8 -9.7 20.9 -9.6 20.2C-9.5 19.5 -6.6 19.2 -5.4 18.4C-4.2 17.6 -3.7 15.9 -2.4 15.4Z', 1],
    schulterh: ['Schulter hinten', 'h', 'M8.6 19.6C9.0 19.2 10.8 19.4 11.6 19.9C12.4 20.4 13.2 21.7 13.6 22.8C14.0 23.9 14.1 25.6 13.9 26.6C13.7 27.6 13.0 28.7 12.4 28.6C11.8 28.5 11.1 27.2 10.6 26.2C10.1 25.2 9.6 23.7 9.3 22.6C9.0 21.5 8.2 20.1 8.6 19.6Z'],
    bws: ['Brustwirbelsäule', 'h', 'M0.7 22.6C1.3 20.8 3.3 22.1 4.4 22.4C5.5 22.7 7.0 23.6 7.4 24.6C7.8 25.6 7.5 27.3 7.0 28.6C6.5 29.9 5.5 31.6 4.4 32.4C3.4 33.2 1.3 34.8 0.7 33.2C0.1 31.6 0.1 24.4 0.7 22.6Z'],
    lat: ['Latissimus', 'h', 'M7.6 26.4C8.3 25.6 9.2 26.7 9.5 28.0C9.8 29.3 9.3 32.0 9.1 34.0C8.9 36.0 8.8 38.3 8.2 40.0C7.6 41.7 6.4 43.6 5.6 44.2C4.8 44.8 3.9 44.6 3.6 43.6C3.3 42.6 3.7 39.8 4.0 38.0C4.3 36.2 4.8 34.5 5.4 32.6C6.0 30.7 6.9 27.2 7.6 26.4Z'],
    trizeps: ['Trizeps', 'h', 'M11.3 28.8C11.7 28.1 12.8 28.0 13.3 28.6C13.8 29.2 14.3 31.0 14.4 32.5C14.5 34.0 14.3 36.2 14.1 37.5C13.8 38.8 13.3 40.0 12.9 40.0C12.5 40.0 12.1 38.6 11.8 37.4C11.5 36.2 11.3 34.4 11.2 33.0C11.1 31.6 11.0 29.5 11.3 28.8Z'],
    lws: ['unterer Rücken', 'h', 'M0.7 35.0C1.0 32.6 2.3 34.4 2.8 35.2C3.2 36.0 3.3 38.4 3.4 40.0C3.5 41.6 3.5 43.5 3.4 45.0C3.3 46.5 3.2 48.3 2.8 49.0C2.3 49.7 1.0 51.7 0.7 49.4C0.4 47.1 0.4 37.4 0.7 35.0Z'],
    gesaess: ['Gesäß', 'h', 'M0.7 51.6C1.3 49.9 2.9 49.9 4.2 49.8C5.5 49.7 7.6 50.1 8.6 51.0C9.6 51.9 10.0 53.6 10.2 55.0C10.4 56.4 10.3 58.2 9.7 59.4C9.1 60.6 7.7 61.6 6.6 62.0C5.5 62.4 4.0 62.0 3.0 61.6C2.0 61.2 1.2 61.5 0.8 59.8C0.4 58.1 0.1 53.3 0.7 51.6Z'],
    hamstrings: ['Oberschenkelrückseite', 'h', 'M2.8 63.8C3.4 62.9 4.9 62.8 6.0 62.8C7.1 62.8 8.6 62.4 9.2 63.6C9.8 64.8 9.5 67.8 9.3 70.0C9.1 72.2 8.7 74.9 8.2 76.5C7.7 78.1 6.9 79.2 6.2 79.6C5.5 80.0 4.7 79.9 4.2 79.0C3.7 78.1 3.4 75.8 3.1 74.0C2.8 72.2 2.7 69.7 2.6 68.0C2.5 66.3 2.2 64.7 2.8 63.8Z'],
    wade: ['Wade', 'h', 'M3.2 82.6C3.7 81.3 4.8 80.8 5.6 80.8C6.4 80.8 7.6 81.7 8.2 82.8C8.8 83.9 9.0 85.9 9.0 87.6C9.0 89.3 8.6 91.4 8.1 92.8C7.6 94.2 6.7 95.8 6.0 96.0C5.3 96.2 4.5 95.3 4.0 94.0C3.5 92.7 3.0 90.3 2.9 88.4C2.8 86.5 2.8 83.9 3.2 82.6Z'],
    soleus: ['Achillessehne', 'h', 'M4.4 96.6C4.7 95.8 5.9 95.8 6.2 96.6C6.5 97.4 6.2 100.3 6.0 101.4C5.8 102.5 5.5 103.4 5.2 103.4C5.0 103.4 4.6 102.5 4.5 101.4C4.4 100.3 4.1 97.4 4.4 96.6Z']
  };
  const DECO = {'v': ['M11.9 41.2C12.3 39.6 14.1 39.8 14.6 40.6C15.1 41.4 15.1 44.1 15.1 46.0C15.1 47.9 14.9 50.4 14.6 52.0C14.2 53.6 13.4 55.7 13.0 55.4C12.6 55.1 12.3 52.4 12.1 50.0C11.9 47.6 11.5 42.8 11.9 41.2Z', 'M4.7 30.8C5.4 29.0 8.3 28.5 8.9 29.4C9.5 30.3 8.5 33.6 8.4 36.0C8.3 38.4 8.4 42.0 8.6 44.0C8.8 46.0 9.8 47.6 9.3 48.2C8.8 48.8 6.4 49.0 5.6 47.6C4.8 46.2 4.8 42.8 4.6 40.0C4.4 37.2 4.0 32.6 4.7 30.8Z'], 'h': ['M11.9 41.2C12.3 39.6 14.1 39.8 14.6 40.6C15.1 41.4 15.1 44.1 15.1 46.0C15.1 47.9 14.9 50.4 14.6 52.0C14.2 53.6 13.4 55.7 13.0 55.4C12.6 55.1 12.3 52.4 12.1 50.0C11.9 47.6 11.5 42.8 11.9 41.2Z', 'M4.0 44.6C4.7 43.3 7.3 41.0 8.2 41.6C9.1 42.2 9.4 46.5 9.4 48.0C9.4 49.5 9.1 50.1 8.2 50.4C7.3 50.7 4.9 50.6 4.2 49.6C3.5 48.6 3.3 45.9 4.0 44.6Z']};
  const BODY = 'M2.3 14.5C3.2 14.9 2.1 16.5 2.9 17.2C3.7 17.9 5.7 18.2 7.0 18.6C8.3 19.0 9.7 18.8 10.8 19.4C11.9 20.0 12.8 21.1 13.4 22.5C14.0 23.9 14.2 26.1 14.4 28.0C14.7 29.9 14.8 32.0 14.9 34.0C15.1 36.0 15.2 38.0 15.3 40.0C15.4 42.0 15.3 44.0 15.2 46.0C15.1 48.0 14.8 50.2 14.7 52.0C14.6 53.8 14.4 55.6 14.4 57.0C14.4 58.4 15.1 59.6 14.9 60.5C14.7 61.4 13.9 62.2 13.4 62.3C12.9 62.3 12.2 61.8 12.0 60.8C11.8 59.8 12.0 58.1 11.9 56.0C11.8 53.9 11.7 50.7 11.6 48.0C11.5 45.3 11.3 42.5 11.2 40.0C11.1 37.5 11.0 35.0 10.8 33.0C10.6 31.0 10.1 27.8 9.8 28.0C9.5 28.2 9.4 31.7 9.2 34.0C9.0 36.3 8.6 39.7 8.5 42.0C8.4 44.3 8.6 46.0 8.9 48.0C9.2 50.0 9.9 51.7 10.2 54.0C10.4 56.3 10.5 59.2 10.4 62.0C10.3 64.8 9.9 68.0 9.6 71.0C9.3 74.0 8.8 77.3 8.7 80.0C8.6 82.7 9.3 84.5 9.2 87.0C9.1 89.5 8.7 92.5 8.3 95.0C7.9 97.5 6.9 100.2 6.9 102.0C6.9 103.8 8.3 104.6 8.2 105.5C8.1 106.4 7.0 107.0 6.2 107.2C5.4 107.4 3.7 107.6 3.2 106.6C2.7 105.6 3.2 103.3 3.1 101.0C3.0 98.7 2.8 95.8 2.7 93.0C2.6 90.2 2.5 86.7 2.5 84.0C2.5 81.3 2.5 79.7 2.4 77.0C2.2 74.3 1.9 70.7 1.6 68.0C1.3 65.3 1.1 62.4 0.8 61.0C0.5 59.6 0.3 59.5 0.0 59.5C-0.3 59.5 -0.5 59.6 -0.8 61.0C-1.1 62.4 -1.3 65.3 -1.6 68.0C-1.9 70.7 -2.2 74.3 -2.4 77.0C-2.5 79.7 -2.5 81.3 -2.5 84.0C-2.5 86.7 -2.6 90.2 -2.7 93.0C-2.8 95.8 -3.0 98.7 -3.1 101.0C-3.2 103.3 -2.7 105.6 -3.2 106.6C-3.7 107.6 -5.4 107.4 -6.2 107.2C-7.0 107.0 -8.1 106.4 -8.2 105.5C-8.3 104.6 -6.9 103.8 -6.9 102.0C-6.9 100.2 -7.9 97.5 -8.3 95.0C-8.7 92.5 -9.1 89.5 -9.2 87.0C-9.3 84.5 -8.6 82.7 -8.7 80.0C-8.8 77.3 -9.3 74.0 -9.6 71.0C-9.9 68.0 -10.3 64.8 -10.4 62.0C-10.5 59.2 -10.4 56.3 -10.2 54.0C-9.9 51.7 -9.2 50.0 -8.9 48.0C-8.6 46.0 -8.4 44.3 -8.5 42.0C-8.6 39.7 -9.0 36.3 -9.2 34.0C-9.4 31.7 -9.5 28.2 -9.8 28.0C-10.1 27.8 -10.6 31.0 -10.8 33.0C-11.0 35.0 -11.1 37.5 -11.2 40.0C-11.3 42.5 -11.5 45.3 -11.6 48.0C-11.7 50.7 -11.8 53.9 -11.9 56.0C-12.0 58.1 -11.8 59.8 -12.0 60.8C-12.2 61.8 -12.9 62.3 -13.4 62.3C-13.9 62.2 -14.7 61.4 -14.9 60.5C-15.1 59.6 -14.4 58.4 -14.4 57.0C-14.4 55.6 -14.6 53.8 -14.7 52.0C-14.8 50.2 -15.1 48.0 -15.2 46.0C-15.3 44.0 -15.4 42.0 -15.3 40.0C-15.2 38.0 -15.1 36.0 -14.9 34.0C-14.8 32.0 -14.7 29.9 -14.4 28.0C-14.2 26.1 -14.0 23.9 -13.4 22.5C-12.8 21.1 -11.9 20.0 -10.8 19.4C-9.7 18.8 -8.3 19.0 -7.0 18.6C-5.7 18.2 -3.7 17.9 -2.9 17.2C-2.1 16.5 -3.2 14.9 -2.3 14.5C-1.4 14.1 1.4 14.1 2.3 14.5Z', HEAD = 'M0 2.6C3.6 2.6 5.6 5.4 5.6 9C5.6 12.4 3.4 15 0 15C-3.4 15 -5.6 12.4 -5.6 9C-5.6 5.4 -3.6 2.6 0 2.6Z';
  /* weiche Silhouette mit dezenten Linien für Schlüsselbein bzw. Wirbelsäule */
  function figure(cx, back) {
    const det = back ? '<path d="M0 17V52" fill="none" stroke="var(--c-l)" stroke-width=".5" stroke-linecap="round" opacity=".7"/>'
      : '<path d="M-8 18.6Q-4 17.6 -1 18.8M8 18.6Q4 17.6 1 18.8" fill="none" stroke="var(--c-l)" stroke-width=".5" stroke-linecap="round" opacity=".8"/>';
    return `<g transform="translate(${cx} 0)"><path d="${BODY}" fill="var(--card)" stroke="var(--c-l)" stroke-width=".8" stroke-linejoin="round"/><path d="${HEAD}" fill="var(--card)" stroke="var(--c-l)" stroke-width=".8"/>${det}</g>`;
  }
  function bodyMap(ex) {
    if (!ex || !ex.m || !ex.m.length) return '';
    const on = new Set(ex.m), cx = { v: 30, h: 90 };
    const dst = 'fill="var(--c-t)" stroke="var(--card)" stroke-width=".45" stroke-linejoin="round"';
    let g = { v: '', h: '' };
    ['v', 'h'].forEach(sd => DECO[sd].forEach(d => { g[sd] += `<path d="${d}" ${dst}/><path d="${d}" transform="scale(-1 1)" ${dst}/>`; }));
    Object.keys(MUSC).forEach(k => {
      const [, side, path, single] = MUSC[k], act = on.has(k);
      const st = `fill="${act ? 'var(--c-d)' : 'var(--c-t)'}" stroke="var(--card)" stroke-width=".45" stroke-linejoin="round"`;
      g[side] += `<path d="${path}" ${st}/>` + (single ? '' : `<path d="${path}" transform="scale(-1 1)" ${st}/>`);
    });
    g.v += '<path d="M-3.8 35.6H3.8M-4.1 40.8H4.1M-3.6 45.6H3.6M0 30V50.6" fill="none" stroke="var(--card)" stroke-width=".45" opacity=".9"/>';
    const names = ex.m.map(k => MUSC[k] && MUSC[k][0]).filter(Boolean);
    const head = ex.mh || (ex.t === 'stretch' ? 'Gedehnt' : ex.t === 'rep' ? 'Mobilisiert' : 'Trainiert');
    return `<div class="musc"><svg viewBox="0 0 120 118" role="img" aria-label="${head}: ${names.join(', ')}">${figure(cx.v)}${figure(cx.h, 1)}<g transform="translate(${cx.v} 0)">${g.v}</g><g transform="translate(${cx.h} 0)">${g.h}</g>
      <text x="30" y="116" text-anchor="middle">vorn</text><text x="90" y="116" text-anchor="middle">hinten</text></svg>
      <div class="musc-tx"><small>${head}</small><b>${names.join(' · ')}</b></div></div>`;
  }

  window.UEBUNGEN = { LIB, lib, svg, animate, bodyMap };
})();
