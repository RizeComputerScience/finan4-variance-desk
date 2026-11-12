/* The Variance Desk: FINAN IV Unit 3 (planning the year). Config for lib/coursedev/desk-engine.
   Names swept for reuse 2026-11-03 (case_reuse.py): Tidewater Gulls, Odalys Brennan, both clean.
   Version 3 (2026-11-12), rebuilt to the Unit 9 pattern (design/ROLLOUT-BRIEF-2026-11-12.md; u03/TEACHING-MAP.md;
   process/standards/interactive-assignments.md rules 25 to 39):
   - The reading teaches; the desk has no walkthrough of its own (rule 32).
   - Four calculations, each as a faded step (worked example drawn as the SAME table, a different team, then the student's
     table with most lines given) and then the student's own (every line blank): a budget from drivers (bud1, bud2), a
     variance with favorable or unfavorable for revenue and for costs (var1, var2), the volume and price parts (split1,
     split2), and a cash budget (cash1, cash2). One light check, one exam-style check, the note.
   - Cut from the desk: the walkthrough, spending per fan (never taught, never tested), two of the three light checks.
   - Seeded answers never equal a reading answer or a worked-example answer (FORBID below; core_test checks it).
   The previous version is in v2-archive/. seedVersion 3 and version 3: progress and receipts from v2 do not carry over. */
