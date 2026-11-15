// Live, annotated walkthroughs. Each journey drives the real prototype in an iframe (same origin on GitHub Pages).
const APP = /^(localhost|127\.)/.test(location.hostname) ? location.origin + '/' : 'https://rushabhm-blip.github.io/Cleartrip_ai_agent/';
const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
const sleep = ms => new Promise(r => setTimeout(r, ms));
const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;
const GL = { sparkle: '<path d="M12 3l2.2 5.8L20 11l-5.8 2.2L12 19l-2.2-5.8L4 11l5.8-2.2z"/>', heart: '<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/>', shield: '<path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6z"/><path d="M9 12l2 2 4-4"/>', alert: '<path d="M12 4l9 16H3z"/><path d="M12 10v4"/><path d="M12 17v.5"/>' };

/* pin = [target, label, side]  target: 'css:selector' or a text pattern (regex source, case-insensitive)
   action = ['jump',name] ['click',target] ['wait',ms] ['dragSticker',key] ['app',actionName] ['scroll',target] */
const J = [
{ id: 'j1', glyph: 'sparkle', tile: 'Planner', title: ['Plan together,', 'simplified.'], path: 'Set up the crew  →  Decide where  →  Get a plan',
  start: ['Open Trip planner', 'From Cleartrip home'],
  rows: [[['Add traveller', 'Pick a character'], ['Name them', 'Optional nickname'], ['Invite', 'Link; friends claim a name']],
         [['Set the trip', 'Place · dates · budget'], ['Not sure?', 'Find me a place'], ['Three matches', 'Sample estimates'], ['Choose', 'Back to setup']],
         [['Plan my trip', 'Press when ready'], ['One question', 'Mood of the trip'], ['Checks shown', 'Builds the plan'], ['Draft plan', 'Days · totals · reasons']]],
  steps: [
   { hl: '0.0', t: 'One screen for crew, place, dates and budget', c: 'Friends join shoulder to shoulder. Naming a friend is not inviting them, and joining is not approving costs.', a: [['jump', 'setup']],
     pins: [['css:.gc-polaroid, .gc-sheet', 'Everyone gets a character, standing shoulder to shoulder', 'l'], ['Add traveller', 'Naming a friend is not inviting them', 'l'], ['Not sure\\?', 'Not sure where? Ask for ideas', 'r'], ['Create a Wishbox', 'Still deciding together? Start a Wishbox', 'r'], ['Keep it relaxed', 'Quick prompts replace an empty chat box', 'r']] },
   { hl: '1.1', t: 'Not sure where? Say what you are in the mood for', c: 'Five moods replace a long form. Dates, budget and travellers are filled in from what you already told us.', a: [['jump', 'setup'], ['wait', 500], ['click', 'css:.dc-link'], ['wait', 900]],
     pins: [['Find your next getaway', 'Never asks twice for what you entered', 'l'], ['Local food', 'Tap the moods you want', 'r'], ['Travellers', 'Travellers come from your crew', 'l'], ['css:.dc-go', 'Then ask for ideas', 'r']] },
   { hl: '1.2', t: 'A short globe animation, then three matches', c: 'The list is filtered by dates, travel time and budget before it is ranked. Prices are labelled as samples.', a: [['click', 'css:.dc-go'], ['wait', 4700]],
     pins: [['css:.dc-globe', 'A short globe animation, then the matches', 'l'], ['css:.dc-card', 'Each match says why it fits', 'r'], ['css:.dc-note', 'Sample estimates, not live prices', 'l']] },
   { hl: '2.1', t: 'One short question, not a form', c: 'The AI asks one thing at a time, and your limit is said back to you so nobody has to repeat it.', a: [['jump', 'chat']],
     pins: [['What kind of trip', 'One short question, not a form', 'l'], ['Heritage & sunrise', 'Tap a chip or type your own', 'r'], ['Planning target', 'Your limit is said back to you', 'l']] },
   { hl: '2.2', t: 'Watch it think', c: 'The work is visible: compared, checked, fitted. You can stop at any time. Counts are simulated in the prototype.', a: [['jump', 'building']],
     pins: [['Compared 14 stays', 'Checks complete one by one', 'l'], ['Fitting sights', 'The current check is highlighted', 'r'], ['Stop planning', 'Stop at any time', 'l']] },
   { hl: '2.3', t: 'A draft plan, never a booking', c: 'Days, totals and reasons, with the cap breach called out and a cheaper stay one tap away.', a: [['jump', 'plan']],
     pins: [['Draft plan', 'A draft, never a booking', 'l'], ['See cheaper stay', 'Over a cap? It says so', 'r'], ['Your trip, day by day', 'Days, totals and reasons', 'l']] }] },

{ id: 'j2', glyph: 'heart', tile: 'Wishbox', title: ['Decide together,', 'simplified.'], path: 'Add wishes  →  Review and shortlist  →  Reveal and vote',
  start: ['Create a Wishbox', 'Still deciding together?'],
  rows: [[['Add wishes', 'Drag a sticker or write'], ['Must-haves', 'Edit · remove · undo'], ['Ready', 'Each member confirms']],
         [['Coordinator review', 'Who is ready'], ['Group with AI', 'Unusual wishes kept'], ['Shortlist', 'Reorder · exclude'], ['Publish', 'A versioned list']],
         [['Reveal', 'Skip any time'], ['Like or Pass', 'Every option'], ['Tallies', 'Shown after you submit'], ['Confirm', 'Coordinator picks a place']]],
  steps: [
   { hl: '0.0', t: 'A shared box for everyone’s wishes', c: 'Different budgets and tastes are rarely said out loud. Collecting wishes in one box lets quieter people speak first.', a: [['jump', 'wishbox']],
     pins: [['14–17 Nov', 'Dates and the lowest cap travel with the group', 'l'], ['css:#wb-box', 'The box fills as friends add wishes', 'r'], ['Drag a sticker', 'Drag a sticker into the box', 'l'], ['css:.wb-tray', 'Six common wishes; More shows the rest', 'r']] },
   { hl: '0.1', t: 'Drag a sticker in', c: 'Stickers are dragged into the box, or added with the keyboard. Nothing has to be typed.', a: [['jump', 'wishbox'], ['app', 'wb-demo-reset'], ['wait', 600], ['dragSticker', 'beach'], ['wait', 500], ['dragSticker', 'heritage'], ['wait', 500], ['dragSticker', 'cafe'], ['wait', 800]],
     pins: [['css:#wb-box', 'Wishes land in the box', 'r'], ['css:.wb-tray', 'Drag any sticker in', 'l']] },
   { hl: '1.1', t: 'The coordinator reviews, AI groups', c: 'AI groups wishes into themes but never deletes unusual ones, so minority wishes survive.', a: [['jump', 'review']],
     pins: [['Who is ready', 'See who is ready', 'l'], ['Group wishes with AI', 'AI groups wishes into themes', 'r'], ['Unusual wishes', 'Unusual wishes are kept; nothing is deleted', 'l']] },
   { hl: '2.0', t: 'A little ceremony for the shortlist', c: 'A globe introduces the options. The globe does not choose, and Skip animation is always there.', a: [['jump', 'reveal'], ['wait', 500]],
     pins: [['Ready to reveal', 'The reveal makes the shortlist feel shared', 'l'], ['Skip animation', 'Skip any time', 'r']] },
   { hl: '2.1', t: 'Like or Pass, every option', c: 'Liking a place is not approving its cost, and a missing vote is never counted as Pass.', a: [['jump', 'reveal'], ['wait', 500], ['click', 'Skip animation'], ['wait', 1100]],
     pins: [['Where could we go', 'Everyone votes on every option', 'l'], ['^\\s*Like\\s*$', 'Like or Pass each option', 'r'], ['Replay reveal', 'Replaying never changes votes', 'l']] }] },

{ id: 'j3', glyph: 'shield', tile: 'Agree', title: ['Review and agree,', 'simplified.'], path: 'Spot a problem  →  Preview a fix  →  Everyone approves',
  start: ['Draft plan', 'Day by day'],
  rows: [[['Spot a problem', 'Over cap or overpacked'], ['Preview', 'Cheaper stay · Day 2 fix'], ['Apply or keep', 'Undo is available']],
         [['Share with group', 'Version 2'], ['Approvals', 'Each person approves'], ['All approved?', 'Waiting · over cap · yes'], ['Review and book', 'Unlocks']],
         [['Checkout items', 'Buses · stay'], ['Estimates', 'Local transport · food'], ['Continue', 'Nothing booked here']]],
  steps: [
   { hl: '0.0', t: 'One plan, with totals beside it', c: '6 of 9 people check the total price first. Totals, the split and a per-person or group toggle stay next to the plan.', a: [['jump', 'plan']],
     pins: [['Per person', 'Per person or the whole group', 'l'], ['above Prathmesh', 'Over a cap? It says so, and offers a cheaper stay', 'r'], ['Trip cost', 'Totals split by stay, transport and meals', 'l'], ['Your trip, day by day', 'Pick a day to read and edit it', 'r']] },
   { hl: '0.0', t: 'A day that looks good should fit in a day', c: 'Day 2 is flagged as overpacked: 11 hours planned in 8 h 30. A fix is offered, never forced.', a: [['jump', 'plan'], ['wait', 400], ['scroll', 'Overpacked']],
     pins: [['Overpacked', '11 h planned in 8 h 30', 'r'], ['Move Anjanadri', 'Preview the move before applying it', 'l']] },
   { hl: '0.1', t: 'Preview both days before applying', c: 'Warn, preview, apply, undo. The change is shown on both days, with the cost impact, before anything moves.', a: [['jump', 'timefix'], ['wait', 400], ['scroll', 'Make Day 2']],
     pins: [['Make Day 2 comfortable', 'Both days are previewed first', 'r'], ['Apply change', 'Apply the change…', 'l'], ['Keep original plan', '…or keep the original plan', 'r']] },
   { hl: '0.2', t: 'Swap one piece without starting over', c: 'A cheaper stay brings the trip back under the lowest cap. The saving is stated: ₹300 per person.', a: [['jump', 'stay'], ['wait', 400], ['scroll', 'Review & edit']],
     pins: [['Review & edit', 'Compare a stay, see the new total', 'r'], ['Save ₹300', 'The saving is stated', 'l'], ['New trip estimate', 'The new total fits everyone', 'r']] },
   { hl: '1.1', t: 'A shared plan is not a shared agreement', c: 'Each person approves the same version. A cap breach is visible to everyone, and joining a plan is not approving it.', a: [['jump', 'shared'], ['wait', 400], ['scroll', 'Group approvals']],
     pins: [['Group approvals', 'Each person approves the same version', 'r'], ['Waiting', 'Waiting on one member', 'l'], ['Over by', 'A cap breach is visible to everyone', 'r'], ['Review change', 'AI suggests a fix; you review it', 'l']] },
   { hl: '1.3', t: 'Review and book unlocks for everyone', c: 'Any change to itinerary, price, dates, party size or a cap asks the group to approve again.', a: [['jump', 'approved'], ['wait', 400], ['scroll', 'Final plan']],
     pins: [['Everyone approved', 'Everyone approved the revised plan', 'r'], ['Final plan', 'The new total fits every cap', 'l'], ['Review & book', 'Review and book unlocks', 'r']] },
   { hl: '2.2', t: 'Hand off, stopping before payment', c: 'Items for checkout are listed apart from local transport and food estimates. Nothing is booked in this prototype.', a: [['jump', 'handoff']],
     pins: [['ready for checkout', 'Handoff stops before payment', 'r'], ['Items in checkout', 'Checkout items are listed separately', 'l'], ['No booking or payment', 'Nothing is booked here', 'r']] }] },

{ id: 'j4', glyph: 'alert', tile: 'Recovery', title: ['When things go wrong,', 'simplified.'], path: 'Say what happened  →  Keep what was saved  →  Offer a way forward',
  start: ['Something changes', 'Price · budget · error'],
  rows: [[['Price rises', 'A stay is +₹150'], ['Cap breached', '₹10,350 vs ₹10,200'], ['Alternatives', 'Find one · review price'], ['Approve again', 'Group re-approves']],
         [['No option fits', 'A ₹9,500 request'], ['Closest plan', '₹10,200, gap ₹700'], ['Choose', 'Budget · dates · edit'], ['Saved plan kept', 'Never overwritten']],
         [['Search fails', 'Connection error'], ['Details saved', 'Trip and group kept'], ['Retry', 'Try again · edit details']]],
  steps: [
   { hl: '0.1', t: 'The price changes mid-booking', c: 'A stay rises by ₹150 and breaks Prathmesh’s cap. The cap is never bypassed: the group approves again.', a: [['jump', 'price'], ['wait', 400], ['scroll', 'stay price changed']],
     pins: [['stay price changed', 'A stay rises by ₹150', 'r'], ['above Prathmesh', 'The cap is never bypassed', 'l'], ['Find an alternative', 'Alternatives come first', 'r']] },
   { hl: '1.1', t: 'Nothing fits the budget', c: 'No dead end. The closest option and the gap are shown, and the saved plan is never overwritten.', a: [['jump', 'nomatch']],
     pins: [['No complete plan fits', 'Says plainly what is wrong', 'r'], ['Gap', 'The gap is stated: ₹700', 'l'], ['Increase budget', 'Three ways forward, no dead end', 'r'], ['Return to saved plan', 'The saved plan is never overwritten', 'l']] },
   { hl: '2.1', t: 'A search fails', c: 'Errors keep what people entered. The spinner never runs forever, and there is always a way back.', a: [['jump', 'error']],
     pins: [['t finish your plan', 'Details and group are saved', 'r'], ['Try again', 'Try again or edit details', 'l'], ['Last check', 'Shows what it was doing', 'r']] }] }
];

