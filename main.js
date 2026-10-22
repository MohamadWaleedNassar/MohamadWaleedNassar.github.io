'use strict';
/* No dependencies. Content comes from data.js. */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = v => String(v).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const { CASES, PROJECTS, TIMELINE, SKILLS, EDUCATION, LEADERSHIP, STATS, ROLES, MAP, SITE } = window;

/* ---------- theme ---------- */
const root = document.documentElement;
const themeBtn = $('#theme');
function syncThemeLabel() {
  const dark = root.dataset.theme !== 'light';
  themeBtn.setAttribute('aria-label', dark ? 'Switch to light theme' : 'Switch to dark theme');
}
themeBtn.addEventListener('click', () => {
  root.dataset.theme = root.dataset.theme === 'light' ? 'dark' : 'light';
  try { localStorage.setItem('theme', root.dataset.theme); } catch (e) {}
  syncThemeLabel();
  window.dispatchEvent(new Event('themechange'));
});
syncThemeLabel();
const css = name => getComputedStyle(root).getPropertyValue(name).trim();

/* ---------- header, nav, progress ---------- */
const burger = $('#burger'), nav = $('#nav');
burger.addEventListener('click', () => {
  const open = burger.getAttribute('aria-expanded') !== 'true';
  burger.setAttribute('aria-expanded', open);
  nav.classList.toggle('open', open);
});
nav.addEventListener('click', e => { if (e.target.closest('a')) { burger.setAttribute('aria-expanded', 'false'); nav.classList.remove('open'); } });
addEventListener('keydown', e => { if (e.key === 'Escape') { burger.setAttribute('aria-expanded', 'false'); nav.classList.remove('open'); } });

const bar = $('#progress');
let ticking = false;
function onScroll() {
  const max = document.documentElement.scrollHeight - innerHeight;
  bar.style.width = (max > 0 ? scrollY / max * 100 : 0) + '%';
  fillTimeline();
  ticking = false;
}
addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
addEventListener('resize', onScroll);

const navLinks = $$('#nav a');
const spy = new IntersectionObserver(entries => {
  entries.forEach(en => { if (en.isIntersecting) navLinks.forEach(a => a.classList.toggle('on', a.getAttribute('href') === '#' + en.target.id)); });
}, { rootMargin: '-45% 0px -50% 0px' });
$$('main section[id]').forEach(s => spy.observe(s));

/* ---------- hero: headline reveal, role typer ---------- */
const h1 = $('#headline');
h1.innerHTML = h1.textContent.trim().split(/\s+/).map((w, i) => `<span class="w" style="animation-delay:${reduced ? 0 : 120 + i * 70}ms">${esc(w)}</span>`).join(' ');
h1.setAttribute('aria-label', h1.textContent);

const rot = $('#rotator');
if (!reduced && ROLES.length) {
  let r = 0, c = ROLES[0].length, del = true;
  (function tick() {
    const word = ROLES[r];
    if (del) { c--; if (c <= 0) { del = false; r = (r + 1) % ROLES.length; } }
    else { c++; if (c >= ROLES[r].length) { del = true; rot.textContent = ROLES[r]; return setTimeout(tick, 2200); } }
    rot.textContent = ROLES[r].slice(0, c);
    setTimeout(tick, del ? 26 : 55);
  })();
  setTimeout(() => {}, 0);
}

