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
    { re: /^goblet/i, t: 'w', inc: 2,
      how: 'Hantel senkrecht vor der Brust halten, Füße etwas weiter als hüftbreit. Gesäß nach hinten unten sinken lassen, bis die Oberschenkel waagerecht sind. Über die ganze Fußsohle wieder hochdrücken.',
      cue: 'Brust bleibt oben, Knie zeigen Richtung Zehen.',
      A: P('61 13,60 21,60 46,63 59,61 72,69 72,60 59,58 72,65 72,67 33,63 27,64 34,61 27'),
      B: P('57 30,55 38,45 56,64 56,61 72,69 72,61 57,58 72,65 72,64 49,60 43,61 50,58 43'),
      props: ['khv'] },
    { re: /^rumänisch|kreuzheben/i, t: 'w', inc: 2,
      how: 'Hanteln vor den Oberschenkeln, Knie leicht gebeugt. Hüfte nach hinten schieben und die Hanteln nah an den Beinen bis knapp unter die Knie senken. Gesäß anspannen und aufrichten.',
      cue: 'Rücken gerade, die Bewegung kommt aus der Hüfte.',
      A: P(STAND), B: P('82 28,76 31,44 40,48 56,46 72,54 72,46 56,44 72,51 72,72 43,70 55,70 43,68 55'),
      props: ['kh2'] },
    { re: /^ausfallschritt/i, t: 'w', inc: 2,
      how: 'Aufrecht stehen, Hanteln seitlich. Ein Bein weit nach hinten setzen und das hintere Knie knapp über den Boden absenken. Über die vordere Ferse zurück in den Stand.',
      cue: 'Vorderes Knie bleibt über dem Fuß, Oberkörper aufrecht.',
      A: P(STAND), B: P('56 18,56 25,56 48,70 56,70 72,78 72,44 70,32 69,27 72,57 37,56 50,55 37,54 50'),
      props: ['kh2'] },
    { re: /^wadenheben/i, t: 'w', inc: 2,
      how: 'Auf einem Bein mit dem Vorfuß auf eine Stufe stellen, eine Hand an der Wand. Ferse langsam unter Stufenhöhe senken, dann so hoch wie möglich auf die Zehen drücken.',
      cue: 'Oben kurz halten, langsam absenken (3 Sekunden).',
      A: P('62 12,62 19,62 40,62 51,60 64,70 62,58 50,54 57,56 59,79 26,95 27,63 30,64 41'),
      B: P('62 7,62 14,62 35,62 46,63 56,70 62,58 45,54 52,56 54,79 22,95 26,63 25,64 36'),
      props: ['stufe', 'wand', 'khf'], hl: [['Kn', 'An']] },
    { re: /^unterarmstütz/i, t: 'time', inc: 5,
      how: 'Auf Unterarme und Zehenspitzen stützen, Ellbogen unter den Schultern. Der Körper bildet eine gerade Linie von Kopf bis Ferse.',
      cue: 'Bauch und Gesäß fest, die Hüfte hängt nicht durch.',
      A: P('20 50,27 53,66 59,85 62,102 66,104 72,85 62,101 66,103 72,28 72,42 72,30 72,44 72'),
      B: P('20 49,27 52,66 57,85 61,102 66,104 72,85 61,101 66,103 72,28 72,42 72,30 72,44 72'), dur: 4 },
    { re: /^seitstütz/i, t: 'time', inc: 5,
      how: 'Seitlich auf einen Unterarm stützen, Ellbogen unter der Schulter, Beine gestreckt übereinander. Hüfte anheben, bis der Körper eine Linie bildet.',
      cue: 'Hüfte hoch, nicht nach vorn kippen.',
      A: P('24 40,30 45,66 62,84 66,102 70,106 72,84 65,102 69,106 71,32 72,44 72,40 36,42 26'),
      B: P('24 38,30 43,66 54,84 60,102 68,106 72,84 59,102 67,106 71,32 72,44 72,40 34,42 24') },
    { re: /^bulgarian|split squat/i, t: 'w', inc: 2,
      how: 'Mit dem Rücken zu einer Bank, hinteren Fuß mit dem Spann darauf ablegen. Senkrecht nach unten sinken, bis der vordere Oberschenkel waagerecht ist, dann über die vordere Ferse hochdrücken.',
      cue: 'Etwa 70 % des Gewichts auf dem vorderen Bein.',
      A: P('54 12,54 19,54 42,44 56,40 72,48 72,64 58,80 52,86 50,55 30,54 44,53 30,52 44'),
      B: P('53 22,53 29,53 52,41 54,40 72,48 72,62 68,80 53,86 50,54 40,53 54,52 40,51 54'),
      props: ['bank', 'kh2'] },
    { re: /^hip thrust|glute bridge/i, t: 'w', inc: 2.5,
      how: 'Oberer Rücken an einer Bank, Füße hüftbreit aufgestellt, Gewicht auf der Hüfte. Hüfte nach oben drücken, bis Oberkörper und Oberschenkel eine Linie bilden. Oben das Gesäß fest anspannen.',
      cue: 'Kinn leicht zur Brust, nicht ins Hohlkreuz drücken.',
      A: P('20 36,26 41,46 58,66 50,70 72,78 72,64 50,68 72,76 72,36 52,44 56,34 52,42 56'),
      B: P('20 36,26 41,50 42,68 44,70 72,78 72,66 44,68 72,76 72,38 46,48 41,36 46,46 41'),
      props: ['bankl', 'scheibe'] },
    { re: /^step-?ups?/i, t: 'w', inc: 2,
      how: 'Einen Fuß komplett auf eine stabile Bank oder Stufe setzen. Über dieses Bein hochdrücken, bis du oben stehst, dann kontrolliert zurück. Das untere Bein hilft möglichst wenig.',
      cue: 'Druck über die Ferse des oberen Beins.',
      A: P('54 12,54 19,54 42,68 48,70 60,78 60,50 57,48 72,55 72,55 31,54 45,53 31,52 45'),
      B: P('72 10,72 17,72 38,73 49,72 60,80 60,70 49,70 60,77 60,73 27,72 40,71 27,70 40'),
      props: ['box', 'kh2'] },
    { re: /^einarmig|rudern/i, t: 'w', inc: 2,
      how: 'Eine Hand und ein Knie auf die Bank, Rücken gerade und waagerecht. Die Hantel mit dem freien Arm zur Hüfte ziehen, Ellbogen nah am Körper, dann langsam absenken.',
      cue: 'Schulterblatt zuerst nach hinten ziehen, nicht aufdrehen.',
      A: P('38 32,46 36,80 37,82 48,96 48,98 46,88 54,92 72,99 72,56 46,56 58,52 37,54 48'),
      B: P('38 32,46 36,80 37,82 48,96 48,98 46,88 54,92 72,99 72,66 30,60 41,52 37,54 48'),
      props: ['bankr', 'kh1'] },
    { re: /^liegestütz/i, t: 'bw', inc: 1,
      how: 'Hände etwas weiter als schulterbreit, Körper gerade. Brust kontrolliert bis knapp über den Boden senken und wieder hochdrücken. Zu schwer? Knie aufsetzen.',
      cue: 'Ellbogen etwa 45° vom Körper, Bauch fest.',
      A: P('20 44,27 48,66 57,85 61,102 66,104 72,85 61,101 66,103 72,28 60,28 72,30 60,30 72'),
      B: P('20 58,27 62,66 64,85 66,102 67,104 72,85 66,101 67,103 72,40 64,28 72,42 64,30 72') },
    { re: /^dead bug/i, t: 'bw', inc: 1,
      how: 'Auf dem Rücken liegen, Arme senkrecht nach oben, Hüfte und Knie 90° gebeugt. Gegengleich einen Arm nach hinten und das andere Bein nach vorn strecken, zurück, Seite wechseln.',
      cue: 'Der untere Rücken bleibt die ganze Zeit am Boden.',
      A: P('22 64,29 66,68 66,68 48,84 48,87 46,66 48,82 48,85 46,36 52,36 40,34 52,34 40'),
      B: P('22 64,29 66,68 66,86 62,104 62,107 60,66 48,82 48,85 46,36 52,36 40,22 56,12 60') },
    { re: /^hüftbeuger/i, t: 'stretch',
      how: 'Halber Kniestand, das hintere Knie auf einer weichen Unterlage. Gesäß der hinteren Seite anspannen und die Hüfte leicht nach vorn schieben, bis vorn an der Leiste ein Zug kommt. Die ganze Zeit halten, dann Bein wechseln.',
      cue: 'Nicht ins Hohlkreuz fallen, Becken aufrichten.',
      A: P('54 12,54 19,54 44,70 48,70 72,78 72,46 70,30 71,26 72,55 30,58 44,53 30,56 44'),
      B: P('56 13,56 20,58 46,72 50,70 72,78 72,48 70,30 71,26 72,57 31,60 45,55 31,58 45'),
      hl: [['P', 'Kf']] },
    { re: /^wade an der wand|^wade/i, t: 'stretch', sides: 2,
      how: 'Hände an die Wand, ein Bein weit nach hinten, Ferse am Boden. Zwei getrennte Abschnitte mit je voller Zeit: zuerst hinteres Knie gestreckt halten (Zug oben in der Wade), dann – ohne den Fuß zu versetzen – das hintere Knie beugen und erneut halten (Zug tiefer, Richtung Achillessehne). Danach Seite wechseln.',
      cue: 'Hintere Ferse bleibt am Boden, der Fuß zeigt nach vorn.',
      A: P('77 16,74 23,60 46,76 56,78 72,86 72,45 59,30 71,37 72,87 27,99 23,86 28,99 25'),
      B: P('76 17,73 24,61 49,77 58,78 72,86 72,48 64,31 71,38 72,86 28,99 24,85 29,99 26'),
      props: ['wand2'], hl: [['Kf', 'Af']], dur: 3.6 },
    { re: /^oberschenkelrückseite/i, t: 'stretch',
      how: 'Ein Bein gestreckt auf eine niedrige Erhöhung legen, Zehen zeigen nach oben. Mit geradem Rücken aus der Hüfte nach vorn neigen, bis hinten im Oberschenkel ein Zug kommt. Die ganze Zeit halten, dann Bein wechseln.',
      cue: 'Rücken lang lassen, nicht rund ziehen.',
      A: P('66 18,62 24,44 44,70 50,96 56,98 52,43 58,42 72,50 72,66 34,74 44,64 34,72 44'),
      B: P('76 30,70 33,43 45,70 50,96 56,98 52,43 58,42 72,50 72,76 44,84 50,74 44,82 50'),
      props: ['box2'], hl: [['P', 'Kn'], ['Kn', 'An']] },
    { re: /^taube/i, t: 'stretch',
      how: 'Aus dem Vierfüßlerstand ein Knie nach vorn zwischen die Hände bringen und den Unterschenkel schräg ablegen. Das andere Bein gestreckt nach hinten schieben. Oberkörper aufrecht oder nach vorn ablegen und die ganze Zeit halten, dann Seite wechseln.',
      cue: 'Hüfte gerade ausrichten, nicht zur Seite kippen.',
      A: P('40 32,40 38,44 64,58 66,46 70,40 70,78 68,104 70,110 72,36 50,34 71,38 50,36 71'),
      B: P('58 52,54 56,44 64,58 66,46 70,40 70,78 68,104 70,110 72,62 64,70 71,64 64,72 71'),
      hl: [['P', 'Kn']] },
    { re: /^offenes buch/i, t: 'rep',
      how: 'Seitlich liegen, Knie angewinkelt übereinander, Arme nach vorn gestreckt. Den oberen Arm in einem Bogen zur anderen Seite öffnen, mit dem Blick folgen, zurück – das ist eine Wiederholung. Alle Wiederholungen auf einer Seite, dann umdrehen.',
      cue: 'Beim Öffnen ausatmen, 2 Sekunden halten.',
      A: P('22 62,28 64,66 64,82 54,96 62,99 64,82 56,96 64,99 66,16 62,8 62,16 64,8 64'),
      B: P('22 60,28 64,66 64,82 54,96 62,99 64,82 56,96 64,99 66,30 50,44 56,16 64,8 64'),
      hl: [['N', 'En']] },
    { re: /^brustdehnung|türrahmen/i, t: 'stretch',
      how: 'Unterarm senkrecht an den Türrahmen legen, Ellbogen auf Schulterhöhe. Mit einem Schritt nach vorn den Oberkörper durch die Tür lehnen, bis vorn an der Brust ein Zug kommt. Die ganze Zeit halten, dann Arm wechseln.',
      cue: 'Schulter tief halten, nicht hochziehen.',
      A: P('58 16,57 22,58 48,62 60,66 72,73 72,52 60,48 72,55 72,40 28,40 12,62 32,64 44'),
      B: P('62 16,61 22,60 48,64 60,66 72,73 72,54 60,48 72,55 72,42 29,40 12,66 32,68 44'),
      props: ['tuer'], hl: [['N', 'En']] },
    { re: /^armkreisen/i, t: 'rep',
      how: 'Aufrecht stehen, Arme seitlich gestreckt. Große, langsame Kreise: die angegebene Anzahl vorwärts, danach dieselbe Anzahl rückwärts. Das lockert die Schultern fürs Schwimmen.',
      cue: 'Kreise groß und ruhig, Schultern locker lassen.',
      A: P('60 12,60 19,60 46,56 59,54 72,50 72,64 59,66 72,70 72,72 18,84 14,48 18,36 14'),
      B: P('60 12,60 19,60 46,56 59,54 72,50 72,64 59,66 72,70 72,74 26,86 32,46 26,34 32'),
      props: ['kreise'], dur: 2.2 },
    { re: /^katze/i, t: 'rep',
      how: 'Vierfüßlerstand, Hände unter den Schultern, Knie unter der Hüfte. Im Wechsel den Rücken langsam rund machen und den Kopf sinken lassen, dann den Rücken sanft durchhängen lassen und nach vorn schauen.',
      cue: 'Langsam und mit dem Atem, Bewegung Wirbel für Wirbel.',
      A: P('24 40,32 44,72 44,74 72,92 72,96 70,72 72,90 72,94 70,32 58,32 72,34 58,34 72,52 52'),
      B: P('28 52,32 46,72 46,74 72,92 72,96 70,72 72,90 72,94 70,32 59,32 72,34 59,34 72,52 32'),
      hl: [['N', 'P']], dur: 4.4 },
    { re: /^kindhaltung/i, t: 'stretch',
      how: 'Auf die Knie setzen, Gesäß Richtung Fersen und Oberkörper nach vorn ablegen. Arme lang nach vorn, Stirn Richtung Boden. Ruhig in den unteren Rücken atmen.',
      cue: 'Locker lassen, nicht ziehen, ruhig atmen.',
      A: P('34 62,40 62,70 60,64 70,84 71,88 70,64 70,84 71,88 70,26 66,14 70,28 66,16 70,55 54'),
      B: P('32 64,38 63,72 58,64 70,84 71,88 70,64 70,84 71,88 70,24 67,12 70,26 67,14 70,55 52'),
      hl: [['N', 'P']], dur: 5 },
    { re: /^vierfüßler/i, t: 'rep',
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

  window.UEBUNGEN = { LIB, lib, svg, animate };
})();