(function (root) {
  'use strict';
  const QUIZ = [
    { title: 'Quick check: good news or bad news?',
      q: 'Which of these is a favorable variance?',
      options: ['Food costs came in $6,000 below budget', 'Ticket revenue came in $6,000 below budget', 'Food costs came in $6,000 above budget', 'None of them, because every gap from the budget is bad news'],
      answer: 0,
      why: ['Right. Spending less than planned is good news, so costs below budget are favorable. For revenue it runs the other way: below budget is unfavorable.',
        'Earning less than planned is bad news, so revenue below budget is unfavorable.',
        'Spending more than planned is bad news, so costs above budget are unfavorable.',
        'A gap can be good news. Costs below budget and revenue above budget are both favorable.'] },
    { title: 'Exam-style question',
      q: 'A team budgeted 4,000 tickets at $12 for one game. It sold 3,500 tickets at $13. What is the price part of the revenue variance?',
      options: ['$3,500 favorable', '$4,000 favorable', '$6,000 unfavorable', '$2,500 unfavorable'],
      answer: 0,
      why: ['Right. Price part = actual units × (actual price − budget price) = 3,500 × ($13 − $12) = $3,500, favorable because each ticket brought in more than planned. Exam questions look like this one.',
        '$4,000 multiplies the $1 price change by the 4,000 budgeted tickets. Use the 3,500 tickets actually sold.',
        '$6,000 unfavorable is the volume part: (3,500 − 4,000) × the $12 budget price. The question asks for the price part.',
        '$2,500 unfavorable is the whole variance, $45,500 − $48,000. The question asks for the price part only.'] },
  ];

  const STEPS = [
    { id: 'bud1', label: 'Ticket budget', kind: 'task' },
    { id: 'bud2', label: 'Food cost budget', kind: 'task' },
    { id: 'var1', label: 'Tickets against budget', kind: 'task' },
    { id: 'var2', label: 'Costs against budget', kind: 'task' },
    { id: 'q1', label: 'Quick check', kind: 'check', quiz: 0 },
    { id: 'split1', label: 'Fans or prices?', kind: 'task' },
    { id: 'split2', label: 'Cars or prices?', kind: 'task' },
    { id: 'cash1', label: 'Cash, January to March', kind: 'task' },
    { id: 'cash2', label: 'Cash, April to June', kind: 'task' },
    { id: 'q2', label: 'Exam-style question', kind: 'check', quiz: 1 },
    { id: 'note', label: 'Your note', kind: 'note' },
  ];
  const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June'];
  const CASH_IN = [40, 70, 110, 260, 330, 360], CASH_OUT = [130, 140, 230, 310, 290, 300];   // $ thousands, before scaling
  // Answers a student must never be able to copy: the reading's worked examples and the desk's own worked examples.
  const FORBID = [800000, 120000, 756000, -44000, -8000, -80000, 36000, 70000, 50000, 15000,
    100000, 1000000, 300000, 990000, -10000, 18000, -100000, 90000, 16000, -22000, -6000, 80000, 60000, 40000, 120000];
  const bad = (...xs) => xs.some((x) => FORBID.some((f) => Math.abs(x - f) < 0.5));

  function buildTasks(rng, h) {
    const T = [];
    for (let tries = 0; ; tries++) {
      T.length = 0;
      const G = h.pick(rng, [60, 70]), Cf = h.pick(rng, [3, 3.5, 4, 4.5, 5]); let Fb, Pb;
      do { Fb = h.between(rng, 3000, 5000, 500); Pb = h.between(rng, 11, 16, 1); } while (Fb === 4000 && Pb === 12);   // 4,000 at $12 is the exam-style question's budget
      const Y = G * Fb;
      // Actual crowd: per-game fans in hundreds, the price moving $1 against the crowd, with a readable gap (at least 2% of budget).
      const fewer = rng() < 0.5; let Fa, Pa;
      for (let k = 0; k < 60; k++) { Fa = h.round(Fb * (fewer ? 0.84 + 0.10 * rng() : 1.06 + 0.14 * rng()), 100); Pa = Pb + (fewer ? 1 : -1);
        if (Fa !== Fb && Math.abs(Fa * Pa - Fb * Pb) > 0.02 * Fb * Pb) break; }
      const X = G * Fa;
      // Food cost: actual spending per fan moves by 25 or 50 cents; the actual total is rounded to the thousand.
      let AC; for (let k = 0; k < 60; k++) { AC = h.round(X * (Cf + h.pick(rng, [-0.5, -0.25, 0.25, 0.5])), 1000); if (Math.abs(AC - Y * Cf) >= 0.02 * Y * Cf) break; }
      // Parking: more cars at a lower price, or fewer cars at a higher price; the two parts at least 15% apart in size.
      let Yp, Pp, Xp, Pp2, volP, priceP;
      for (let k = 0; k < 80; k++) { Yp = h.between(rng, 12000, 30000, 1000); Pp = h.pick(rng, [8, 10, 12, 15]); const more = rng() < 0.5;
        Xp = Yp + (more ? 1 : -1) * h.between(rng, 1000, 4000, 500); Pp2 = Pp + (more ? -1 : 1) * h.pick(rng, [1, 2]);
        volP = (Xp - Yp) * Pp; priceP = Xp * (Pp2 - Pp);
        if (Math.abs(Math.abs(volP) - Math.abs(priceP)) >= 0.15 * Math.max(Math.abs(volP), Math.abs(priceP))) break; }
      // Cash: a ballpark spends all spring before the crowds arrive, so the low month is March or April.
      const k = h.pick(rng, [0.9, 1, 1.1, 1.2]), S0 = h.between(rng, 500, 600, 50) * 1000, aprShift = h.pick(rng, [-40, 0, 40, 80]);
      const cin = CASH_IN.map((x, i) => Math.round((x + (i === 3 ? aprShift : 0)) * k) * 1000), cout = CASH_OUT.map((x) => Math.round(x * k) * 1000);
      const end = []; let b = S0; for (let i = 0; i < 6; i++) { b += cin[i] - cout[i]; end.push(b); }
      const low = end.indexOf(Math.min(...end));
      const vol = (X - Y) * Pb, price = X * (Pa - Pb), tv = X * Pa - Y * Pb;
      T.push({ id: 'bud1', G, Fb, Pb, Y, answer: Y * Pb });
      T.push({ id: 'bud2', G, Fb, Cf, Pb, Y, answer: Y * Cf });
      T.push({ id: 'var1', Y, Pb, X, Pa, answer: tv, decision: tv > 0 ? 'fav' : 'unfav' });
      T.push({ id: 'var2', Y, Cf, AC, answer: AC - Y * Cf, decision: AC < Y * Cf ? 'fav' : 'unfav' });
      T.push({ id: 'split1', Y, Pb, X, Pa, vol, price, answer: tv });
      T.push({ id: 'split2', Yp, Pp, Xp, Pp2, vol: volP, price: priceP, answer: volP + priceP, decision: Math.abs(volP) > Math.abs(priceP) ? 'vol' : 'price' });
      T.push({ id: 'cash1', S0, cin, cout, end, answer: end[2] });
      T.push({ id: 'cash2', S0, cin, cout, end, answer: end[5], decision: String(low) });
      const all = [Y * Pb, Y * Cf, X * Pa, tv, AC - Y * Cf, vol, price, volP, priceP, volP + priceP].concat(end);
      if (!bad(...all) || tries > 200) break;
    }
    return T;
  }

  const m = (x, dp) => root.DeskEngine.h.money(x, dp);
  const n0 = (x) => Math.round(x).toLocaleString('en-US');
  const pr = (x) => (Number.isInteger(x) ? m(x) : m(x, 2));   // per-fan costs: $3.50
  const thou = (v) => (isFinite(v) && Math.abs(v) < 5000 ? v * 1000 : v);   // the cash budget also takes 410 for $410,000 (no balance is under $56,000)

  // Lines for each task. The worked example uses the same function on other numbers, so the two tables always match.
  // count: true marks a number of fans or cars (judged as a number, shown with commas wherever it is not an input).
  const LINES = {
    bud: (G, F, rate, rateWord, rowLabel, faded) => [
      { label: 'Fans in the season', calc: `${G} games × ${n0(F)} fans`, value: G * F, fmt: 'num', count: true, input: !faded },
      { label: rowLabel, calc: `${n0(G * F)} fans × ${pr(rate)}`, help: `${n0(G * F)} × ${pr(rate)}`, value: G * F * rate, input: true, word: rateWord }],
    var1: (Y, Pb, X, Pa) => [
      { label: 'Budget ticket revenue', calc: `${n0(Y)} fans × ${pr(Pb)}`, value: Y * Pb },
      { label: 'Actual ticket revenue', calc: `${n0(X)} fans × ${pr(Pa)}`, value: X * Pa, input: true },
      { label: 'Ticket revenue variance', calc: 'actual − budget', help: `${m(X * Pa)} − ${m(Y * Pb)}`, value: X * Pa - Y * Pb, input: true, signed: true }],
    var2: (Y, Cf, AC) => [
      { label: 'Budget food cost', calc: `${n0(Y)} fans × ${pr(Cf)}`, value: Y * Cf, input: true },
      { label: 'Food cost variance', calc: `${m(AC)} − budget food cost`, help: `${m(AC)} − ${m(Y * Cf)}`, value: AC - Y * Cf, input: true, signed: true }],
    split: (Y, Pb, X, Pa, unit, faded) => [
      { label: 'Volume part', calc: `(${n0(X)} − ${n0(Y)}) × ${pr(Pb)}`, value: (X - Y) * Pb, input: !faded, signed: true },
      { label: 'Price part', calc: `${n0(X)} × (${pr(Pa)} − ${pr(Pb)})`, value: X * (Pa - Pb), input: true, signed: true },
      { label: 'Total variance', calc: 'volume part + price part', help: `${m((X - Y) * Pb)} + ${m(X * (Pa - Pb))}`, value: X * Pa - Y * Pb, input: true, signed: true }],
    cash: (start, cin, cout, first, faded) => {
      const out = []; let b = start;
      for (let i = 0; i < 3; i++) { const s = b; b += cin[i] - cout[i];
        const startName = (first === 0 && i === 0) || (faded && i < 2) ? m(s) : `end of ${MONTHS[first + i - 1]}`;
        out.push({ label: `End of ${MONTHS[first + i]}`, calc: `${startName} + ${m(cin[i])} − ${m(cout[i])}`, help: `${m(s)} + ${m(cin[i])} − ${m(cout[i])}`,
          value: b, input: !(faded && i < 2), cash: true, mi: first + i }); }
      return out; },
  };
  // Show counts with commas wherever they are not an input (the engine's 'num' format has no thousands separator).
  const shown = (lines, filled) => lines.map((l) => (l.count && (filled || !l.input) ? Object.assign({}, l, { fmt: 'text', value: n0(l.value) }) : l));

  // Built on first use: config.js loads before the engine, so money() is not available at load time.
  const EXAMPLES = () => ({
    bud1: { cap: 'Another team plays 50 home games and expects 2,000 fans a game at $10 a ticket.', lines: LINES.bud(50, 2000, 10, 'price', 'Ticket revenue', true) },
    bud2: { cap: 'The same team budgets $3 of food and supplies for each fan.', lines: LINES.bud(50, 2000, 3, 'cost', 'Food cost', false) },
    var1: { cap: 'Another team budgeted 100,000 fans at $10. 90,000 came, and tickets averaged $11.', lines: LINES.var1(100000, 10, 90000, 11),
      after: 'Revenue came in below budget, so the variance is unfavorable.' },
    var2: { cap: 'The same team budgeted $3 of food for each of 100,000 fans. Food actually cost $318,000.', lines: LINES.var2(100000, 3, 318000),
      after: 'Costs came in above budget, so the variance is unfavorable.' },
    split1: { cap: 'Another team budgeted 100,000 fans at $10. 90,000 came at $11.', lines: LINES.split(100000, 10, 90000, 11, 'fans', true) },
    split2: { cap: 'Another team budgeted 20,000 cars at $8. It parked 22,000 cars at $7.', lines: LINES.split(20000, 8, 22000, 7, 'cars', false),
      after: 'The price part is bigger, so the lower price cost more than the extra cars brought in.' },
    cash1: { cap: 'Another team starts January with $100,000.', lines: LINES.cash(100000, [30000, 40000, 50000], [50000, 60000, 70000], 0, false) },
    cash2: { cap: 'The same team ends March with $40,000.', lines: LINES.cash(40000, [90000, 120000, 130000], [80000, 90000, 90000], 3, false),
      after: 'Its lowest month-end balance of the six is March, at $40,000.' },
  });

  function linesFor(t) {
    if (t.id === 'bud1') return LINES.bud(t.G, t.Fb, t.Pb, 'price', 'Ticket revenue', true);
    if (t.id === 'bud2') return LINES.bud(t.G, t.Fb, t.Cf, 'cost', 'Food cost', false);
    if (t.id === 'var1') return LINES.var1(t.Y, t.Pb, t.X, t.Pa);
    if (t.id === 'var2') return LINES.var2(t.Y, t.Cf, t.AC);
    if (t.id === 'split1') return LINES.split(t.Y, t.Pb, t.X, t.Pa, 'fans', true);
    if (t.id === 'split2') return LINES.split(t.Yp, t.Pp, t.Xp, t.Pp2, 'cars', false);
    if (t.id === 'cash1') return LINES.cash(t.S0, t.cin.slice(0, 3), t.cout.slice(0, 3), 0, true);
    if (t.id === 'cash2') return LINES.cash(t.end[2], t.cin.slice(3), t.cout.slice(3), 3, false);
  }

  const FU = [['fav', 'Favorable'], ['unfav', 'Unfavorable']];
  const PROBLEM = {
    bud1: (t) => ({ title: 'The ticket budget', place: 'Odalys starts every season plan with tickets.',
      body: `<p>The Gulls play <b>${t.G} home games</b>. Odalys expects <b>${n0(t.Fb)} fans</b> a game at <b>${pr(t.Pb)}</b> a ticket. What ticket revenue should the budget show? The first line is done for you.</p>` }),
    bud2: (t) => ({ title: 'The food cost budget', place: 'Every hot dog sold costs the team food and supplies.',
      body: `<p>Odalys budgets <b>${pr(t.Cf)}</b> of food and supplies for each fan, with the same <b>${n0(t.Fb)} fans</b> a game over <b>${t.G} games</b>. What food cost should the budget show?</p>` }),
    var1: (t) => ({ title: 'Tickets against the budget', place: 'The season is over, and Odalys pulls the actual numbers.',
      body: `<p>The budget planned <b>${n0(t.Y)} fans</b> at <b>${pr(t.Pb)}</b>. In the end <b>${n0(t.X)} fans</b> came, and tickets averaged <b>${pr(t.Pa)}</b>. Was ticket revenue above or below the budget? The budget line is done for you.</p>`,
      choice: { legend: 'Is the ticket revenue variance favorable or unfavorable?', options: FU } }),
    var2: (t) => ({ title: 'Food costs against the budget', place: 'Odalys turns from revenue to costs.',
      body: `<p>Food and supplies cost the Gulls <b>${m(t.AC)}</b> this season. The budget planned <b>${pr(t.Cf)}</b> a fan for <b>${n0(t.Y)} fans</b>. Was food cost above or below the budget?</p>`,
      choice: { legend: 'Is the food cost variance favorable or unfavorable?', options: FU } }),
    split1: (t) => ({ title: 'Fans or prices?', place: 'The owner asks whether the ticket gap came from the crowd or the price.',
      body: `<p>Split the ticket variance into its two parts. The budget planned <b>${n0(t.Y)} fans</b> at <b>${pr(t.Pb)}</b>, and <b>${n0(t.X)} fans</b> came at <b>${pr(t.Pa)}</b>. The volume part is done for you.</p>` }),
    split2: (t) => ({ title: 'Cars or prices?', place: 'The Gulls also sell parking.',
      body: `<p>The budget planned <b>${n0(t.Yp)} cars</b> at <b>${pr(t.Pp)}</b>. The season parked <b>${n0(t.Xp)} cars</b> at <b>${pr(t.Pp2)}</b>. Split the parking variance into its two parts.</p>`,
      choice: { legend: 'Which part moved parking revenue more?', options: [['vol', 'The number of cars (the volume part)'], ['price', 'The price (the price part)']] } }),
    cash1: (t) => ({ title: 'Cash before the gates open', place: 'Odalys needs to know the team can pay its bills before the season starts.',
      body: `<p>The Gulls pay staff and repair crews all spring, before the crowds bring cash in. They start January with <b>${m(t.S0)}</b>. How much cash is left at the end of March? Two months are done for you.</p>` }),
    cash2: (t) => ({ title: 'Cash into the season', place: 'Odalys carries the plan from April to June.',
      body: '<p>Each month starts with the cash the month before ended with, so April starts with your end of March. Fill in April to June, then find the lowest month of all six.</p>',
      choice: { legend: 'Which month, January to June, ends with the least cash?', options: MONTHS.map((mo, i) => [String(i), mo]) } }),
  };

  function taskView(t, L, h) {
    const P = PROBLEM[t.id](t), E = EXAMPLES()[t.id], lines = linesFor(t);
    const example = h.ladder(shown(E.lines, true), { filled: true, caption: E.cap }) + (E.after ? `<p>${E.after}</p>` : '');
    const table = h.ladder(shown(lines, false), { rows: L.rows, caption: 'Your turn' })
      + (lines.some((l) => l.input && l.signed) ? '<p class="small">Start a negative amount with a minus sign.</p>' : '');
    const parts = [{ html: '', field: 'table' }];
    if (P.choice) parts.push({ html: '', field: 'choice' });
    return { title: P.title, place: P.place, body: P.body, example, table, parts, choice: P.choice,
      helpLabels: ['Show me the first blank', 'Show me every line'] };
  }

  const sgn = (x) => (x > 0 ? '+' : '') + m(x);
  // Common slips, per line, phrased with the student's own numbers.
  function diagFor(t, l) {
    const D = [];
    if (l.label === 'Fans in the season') D.push([t.Fb, 'pergame', `That is one game’s crowd. Multiply by all ${t.G} games: ${t.G} × ${n0(t.Fb)}.`]);
    if (/^bud/.test(t.id) && l.label !== 'Fans in the season') { const rate = t.id === 'bud1' ? t.Pb : t.Cf;
      D.push([t.Fb * rate, 'onegame', `That is one game. Use every fan in the season: ${n0(t.Y)} × ${pr(rate)}.`],
        [t.Y, 'norate', `That is the number of fans. Multiply it by the ${pr(rate)} ${t.id === 'bud1' ? 'ticket price' : 'food cost a fan'}.`]);
      if (t.id === 'bud2') D.push([t.Y * t.Pb, 'tickets', `That uses a ticket price. Food cost uses the ${pr(t.Cf)} budgeted for each fan.`]); }
    if (l.label === 'Actual ticket revenue') D.push([t.Y * t.Pa, 'budfans', `Use the ${n0(t.X)} fans who actually came, not the ${n0(t.Y)} budgeted.`],
      [t.X * t.Pb, 'budprice', `Use the actual price, ${pr(t.Pa)}, not the budget price.`], [t.Y * t.Pb, 'budget', `That is the budget. Actual = ${n0(t.X)} × ${pr(t.Pa)}.`]);
    if (l.label === 'Ticket revenue variance') { const a = t.X * t.Pa, b = t.Y * t.Pb;
      D.push([a, 'actual', `That is actual revenue. Subtract the budget: ${m(a)} − ${m(b)}.`], [b, 'budget', `That is the budget. Variance = actual − budget = ${m(a)} − ${m(b)}.`]); }
    if (l.label === 'Budget food cost') D.push([t.X * t.Cf, 'actfans', `The budget uses the ${n0(t.Y)} budgeted fans, not the actual crowd.`], [t.AC, 'actual', `That is what food actually cost. The budget is ${n0(t.Y)} × ${pr(t.Cf)}.`]);
    if (l.label === 'Food cost variance') D.push([t.AC, 'actual', `That is the actual cost. Subtract the budget: ${m(t.AC)} − ${m(t.Y * t.Cf)}.`], [t.Y * t.Cf, 'budget', `That is the budget. Variance = actual − budget = ${m(t.AC)} − ${m(t.Y * t.Cf)}.`]);
    if (/^split/.test(t.id)) { const Y = t.Y || t.Yp, X = t.X || t.Xp, Pb = t.Pb || t.Pp, Pa = t.Pa || t.Pp2, u = t.id === 'split1' ? 'fans' : 'cars';
      if (l.label === 'Volume part') D.push([(X - Y) * Pa, 'actprice', `Price the change in ${u} at the budget price, ${pr(Pb)}, not the actual ${pr(Pa)}.`], [t.price, 'swapped', `That is the price part. Volume part = (${n0(X)} − ${n0(Y)}) × ${pr(Pb)}.`]);
      if (l.label === 'Price part') D.push([Y * (Pa - Pb), 'budunits', `Use the ${n0(X)} ${u === 'fans' ? 'fans who actually came' : 'cars actually parked'}, not the ${n0(Y)} budgeted.`], [t.vol, 'swapped', `That is the volume part. Price part = ${n0(X)} × (${pr(Pa)} − ${pr(Pb)}).`]);
      if (l.label === 'Total variance') D.push([t.vol - t.price, 'minus', `Add the two parts: ${m(t.vol)} + ${m(t.price)}.`], [Math.abs(t.vol) + Math.abs(t.price), 'abs', `One part is negative. Add them with their signs: ${m(t.vol)} + ${m(t.price)}.`]); }
    if (l.cash) { const i = l.mi, s = i === 0 ? t.S0 : t.end[i - 1];
      D.push([t.cin[i] - t.cout[i], 'nostart', `That is ${MONTHS[i]}’s cash in minus cash out. Add the ${m(s)} the month started with: ${m(s)} + ${m(t.cin[i])} − ${m(t.cout[i])}.`],
        [s - t.cin[i] + t.cout[i], 'flipped', `Cash in adds to the balance and cash out takes away: ${m(s)} + ${m(t.cin[i])} − ${m(t.cout[i])}.`]); }
    return D;
  }

  const plain = (s) => String(s).replace(/<[^>]+>/g, '');
  function judgeTask(t, e, h) {
    const lines = linesFor(t), rows = e.rows || [], rowRes = [];
    lines.forEach((l, i) => {
      if (!l.input) return;
      let v = h.parseMoney(rows[i]); if (l.cash) v = thou(v);
      const how = l.help || plain(l.calc);
      const opts = { scale: Math.max(Math.abs(l.value), 1000), otherMsg: `${how}.`,
        signMsg: `The size is right but the sign is flipped. ${how} is ${l.value < 0 ? 'negative' : 'positive'}.`, closeMsg: `Close. Check the arithmetic: ${how}.` };
      if (l.count) Object.assign(opts, { tol: 0.5, unreadable: 'Type the number of fans, like 240,000.' });
      rowRes[i] = h.judgeNumber(v, l.value, diagFor(t, l), opts);
    });
    const badRow = rowRes.findIndex((x) => x && !x.ok);
    if (badRow >= 0) return { ok: false, rowRes, msg: `${lines[badRow].label}: ${rowRes[badRow].msg}` };
    if (t.decision && e.choice !== t.decision) {
      if (!e.choice) return { ok: false, rowRes, msg: 'Now answer the question under the table.' };
      let msg;
      if (t.id === 'var1') msg = `Your variance is ${sgn(t.answer)}, so revenue came in ${t.answer < 0 ? 'below' : 'above'} the budget. For revenue, above budget is favorable and below budget is unfavorable.`;
      if (t.id === 'var2') msg = `Your variance is ${sgn(t.answer)}, so food cost came in ${t.answer < 0 ? 'below' : 'above'} the budget. For costs, above budget is unfavorable and below budget is favorable.`;
      if (t.id === 'split2') msg = `Compare the sizes, ignoring the signs: the volume part is ${m(Math.abs(t.vol))} and the price part is ${m(Math.abs(t.price))}. Which is bigger?`;
      if (t.id === 'cash2') msg = 'Compare all six month-end balances: January to March from the step before, and April to June here. Which is smallest?';
      return { ok: false, rowRes, msg };
    }
    return { ok: true, rowRes };
  }

  function helpText(t, lvl) {
    const lines = linesFor(t), blanks = lines.filter((l) => l.input);
    const say = (l) => `${l.label}: ${l.help || l.calc} = ${l.count ? n0(l.value) : m(l.value)}`;
    if (lvl === 1) return say(blanks[0]);
    let s = lines.map(say).join('<br>');
    if (t.id === 'cash2') s += `<br>Lowest month: ${MONTHS[Number(t.decision)]}, at ${m(t.end[Number(t.decision)])}.`;
    return s;
  }
  function praise(t) {
    if (t.id === 'bud1') return `The budget plans on ${m(t.answer)} of ticket revenue from ${n0(t.Y)} fans.`;
    if (t.id === 'bud2') return `Food and supplies should cost ${m(t.answer)}. If the crowd or the cost per fan changes, Odalys will see which one moved.`;
    if (t.id === 'var1') return `Ticket revenue came in ${m(Math.abs(t.answer))} ${t.answer < 0 ? 'below' : 'above'} the budget, ${t.decision === 'fav' ? 'a favorable' : 'an unfavorable'} variance.`;
    if (t.id === 'var2') return `Food cost came in ${m(Math.abs(t.answer))} ${t.answer < 0 ? 'below' : 'above'} the budget. For a cost, that is ${t.decision === 'fav' ? 'favorable' : 'unfavorable'}.`;
    if (t.id === 'split1') return `${t.vol < 0 ? 'Fewer' : 'More'} fans moved ticket revenue by ${sgn(t.vol)}, and the ${t.price > 0 ? 'higher' : 'lower'} price moved it by ${sgn(t.price)}. Together they make the ${sgn(t.answer)} you found for tickets against the budget.`;
    if (t.id === 'split2') return `The ${t.decision === 'vol' ? 'number of cars' : 'price'} moved parking revenue more: ${sgn(t.vol)} from cars and ${sgn(t.price)} from price.`;
    if (t.id === 'cash1') return `The Gulls end March with ${m(t.answer)}, down from ${m(t.S0)} in January.`;
    if (t.id === 'cash2') return `Cash bottoms out at ${m(t.end[Number(t.decision)])} in ${MONTHS[Number(t.decision)]}. That is the month Odalys needs a cushion for, so she can arrange a loan in advance.`;
  }
  function selfAnswer(t) {
    const rows = []; linesFor(t).forEach((l, i) => { if (l.input) rows[i] = String(Math.round(l.value)); });
    return { rows, choice: t.decision || null };
  }
  function selfWrong(t) {
    const rows = []; linesFor(t).forEach((l, i) => { if (l.input) rows[i] = String(Math.round(l.value * 1.3 + 7)); });
    return { rows, choice: t.decision || null };
  }

  root.DESK = {
    app: 'finan4-u3-variance-desk', version: 3, seedVersion: 3, salt: 'rize-finan4-u3-variance:c41e07', points: 20,
    storageKey: 'rize-finan4-u3-variance-v3', filePrefix: 'VarianceDesk',
    verifyUrl: 'https://rizecomputerscience.github.io/finan4-variance-desk/verify.html',
    calcPlaceholder: '60*4000*12',
    story: { title: 'The Variance Desk', kicker: 'Corporate Finance, Unit 3', company: 'Tidewater Gulls', team: 'Front Office',
      from: 'Odalys Brennan', fromTitle: 'finance director, Tidewater Gulls',
      dek: 'The Tidewater Gulls, a minor-league baseball team, must decide what to change for next season: ticket prices, or how they bring fans in. Odalys Brennan, the finance director, plans each season in numbers and explains to the owner where it came out differently. You work through this season with her, from the budget to the cash the team needs before the gates open.',
      whatBox: '',
      stepsLine: 'Eleven short steps. Each shows a worked example in the same table you fill in, then you do the same calculation with your own numbers.' },
    steps: STEPS, quiz: QUIZ, walk: null, buildTasks, taskView, judgeTask, helpText, praise, selfAnswer, selfWrong,
    note: { title: 'A note for the owner', label: 'Your note to Odalys', minWords: 30, receiptHeading: 'Note to the finance director',
      prompt: 'The owner wants one paragraph before next season’s planning meeting. Was this season’s ticket gap mostly about the crowd or about the price, and what should next season’s plan change because of it?' },
  };
})(typeof window !== 'undefined' ? window : globalThis);