/* ---------- hero: illustrative CAN monitor (standard UDS services) ---------- */
const FR = [
  ['7DF', '02 10 03', 'Session control: extended'],
  ['7E0', '03 19 02 08', 'Read DTCs by status'],
  ['7E8', '06 59 02 FF C1 00 08', 'DTC report'],
  ['7E0', '03 22 F1 90', 'Read data ID F190'],
  ['7E8', '07 62 F1 90 4A 4E 38', 'Data ID response'],
  ['7E0', '04 14 FF FF FF', 'Clear DTCs'],
  ['7E8', '01 54', 'DTCs cleared'],
  ['7E0', '04 31 01 FF 00', 'Routine control: start'],
  ['7E8', '03 7F 31 78', 'Negative: response pending'],
  ['7E0', '02 3E 00', 'Tester present'],
  ['7E0', '06 2E F1 A0 01 02 03', 'Write data ID F1A0']
];
const list = $('#frames');
function pushFrame() {
  let [id, data, dec] = FR[Math.floor(Math.random() * FR.length)];
  if (id === '7E0' || id === '7E8') { const n = Math.floor(Math.random() * 4); id = (parseInt(id, 16) + n).toString(16).toUpperCase(); }
  const li = document.createElement('li');
  if (data.split(' ')[1] === '7F') li.className = 'neg';
  li.innerHTML = `<span class="id">${id}</span><span class="data">${data}</span><span class="dec">${esc(dec)}</span>`;
  list.appendChild(li);
  while (list.children.length > 8) list.firstChild.remove();
}
for (let i = 0; i < 6; i++) pushFrame();
let frameTimer;
if (!reduced) frameTimer = setInterval(pushFrame, 950);

/* ---------- hero: stats counters ---------- */
const statsEl = $('#stats');
statsEl.innerHTML = STATS.map(s => `<div><dt data-to="${s.value}" data-suffix="${esc(s.suffix)}">0</dt><dd>${esc(s.label)}</dd></div>`).join('');
const fmt = n => n.toLocaleString('en-US');
const countObs = new IntersectionObserver(es => es.forEach(en => {
  if (!en.isIntersecting) return;
  countObs.unobserve(en.target);
  const el = en.target, to = +el.dataset.to, suf = el.dataset.suffix;
  if (reduced) { el.textContent = fmt(to) + suf; return; }
  const t0 = performance.now(), dur = 1400;
  (function step(t) {
    const p = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - p, 3);
    el.textContent = fmt(Math.round(to * e)) + (p === 1 ? suf : '');
    if (p < 1) requestAnimationFrame(step);
  })(t0);
}), { threshold: .6 });
$$('#stats dt').forEach(el => countObs.observe(el));

/* ---------- hero: copper traces canvas ---------- */
(function traces() {
  const cv = $('#traces'), ctx = cv.getContext('2d');
  const G = 36;
  let W, H, paths = [], colors, running = false, raf;
  function build() {
    const dpr = Math.min(devicePixelRatio || 1, 2);
    const r = cv.getBoundingClientRect();
    W = r.width; H = r.height;
    cv.width = W * dpr; cv.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    colors = { line: css('--line2'), copper: css('--copper'), h: css('--canh'), l: css('--canl') };
    const count = W < 700 ? 9 : 18;
    paths = [];
    const cols = Math.floor(W / G), rows = Math.floor(H / G);
    for (let i = 0; i < count; i++) {
      let x = Math.floor(Math.random() * cols), y = Math.floor(Math.random() * rows);
      const pts = [[x * G, y * G]];
      let horiz = Math.random() < .5;
      const segs = 3 + Math.floor(Math.random() * 4);
      for (let s = 0; s < segs; s++) {
        const len = (2 + Math.floor(Math.random() * 5)) * (Math.random() < .5 ? -1 : 1);
        if (Math.random() < .28) { x += Math.sign(len) * 2; y += (Math.random() < .5 ? 1 : -1) * 2; }
        else if (horiz) x += len; else y += len;
        x = Math.max(0, Math.min(cols, x)); y = Math.max(0, Math.min(rows, y));
        pts.push([x * G, y * G]); horiz = !horiz;
      }
      const cum = [0];
      for (let k = 1; k < pts.length; k++) cum.push(cum[k - 1] + Math.hypot(pts[k][0] - pts[k - 1][0], pts[k][1] - pts[k - 1][1]));
      if (cum[cum.length - 1] < G) continue;
      paths.push({ pts, cum, total: cum[cum.length - 1], pos: Math.random() * cum[cum.length - 1], speed: 40 + Math.random() * 70, col: [colors.h, colors.l, colors.copper][i % 3] });
    }
  }
  function at(p, d) {
    d = ((d % p.total) + p.total) % p.total;
    let k = 1; while (p.cum[k] < d) k++;
    const t = (d - p.cum[k - 1]) / (p.cum[k] - p.cum[k - 1] || 1);
    return [p.pts[k - 1][0] + (p.pts[k][0] - p.pts[k - 1][0]) * t, p.pts[k - 1][1] + (p.pts[k][1] - p.pts[k - 1][1]) * t];
  }
  function draw(dt) {
    ctx.clearRect(0, 0, W, H);
    ctx.lineWidth = 1.5; ctx.lineJoin = 'round';
    for (const p of paths) {
      ctx.strokeStyle = colors.line; ctx.beginPath();
      p.pts.forEach((q, i) => i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1])); ctx.stroke();
      ctx.fillStyle = colors.copper;
      for (const q of [p.pts[0], p.pts[p.pts.length - 1]]) { ctx.beginPath(); ctx.arc(q[0], q[1], 3.5, 0, 7); ctx.fill(); }
      p.pos += p.speed * dt;
      ctx.strokeStyle = p.col; ctx.lineWidth = 2.5; ctx.globalAlpha = 1;
      ctx.beginPath();
      for (let k = 0; k <= 8; k++) { const q = at(p, p.pos - k * 5); k ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1]); }
      ctx.stroke(); ctx.lineWidth = 1.5;
    }
  }
  let last = 0;
  function loop(t) { if (!running) return; draw(Math.min(.05, (t - last) / 1000 || 0)); last = t; raf = requestAnimationFrame(loop); }
  function start() { if (running || reduced) return; running = true; last = performance.now(); raf = requestAnimationFrame(loop); }
  function stop() { running = false; cancelAnimationFrame(raf); }
  function init() { stop(); build(); draw(0); if (visible) start(); }
  let visible = true;
  new IntersectionObserver(es => { visible = es[0].isIntersecting; visible ? start() : stop(); }).observe(cv);
  let rs; addEventListener('resize', () => { clearTimeout(rs); rs = setTimeout(init, 200); });
  addEventListener('themechange', init);
  init();
})();