/* ---------- build the four journeys ---------- */
const NS = 'http://www.w3.org/2000/svg';
function build(j) {
  const sec = document.createElement('section'); sec.className = 'jr'; sec.id = j.id;
  sec.innerHTML = `<div class="jh rv"><div class="tile"><i><svg viewBox="0 0 24 24">${GL[j.glyph]}</svg></i><span>${j.tile}</span></div><div><h2>${j.title[0]} <em>${j.title[1]}</em></h2><p>${j.path}</p></div></div>
  <div class="flowwrap"><div class="flow" id="${j.id}-flow"><svg class="fl-svg"></svg></div></div>
  <div class="stagebox rv">
    <div class="ctl"><div class="seg" role="group" aria-label="Device"><button data-m="web" class="on">Web</button><button data-m="phone">Phone</button></div><button class="pl">Pause</button><button class="pv">← Back</button><button class="nx">Next →</button><a target="_blank" rel="noopener">Open the app ↗</a></div>
    <div class="stage"><div class="gut gl"></div><div class="dev web"><div class="vp"><iframe title="Prototype"></iframe><div class="pinl"></div><div class="cur"><svg viewBox="0 0 24 24"><path d="M4 2l15 9-6.5 1.6L9.5 19z" fill="#141414" stroke="#fff" stroke-width="1.4" stroke-linejoin="round"/></svg></div></div></div><div class="gut gr"></div><svg class="ann"></svg></div>
    <div class="cap"><h3></h3><p></p><div class="bar"><i></i></div></div>
    <div class="dots"></div><p class="hint">This is the live app, so you can click around inside it. The walkthrough pauses when you do.</p>
  </div>`;
  // flow nodes
  const flow = $('.flow', sec); const mk = (t, s, cls, r, c) => { const d = document.createElement('div'); d.className = 'fn ' + (cls || ''); d.dataset.k = cls === 'st' ? 's' : r + '.' + c; d.innerHTML = `${t}<small>${s}</small>`; flow.appendChild(d); return d; };
  const st = mk(j.start[0], j.start[1], 'st'); st.style.gridColumn = 1; st.style.gridRow = '1 / 4';
  j.rows.forEach((row, r) => row.forEach((n, c) => { const d = mk(n[0], n[1], '', r, c); d.style.gridColumn = c + 3; d.style.gridRow = r + 1; }));
  return sec;
}

