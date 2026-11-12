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
    brust: ['Brust', { v: ["M0.8 23.3C1.3 22.6 2.4 22.6 3.4 22.5C4.3 22.4 5.8 22.1 6.5 22.4C7.2 22.6 7.7 23.2 7.9 24.0C8.2 24.8 8.2 26.4 8.0 27.4C7.8 28.4 7.6 29.4 6.9 30.0C6.2 30.6 4.8 30.8 3.8 30.8C2.8 30.9 1.4 31.0 0.9 30.3C0.4 29.6 0.6 28.0 0.6 26.8C0.6 25.6 0.3 24.0 0.8 23.3Z"] }],
    schulter: ['Schulter', { v: ["M8.4 20.7C9.4 20.6 10.6 20.9 11.4 21.7C12.1 22.5 12.5 23.6 12.7 24.9C12.8 26.0 12.7 27.0 12.3 27.6C12.1 27.9 11.8 27.9 11.6 27.6C11.1 26.6 10.2 25.4 9.5 24.1C9.0 23.2 8.4 22.4 8.1 21.6C7.9 21.1 8.0 20.8 8.4 20.7Z"] }],
    bizeps: ['Bizeps', { v: ["M10.4 28.9C10.7 28.0 11.4 27.9 11.8 28.0C12.2 28.1 12.7 28.5 12.9 29.2C13.2 29.9 13.3 31.3 13.3 32.4C13.3 33.5 13.1 34.8 12.9 35.6C12.7 36.4 12.3 37.3 12.0 37.4C11.7 37.5 11.3 37.1 11.0 36.4C10.7 35.7 10.3 34.6 10.2 33.4C10.1 32.1 10.1 29.8 10.4 28.9Z"] }],
    bauch: ['Bauch', { v: ["M2.4 31.6L2.5 31.6Q4.3 31.9 4.3 33.7L4.3 36.8Q4.3 38.6 2.5 38.7L2.4 38.7Q0.6 38.8 0.6 37.0L0.6 33.1Q0.6 31.3 2.4 31.6Z", "M2.2 39.5L2.7 39.4Q4.3 39.4 4.3 41.0L4.2 41.8Q4.2 43.4 2.6 43.5L2.2 43.5Q0.6 43.6 0.6 42.0L0.6 41.1Q0.6 39.5 2.2 39.5Z", "M1.6 44.3L3.1 44.2Q4.1 44.1 4.0 45.1L3.7 46.6Q3.6 47.6 3.3 48.6L2.0 52.8Q1.7 53.8 1.2 53.9L1.1 53.9Q0.6 54.0 0.6 53.0L0.6 45.4Q0.6 44.4 1.6 44.3Z"] }],
    hueftbeuger: ['Hüftbeuger', { v: ["M2.8 54.0C3.2 53.3 4.5 51.9 5.4 51.2C6.3 50.5 7.8 49.9 8.3 49.9C8.8 49.9 8.9 50.5 8.6 51.0C8.3 51.5 7.1 52.5 6.4 53.2C5.7 53.9 4.8 55.0 4.2 55.4C3.6 55.8 3.1 55.6 2.9 55.4C2.7 55.2 2.4 54.7 2.8 54.0Z"] }],
    quad: ['Oberschenkelvorderseite', { v: ["M7.6 55.4C7.9 53.6 8.6 52.6 8.9 53.0C9.2 53.4 9.5 55.6 9.6 57.6C9.65 59.6 9.45 62.8 9.28 65.0C9.12 67.2 8.86 69.7 8.56 70.8C8.26 71.9 7.90 72.5 7.65 71.4C7.40 70.3 7.18 66.7 7.22 64.0C7.16 61.3 7.3 57.2 7.6 55.4Z", "M6.6 54.0C7.0 54.4 6.8 57.0 6.79 59.0C6.77 61.0 6.74 63.8 6.63 66.0C6.51 68.2 6.58 70.9 6.30 72.2C6.03 73.5 5.50 73.5 5.15 73.6C4.80 73.7 4.36 73.9 3.99 72.6C3.62 71.3 3.19 68.0 2.97 66.0C2.74 64.0 2.59 62.0 2.85 60.4C3.11 58.8 3.8 57.7 4.4 56.6C5.0 55.5 6.2 53.6 6.6 54.0Z"] }],
    adduktoren: ['Adduktoren', { v: ["M1.7 57.0L1.8 56.9Q2.2 56.7 2.3 57.4L2.3 57.9Q2.41 58.6 2.33 59.3L2.21 62.1Q2.13 62.8 1.94 62.8L1.84 62.9Q1.65 62.9 1.53 62.2L1.39 60.7Q1.27 60.0 1.24 59.3L1.3 57.9Q1.3 57.2 1.7 57.0Z"] }],
    schienbein: ['Schienbein', { v: ["M7.22 81.4C7.30 80.7 8.30 80.6 8.38 81.3C8.45 82.2 8.27 84.6 8.06 86.8C7.86 88.8 7.46 91.0 7.15 92.4C7.05 92.9 6.84 92.9 6.86 92.4C6.86 90.8 6.92 88.4 6.95 86.4C6.97 84.4 7.05 82.2 7.22 81.4Z"] }],
    nacken: ['Nacken', { v: ["M4.0 18.1C4.8 18.3 6.2 18.8 7.2 19.3C7.7 19.7 7.5 20.4 6.8 20.6C5.8 20.8 4.6 20.5 3.9 20.0C3.4 19.2 3.4 18.2 4.0 18.1Z"], h: ["M-2.4 15.6L2.4 15.6C2.8 16.8 3.6 17.6 4.6 18.1C5.8 18.6 7.2 19.0 8.0 19.6C7.8 20.4 7.0 21.0 6.0 21.5C5.0 22.0 4.0 22.3 3.2 23.0C2.6 24.0 2.3 26.4 2.1 28.6C2.0 29.4 1.8 29.8 1.4 29.8L-1.4 29.8C-1.8 29.8 -2.0 29.4 -2.1 28.6C-2.3 26.4 -2.6 24.0 -3.2 23.0C-4.0 22.3 -5.0 22.0 -6.0 21.5C-7.0 21.0 -7.8 20.4 -8.0 19.6C-7.2 19.0 -5.8 18.6 -4.6 18.1C-3.6 17.6 -2.8 16.8 -2.4 15.6Z"] }],
    schulterh: ['Schulter hinten', { h: ["M8.4 20.7C9.4 20.6 10.6 20.9 11.4 21.7C12.1 22.5 12.5 23.6 12.7 24.9C12.8 26.0 12.7 27.0 12.3 27.6C12.1 27.9 11.8 27.9 11.6 27.6C11.1 26.6 10.2 25.4 9.5 24.1C9.0 23.2 8.4 22.4 8.1 21.6C7.9 21.1 8.0 20.8 8.4 20.7Z"] }],
    bws: ['Brustwirbelsäule', { h: ["M-1.5 30.6L1.5 30.6Q2.3 30.6 2.3 31.4L2.1 35.8Q2.1 36.6 1.6 36.9L1.5 36.9Q1.0 37.2 0.5 37.0L0.5 36.9Q0.0 36.7 -0.5 36.9L-0.5 37.0Q-1.0 37.2 -1.5 36.9L-1.6 36.9Q-2.1 36.6 -2.1 35.8L-2.3 31.4Q-2.3 30.6 -1.5 30.6Z"] }],
    lat: ['Latissimus', { h: ["M3.6 25.8C3.9 24.4 4.6 23.6 5.4 23.2C6.0 22.9 6.5 23.0 6.8 23.6C7.1 24.2 7.4 25.0 7.6 26.4C7.8 27.8 7.9 29.9 7.9 32.0C7.9 34.1 7.8 36.8 7.7 39.0C7.6 41.2 7.3 44.3 7.1 45.2C6.9 46.1 6.9 45.7 6.4 44.6C5.9 43.5 4.5 40.7 4.0 38.6C3.5 36.5 3.4 34.5 3.3 32.0C3.2 29.5 3.3 27.2 3.6 25.8Z"] }],
    trizeps: ['Trizeps', { h: ["M10.4 28.9C10.7 28.0 11.4 27.9 11.8 28.0C12.2 28.1 12.7 28.5 12.9 29.2C13.2 29.9 13.3 31.3 13.3 32.4C13.3 33.5 13.1 34.8 12.9 35.6C12.7 36.4 12.3 37.3 12.0 37.4C11.7 37.5 11.3 37.1 11.0 36.4C10.7 35.7 10.3 34.6 10.2 33.4C10.1 32.1 10.1 29.8 10.4 28.9Z"] }],
    lws: ['unterer Rücken', { h: ["M-1.8 38.4L1.8 38.4Q2.8 38.4 3.1 39.3L3.6 40.5Q3.9 41.4 3.6 42.3L3.4 42.9Q3.1 43.8 2.2 44.3L0.9 45.1Q0.0 45.6 -0.9 45.1L-2.2 44.3Q-3.1 43.8 -3.4 42.9L-3.6 42.3Q-3.9 41.4 -3.6 40.5L-3.1 39.3Q-2.8 38.4 -1.8 38.4Z"] }],
    gesaess: ['Gesäß', { h: ["M0.8 46.8C1.4 46.2 3.3 45.9 4.4 45.9C5.5 45.9 6.7 46.2 7.4 46.9C8.1 47.6 8.5 48.9 8.6 50.0C8.7 51.1 8.6 52.6 8.1 53.6C7.6 54.6 6.7 55.4 5.6 55.8C4.5 56.2 2.4 56.5 1.6 56.0C0.8 55.5 0.8 54.1 0.6 53.0C0.4 51.9 0.6 50.4 0.6 49.4C0.6 48.4 0.2 47.4 0.8 46.8Z"] }],
    hamstrings: ['Oberschenkelrückseite', { h: ["M2.03 59.2C2.2 57.8 2.9 57.6 3.8 57.3C4.7 57.0 6.5 56.9 7.4 57.3C8.3 57.6 8.9 58.0 9.06 59.4C9.22 60.8 8.86 63.3 8.51 65.6C8.26 68.4 7.82 71.8 7.35 73.4C6.98 74.6 6.28 75.0 5.59 75.0C4.89 75.0 4.19 74.6 3.83 73.4C3.26 71.6 2.65 68.4 2.41 66.0C2.44 63.6 1.88 60.7 2.03 59.2Z"] }],
    wade: ['Wade', { v: ["M3.41 81.6C3.47 80.8 4.80 80.7 4.98 81.4C5.16 82.4 5.10 85.0 5.03 87.6C4.95 89.6 4.91 91.6 4.79 92.8C4.74 93.4 4.53 93.4 4.44 92.8C4.15 91.2 3.76 88.6 3.58 86.4C3.40 84.4 3.35 82.4 3.41 81.6Z"], h: ["M5.80 80.6C7.13 80.6 8.04 81.6 8.12 83.6C8.16 85.6 7.72 87.6 7.22 89.6C6.77 91.2 6.48 93.0 6.05 93.6C5.91 93.8 5.63 93.8 5.50 93.6C5.08 93.0 4.82 91.2 4.48 89.6C3.99 87.6 3.58 85.6 3.63 83.6C3.66 81.6 4.46 80.6 5.80 80.6Z"] }],
    soleus: ['Achillessehne', { h: ["M5.83 94.4C6.03 94.4 6.09 94.8 6.08 95.4L6.09 100.6Q6.07 101.2 6.01 101.2Q5.95 101.2 5.85 100.6L5.57 95.4C5.57 94.8 5.63 94.4 5.83 94.4Z"] }]
  };
  /* Muskeln ohne eigene Gruppe (Unterarme, seitlicher Bauch) */
  const DECO = {"v": ["M-2.8 12.8C-1.6 13.8 1.6 13.8 2.8 12.8C3.0 14.0 3.0 15.4 3.2 16.4C2.4 17.0 1.2 17.4 0.0 17.4C-1.2 17.4 -2.4 17.0 -3.2 16.4C-3.0 15.4 -3.0 14.0 -2.8 12.6Z", "M12.1 39.6C12.2 38.9 13.0 38.6 13.4 38.5C13.8 38.4 14.3 38.6 14.7 39.2C15.0 39.8 15.3 40.9 15.5 42.0C15.7 43.1 16.0 44.5 16.0 45.6C16.0 46.7 15.8 48.2 15.6 48.6C15.4 49.0 15.1 48.3 14.8 47.8C14.5 47.3 14.0 46.3 13.6 45.4C13.2 44.5 12.8 43.6 12.5 42.6C12.2 41.6 11.9 40.3 12.1 39.6Z", "M6.1 31.8L6.1 31.8Q7.2 31.6 7.2 32.7L7.3 39.7Q7.3 40.8 6.4 41.4L5.9 41.6Q5.0 42.2 5.0 41.1L5.0 33.1Q5.0 32.0 6.1 31.8Z", "M6.0 43.5L6.5 43.1Q7.4 42.6 7.4 43.6L7.5 43.6Q7.5 44.6 7.1 45.5L5.4 48.7Q5.0 49.6 4.9 48.6L4.9 47.5Q4.8 46.5 4.9 45.5L5.0 45.0Q5.1 44.0 6.0 43.5Z"], "h": ["M12.1 39.6C12.2 38.9 13.0 38.6 13.4 38.5C13.8 38.4 14.3 38.6 14.7 39.2C15.0 39.8 15.3 40.9 15.5 42.0C15.7 43.1 16.0 44.5 16.0 45.6C16.0 46.7 15.8 48.2 15.6 48.6C15.4 49.0 15.1 48.3 14.8 47.8C14.5 47.3 14.0 46.3 13.6 45.4C13.2 44.5 12.8 43.6 12.5 42.6C12.2 41.6 11.9 40.3 12.1 39.6Z"]};
  const BODY = 'M0.0 2.6C0.9 2.6 1.9 2.7 2.6 3.0C3.3 3.3 3.7 3.8 4.0 4.5C4.3 5.2 4.5 6.1 4.5 7.0C4.5 7.9 4.5 8.9 4.3 9.8C4.1 10.7 3.8 11.5 3.6 12.2C3.4 12.9 3.2 13.3 3.2 13.9C3.2 14.5 3.2 15.2 3.3 15.8C3.4 16.4 3.4 16.8 3.9 17.2C4.3 17.6 5.2 18.0 6.0 18.3C6.8 18.6 7.8 18.9 8.6 19.2C9.4 19.5 10.1 19.7 10.7 20.1C11.3 20.5 11.7 21.0 12.1 21.6C12.5 22.2 12.7 22.9 12.9 23.7C13.1 24.5 13.3 25.5 13.4 26.5C13.5 27.5 13.5 28.4 13.6 29.5C13.7 30.6 13.8 31.8 14.0 33.0C14.2 34.2 14.5 35.3 14.8 36.6C15.1 37.9 15.5 39.4 15.8 41.0C16.1 42.6 16.5 44.4 16.8 46.0C17.1 47.6 17.2 49.2 17.4 50.5C17.5 51.8 17.5 52.8 17.7 53.8C17.9 54.8 18.2 55.5 18.3 56.4C18.4 57.3 18.45 58.5 18.26 59.4C18.07 60.3 17.68 61.3 17.33 61.9C16.98 62.5 16.58 62.7 16.28 62.8C15.98 62.9 15.61 62.8 15.45 62.4C15.29 62.0 15.27 61.0 15.12 60.4C14.97 59.8 14.71 59.2 14.65 58.7C14.49 58.2 14.4 57.7 14.4 57.2C14.4 56.7 14.8 56.4 14.9 55.8C15.0 55.2 15.0 54.7 14.9 53.8C14.8 52.9 14.5 51.6 14.3 50.4C14.1 49.2 13.8 47.9 13.5 46.4C13.2 44.9 12.8 43.0 12.4 41.6C12.1 40.2 11.7 39.2 11.4 38.0C11.1 36.8 10.7 35.7 10.4 34.4C10.1 33.1 9.8 31.7 9.6 30.4C9.4 29.1 9.1 27.5 9.0 26.6C8.9 25.8 8.9 25.3 8.8 25.3C8.8 25.3 8.7 25.9 8.7 26.6C8.7 27.3 8.6 28.4 8.6 29.5C8.6 30.6 8.6 32.2 8.5 33.5C8.4 34.8 8.3 36.2 8.2 37.5C8.1 38.8 7.9 40.3 7.9 41.5C7.9 42.7 7.8 43.5 8.0 44.5C8.2 45.5 8.6 46.5 8.9 47.6C9.2 48.7 9.5 49.8 9.7 51.0C9.9 52.2 10.0 53.6 10.1 55.0C10.2 56.4 10.2 58.0 10.14 59.5C10.09 61.0 9.94 62.4 9.79 64.0C9.64 65.6 9.39 67.4 9.25 69.0C9.11 70.6 8.79 72.2 8.75 73.5C8.63 74.8 8.70 75.3 8.76 76.5C8.83 77.7 9.07 79.2 9.13 80.5C9.20 81.8 9.27 83.1 9.16 84.5C9.04 85.9 8.92 87.5 8.72 89.0C8.49 90.5 8.10 92.2 7.84 93.5C7.60 94.8 7.32 96.0 7.18 97.0C7.11 98.0 7.21 98.7 7.38 99.6C7.55 100.5 7.90 101.5 8.05 102.4C8.16 103.3 8.28 104.1 8.22 104.8C8.17 105.5 8.00 106.2 7.77 106.6C7.54 107.0 7.13 107.2 6.72 107.3C6.32 107.4 5.68 107.4 5.33 107.3C4.98 107.2 4.75 107.0 4.63 106.4C4.52 105.9 4.51 104.9 4.51 104.0C4.51 103.1 4.55 102.0 4.47 101.0C4.40 100.0 4.28 99.2 4.13 98.0C4.05 96.8 3.84 95.5 3.60 94.0C3.42 92.5 3.13 90.7 2.98 89.0C2.88 87.3 2.85 85.5 2.82 84.0C2.77 82.5 2.74 81.3 2.61 80.0C2.49 78.7 2.36 77.3 2.23 76.0C2.11 74.7 2.07 73.5 1.94 72.0C1.80 70.5 1.65 68.7 1.50 67.0C1.35 65.3 1.19 63.4 1.04 62.0C0.90 60.6 0.75 59.4 0.52 58.6C0.3 57.8 0.2 57.3 0.0 57.3C-0.2 57.3 -0.3 57.8 -0.52 58.6C-0.75 59.4 -0.90 60.6 -1.04 62.0C-1.19 63.4 -1.35 65.3 -1.50 67.0C-1.65 68.7 -1.80 70.5 -1.94 72.0C-2.07 73.5 -2.11 74.7 -2.23 76.0C-2.36 77.3 -2.49 78.7 -2.61 80.0C-2.74 81.3 -2.77 82.5 -2.82 84.0C-2.85 85.5 -2.88 87.3 -2.98 89.0C-3.13 90.7 -3.42 92.5 -3.60 94.0C-3.84 95.5 -4.05 96.8 -4.13 98.0C-4.28 99.2 -4.40 100.0 -4.47 101.0C-4.55 102.0 -4.51 103.1 -4.51 104.0C-4.51 104.9 -4.52 105.9 -4.63 106.4C-4.75 107.0 -4.98 107.2 -5.33 107.3C-5.68 107.4 -6.32 107.4 -6.72 107.3C-7.13 107.2 -7.54 107.0 -7.77 106.6C-8.00 106.2 -8.17 105.5 -8.22 104.8C-8.28 104.1 -8.16 103.3 -8.05 102.4C-7.90 101.5 -7.55 100.5 -7.38 99.6C-7.21 98.7 -7.11 98.0 -7.18 97.0C-7.32 96.0 -7.60 94.8 -7.84 93.5C-8.10 92.2 -8.49 90.5 -8.72 89.0C-8.92 87.5 -9.04 85.9 -9.16 84.5C-9.27 83.1 -9.20 81.8 -9.13 80.5C-9.07 79.2 -8.83 77.7 -8.76 76.5C-8.70 75.3 -8.63 74.8 -8.75 73.5C-8.79 72.2 -9.11 70.6 -9.25 69.0C-9.39 67.4 -9.64 65.6 -9.79 64.0C-9.94 62.4 -10.09 61.0 -10.14 59.5C-10.2 58.0 -10.2 56.4 -10.1 55.0C-10.0 53.6 -9.9 52.2 -9.7 51.0C-9.5 49.8 -9.2 48.7 -8.9 47.6C-8.6 46.5 -8.2 45.5 -8.0 44.5C-7.8 43.5 -7.9 42.7 -7.9 41.5C-7.9 40.3 -8.1 38.8 -8.2 37.5C-8.3 36.2 -8.4 34.8 -8.5 33.5C-8.6 32.2 -8.6 30.6 -8.6 29.5C-8.6 28.4 -8.7 27.3 -8.7 26.6C-8.7 25.9 -8.8 25.3 -8.8 25.3C-8.9 25.3 -8.9 25.8 -9.0 26.6C-9.1 27.5 -9.4 29.1 -9.6 30.4C-9.8 31.7 -10.1 33.1 -10.4 34.4C-10.7 35.7 -11.1 36.8 -11.4 38.0C-11.7 39.2 -12.1 40.2 -12.4 41.6C-12.8 43.0 -13.2 44.9 -13.5 46.4C-13.8 47.9 -14.1 49.2 -14.3 50.4C-14.5 51.6 -14.8 52.9 -14.9 53.8C-15.0 54.7 -15.0 55.2 -14.9 55.8C-14.8 56.4 -14.4 56.7 -14.4 57.2C-14.4 57.7 -14.49 58.2 -14.65 58.7C-14.71 59.2 -14.97 59.8 -15.12 60.4C-15.27 61.0 -15.29 62.0 -15.45 62.4C-15.61 62.8 -15.98 62.9 -16.28 62.8C-16.58 62.7 -16.98 62.5 -17.33 61.9C-17.68 61.3 -18.07 60.3 -18.26 59.4C-18.45 58.5 -18.4 57.3 -18.3 56.4C-18.2 55.5 -17.9 54.8 -17.7 53.8C-17.5 52.8 -17.5 51.8 -17.4 50.5C-17.2 49.2 -17.1 47.6 -16.8 46.0C-16.5 44.4 -16.1 42.6 -15.8 41.0C-15.5 39.4 -15.1 37.9 -14.8 36.6C-14.5 35.3 -14.2 34.2 -14.0 33.0C-13.8 31.8 -13.7 30.6 -13.6 29.5C-13.5 28.4 -13.5 27.5 -13.4 26.5C-13.3 25.5 -13.1 24.5 -12.9 23.7C-12.7 22.9 -12.5 22.2 -12.1 21.6C-11.7 21.0 -11.3 20.5 -10.7 20.1C-10.1 19.7 -9.4 19.5 -8.6 19.2C-7.8 18.9 -6.8 18.6 -6.0 18.3C-5.2 18.0 -4.3 17.6 -3.9 17.2C-3.4 16.8 -3.4 16.4 -3.3 15.8C-3.2 15.2 -3.2 14.5 -3.2 13.9C-3.2 13.3 -3.4 12.9 -3.6 12.2C-3.8 11.5 -4.1 10.7 -4.3 9.8C-4.5 8.9 -4.5 7.9 -4.5 7.0C-4.5 6.1 -4.3 5.2 -4.0 4.5C-3.7 3.8 -3.3 3.3 -2.6 3.0C-1.9 2.7 -0.9 2.6 0.0 2.6Z';
  /* weiche Silhouette ohne Umriss; Proportionen nach sportlicher Vorlage */
  function figure(cx) {
    return `<g transform="translate(${cx} 0)"><path d="${BODY}" fill="var(--mm-body)"/></g>`;
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