/* ---------- system map ---------- */
(function sysmap() {
  const svg = $('#mapsvg'), NS = 'http://www.w3.org/2000/svg';
  const X = [20, 250, 480, 720], NW = [200, 200, 200, 260], Y = [30, 168, 306], NH = 84;
  const byId = Object.fromEntries(MAP.nodes.map(n => [n.id, n]));
  const box = n => ({ x: X[n.col], y: Y[n.row], w: NW[n.col], h: NH });
  const mk = (t, a, parent = svg) => { const e = document.createElementNS(NS, t); for (const k in a) e.setAttribute(k, a[k]); parent.appendChild(e); return e; };
  const linkEls = MAP.links.map(([a, b]) => {
    const A = box(byId[a]), B = box(byId[b]);
    const x1 = A.x + A.w, y1 = A.y + A.h / 2, x2 = B.x, y2 = B.y + B.h / 2, mx = (x1 + x2) / 2;
    const path = mk('path', { class: 'lnk', d: `M${x1} ${y1}C${mx} ${y1} ${mx} ${y2} ${x2} ${y2}` });
    return { a, b, path, len: path.getTotalLength(), off: Math.random() };
  });
  const nodeEls = {};
  MAP.nodes.forEach(n => {
    const b = box(n);
    const g = mk('g', { class: 'node', tabindex: 0, role: 'button', 'aria-label': `${n.label}: ${n.sub}` });
    mk('rect', { x: b.x, y: b.y, width: b.w, height: b.h, rx: 12 }, g);
    mk('text', { x: b.x + 16, y: b.y + 36, class: 't1' }, g).textContent = n.label;
    mk('text', { x: b.x + 16, y: b.y + 60, class: 't2' }, g).textContent = n.sub;
    g.addEventListener('click', () => select(n.id));
    g.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); select(n.id); } });
    nodeEls[n.id] = g;
  });
  const pkts = linkEls.map(() => mk('circle', { r: 5, class: 'pkt' }));
  const detail = $('#mapdetail');
  function select(id) {
    const n = byId[id];
    Object.entries(nodeEls).forEach(([k, g]) => g.classList.toggle('on', k === id));
    linkEls.forEach(l => l.path.classList.toggle('on', l.a === id || l.b === id));
    detail.innerHTML = `<div><h3>${esc(n.label)}</h3><p>${esc(n.text)}</p></div>` + (n.case ? `<button class="btn ghost small" type="button" data-case="${n.case}">Open the case file</button>` : '');
  }
  detail.addEventListener('click', e => { const b = e.target.closest('[data-case]'); if (b) openCase(b.dataset.case, true); });
  select('vep');
  let on = true;
  new IntersectionObserver(es => { on = es[0].isIntersecting; if (on) requestAnimationFrame(anim); }).observe(svg);
  function anim(t) {
    if (!on) return;
    linkEls.forEach((l, i) => {
      const p = ((t / 2600) + l.off) % 1;
      const pt = l.path.getPointAtLength(p * l.len);
      pkts[i].setAttribute('cx', pt.x); pkts[i].setAttribute('cy', pt.y);
    });
    if (!reduced) requestAnimationFrame(anim);
  }
  requestAnimationFrame(anim);
})();