class Stage {
  constructor(j, sec) { this.j = j; this.sec = sec; this.i = 0; this.mode = 'web'; this.playing = false; this.paused = false; this.tok = 0; this.loaded = false;
    this.fr = $('iframe', sec); this.dev = $('.dev', sec); this.vp = $('.vp', sec); this.pl = $('.pinl', sec); this.cur = $('.cur', sec); this.stageEl = $('.stage', sec); this.ann = $('.ann', sec); this.gl = $('.gl', sec); this.gr = $('.gr', sec);
    const dots = $('.dots', sec); j.steps.forEach((s, n) => { const b = document.createElement('button'); b.textContent = (n + 1) + '. ' + s.t.split(',')[0].split(':')[0].slice(0, 26); b.onclick = () => this.user(n); dots.appendChild(b); });
    $$('.seg button', sec).forEach(b => b.onclick = () => { this.setMode(b.dataset.m); });
    $('.pl', sec).onclick = () => { this.paused = !this.paused; $('.pl', sec).textContent = this.paused ? 'Play' : 'Pause'; if (!this.paused) this.start(); else this.stop(); };
    $('.pv', sec).onclick = () => this.user((this.i - 1 + j.steps.length) % j.steps.length); $('.nx', sec).onclick = () => this.user((this.i + 1) % j.steps.length);
    $('a', sec).href = APP; this.dims();
    // pause when the visitor touches the live app
    this.vp.addEventListener('pointerdown', () => { if (this.playing) { this.paused = true; $('.pl', sec).textContent = 'Play'; this.stop(); } }, true);
  }
  dims() { const m = this.mode, st = this.j.steps[this.i]; this.vw = m === 'web' ? 1200 : 390; this.vh = m === 'web' ? 780 : 844;
    this.k = m === 'web' ? Math.min(700, this.stageEl.clientWidth - 40) / this.vw : Math.min(590, innerHeight * .8) / this.vh;
    const w = Math.round(this.vw * this.k), h = Math.round(this.vh * this.k); this.vp.style.width = w + 'px'; this.vp.style.height = h + 'px';
    this.fr.style.width = this.vw + 'px'; this.fr.style.height = this.vh + 'px'; this.fr.style.transform = `scale(${this.k})`;
    this.dev.className = 'dev ' + m; this.stageEl.style.minHeight = (h + 30) + 'px'; }
  async setMode(m) { if (m === this.mode) return; this.mode = m; $$('.seg button', this.sec).forEach(b => b.classList.toggle('on', b.dataset.m === m)); this.loaded = false; this.dims(); await this.go(this.i); }
  doc() { try { return this.fr.contentDocument; } catch (e) { return null; } }
  win() { try { return this.fr.contentWindow; } catch (e) { return null; } }
  async load() { if (this.loaded) return; await new Promise(res => { this.fr.onload = res; this.fr.src = APP + 'index.html?jump=setup'; }); const d = this.doc(); if (d) { const s = d.createElement('style'); s.textContent = '.demo{display:none!important}html{scroll-behavior:auto!important}'; d.head.appendChild(s); } for (let n = 0; n < 40 && !(this.win() && this.win().__app); n++) await sleep(100); this.loaded = true; }
  find(spec) { const d = this.doc(); if (!d) return null; if (spec.startsWith('css:')) return d.querySelector(spec.slice(4)); const re = new RegExp(spec, 'i'); const els = [...d.body.querySelectorAll('button,a,h1,h2,h3,h4,p,span,li,label,b,strong,small,div,em,i')];
    const hit = els.filter(e => { const t = (e.textContent || '').replace(/\s+/g, ' ').trim(); if (!re.test(t)) return false; const r = e.getBoundingClientRect(); if (r.width < 2 || r.height < 2) return false; return ![...e.children].some(c => re.test((c.textContent || '').replace(/\s+/g, ' ').trim())); });
    const vh = d.defaultView.innerHeight; const inView = hit.find(e => { const r = e.getBoundingClientRect(); return r.top >= 0 && r.bottom <= vh; }); return inView || hit[0] || null; }
  rect(el) { const r = el.getBoundingClientRect(); return { x: r.left, y: r.top, w: r.width, h: r.height }; }
  top() { const d = this.doc(), w = this.win(); if (!d) return; w.scrollTo(0, 0); d.querySelectorAll('.ws-scroll,.col-pane,.setup-work,main,.planner').forEach(e => { e.scrollTop = 0; }); }
  scroller(e) { const w = this.win(); for (let p = e.parentElement; p; p = p.parentElement) { const o = w.getComputedStyle(p).overflowY; if ((o === 'auto' || o === 'scroll') && p.scrollHeight > p.clientHeight + 2) return p; } return null; }
  chk(t) { if (t !== this.tok) throw new Error('cancel'); }
  async wait(ms, t) { const end = Date.now() + ms; while (Date.now() < end) { await sleep(Math.min(120, end - Date.now())); this.chk(t); } }
  async cursorTo(el, t) { const r = this.rect(el), x = (r.x + r.w / 2) * this.k, y = (r.y + r.h / 2) * this.k; this.cur.classList.add('show'); this.cur.style.transform = `translate(${x - 4}px,${y - 2}px)`; await this.wait(REDUCED ? 100 : 900, t); return { x, y }; }
  ripple(x, y) { const r = document.createElement('div'); r.className = 'rip'; r.style.left = x + 'px'; r.style.top = y + 'px'; this.vp.appendChild(r); setTimeout(() => r.remove(), 700); }
  async action(a, t) { const [k, v] = a; const w = this.win();
    if (k === 'jump') { w.__app.jump(v); await this.wait(650, t); this.top(); }
    else if (k === 'wait') await this.wait(v, t);
    else if (k === 'app') { const f = w.__app.A[v]; if (f) f({ dataset: {} }); await this.wait(300, t); }
    else if (k === 'scroll') { const e = this.find(v); if (e) { e.scrollIntoView({ block: 'start' }); const sc = this.scroller(e); if (sc) sc.scrollTop -= 90; else w.scrollBy(0, -90); await this.wait(350, t); } }
    else if (k === 'click') { const e = this.find(v); if (!e) return; if (e.scrollIntoView) e.scrollIntoView({ block: 'nearest' }); const p = await this.cursorTo(e, t); this.ripple(p.x, p.y); await this.wait(350, t); e.click(); await this.wait(250, t); this.cur.classList.remove('show'); }
    else if (k === 'dragSticker') { await this.drag(v, t); } }
  async drag(key, t) { const d = this.doc(), w = this.win(); const s = d.querySelector(`.wb-sticker[data-key="${key}"]`), box = d.getElementById('wb-box'); if (!s || !box) return; const a = this.rect(s), b = this.rect(box);
    const sx = a.x + a.w / 2, sy = a.y + a.h / 2, ex = b.x + b.w / 2 + (Math.random() * 60 - 30), ey = b.y + b.h * .55; const P = (type, x, y) => (s.ownerDocument).dispatchEvent(new w.PointerEvent(type, { clientX: x, clientY: y, pointerId: 7, bubbles: true, button: 0 }));
    this.cur.classList.add('show'); this.cur.style.transform = `translate(${sx * this.k - 4}px,${sy * this.k - 2}px)`; await this.wait(700, t); this.ripple(sx * this.k, sy * this.k);
    s.dispatchEvent(new w.PointerEvent('pointerdown', { clientX: sx, clientY: sy, pointerId: 7, bubbles: true, button: 0 })); P('pointermove', sx + 8, sy - 8);
    const n = 18; for (let i = 1; i <= n; i++) { const f = i / n, e = f * f * (3 - 2 * f); const x = sx + (ex - sx) * e, y = sy + (ey - sy) * e - Math.sin(f * Math.PI) * 40; P('pointermove', x, y); this.cur.style.transition = 'none'; this.cur.style.transform = `translate(${x * this.k - 4}px,${y * this.k - 2}px)`; await sleep(26); this.chk(t); }
    P('pointerup', ex, ey); this.cur.style.transition = ''; await this.wait(450, t); this.cur.classList.remove('show'); }
  clearPins() { this.pl.innerHTML = ''; this.gl.innerHTML = ''; this.gr.innerHTML = ''; this.ann.innerHTML = ''; }
  placePins(step) { this.clearPins(); const sr = this.stageEl.getBoundingClientRect(), vr = this.vp.getBoundingClientRect(); const ox = vr.left - sr.left, oy = vr.top - sr.top, W = this.vp.clientWidth, H = this.vp.clientHeight;
    const items = []; step.pins.forEach(p => { const e = this.find(p[0]); if (!e) return; const r = this.rect(e); const side = this.mode === 'web' ? p[2] : p[2]; const ax = (side === 'l' ? r.x - 5 : r.x + r.w + 5); const px = Math.max(8, Math.min(this.vw - 8, ax)) * this.k, py = (r.y + r.h / 2) * this.k; if (r.y + r.h < 0 || r.y > this.vh) return; const pyc = Math.min(py, H - 12); items.push({ px, py: Math.max(8, pyc), label: p[1], side }); });
    if (this.mode === 'phone') items.forEach(it => { it.side = it.px < W / 2 ? 'l' : 'r'; }); else items.forEach(it => { it.side = it.px < W / 2 ? 'l' : 'r'; });
    items.forEach((it, n) => { it.n = n + 1; });
    const sides = { l: items.filter(i => i.side === 'l').sort((a, b) => a.py - b.py), r: items.filter(i => i.side === 'r').sort((a, b) => a.py - b.py) };
    ['l', 'r'].forEach(sd => { let last = -99; sides[sd].forEach(it => { it.ly = Math.max(it.py, last + 58); last = it.ly; }); });
    items.forEach((it, n) => { const delay = (REDUCED ? 0 : 160 * n);
      const pin = document.createElement('div'); pin.className = 'pin'; pin.style.left = it.px + 'px'; pin.style.top = it.py + 'px'; pin.style.animationDelay = delay + 'ms'; this.pl.appendChild(pin);
      const gut = it.side === 'l' ? this.gl : this.gr; const lab = document.createElement('div'); lab.className = 'lab ' + it.side; lab.innerHTML = `<b>${it.n}</b><span>${it.label}</span>`; lab.style.animationDelay = (delay + 150) + 'ms'; lab.style.top = (oy + it.ly - 10) + 'px';
      const dr = this.dev.getBoundingClientRect(); const gr = gut.getBoundingClientRect(); if (it.side === 'l') { lab.style.right = (gr.right - dr.left + 22 - 0) + 'px'; lab.style.right = '22px'; lab.style.left = 'auto'; } else { lab.style.left = '22px'; }
      gut.appendChild(lab);
      const x1 = ox + it.px, y1 = oy + it.py, lr = null; const x2 = it.side === 'l' ? (dr.left - sr.left - 16) : (dr.right - sr.left + 16), y2 = oy + it.ly;
      const path = document.createElementNS(NS, 'path'); path.setAttribute('d', `M ${x1} ${y1} L ${x2} ${y2}`); const len = Math.hypot(x2 - x1, y2 - y1); path.style.setProperty('--len', len); path.style.animationDelay = delay + 'ms'; this.ann.appendChild(path); });
    this.ann.setAttribute('width', sr.width); this.ann.setAttribute('height', sr.height); this.gl.style.minHeight = this.gr.style.minHeight = H + 'px'; this.gl.style.position = this.gr.style.position = 'relative'; }
  async go(i, quick) { const t = ++this.tok; this.i = i; const step = this.j.steps[i]; this.markFlow(step); $$('.dots button', this.sec).forEach((b, n) => { b.classList.toggle('on', n === i); b.classList.toggle('dn', n < i); });
    $('h3', this.sec).textContent = step.t; $('.cap p', this.sec).textContent = step.c; this.clearPins();
    try { await this.load(); this.chk(t); this.dims(); for (const a of step.a) await this.action(a, t); await this.wait(350, t); if (!step.a.some(x => x[0] === 'scroll' || x[0] === 'click')) { this.top(); await this.wait(250, t); this.top(); } this.placePins(step); } catch (e) { if (e.message !== 'cancel') console.warn(e); } }
  markFlow(step) { const flow = $('.flow', this.sec); const order = this.j.steps.slice(0, this.i).map(s => s.hl); $$('.fn', flow).forEach(n => { n.classList.toggle('on', n.dataset.k === step.hl); n.classList.toggle('done', order.includes(n.dataset.k) && n.dataset.k !== step.hl); }); const st = $('.st', flow); st.classList.toggle('done', true); }
  user(i) { this.paused = true; $('.pl', this.sec).textContent = 'Play'; this.stop(); this.go(i); }
  stop() { this.playing = false; this.run = (this.run || 0) + 1; this.tok++; const b = $('.bar i', this.sec); b.style.transition = 'none'; b.style.width = '0'; }
  async start() { if (this.playing || this.paused) return; this.playing = true; const id = this.run = (this.run || 0) + 1;
    while (this.playing && id === this.run) { await this.go(this.i); if (!(this.playing && id === this.run)) return; const bar = $('.bar i', this.sec), dwell = 5200; bar.style.transition = 'none'; bar.style.width = '0'; void bar.offsetWidth; bar.style.transition = `width ${dwell}ms linear`; bar.style.width = '100%'; const end = Date.now() + dwell; while (Date.now() < end && this.playing && id === this.run) await sleep(150); if (!(this.playing && id === this.run)) return; this.i = (this.i + 1) % this.j.steps.length; } }
}

