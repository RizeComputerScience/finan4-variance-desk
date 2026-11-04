/* The Variance Desk: FINAN IV Unit 3 (planning the year: budgets, variances, a cash budget). Config for lib/coursedev/desk-engine.
   Names swept for reuse 2026-11-03 (case_reuse.py): Tidewater Gulls, Odalys Brennan, both clean. */
(function (root) {
  'use strict';
  const QUIZ = [
    { title: 'Quick win: what a budget is for',
      q: 'Odalys builds the Gulls’ budget before the season starts. What is it mainly for?',
      options: ['A plan to compare the real season against, so surprises show up early', 'A filing the league requires each year', 'A record of last season’s results', 'A promise of how many fans will come'],
      answer: 0,
      why: ['Right. A budget is the plan written in numbers. Comparing the actual results against it each month shows where the season is going differently, while there is still time to act.',
        'Some leagues ask for reports, but that is not why a team budgets. A budget is the team’s own plan, used to spot surprises early.',
        'Last season’s results are history. A budget looks forward: it says what the team expects this season to bring.',
        'Nobody can promise attendance. A budget is a best estimate, and its value is in comparing the real season against it.'] },
    { title: 'Quick win: favorable or unfavorable',
      q: 'Ticket revenue came in $20,000 above budget. What do analysts call that in a variance report?',
      options: ['A favorable variance', 'An unfavorable variance', 'A budget deficit', 'A rounding error'],
      answer: 0,
      why: ['Right. Revenue above budget is favorable. For costs it runs the other way: spending more than budgeted is unfavorable.',
        'An unfavorable variance means results were worse than planned. Earning more revenue than planned is better than planned, so it is favorable.',
        'A deficit means spending more than you take in. This is revenue coming in above the plan, which is a favorable variance.',
        'A $20,000 gap is a real difference between the plan and the season, and explaining it is the analyst’s job.'] },
    { title: 'Quick win: reading the split',
      q: 'Fewer fans came than the budget planned, but each one paid a higher ticket price than planned. Which part of the variance is negative?',
      options: ['The attendance part, from fewer fans', 'The price part, from higher prices', 'Both parts', 'Neither part'],
      answer: 0,
      why: ['Right. Fewer fans than planned pulls revenue down, so the attendance part is negative. The higher price pushes revenue up, so the price part is positive.',
        'A higher price than planned brings in more per ticket, so the price part is positive. The fewer fans are what pull revenue down.',
        'The two parts move in opposite directions here: fewer fans lowers revenue, and a higher price raises it.',
        'Fewer fans than planned does lower revenue, so the attendance part is negative.'] },
    { title: 'Exam-style question',
      q: 'A team budgeted 4,000 fans at $12 a ticket for one game. It sold 3,500 tickets at $13. What is the price variance?',
      options: ['$3,500 favorable', '$4,000 favorable', '$6,000 unfavorable', '$2,500 unfavorable'],
      answer: 0,
      why: ['Right. Price variance = actual tickets × (actual price − budget price) = 3,500 × $1 = $3,500, and it is favorable because each ticket brought in more than planned. Questions on the exams look like this one.',
        '$4,000 multiplies the $1 price difference by the budgeted 4,000 fans. Use the tickets actually sold, 3,500.',
        '$6,000 unfavorable is the attendance part: 500 fewer fans × the budgeted $12. The question asks for the price part.',
        '$2,500 unfavorable is the total variance: $45,500 actual − $48,000 budget. The question asks for the price part only.'] },
  ];

  const STEPS = [
    { id: 'walk', label: 'Worked example', kind: 'walk' },
    { id: 'q1', label: 'Check 1', kind: 'check', quiz: 0 },
    { id: 't1', label: 'Ticket budget', kind: 'task' },
    { id: 't2', label: 'Concessions budget', kind: 'task' },
    { id: 'q2', label: 'Check 2', kind: 'check', quiz: 1 },
    { id: 't3', label: 'Actual against budget', kind: 'task' },
    { id: 't4', label: 'Fans or prices?', kind: 'task' },
    { id: 'q3', label: 'Check 3', kind: 'check', quiz: 2 },
    { id: 't5', label: 'Spending per fan', kind: 'task' },
    { id: 't6', label: 'Cash budget', kind: 'task' },
    { id: 'q4', label: 'Exam-style question', kind: 'check', quiz: 3 },
    { id: 'note', label: 'Your note', kind: 'note' },
  ];
  const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June'];
  const CASH_IN = [40, 70, 110, 260, 330, 360], CASH_OUT = [130, 140, 230, 310, 290, 300];   // $ thousands, before scaling

  function buildTasks(rng, h) {
    const T = [];
    const G = h.pick(rng, [66, 68, 70]), Fb = h.between(rng, 3200, 5000, 100), Pb = h.between(rng, 11, 16, 0.5), Cb = h.between(rng, 9, 13, 0.5);
    T.push({ id: 't1', G, Fb, Pb, answer: G * Fb * Pb });
    T.push({ id: 't2', G, Fb, Cb, answer: G * Fb * Cb });
    const fewer = rng() < 0.5; let Fa, Pa;
    for (let tries = 0; tries < 30; tries++) {   // keep drawing until the two effects leave a readable gap (at least 2% of budget)
      Fa = h.round(Fb * (fewer ? 0.84 + 0.10 * rng() : 1.04 + 0.08 * rng()), 50); Pa = Pb + (fewer ? 1 : -1) * h.pick(rng, [0.5, 1]);
      if (Math.abs(Fa * Pa - Fb * Pb) > 0.02 * Fb * Pb) break; }
    T.push({ id: 't3', G, Fb, Pb, Fa, Pa, answer: G * Fa * Pa - G * Fb * Pb, decision: G * Fa * Pa >= G * Fb * Pb ? 'fav' : 'unfav' });
    T.push({ id: 't4', G, Fb, Pb, Fa, Pa, vol: (Fa - Fb) * G * Pb, price: G * Fa * (Pa - Pb) });
    const Ca = Cb + (rng() < 0.6 ? 1 : -1) * h.pick(rng, [0.5, 0.75, 1, 1.25]);
    const CA = h.round(G * Fa * Ca, 1);
    T.push({ id: 't5', G, Fa, Cb, CA, answer: CA / (G * Fa), decision: CA / (G * Fa) > Cb ? 'more' : 'less' });
    const k = h.pick(rng, [0.9, 1, 1.1, 1.2]), S0 = h.between(rng, 480, 600, 10) * 1000, aprShift = h.pick(rng, [-40, 0, 40, 80]);
    const cin = CASH_IN.map((x, i) => Math.round((x + (i === 3 ? aprShift : 0)) * k) * 1000), cout = CASH_OUT.map((x) => Math.round(x * k) * 1000);
    const end = []; let b = S0; for (let i = 0; i < 6; i++) { b += cin[i] - cout[i]; end.push(b); }
    const low = end.indexOf(Math.min(...end));
    T.push({ id: 't6', S0, cin, cout, end, answer: end[5], decision: String(low) });
    return T;
  }

  const m = (x, dp) => root.DeskEngine.h.money(x, dp);
  const sgn = (x) => (x >= 0 ? '+' : '−') + m(Math.abs(x));
  const n0 = (x) => Math.round(x).toLocaleString('en-US');

  function taskView(t, L, h) {
    if (t.id === 't1') return { title: 'The ticket budget', place: 'Odalys starts every season plan with tickets.',
      body: `<p>The Gulls play <b>${t.G} home games</b>. Odalys expects <b>${n0(t.Fb)} fans</b> a game at an average ticket price of <b>${m(t.Pb, 1)}</b>.</p><p>What ticket revenue should the budget show for the season?</p>`,
      value: { label: 'Season ticket revenue, budget' } };
    if (t.id === 't2') return { title: 'The concessions budget', place: 'Hot dogs, drinks and caps are the other half of a ballpark’s revenue.',
      body: `<p>Last season each fan spent about <b>${m(t.Cb, 1)}</b> on food, drinks and merchandise. Odalys plans on the same this year, with the same <b>${n0(t.Fb)} fans</b> a game over <b>${t.G} games</b>.</p><p>What should the budget show for concessions?</p>`,
      value: { label: 'Season concessions revenue, budget' } };
    if (t.id === 't3') return { title: 'The season against the budget', place: 'The season is over. Odalys pulls the actual numbers.',
      body: `<p>The Gulls averaged <b>${n0(t.Fa)} fans</b> a game (the budget said ${n0(t.Fb)}) at an average ticket price of <b>${m(t.Pa, 1)}</b> (the budget said ${m(t.Pb, 1)}), over the same ${t.G} games.</p><p>What is the ticket revenue variance, actual minus budget? Type a negative number if actual came in below budget. Then say whether it is favorable or unfavorable.</p>`,
      value: { label: 'Ticket revenue variance (actual − budget)' },
      choice: { legend: 'Is the variance favorable or unfavorable?', options: [['fav', 'Favorable'], ['unfav', 'Unfavorable']] } };
    if (t.id === 't4') {
      const rows = L.rows || [];
      const cell = (y) => `<label class="sr-only" for="r${y}">${y === 1 ? 'Attendance part' : 'Price part'}</label><input id="r${y}" class="rowin" data-row="${y}" inputmode="decimal" autocomplete="off" value="${rows[y] ? String(rows[y]).replace(/"/g, '') : ''}"><span class="mark" id="mk${y}"></span>`;
      return { title: 'Fans or prices?', place: 'The owner asks the question every manager asks: was it the crowd or the price?',
        body: `<p>Split the variance into two parts. The <b>attendance part</b> is the revenue gained or lost from the change in fans, priced at the budgeted ticket price. The <b>price part</b> is the revenue gained or lost from the change in price, on the fans who actually came.</p>`,
        table: `<div class="tw"><table class="cf"><caption>Splitting the ticket variance</caption><thead><tr><th scope="col" style="text-align:left">Part</th><th scope="col" style="text-align:left">How to work it out</th><th scope="col">Amount</th></tr></thead><tbody>
          <tr><td class="lbl">Attendance part</td><td class="lbl">(actual fans − budget fans) × games × budget price = (${n0(t.Fa)} − ${n0(t.Fb)}) × ${t.G} × ${m(t.Pb, 1)}</td><td>${cell(1)}</td></tr>
          <tr><td class="lbl">Price part</td><td class="lbl">actual fans × games × (actual price − budget price) = ${n0(t.Fa)} × ${t.G} × (${m(t.Pa, 1)} − ${m(t.Pb, 1)})</td><td>${cell(2)}</td></tr></tbody>
          <tfoot><tr class="total hl"><td colspan="2"><b>The two parts together</b></td><td id="rowTotal"><b>$0</b></td></tr></tfoot></table></div>`,
        onRows: (rs, $) => { let s = 0; for (const y of [1, 2]) { const v = h.parseMoney(rs[y]); if (isFinite(v)) s += v; } $('#rowTotal').innerHTML = '<b>' + sgn(s) + '</b>'; },
        helpLabels: ['Show me the attendance part', 'Show me both parts'] };
    }
    if (t.id === 't5') return { title: 'Did each fan spend more?', place: 'Concessions are where a ballpark makes its margin.',
      body: `<p>The Gulls took in <b>${m(t.CA)}</b> from concessions this season, from <b>${n0(t.Fa)} fans</b> a game over <b>${t.G} games</b>. The budget planned on ${m(t.Cb, 1)} a fan.</p><p>How much did each fan actually spend, on average? Then say whether that is more or less than the budget planned.</p>`,
      value: { label: 'Concessions spending per fan', help: 'Round to the nearest cent.' },
      choice: { legend: 'Compared with the budget, each fan spent', options: [['more', 'More'], ['less', 'Less']] } };
    if (t.id === 't6') {
      const rows = L.rows || [];
      const body = MONTHS.map((mo, i) => { const y = i + 1;
        return `<tr><td class="lbl">${mo}</td><td>${m(t.cin[i])}</td><td>${m(t.cout[i])}</td><td><label class="sr-only" for="r${y}">Cash at the end of ${mo}</label><input id="r${y}" class="rowin" data-row="${y}" inputmode="decimal" autocomplete="off" value="${rows[y] ? String(rows[y]).replace(/"/g, '') : ''}"><span class="mark" id="mk${y}"></span></td></tr>`; }).join('');
      return { title: 'The cash budget', place: 'Odalys needs to know whether the team can pay its bills before the gates open.',
        body: `<p>A ballpark spends heavily in the spring, on staff, food and repairs, before the summer crowds bring cash in. The Gulls start the year with <b>${m(t.S0)}</b> in the bank. Fill in the cash at the end of each month: last month’s cash, plus cash in, minus cash out. Then pick the month when cash is lowest.</p>`,
        table: `<div class="tw"><table class="cf"><caption>Cash budget, January to June</caption><thead><tr><th scope="col" style="text-align:left">Month</th><th scope="col">Cash in</th><th scope="col">Cash out</th><th scope="col">Cash at the end of the month</th></tr></thead><tbody>${body}</tbody></table></div>`,
        choice: { legend: 'Which month ends with the least cash?', options: MONTHS.map((mo, i) => [String(i), mo]) },
        helpLabels: ['Show me January', 'Show me every month'] };
    }
  }

  function judgeTask(t, e, h) {
    const v = h.parseMoney(e.value);
    if (t.id === 't1') return h.judgeNumber(v, t.answer, [
      [t.Fb * t.Pb, 'onegame', `That is one game. Multiply by all ${t.G} home games.`],
      [t.G * t.Fb, 'noprice', 'That is the number of tickets. Multiply by the average price as well.'],
      [t.G * t.Pb, 'nofans', `Multiply by the fans per game too: ${t.G} × ${n0(t.Fb)} × ${m(t.Pb, 1)}.`]],
      { otherMsg: `Ticket revenue = games × fans per game × price = ${t.G} × ${n0(t.Fb)} × ${m(t.Pb, 1)}.` });
    if (t.id === 't2') return h.judgeNumber(v, t.answer, [
      [t.Fb * t.Cb, 'onegame', `That is one game. Multiply by all ${t.G} home games.`],
      [t.G * t.Fb * t.Cb * 2, 'double', 'Count each fan once: games × fans per game × spending per fan.']],
      { otherMsg: `Concessions = games × fans per game × spending per fan = ${t.G} × ${n0(t.Fb)} × ${m(t.Cb, 1)}.` });
    if (t.id === 't3') {
      const n = h.judgeNumber(v, t.answer, [
        [t.Fa * t.Pa - t.Fb * t.Pb, 'onegame', `That is the variance for one game. Multiply by all ${t.G} games, or work out each season total first.`],
        [t.G * t.Fa * t.Pa, 'actual', 'That is the actual revenue. Subtract the budget to get the variance.']],
        { signMsg: 'The size is right but the sign is flipped. Variance = actual − budget, so it is negative when actual comes in below budget.',
          otherMsg: `Actual revenue = ${t.G} × ${n0(t.Fa)} × ${m(t.Pa, 1)}. Budget revenue = ${t.G} × ${n0(t.Fb)} × ${m(t.Pb, 1)}. Subtract the budget from the actual.` });
      if (!n.ok) return n;
      if (e.choice !== t.decision) return { ok: false, code: 'decision', msg: !e.choice ? 'Say whether the variance is favorable or unfavorable as well.' : 'Revenue above budget is favorable; revenue below budget is unfavorable.' };
      return { ok: true };
    }
    if (t.id === 't4') {
      const rows = e.rows || []; const rowRes = [];
      rowRes[1] = h.judgeNumber(h.parseMoney(rows[1]), t.vol, [[(t.Fa - t.Fb) * t.G * t.Pa, 'actprice', 'Price the change in fans at the budgeted price, not the actual one.'], [(t.Fa - t.Fb) * t.Pb, 'onegame', `Multiply by all ${t.G} games.`]],
        { scale: Math.abs(t.vol) + 1, signMsg: 'The size is right but the sign is flipped. Fewer fans than budget makes this part negative.', otherMsg: `(${n0(t.Fa)} − ${n0(t.Fb)}) × ${t.G} × ${m(t.Pb, 1)}.` });
      rowRes[2] = h.judgeNumber(h.parseMoney(rows[2]), t.price, [[t.Fb * t.G * (t.Pa - t.Pb), 'budfans', 'Use the fans who actually came, not the budgeted fans.'], [t.Fa * (t.Pa - t.Pb), 'onegame', `Multiply by all ${t.G} games.`]],
        { scale: Math.abs(t.price) + 1, signMsg: 'The size is right but the sign is flipped. A lower price than budget makes this part negative.', otherMsg: `${n0(t.Fa)} × ${t.G} × (${m(t.Pa, 1)} − ${m(t.Pb, 1)}).` });
      const bad = [1, 2].find((y) => !rowRes[y].ok);
      if (bad) return { ok: false, rowRes, msg: `${bad === 1 ? 'Attendance part' : 'Price part'}: ${rowRes[bad].msg}` };
      return { ok: true, rowRes };
    }
    if (t.id === 't5') {
      const n = h.judgeNumber(v, t.answer, [[t.CA / t.Fa, 'nogames', `Divide by all the fans of the season: ${n0(t.Fa)} a game × ${t.G} games.`], [t.CA / (t.G * t.Fa) * t.G, 'pergame', 'That is spending per game. Divide the season total by every fan of the season.']],
        { tol: 0.006, closeMsg: 'Close. Round to the nearest cent at the end.', otherMsg: `Spending per fan = ${m(t.CA)} ÷ (${n0(t.Fa)} × ${t.G}).` });
      if (!n.ok) return n;
      if (e.choice !== t.decision) return { ok: false, code: 'decision', msg: !e.choice ? 'Say whether each fan spent more or less than the budget as well.' : `Compare your answer with the budgeted ${m(t.Cb, 1)}.` };
      return { ok: true };
    }
    if (t.id === 't6') {
      const rows = e.rows || []; const rowRes = [];
      for (let y = 1; y <= 6; y++) { const prev = y === 1 ? t.S0 : t.end[y - 2];
        rowRes[y] = h.judgeNumber(h.parseMoney(rows[y]), t.end[y - 1], [[t.cin[y - 1] - t.cout[y - 1], 'nostart', 'That is this month’s cash in minus cash out. Add the cash the month started with.'], [prev - t.cin[y - 1] + t.cout[y - 1], 'flipped', 'Cash in adds to the balance and cash out takes away from it.']],
          { scale: Math.abs(t.end[y - 1]) + 10000, otherMsg: `${MONTHS[y - 1]}: ${m(prev)} + ${m(t.cin[y - 1])} − ${m(t.cout[y - 1])}.` }); }
      const bad = rowRes.findIndex((x, i) => i > 0 && !x.ok);
      if (bad > 0) return { ok: false, rowRes, msg: `${MONTHS[bad - 1]}: ${rowRes[bad].msg}` };
      if (e.choice !== t.decision) return { ok: false, rowRes, msg: !e.choice ? 'Pick the month with the least cash as well.' : 'Look down your last column for the smallest balance.' };
      return { ok: true, rowRes };
    }
  }

  function helpText(t, lvl, h) {
    if (t.id === 't1') return lvl === 1 ? `One game brings in ${n0(t.Fb)} × ${m(t.Pb, 1)} = ${m(t.Fb * t.Pb)}. The season has ${t.G} of them.` : `${t.G} × ${n0(t.Fb)} × ${m(t.Pb, 1)} = ${m(t.answer)}. In the calculator: <code>${t.G}*${t.Fb}*${t.Pb}</code>.`;
    if (t.id === 't2') return lvl === 1 ? `The season has ${t.G} × ${n0(t.Fb)} = ${n0(t.G * t.Fb)} fans. Each spends ${m(t.Cb, 1)}.` : `${n0(t.G * t.Fb)} × ${m(t.Cb, 1)} = ${m(t.answer)}.`;
    if (t.id === 't3') return lvl === 1 ? `Actual: ${t.G} × ${n0(t.Fa)} × ${m(t.Pa, 1)} = ${m(t.G * t.Fa * t.Pa)}. Budget: ${t.G} × ${n0(t.Fb)} × ${m(t.Pb, 1)} = ${m(t.G * t.Fb * t.Pb)}.` : `${m(t.G * t.Fa * t.Pa)} − ${m(t.G * t.Fb * t.Pb)} = ${sgn(t.answer)}, which is ${t.decision === 'fav' ? 'favorable' : 'unfavorable'}.`;
    if (t.id === 't4') return lvl === 1 ? `Attendance part: (${n0(t.Fa)} − ${n0(t.Fb)}) × ${t.G} × ${m(t.Pb, 1)} = ${sgn(t.vol)}.` : `Attendance part: ${sgn(t.vol)}. Price part: ${n0(t.Fa)} × ${t.G} × (${m(t.Pa, 1)} − ${m(t.Pb, 1)}) = ${sgn(t.price)}. Together they equal the variance from the last step.`;
    if (t.id === 't5') return lvl === 1 ? `The season had ${n0(t.Fa)} × ${t.G} = ${n0(t.Fa * t.G)} fans.` : `${m(t.CA)} ÷ ${n0(t.Fa * t.G)} = ${m(t.answer, 1)}, which is ${t.decision === 'more' ? 'more' : 'less'} than the budgeted ${m(t.Cb, 1)}.`;
    if (t.id === 't6') { if (lvl === 1) return `January: ${m(t.S0)} + ${m(t.cin[0])} − ${m(t.cout[0])} = ${m(t.end[0])}. February starts from that.`;
      return MONTHS.map((mo, i) => `${mo}: ${m(i ? t.end[i - 1] : t.S0)} + ${m(t.cin[i])} − ${m(t.cout[i])} = ${m(t.end[i])}`).join('<br>') + `<br>The lowest balance is in ${MONTHS[Number(t.decision)]}.`; }
  }
  function praise(t) {
    if (t.id === 't1') return `The budget plans on ${m(t.answer)} of ticket revenue from ${n0(t.G * t.Fb)} fans.`;
    if (t.id === 't2') return `Concessions add ${m(t.answer)}, so the season budget is ${m(t.answer + t.G * t.Fb * t.Pb)} in all.`;
    if (t.id === 't3') return `Ticket revenue came in ${sgn(t.answer)} against the budget, a ${t.decision === 'fav' ? 'favorable' : 'unfavorable'} variance.`;
    if (t.id === 't4') return `${t.vol < 0 ? 'Fewer' : 'More'} fans moved revenue by ${sgn(t.vol)}, and the ${t.price > 0 ? 'higher' : 'lower'} price moved it by ${sgn(t.price)}. Together: ${sgn(t.vol + t.price)}.`;
    if (t.id === 't5') return `Each fan spent ${m(t.answer, 1)}, ${m(Math.abs(t.answer - t.Cb), 1)} ${t.decision === 'more' ? 'more' : 'less'} than planned.`;
    if (t.id === 't6') return `Cash bottoms out at ${m(Math.min(...t.end))} in ${MONTHS[Number(t.decision)]}, before the summer crowds arrive. That is the month Odalys needs a cushion for.`;
  }
  function selfAnswer(t) {
    if (t.id === 't4') return { rows: [null, String(Math.round(t.vol)), String(Math.round(t.price))] };
    if (t.id === 't6') return { rows: [null].concat(t.end.map(String)), choice: t.decision };
    if (t.id === 't5') return { value: t.answer.toFixed(2), choice: t.decision };
    return { value: String(Math.round(t.answer)), choice: t.decision || null };
  }
  function selfWrong(t) {
    if (t.id === 't4') return { rows: [null, String(Math.round((t.Fa - t.Fb) * t.G * t.Pa)), String(Math.round(t.price))] };
    if (t.id === 't6') return { rows: [null].concat(t.cin.map((x, i) => String(x - t.cout[i]))), choice: t.decision };
    if (t.id === 't5') return { value: (t.answer * 1.2).toFixed(2), choice: t.decision };
    return { value: String(Math.round(t.answer * 1.2)), choice: t.decision || null };
  }

  const WALK = {
    title: 'How Odalys reads one game',
    intro: '<p>Before the season, here is one game worked from start to finish. The budget planned <b>4,000 fans at $12</b> a ticket. <b>3,600 fans</b> came, and the average ticket sold for <b>$13</b>.</p>',
    render(stage) {
      const rows = [['Budget: 4,000 fans × $12', '$48,000', 0], ['Actual: 3,600 fans × $13', '$46,800', 0], ['Variance: actual − budget', '−$1,200', 1],
        ['Attendance part: (3,600 − 4,000) × $12', '−$4,800', 2], ['Price part: 3,600 × ($13 − $12)', '+$3,600', 3], ['The two parts together', '−$1,200', 4]];
      return `<div class="tw"><table class="cf"><caption>One game, budget against actual</caption><thead><tr><th scope="col" style="text-align:left">Line</th><th scope="col">Amount</th></tr></thead><tbody>${rows.filter((r) => r[2] <= stage).map((r) => `<tr class="${r[2] === stage ? 'reveal' : ''}${r[2] === 4 ? ' hl' : ''}"><td class="lbl">${r[0]}</td><td>${r[1]}</td></tr>`).join('')}</tbody></table></div>`;
    },
    stages: [
      { t: 'Budget and actual', p: 'Revenue is fans × price. The budget expected 4,000 × $12 = $48,000. The game brought in 3,600 × $13 = $46,800.' },
      { t: 'The variance', p: 'The <b>variance</b> is actual minus budget: $46,800 − $48,000 = −$1,200. Revenue below budget is <b>unfavorable</b>. The number alone does not say why.' },
      { t: 'The attendance part', p: 'Price the missing fans at the budgeted price: 400 fewer fans × $12 = −$4,800. That is what the smaller crowd cost.' },
      { t: 'The price part', p: 'Now take the fans who did come and apply the price change: 3,600 × $1 = +$3,600. That is what the higher price earned.' },
      { t: 'The two parts explain it all', p: '−$4,800 + $3,600 = −$1,200, exactly the variance. So the story is clear: the price rise brought in more per fan, but it did not make up for the smaller crowd.' },
    ],
  };

  root.DESK = {
    app: 'finan4-u3-variance-desk', version: 1, seedVersion: 1, salt: 'rize-finan4-u3-variance:c41e07', points: 20,
    storageKey: 'rize-finan4-u3-variance-v1', filePrefix: 'VarianceDesk',
    verifyUrl: 'https://rizecomputerscience.github.io/finan4-variance-desk/verify.html',
    calcPlaceholder: '68*4200*13.5',
    calcHint: 'Type or tap. Use * to multiply and parentheses to group, so (3600-4000)*12 is the attendance part of one game.',
    story: { title: 'The Variance Desk', kicker: 'Corporate Finance, Unit 3', company: 'Tidewater Gulls', team: 'Front Office',
      from: 'Odalys Brennan', fromTitle: 'finance director, Tidewater Gulls',
      dek: 'You have joined the front office of the Tidewater Gulls, a minor-league baseball team. Odalys Brennan, the finance director, plans the season in numbers before it starts, then explains to the owner where it went differently. This season she wants your help with both.',
      whatBox: '<b>A budget is the plan in numbers.</b> Comparing the actual season against it shows what went differently, and splitting each gap into its causes, such as fewer fans or higher prices, tells the owner what to do about it.',
      stepsLine: 'There are twelve steps: a worked example, six problems with three one-question checks between them, one exam-style question, and a short note to Odalys.' },
    steps: STEPS, quiz: QUIZ, walk: WALK, buildTasks, taskView, judgeTask, helpText, praise, selfAnswer, selfWrong,
    note: { title: 'A note for the owner', label: 'Your note to Odalys', minWords: 30, receiptHeading: 'Note to the finance director',
      prompt: 'The owner wants one paragraph before the next budget meeting. Was this season’s ticket gap mostly about the crowd or about prices, and what is one change you would suggest for next season’s plan?' },
  };
})(typeof window !== 'undefined' ? window : globalThis);