/* ---------- case files ---------- */
const tabs = $('#casetabs'), panel = $('#casepanel');
tabs.innerHTML = CASES.map((c, i) => `<button class="case-tab" role="tab" id="tab-${c.id}" aria-controls="casepanel" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}" data-id="${c.id}">${esc(c.title)}<small>${esc(c.period)}</small></button>`).join('');
function renderCase(id, animate = true) {
  const c = CASES.find(x => x.id === id); if (!c) return;
  $$('.case-tab', tabs).forEach(t => { const on = t.dataset.id === id; t.setAttribute('aria-selected', on); t.tabIndex = on ? 0 : -1; });
  panel.setAttribute('aria-labelledby', 'tab-' + id);
  panel.innerHTML = `
    <h3>${esc(c.title)}</h3><p class="case-where">${esc(c.where)} · ${esc(c.period)}</p>
    <p class="case-summary">${esc(c.summary)}</p>
    <div class="metrics">${c.result.map(r => `<div class="metric"><b>${esc(r[0])}</b><span>${esc(r[1])}</span></div>`).join('')}</div>
    <div class="case-cols">
      <div><h4>The situation</h4><p>${esc(c.context)}</p></div>
      <div><h4>What I built and did</h4><ul>${c.built.map(b => `<li>${esc(b)}</li>`).join('')}</ul></div>
    </div>
    <div class="stack">${c.stack.map(s => `<span>${esc(s)}</span>`).join('')}</div>
    ${c.note ? `<p class="case-note">${esc(c.note)}</p>` : ''}`;
  if (animate && !reduced) { panel.classList.remove('swap'); void panel.offsetWidth; panel.classList.add('swap'); }
}
tabs.addEventListener('click', e => { const b = e.target.closest('.case-tab'); if (b) renderCase(b.dataset.id); });
tabs.addEventListener('keydown', e => {
  const all = $$('.case-tab', tabs), i = all.indexOf(document.activeElement);
  if (i < 0) return;
  let n = -1;
  if (e.key === 'ArrowDown' || e.key === 'ArrowRight') n = (i + 1) % all.length;
  if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') n = (i - 1 + all.length) % all.length;
  if (n >= 0) { e.preventDefault(); all[n].focus(); renderCase(all[n].dataset.id); }
});
function openCase(id, scroll) {
  renderCase(id);
  if (dlg.open) dlg.close();
  if (scroll) $('#cases').scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' });
}
renderCase(CASES[0].id, false);

/* ---------- timeline ---------- */
const tl = $('#timeline');
tl.innerHTML = TIMELINE.map(t => `<li class="tl-item"><p class="tl-when">${esc(t.when)}</p><h3>${esc(t.org)}</h3><p class="tl-org">${esc(t.role)}</p><ul>${t.points.map(p => `<li>${esc(p)}</li>`).join('')}</ul></li>`).join('');
function fillTimeline() {
  const r = tl.getBoundingClientRect();
  const p = Math.max(0, Math.min(1, (innerHeight * .6 - r.top) / r.height));
  tl.style.setProperty('--fill', (p * 100).toFixed(1) + '%');
  $$('.tl-item', tl).forEach(li => li.classList.toggle('on', li.getBoundingClientRect().top < innerHeight * .6));
}