function drawFlow(sec) { const flow = $('.flow', sec), svg = $('.fl-svg', flow); const fr = flow.getBoundingClientRect(); svg.setAttribute('width', flow.scrollWidth); svg.setAttribute('height', flow.scrollHeight); svg.innerHTML = '';
  const R = el => { const r = el.getBoundingClientRect(); return { l: r.left - fr.left, r: r.right - fr.left, t: r.top - fr.top, b: r.bottom - fr.top, cy: (r.top + r.bottom) / 2 - fr.top }; };
  const line = (pts, len) => { const p = document.createElementNS(NS, 'path'); p.setAttribute('d', 'M ' + pts.map(q => q.join(' ')).join(' L ')); svg.appendChild(p); const a = pts[pts.length - 2], b = pts[pts.length - 1]; const ang = Math.atan2(b[1] - a[1], b[0] - a[0]); const h = document.createElementNS(NS, 'path'); h.setAttribute('class', 'ah'); h.setAttribute('d', `M ${b[0] - 7 * Math.cos(ang - .5)} ${b[1] - 7 * Math.sin(ang - .5)} L ${b[0]} ${b[1]} L ${b[0] - 7 * Math.cos(ang + .5)} ${b[1] - 7 * Math.sin(ang + .5)}`); svg.appendChild(h); };
  const st = R($('.st', flow)); const rows = [0, 1, 2].map(r => $$('.fn', flow).filter(n => n.dataset.k.startsWith(r + '.')).sort((a, b) => a.offsetLeft - b.offsetLeft)); const first = R(rows[0][0]); const bus = first.l - 26;
  const p0 = document.createElementNS(NS, 'path'); p0.setAttribute('d', `M ${st.r} ${st.cy} L ${bus} ${st.cy} M ${bus} ${R(rows[0][0]).cy} L ${bus} ${R(rows[2][0]).cy}`); svg.appendChild(p0);
  rows.forEach(row => { const f = R(row[0]); line([[bus, f.cy], [f.l - 2, f.cy]]); row.forEach((n, i) => { if (i < row.length - 1) { const a = R(n), b = R(row[i + 1]); line([[a.r + 2, a.cy], [b.l - 2, a.cy]]); } }); }); }

