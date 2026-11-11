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
    brust: ['Brust', 'v', ['M0.6 20.4C1.2 18.8 3.0 19.8 4.4 19.8C5.8 19.8 8.0 19.8 9.0 20.4C10.0 21.0 10.2 22.2 10.4 23.2C10.6 24.2 10.5 25.7 10.2 26.6C9.9 27.5 9.3 28.1 8.4 28.6C7.5 29.1 6.1 29.5 4.8 29.6C3.5 29.7 1.3 30.7 0.6 29.2C-0.1 27.7 -0.0 22.0 0.6 20.4Z']],
    schulter: ['Schulter', 'v', ['M9.4 19.4C9.8 19.1 10.7 18.9 11.4 19.4C12.1 19.9 12.9 21.1 13.4 22.4C13.9 23.7 14.3 25.6 14.3 27.0C14.3 28.4 13.9 30.1 13.6 31.0C13.2 31.9 12.6 32.7 12.2 32.4C11.8 32.1 11.4 30.4 11.0 29.0C10.6 27.6 10.3 25.3 10.0 24.0C9.7 22.7 9.3 21.8 9.2 21.0C9.1 20.2 9.0 19.7 9.4 19.4Z']],
    bizeps: ['Bizeps', 'v', ['M11.0 30.6C11.2 30.2 11.9 31.4 12.4 31.8C12.9 32.2 13.8 31.9 14.2 32.8C14.6 33.7 14.8 35.6 14.8 37.0C14.8 38.4 14.6 40.2 14.2 41.0C13.8 41.8 13.1 42.4 12.6 42.0C12.1 41.6 11.7 39.9 11.4 38.6C11.1 37.3 11.1 35.3 11.0 34.0C10.9 32.7 10.8 31.0 11.0 30.6Z']],
    bauch: ['Bauch', 'v', ['M-4.0 30.6C-3.3 29.3 -1.3 30.0 0.0 30.0C1.3 30.0 3.3 29.3 4.0 30.6C4.7 31.9 4.4 35.6 4.4 38.0C4.4 40.4 4.3 43.0 4.0 45.0C3.7 47.0 3.3 49.0 2.6 50.0C1.9 51.0 0.9 51.0 0.0 51.0C-0.9 51.0 -1.9 51.0 -2.6 50.0C-3.3 49.0 -3.7 47.0 -4.0 45.0C-4.3 43.0 -4.4 40.4 -4.4 38.0C-4.4 35.6 -4.7 31.9 -4.0 30.6Z'], 1],
    hueftbeuger: ['Hüftbeuger', 'v', ['M3.2 51.4C3.9 50.2 6.5 48.7 7.6 48.8C8.7 48.9 9.4 50.8 9.6 51.8C9.8 52.8 9.6 54.2 9.0 55.0C8.4 55.8 7.1 56.7 6.2 56.8C5.3 56.9 4.1 56.7 3.6 55.8C3.1 54.9 2.5 52.6 3.2 51.4Z']],
    quad: ['Oberschenkelvorderseite', 'v', ['M4.6 58.0C5.0 57.2 6.0 57.0 6.6 57.0C7.2 57.0 8.1 57.0 8.4 58.2C8.7 59.4 8.4 61.9 8.2 64.0C8.0 66.1 7.7 68.9 7.4 71.0C7.1 73.1 6.7 76.1 6.4 76.6C6.1 77.1 5.7 75.6 5.4 74.0C5.1 72.4 4.8 69.1 4.6 67.0C4.4 64.9 4.1 63.1 4.1 61.6C4.1 60.1 4.2 58.8 4.6 58.0Z', 'M8.8 57.8C9.1 57.3 9.9 59.5 10.2 61.0C10.4 62.5 10.4 64.9 10.3 67.0C10.2 69.1 9.8 71.4 9.4 73.4C9.1 75.4 8.6 78.0 8.2 78.8C7.8 79.6 7.1 79.7 7.0 78.4C6.9 77.1 7.5 73.4 7.8 71.0C8.1 68.6 8.4 66.2 8.6 64.0C8.8 61.8 8.5 58.3 8.8 57.8Z', 'M3.4 66.0C3.7 65.7 4.1 66.8 4.4 68.0C4.7 69.2 5.1 71.4 5.4 73.0C5.7 74.6 6.2 76.6 6.2 77.8C6.2 79.0 5.8 79.7 5.4 80.0C5.0 80.3 4.2 80.3 3.8 79.6C3.4 78.9 3.2 77.6 3.0 76.0C2.8 74.4 2.7 71.7 2.8 70.0C2.9 68.3 3.1 66.3 3.4 66.0Z']],
    adduktoren: ['Adduktoren', 'v', ['M1.0 60.0C1.2 58.6 2.1 58.8 2.6 58.4C3.1 58.0 3.8 57.2 4.0 57.8C4.2 58.4 3.9 60.7 3.8 62.0C3.7 63.3 3.4 64.1 3.2 65.6C3.0 67.1 2.7 70.8 2.4 71.0C2.1 71.2 1.8 68.8 1.6 67.0C1.4 65.2 0.8 61.4 1.0 60.0Z']],
    schienbein: ['Schienbein', 'v', ['M5.4 83.8C5.7 82.6 6.8 83.1 7.2 83.6C7.6 84.1 7.9 85.4 7.9 87.0C7.9 88.6 7.7 91.0 7.4 93.0C7.2 95.0 6.7 98.2 6.4 99.0C6.1 99.8 5.8 99.3 5.6 98.0C5.4 96.7 5.2 93.4 5.2 91.0C5.2 88.6 5.1 85.0 5.4 83.8Z']],
    nacken: ['Nacken', 'h', ['M-2.4 15.4C-1.1 14.9 1.1 14.9 2.4 15.4C3.7 15.9 4.1 17.5 5.4 18.2C6.7 18.9 9.7 19.2 10.0 19.8C10.3 20.4 8.1 21.4 7.0 21.8C5.9 22.2 4.6 22.0 3.4 22.2C2.2 22.4 1.1 22.8 0.0 22.8C-1.1 22.8 -2.2 22.4 -3.4 22.2C-4.6 22.0 -5.9 22.2 -7.0 21.8C-8.1 21.4 -10.3 20.4 -10.0 19.8C-9.7 19.2 -6.7 18.9 -5.4 18.2C-4.1 17.5 -3.7 15.9 -2.4 15.4Z'], 1],
    schulterh: ['Schulter hinten', 'h', ['M9.4 19.4C9.8 19.1 10.7 18.9 11.4 19.4C12.1 19.9 12.9 21.1 13.4 22.4C13.9 23.7 14.3 25.6 14.3 27.0C14.3 28.4 13.9 30.1 13.6 31.0C13.2 31.9 12.6 32.7 12.2 32.4C11.8 32.1 11.4 30.4 11.0 29.0C10.6 27.6 10.3 25.3 10.0 24.0C9.7 22.7 9.3 21.8 9.2 21.0C9.1 20.2 9.0 19.7 9.4 19.4Z']],
    bws: ['Brustwirbelsäule', 'h', ['M0.6 23.4C1.1 21.1 2.6 23.0 3.6 23.0C4.6 23.0 6.5 22.8 6.8 23.6C7.1 24.4 5.9 25.9 5.2 27.6C4.5 29.3 3.4 32.4 2.6 34.0C1.8 35.6 0.9 38.8 0.6 37.0C0.3 35.2 0.1 25.7 0.6 23.4Z']],
    lat: ['Latissimus', 'h', ['M5.6 29.4C6.6 27.7 8.8 28.4 9.6 28.6C10.4 28.8 10.3 29.2 10.3 30.4C10.3 31.6 9.7 34.1 9.4 36.0C9.1 37.9 9.0 40.3 8.5 42.0C8.0 43.7 7.4 45.5 6.6 46.4C5.8 47.3 4.3 47.9 3.8 47.4C3.3 46.9 3.5 44.9 3.5 43.4C3.5 41.9 3.2 40.9 3.6 38.6C4.0 36.3 4.6 31.1 5.6 29.4Z']],
    trizeps: ['Trizeps', 'h', ['M11.0 30.6C11.2 30.2 11.9 31.4 12.4 31.8C12.9 32.2 13.8 31.9 14.2 32.8C14.6 33.7 14.8 35.6 14.8 37.0C14.8 38.4 14.6 40.2 14.2 41.0C13.8 41.8 13.1 42.4 12.6 42.0C12.1 41.6 11.7 39.9 11.4 38.6C11.1 37.3 11.1 35.3 11.0 34.0C10.9 32.7 10.8 31.0 11.0 30.6Z']],
    lws: ['unterer Rücken', 'h', ['M0.6 38.6C0.9 36.5 2.0 36.9 2.4 37.4C2.8 37.9 3.0 40.2 3.1 41.6C3.2 43.0 3.2 44.7 3.1 46.0C3.0 47.3 3.1 48.9 2.7 49.6C2.3 50.3 0.9 51.8 0.6 50.0C0.2 48.2 0.3 40.7 0.6 38.6Z']],
    gesaess: ['Gesäß', 'h', ['M0.6 52.2C1.2 50.7 3.3 51.4 4.6 51.4C5.9 51.4 7.7 51.7 8.6 52.4C9.5 53.1 10.0 54.6 10.2 55.8C10.4 57.0 10.3 58.5 9.8 59.6C9.3 60.7 8.1 61.8 7.0 62.2C5.9 62.6 4.0 62.3 3.0 62.0C2.0 61.7 1.2 62.0 0.8 60.4C0.4 58.8 -0.0 53.7 0.6 52.2Z']],
    hamstrings: ['Oberschenkelrückseite', 'h', ['M2.8 63.6C3.2 62.8 4.8 61.9 5.3 63.0C5.8 64.1 5.6 67.5 5.6 70.0C5.6 72.5 5.6 76.5 5.4 78.0C5.2 79.5 4.6 79.9 4.2 79.2C3.8 78.5 3.3 75.9 3.0 74.0C2.7 72.1 2.6 69.7 2.6 68.0C2.6 66.3 2.3 64.4 2.8 63.6Z', 'M5.9 63.0C6.5 61.6 8.8 62.4 9.4 63.6C10.0 64.8 9.8 67.8 9.6 70.0C9.4 72.2 8.9 75.0 8.4 76.6C7.9 78.2 7.0 80.2 6.6 79.4C6.2 78.6 5.9 74.7 5.8 72.0C5.7 69.3 5.3 64.4 5.9 63.0Z']],
    wade: ['Wade', 'h', ['M2.8 83.4C3.1 82.3 4.1 81.8 4.6 81.6C5.1 81.4 5.5 81.2 5.7 82.4C5.9 83.6 5.9 86.6 5.8 88.6C5.7 90.6 5.5 93.6 5.2 94.4C4.9 95.2 4.2 94.3 3.8 93.2C3.4 92.1 3.0 89.6 2.8 88.0C2.6 86.4 2.5 84.5 2.8 83.4Z', 'M6.2 82.0C6.6 81.0 7.9 81.9 8.4 82.8C8.9 83.7 9.2 86.0 9.2 87.6C9.2 89.2 8.8 91.4 8.4 92.6C8.0 93.8 7.0 95.6 6.6 95.0C6.2 94.4 6.3 91.2 6.2 89.0C6.1 86.8 5.8 83.0 6.2 82.0Z']],
    soleus: ['Achillessehne', 'h', ['M4.6 95.8C4.9 95.0 6.1 95.0 6.4 95.8C6.7 96.6 6.4 99.6 6.2 100.8C6.0 102.0 5.6 103.0 5.4 103.0C5.2 103.0 4.9 102.0 4.8 100.8C4.7 99.6 4.3 96.6 4.6 95.8Z']]
  };
  /* Muskeln ohne eigene Gruppe (Trapez vorn, Unterarme, seitlicher Bauch, Untergrätenmuskel, mittlerer Gesäßmuskel …) */
  const DECO = {'v': ['M2.8 17.4C3.4 17.2 5.5 17.9 6.6 18.2C7.7 18.5 9.3 19.0 9.2 19.2C9.1 19.4 7.0 19.6 6.0 19.6C5.0 19.6 3.5 19.6 3.0 19.2C2.5 18.8 2.2 17.6 2.8 17.4Z', 'M11.4 43.0C11.6 42.0 12.4 42.7 13.0 42.8C13.6 42.9 14.6 42.6 15.0 43.4C15.4 44.2 15.3 46.0 15.2 47.6C15.1 49.2 14.9 51.6 14.6 53.0C14.3 54.4 13.8 55.8 13.4 56.2C13.0 56.6 12.5 56.8 12.2 55.6C11.9 54.4 11.9 51.1 11.8 49.0C11.7 46.9 11.2 44.0 11.4 43.0Z', 'M4.7 31.2C5.3 29.5 7.5 29.5 8.2 30.0C8.9 30.5 9.1 32.2 9.1 34.0C9.1 35.8 8.4 39.0 8.4 41.0C8.4 43.0 9.0 45.0 8.8 46.2C8.6 47.4 8.1 48.1 7.4 48.4C6.7 48.7 5.2 49.4 4.7 48.0C4.2 46.6 4.6 42.8 4.6 40.0C4.6 37.2 4.1 32.9 4.7 31.2Z', 'M7.7 82.8C7.9 82.1 8.6 84.2 8.8 85.6C9.0 87.0 8.9 89.6 8.8 91.0C8.7 92.4 8.3 94.2 8.1 94.0C7.9 93.8 7.7 91.9 7.6 90.0C7.5 88.1 7.5 83.5 7.7 82.8Z', 'M3.0 83.8C3.2 82.7 4.2 82.5 4.5 83.4C4.8 84.3 4.8 87.2 4.7 89.0C4.6 90.8 4.4 93.8 4.1 94.0C3.8 94.2 3.3 91.7 3.1 90.0C2.9 88.3 2.8 84.9 3.0 83.8Z'], 'h': ['M11.4 43.0C11.6 42.0 12.4 42.7 13.0 42.8C13.6 42.9 14.6 42.6 15.0 43.4C15.4 44.2 15.3 46.0 15.2 47.6C15.1 49.2 14.9 51.6 14.6 53.0C14.3 54.4 13.8 55.8 13.4 56.2C13.0 56.6 12.5 56.8 12.2 55.6C11.9 54.4 11.9 51.1 11.8 49.0C11.7 46.9 11.2 44.0 11.4 43.0Z', 'M7.2 24.0C7.8 23.2 9.0 22.1 9.6 22.4C10.2 22.7 10.5 24.7 10.6 25.6C10.7 26.5 10.7 27.5 10.0 28.0C9.3 28.5 7.1 29.0 6.4 28.8C5.7 28.6 5.7 27.8 5.8 27.0C5.9 26.2 6.6 24.8 7.2 24.0Z', 'M4.8 48.8C5.4 48.3 7.6 47.3 8.4 47.8C9.2 48.3 10.0 50.9 9.8 51.6C9.6 52.3 8.0 51.9 7.2 51.8C6.4 51.7 5.2 51.5 4.8 51.0C4.4 50.5 4.2 49.3 4.8 48.8Z']};
  const BODY = 'M0.0 2.4C0.8 2.4 1.7 2.5 2.4 2.9C3.1 3.3 3.6 3.9 4.0 4.8C4.3 5.6 4.5 6.9 4.5 8.0C4.5 9.1 4.3 10.3 4.1 11.2C3.8 12.1 3.3 12.8 3.0 13.4C2.7 14.0 2.5 14.3 2.4 14.8C2.3 15.3 2.4 16.0 2.5 16.4C2.6 16.8 2.1 16.8 2.9 17.2C3.6 17.6 5.7 18.2 7.0 18.6C8.3 19.0 9.7 18.8 10.8 19.4C11.9 20.0 12.8 21.1 13.4 22.5C14.0 23.9 14.2 26.1 14.4 28.0C14.7 29.9 14.8 32.0 14.9 34.0C15.1 36.0 15.2 38.0 15.3 40.0C15.4 42.0 15.3 44.0 15.2 46.0C15.1 48.0 14.8 50.2 14.7 52.0C14.6 53.8 14.4 55.6 14.4 57.0C14.4 58.4 15.1 59.6 14.9 60.5C14.7 61.4 13.9 62.2 13.4 62.3C12.9 62.3 12.2 61.8 12.0 60.8C11.8 59.8 12.0 58.1 11.9 56.0C11.8 53.9 11.7 50.7 11.6 48.0C11.5 45.3 11.3 42.5 11.2 40.0C11.1 37.5 11.0 35.0 10.8 33.0C10.6 31.0 10.1 27.8 9.8 28.0C9.5 28.2 9.4 31.7 9.2 34.0C9.0 36.3 8.6 39.7 8.5 42.0C8.4 44.3 8.6 46.0 8.9 48.0C9.2 50.0 9.9 51.7 10.2 54.0C10.4 56.3 10.5 59.2 10.4 62.0C10.3 64.8 9.9 68.0 9.6 71.0C9.3 74.0 8.8 77.3 8.7 80.0C8.6 82.7 9.3 84.5 9.2 87.0C9.1 89.5 8.7 92.5 8.3 95.0C7.9 97.5 6.9 100.2 6.9 102.0C6.9 103.8 8.3 104.6 8.2 105.5C8.1 106.4 7.0 107.0 6.2 107.2C5.4 107.4 3.7 107.6 3.2 106.6C2.7 105.6 3.2 103.3 3.1 101.0C3.0 98.7 2.8 95.8 2.7 93.0C2.6 90.2 2.5 86.7 2.5 84.0C2.5 81.3 2.5 79.7 2.4 77.0C2.2 74.3 1.9 70.7 1.6 68.0C1.3 65.3 1.1 62.4 0.8 61.0C0.5 59.6 0.3 59.5 0.0 59.5C-0.3 59.5 -0.5 59.6 -0.8 61.0C-1.1 62.4 -1.3 65.3 -1.6 68.0C-1.9 70.7 -2.2 74.3 -2.4 77.0C-2.5 79.7 -2.5 81.3 -2.5 84.0C-2.5 86.7 -2.6 90.2 -2.7 93.0C-2.8 95.8 -3.0 98.7 -3.1 101.0C-3.2 103.3 -2.7 105.6 -3.2 106.6C-3.7 107.6 -5.4 107.4 -6.2 107.2C-7.0 107.0 -8.1 106.4 -8.2 105.5C-8.3 104.6 -6.9 103.8 -6.9 102.0C-6.9 100.2 -7.9 97.5 -8.3 95.0C-8.7 92.5 -9.1 89.5 -9.2 87.0C-9.3 84.5 -8.6 82.7 -8.7 80.0C-8.8 77.3 -9.3 74.0 -9.6 71.0C-9.9 68.0 -10.3 64.8 -10.4 62.0C-10.5 59.2 -10.4 56.3 -10.2 54.0C-9.9 51.7 -9.2 50.0 -8.9 48.0C-8.6 46.0 -8.4 44.3 -8.5 42.0C-8.6 39.7 -9.0 36.3 -9.2 34.0C-9.4 31.7 -9.5 28.2 -9.8 28.0C-10.1 27.8 -10.6 31.0 -10.8 33.0C-11.0 35.0 -11.1 37.5 -11.2 40.0C-11.3 42.5 -11.5 45.3 -11.6 48.0C-11.7 50.7 -11.8 53.9 -11.9 56.0C-12.0 58.1 -11.8 59.8 -12.0 60.8C-12.2 61.8 -12.9 62.3 -13.4 62.3C-13.9 62.2 -14.7 61.4 -14.9 60.5C-15.1 59.6 -14.4 58.4 -14.4 57.0C-14.4 55.6 -14.6 53.8 -14.7 52.0C-14.8 50.2 -15.1 48.0 -15.2 46.0C-15.3 44.0 -15.4 42.0 -15.3 40.0C-15.2 38.0 -15.1 36.0 -14.9 34.0C-14.8 32.0 -14.7 29.9 -14.4 28.0C-14.2 26.1 -14.0 23.9 -13.4 22.5C-12.8 21.1 -11.9 20.0 -10.8 19.4C-9.7 18.8 -8.3 19.0 -7.0 18.6C-5.7 18.2 -3.6 17.6 -2.9 17.2C-2.1 16.8 -2.6 16.8 -2.5 16.4C-2.4 16.0 -2.3 15.3 -2.4 14.8C-2.5 14.3 -2.7 14.0 -3.0 13.4C-3.3 12.8 -3.8 12.1 -4.1 11.2C-4.3 10.3 -4.5 9.1 -4.5 8.0C-4.5 6.9 -4.3 5.6 -4.0 4.8C-3.6 3.9 -3.1 3.3 -2.4 2.9C-1.7 2.5 -0.8 2.4 0.0 2.4Z';
  /* weiche Silhouette mit dezenten Linien für Schlüsselbein bzw. Wirbelsäule */
  function figure(cx, back) {
    const det = back ? '<path d="M0 17V52" fill="none" stroke="var(--card)" stroke-width=".4" stroke-linecap="round" opacity=".7"/>'
      : '<path d="M-8 18.6Q-4 17.6 -1 18.8M8 18.6Q4 17.6 1 18.8" fill="none" stroke="var(--card)" stroke-width=".4" stroke-linecap="round" opacity=".8"/>';
    return `<g transform="translate(${cx} 0)"><path d="${BODY}" fill="var(--fill)" stroke="var(--chev)" stroke-width=".5" stroke-linejoin="round"/>${det}</g>`;
  }
  function bodyMap(ex) {
    if (!ex || !ex.m || !ex.m.length) return '';
    const on = new Set(ex.m), cx = { v: 30, h: 90 };
    const st = act => `fill="${act ? 'var(--c-d)' : 'none'}" stroke="var(--card)" stroke-width="${act ? '.35' : '.4'}" stroke-opacity="${act ? 1 : .85}" stroke-linejoin="round"`;
    const put = (sd, path, single, act) => { g[sd] += `<path d="${path}" ${st(act)}/>` + (single ? '' : `<path d="${path}" transform="scale(-1 1)" ${st(act)}/>`); };
    let g = { v: '', h: '' };
    ['v', 'h'].forEach(sd => DECO[sd].forEach(d => put(sd, d, 0, false)));
    Object.keys(MUSC).forEach(k => { const [, side, paths, single] = MUSC[k]; paths.forEach(d => put(side, d, single, on.has(k))); });
    g.v += '<path d="M-4 36H4M-4.3 41.2H4.3M-3.8 46H3.8M0 30.4V50.8" fill="none" stroke="var(--card)" stroke-width=".45" opacity=".9"/>';
    const names = ex.m.map(k => MUSC[k] && MUSC[k][0]).filter(Boolean);
    const head = ex.mh || (ex.t === 'stretch' ? 'Gedehnt' : ex.t === 'rep' ? 'Mobilisiert' : 'Trainiert');
    return `<div class="musc"><svg viewBox="0 0 120 109" role="img" aria-label="${head}: ${names.join(', ')}">${figure(cx.v)}${figure(cx.h, 1)}<g transform="translate(${cx.v} 0)">${g.v}</g><g transform="translate(${cx.h} 0)">${g.h}</g></svg>
      <div class="musc-tx"><small>${head}</small><b>${names.join(' · ')}</b></div></div>`;
  }

  window.UEBUNGEN = { LIB, lib, svg, animate, bodyMap };
})();