/* ---------- archive ---------- */
const cats = ['All', ...new Set(PROJECTS.map(p => p.category))];
let cat = 'All';
$('#filters').innerHTML = cats.map((c, i) => `<button class="chip" type="button" data-cat="${esc(c)}" aria-pressed="${i === 0}">${esc(c)}</button>`).join('');
const grid = $('#grid'), search = $('#search');
function renderGrid() {
  const q = search.value.trim().toLowerCase();
  const list = PROJECTS.filter(p => (cat === 'All' || p.category === cat) && [p.title, p.description, p.category, ...p.tags].join(' ').toLowerCase().includes(q));
  grid.innerHTML = list.map(p => `<button class="card" type="button" data-id="${p.id}"><div class="meta"><span>${esc(p.category)}</span><span>${esc(p.period)}</span></div><h3>${esc(p.title)}</h3><p>${esc(p.description)}</p><div class="tags">${p.tags.map(t => `<span class="tag">${esc(t)}</span>`).join('')}</div>${p.case ? '<span class="meta badge">Case file available</span>' : ''}</button>`).join('');
  $('#count').textContent = `${list.length} of ${PROJECTS.length} projects` + (q ? ` matching "${search.value.trim()}"` : '');
  $('#empty').hidden = list.length > 0;
}
$('#filters').addEventListener('click', e => {
  const b = e.target.closest('[data-cat]'); if (!b) return;
  cat = b.dataset.cat; $$('#filters .chip').forEach(x => x.setAttribute('aria-pressed', x === b)); renderGrid();
});
search.addEventListener('input', renderGrid);
renderGrid();

const dlg = $('#dlg');
let back;
grid.addEventListener('click', e => {
  const b = e.target.closest('.card'); if (!b) return;
  const p = PROJECTS.find(x => x.id === b.dataset.id);
  if (p.case) return openCase(p.case, true);
  back = b;
  $('#dlg-body').innerHTML = `<p class="meta">${esc(p.category)} · ${esc(p.period)}</p><h2 id="dlg-title">${esc(p.title)}</h2><p>${esc(p.description)}</p><div class="stack">${p.tags.map(t => `<span>${esc(t)}</span>`).join('')}</div>` +
    (p.link && /^https:\/\//.test(p.link) ? `<div class="cta"><a class="btn" href="${esc(p.link)}" target="_blank" rel="noopener">Open project materials</a></div>` : '');
  dlg.showModal(); document.body.classList.add('lock');
});
$('#dlg-x').addEventListener('click', () => dlg.close());
dlg.addEventListener('click', e => { if (e.target === dlg) dlg.close(); });
dlg.addEventListener('close', () => { document.body.classList.remove('lock'); if (back && document.contains(back)) back.focus(); });

/* ---------- toolkit ---------- */
$('#skills').innerHTML = SKILLS.map(s => `<section class="skill"><h3>${esc(s.group)}</h3><ul>${s.items.map(i => `<li>${esc(i)}</li>`).join('')}</ul></section>`).join('');
$('#edu').innerHTML = EDUCATION.map(e => `<details><summary><span>${esc(e.title)}<small>${esc(e.org)} · ${esc(e.when)}</small></span></summary><p>${esc(e.text)}</p></details>`).join('');
$('#lead').innerHTML = LEADERSHIP.map(l => `<li><span>${esc(l.role)}</span><span>${esc(l.org)}</span><span>${esc(l.when)}</span></li>`).join('');

/* ---------- contact + footer ---------- */
$('#copy').addEventListener('click', async () => {
  const out = $('#copied');
  try { await navigator.clipboard.writeText(SITE.email); out.textContent = 'Copied ' + SITE.email; }
  catch (e) { out.textContent = 'Copy failed. The address is ' + SITE.email; }
});
$('#year').textContent = new Date().getFullYear();
onScroll();