/* ---------- init ---------- */
const host = $('#journeys'); const stages = [];
J.forEach(j => { const sec = build(j); host.appendChild(sec); });
const redraw = () => $$('.jr').forEach(drawFlow);
(document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()).then(() => { redraw(); });
addEventListener('resize', () => { redraw(); stages.forEach(s => { s.dims(); if (s.loaded) s.placePins(s.j.steps[s.i]); }); });
const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); } }), { threshold: .15 });
$$('.rv').forEach(e => io.observe(e));
J.forEach((j, n) => { const sec = $('#' + j.id); const s = new Stage(j, sec); stages.push(s); drawFlow(sec);
  const nodes = $$('.fn', sec); const fio = new IntersectionObserver(es => { if (es[0].isIntersecting) { nodes.forEach((nd, k) => setTimeout(() => nd.classList.add('in'), REDUCED ? 0 : 70 * k)); fio.disconnect(); } }, { threshold: .25 }); fio.observe($('.flow', sec));
  const sio = new IntersectionObserver(es => { const vis = es[0].isIntersecting; if (vis && !s.paused) { s.start(); } else if (!vis) { s.stop(); } }, { threshold: .5 }); sio.observe($('.stage', sec)); });
$$('.page>img').forEach(im => { im.classList.add('rv'); io.observe(im); });
window.__stages = stages;
