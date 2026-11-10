/* Earth Mechanics Academy — app engine.
   Content lives in content/*.js, each pushing a module into window.COURSE. */
(function(){
"use strict";
const C = window.COURSE, MODS = C.modules;
const LES = {}, PROB = {}, MOD = {};
MODS.forEach(m => {
  MOD[m.id] = m;
  m.lessons.forEach((l, i) => { l.mod = m.id; l.idx = i; LES[l.id] = l; });
  (m.problems || []).forEach(p => { p.mod = m.id; PROB[p.id] = p; });
});
const LVL = {1:"Concept", 2:"Apply", 3:"Extend"};
const view = document.getElementById("view"), side = document.getElementById("side");

/* ---------- storage (per-viewer convenience only) ---------- */
const KEY = "ema-progress-v1";
let S = {p:{}, l:{}, d:{}, last:null};
try { const s = JSON.parse(localStorage.getItem(KEY) || "null"); if (s) S = Object.assign(S, s); } catch(e) {}
function save(){ try { localStorage.setItem(KEY, JSON.stringify(S)); } catch(e) {} updateTop(); }

/* ---------- helpers ---------- */
const $ = (sel, el=document) => el.querySelector(sel);
function h(html){ const t = document.createElement("template"); t.innerHTML = html.trim(); return t.content.firstElementChild; }
function esc(s){ return String(s).replace(/[&<>"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c])); }
function tx(s){
  if (s == null) return "";
  s = String(s);
  const K = window.katex;
  const r = (t, d) => K ? K.renderToString(t, {displayMode:d, output:"mathml", throwOnError:false, strict:false})
                         : '<code>' + esc(t) + '</code>';
  return s.replace(/\\\[([\s\S]+?)\\\]/g, (m, t) => d1(r(t, true)))
          .replace(/\\\(([\s\S]+?)\\\)/g, (m, t) => r(t, false));
  function d1(x){ return K ? x : '<div class="katex-display">' + x + '</div>'; }
}
function fmt(x, sig=3){
  if (!isFinite(x)) return "—";
  if (x === 0) return "0";
  const a = Math.abs(x);
  if (a >= 1e5 || a < 1e-3) { const e = Math.floor(Math.log10(a)); const m = x / Math.pow(10, e); return (+m.toPrecision(sig)) + "×10" + sup(e); }
  return String(+x.toPrecision(sig));
}
function sup(n){ return String(n).split("").map(c => "⁰¹²³⁴⁵⁶⁷⁸⁹"["0123456789".indexOf(c)] || (c === "-" ? "⁻" : c)).join(""); }
function shuffle(a){ a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
function css(v){ return getComputedStyle(document.documentElement).getPropertyValue(v).trim() || "#888"; }

/* ---------- mastery ---------- */
function stats(m){
  const ps = m.problems || [];
  let c = 0, a = 0;
  ps.forEach(p => { const r = S.p[p.id]; if (r) { a++; if (r.c) c++; } });
  const lc = m.lessons.filter(l => S.l[l.id]).length;
  return {tot: ps.length, c, a, lc, ln: m.lessons.length, pct: ps.length ? c / ps.length : 0};
}
function state(st){
  if (!st.a && !st.lc) return "Not started";
  if (st.pct >= 1) return "Mastered";
  if (st.pct >= .7) return "Proficient";
  if (st.pct >= .35) return "Familiar";
  return "Attempted";
}
function totalSolved(){ return Object.values(S.p).filter(r => r.c).length; }
function updateTop(){ const el = document.getElementById("topSolved"); if (el) el.textContent = totalSolved() + " / " + Object.keys(PROB).length; }

/* ---------- sidebar ---------- */
function renderSide(cur){
  const groups = {};
  MODS.forEach(m => { (groups[m.group || "Course"] = groups[m.group || "Course"] || []).push(m); });
  let html = '<div class="side-sec"><a class="side-mod' + (cur.r === "home" ? " on" : "") + '" href="#home" style="--mc:var(--ink)"><span class="side-dot"></span>Course overview</a>'
    + '<a class="side-mod' + (cur.r === "practice" && cur.id === "mixed" ? " on" : "") + '" href="#practice-mixed" style="--mc:var(--accent)"><span class="side-dot"></span>Mixed review</a>'
    + '<a class="side-mod' + (cur.r === "drill" ? " on" : "") + '" href="#drill" style="--mc:var(--bad)"><span class="side-dot"></span>Exam &amp; interview drill</a></div>';
  Object.keys(groups).forEach(g => {
    html += '<div class="side-sec"><span class="eyebrow">' + esc(g) + '</span>';
    groups[g].forEach(m => {
      const st = stats(m), active = cur.mod === m.id;
      html += '<a class="side-mod' + (active ? " on" : "") + '" href="#mod-' + m.id + '" style="--mc:var(--' + m.color + ')"><span class="side-dot"></span>' + esc(m.title) + '<span class="pct">' + Math.round(st.pct * 100) + '%</span></a>';
      if (active) {
        html += '<ul class="side-les">' + m.lessons.map(l => '<li><a href="#les-' + l.id + '" class="' + (cur.id === l.id ? "on" : "") + '"><span class="tick">' + (S.l[l.id] ? "✓" : "") + '</span>' + esc(l.title) + '</a></li>').join("")
          + '<li><a href="#practice-' + m.id + '" class="' + (cur.r === "practice" && cur.id === m.id ? "on" : "") + '"><span class="tick">✎</span>Practice set (' + (m.problems || []).length + ')</a></li></ul>';
      }
    });
    html += '</div>';
  });
  side.innerHTML = html;
}

/* ---------- router ---------- */
function parse(){
  const hsh = location.hash.replace(/^#/, "") || "home";
  let m;
  if ((m = hsh.match(/^mod-(.+)$/)) && MOD[m[1]]) return {r:"mod", id:m[1], mod:m[1]};
  if ((m = hsh.match(/^les-(.+)$/)) && LES[m[1]]) return {r:"les", id:m[1], mod:LES[m[1]].mod};
  if ((m = hsh.match(/^practice-(.+)$/)) && (MOD[m[1]] || m[1] === "mixed")) return {r:"practice", id:m[1], mod:MOD[m[1]] ? m[1] : null};
  if (hsh === "drill") return {r:"drill"};
  return {r:"home"};
}
function route(){
  const cur = parse();
  document.body.classList.remove("nav-open");
  document.getElementById("menuBtn").setAttribute("aria-expanded", "false");
  renderSide(cur);
  document.querySelectorAll(".top-links a").forEach(a => a.classList.toggle("on", a.dataset.r === (cur.r === "practice" ? "practice-" + cur.id : cur.r)));
  view.innerHTML = "";
  if (cur.r === "mod") renderMod(MOD[cur.id]);
  else if (cur.r === "les") renderLesson(LES[cur.id]);
  else if (cur.r === "practice") renderPractice(cur.id);
  else if (cur.r === "drill") renderDrill();
  else renderHome();
  if (cur.r === "les") { S.last = cur.id; save(); }
  window.scrollTo(0, 0);
  updateTop();
}
window.addEventListener("hashchange", route);
document.getElementById("menuBtn").addEventListener("click", e => {
  const open = document.body.classList.toggle("nav-open");
  e.currentTarget.setAttribute("aria-expanded", String(open));
});

/* ---------- home ---------- */
function renderHome(){
  const nL = Object.keys(LES).length, nP = Object.keys(PROB).length, nD = (C.drill || []).length;
  const last = S.last && LES[S.last];
  const el = h('<div></div>');
  el.innerHTML = '<div class="hero"><div><span class="eyebrow">Geophysical mechanics &amp; dynamics</span><h1>Learn the mechanics of a moving planet, one balance law at a time.</h1>'
    + '<p class="lede">Short lessons built from the course notes, interactive models you can push on, and practice that climbs from concept checks to research-style estimates. Then drill yourself the way a qualifying-exam or fellowship panel would.</p>'
    + '<div class="row" style="margin-top:18px">' + (last ? '<a class="btn pri" href="#les-' + last.id + '">Continue: ' + esc(last.title) + '</a>' : '<a class="btn pri" href="#les-' + MODS[0].lessons[0].id + '">Start the first lesson</a>')
    + '<a class="btn" href="#practice-mixed">Mixed review</a><a class="btn" href="#drill">Exam drill</a></div></div>'
    + '<div class="seis-wrap"><canvas class="seismo" id="seismo" width="600" height="150" aria-label="Synthetic seismogram with P, S and surface-wave arrivals"></canvas>'
    + '<div class="row" style="justify-content:space-between;margin-top:6px"><span class="src">' + MODS.length + ' modules · ' + nL + ' lessons · ' + nP + ' problems · ' + nD + ' drill questions</span><span class="src">S − P ≈ 8 s/km⁻¹ rule</span></div></div></div>';
  const groups = {};
  MODS.forEach(m => { (groups[m.group || "Course"] = groups[m.group || "Course"] || []).push(m); });
  Object.keys(groups).forEach(g => {
    el.appendChild(h('<h2 style="margin-top:8px">' + esc(g) + '</h2>'));
    const grid = h('<div class="grid-mods"></div>');
    groups[g].forEach(m => {
      const st = stats(m), s = state(st);
      grid.appendChild(h('<a class="mod-card" href="#mod-' + m.id + '" style="--mc:var(--' + m.color + ')"><span class="strata"></span>'
        + '<div class="row" style="justify-content:space-between"><span class="eyebrow">' + m.lessons.length + ' lessons · ' + (m.problems || []).length + ' problems</span><span class="state ' + s.split(" ")[0] + '">' + s + '</span></div>'
        + '<h3>' + esc(m.title) + '</h3><p>' + esc(m.blurb) + '</p>'
        + '<div class="bar"><i style="width:' + Math.round(st.pct * 100) + '%"></i></div>'
        + '<div class="meta"><span>' + st.lc + '/' + st.ln + ' lessons read</span><span>' + st.c + '/' + st.tot + ' solved</span></div></a>'));
    });
    el.appendChild(grid);
  });
  el.appendChild(h('<div class="two"><div class="panel"><span class="eyebrow">How to use this</span><h3 style="margin:6px 0 8px">Learn, then apply, then explain</h3>'
    + '<ol style="padding-left:1.2em;margin:0;color:var(--muted)"><li>Read a lesson and work its example before opening the solution.</li><li>Do the module practice set. Levels climb from <b>Concept</b> to <b>Apply</b> to <b>Extend</b>; mastery counts only answers you got without revealing the solution.</li><li>Use <b>Mixed review</b> to interleave modules, which is what exams do.</li><li>Finish in the <b>Exam drill</b>: answer out loud, then compare with a model answer.</li></ol></div>'
    + '<div class="panel"><span class="eyebrow">The thread through everything</span><h3 style="margin:6px 0 8px">Conservation law + constitutive law + boundary conditions</h3>'
    + '<p class="muted">Tides, tsunamis, glaciers, flexure, plate cooling, post-glacial rebound and eruptions are all the same recipe with different materials and different small parameters. The <a href="#mod-synth">Synthesis</a> module makes that explicit with a concept map and two case studies.</p></div></div>'));
  view.appendChild(el);
  drawSeismo(document.getElementById("seismo"));
}
function drawSeismo(cv){
  if (!cv) return;
  const dpr = window.devicePixelRatio || 1, W = cv.clientWidth || 600, H = 150;
  cv.width = W * dpr; cv.height = H * dpr; const g = cv.getContext("2d"); g.scale(dpr, dpr);
  const ink = css("--ink"), mut = css("--muted"), acc = css("--accent"), warn = css("--volc");
  g.strokeStyle = css("--line"); g.lineWidth = 1;
  for (let x = 0; x < W; x += 40) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, H - 18); g.stroke(); }
  let seed = 7; const rnd = () => (seed = (seed * 9301 + 49297) % 233280) / 233280 - .5;
  const tP = .2 * W, tS = .42 * W, tR = .62 * W, mid = (H - 18) / 2;
  g.beginPath(); g.strokeStyle = ink; g.lineWidth = 1.2;
  for (let x = 0; x < W; x++) {
    let a = rnd() * 1.2;
    if (x > tP) a += 12 * Math.exp(-(x - tP) / 40) * Math.sin((x - tP) * .9) + rnd() * 4 * Math.exp(-(x - tP) / 120);
    if (x > tS) a += 30 * Math.exp(-(x - tS) / 55) * Math.sin((x - tS) * .5) + rnd() * 6 * Math.exp(-(x - tS) / 160);
    if (x > tR) a += 42 * Math.exp(-(x - tR) / 70) * Math.sin((x - tR) * .16 * (1 + (x - tR) / 300));
    x ? g.lineTo(x, mid - a) : g.moveTo(x, mid - a);
  }
  g.stroke();
  g.font = "11px 'IBM Plex Mono', monospace"; g.fillStyle = mut;
  [[tP, "P", acc], [tS, "S", warn], [tR, "Surface waves", ink]].forEach(([x, t, c]) => {
    g.strokeStyle = c; g.setLineDash([3, 3]); g.beginPath(); g.moveTo(x, 4); g.lineTo(x, H - 18); g.stroke(); g.setLineDash([]);
    g.fillStyle = c; g.fillText(t, x + 4, H - 4);
  });
}

/* ---------- module page ---------- */
function renderMod(m){
  const st = stats(m), s = state(st);
  const el = h('<div style="--mc:var(--' + m.color + ')"></div>');
  el.innerHTML = '<div class="crumbs"><a href="#home">Course</a> / ' + esc(m.group || "") + '</div>'
    + '<div class="mod-head"><span class="eyebrow">' + esc(m.source || "") + '</span><h1>' + esc(m.title) + '</h1><p>' + tx(m.blurb) + '</p></div>'
    + '<div class="why"><span class="eyebrow">Why it matters in research</span><p style="margin-top:6px">' + tx(m.why) + '</p></div>'
    + '<div class="row" style="justify-content:space-between;max-width:820px;margin-bottom:10px"><h2>Lessons</h2><span class="state ' + s.split(" ")[0] + '">' + s + '</span></div>';
  const ol = h('<ol class="les-list"></ol>');
  m.lessons.forEach((l, i) => ol.appendChild(h('<li><a href="#les-' + l.id + '"><span class="les-num' + (S.l[l.id] ? " done" : "") + '">' + (i + 1) + '</span><span><span class="t">' + esc(l.title) + '</span><span class="s" style="display:block">' + esc(l.summary || "") + '</span></span><span class="m">' + (l.mins || 6) + ' min' + (l.src ? '<br>' + esc(l.src) : '') + '</span></a></li>')));
  el.appendChild(ol);
  if ((m.problems || []).length) {
    const pr = h('<div class="panel" style="max-width:820px;margin-top:22px"><div class="row" style="justify-content:space-between"><div><span class="eyebrow">Practice set</span><h3 style="margin-top:4px">' + m.problems.length + ' problems · ' + st.c + ' solved</h3></div><a class="btn pri" href="#practice-' + m.id + '">Practice</a></div><div class="squares" style="margin-top:14px"></div>'
      + '<p class="muted" style="font-size:.85rem;margin-top:10px">' + [1, 2, 3].map(L => LVL[L] + ": " + m.problems.filter(p => p.lvl === L).length).join(" · ") + '</p></div>');
    const sq = $(".squares", pr);
    m.problems.forEach((p, i) => { const r = S.p[p.id]; const b = h('<button class="sq ' + (r ? (r.c ? "ok" : "tried") : "") + '" title="Problem ' + (i + 1) + ': ' + LVL[p.lvl] + '" aria-label="Problem ' + (i + 1) + '"></button>'); b.onclick = () => { practiceStart = p.id; location.hash = "practice-" + m.id; }; sq.appendChild(b); });
    el.appendChild(pr);
  }
  view.appendChild(el);
}

/* ---------- lesson page ---------- */
function renderLesson(l){
  const m = MOD[l.mod];
  const el = h('<article class="lesson" style="--mc:var(--' + m.color + ')"></article>');
  let html = '<div class="crumbs"><a href="#home">Course</a> / <a href="#mod-' + m.id + '">' + esc(m.title) + '</a> / Lesson ' + (l.idx + 1) + ' of ' + m.lessons.length + '</div>'
    + '<span class="eyebrow">' + esc(l.kind || "Lesson") + ' · ' + (l.mins || 6) + ' min' + (l.src ? ' · from ' + esc(l.src) : '') + '</span>'
    + '<h1 style="margin-top:6px">' + esc(l.title) + '</h1>'
    + (l.intro ? '<p class="lede">' + tx(l.intro) + '</p>' : '');
  if (l.key) html += '<div class="keybox"><span class="eyebrow">Key idea</span><div class="k">' + tx(l.key) + '</div></div>';
  (l.sections || []).forEach((s, i) => {
    html += '<section>' + (s.h ? '<h3>' + tx(s.h) + '</h3>' : '') + tx(s.b) + '</section>';
    if (l.widget && (l.widgetAfter === i)) html += '<div data-widget="' + l.widget + '"></div>';
  });
  if (l.widget && l.widgetAfter == null) html += '<div data-widget="' + l.widget + '"></div>';
  (l.examples || (l.example ? [l.example] : [])).forEach(ex => {
    html += '<details class="ex"><summary>Worked example: ' + tx(ex.t || "try it, then open") + '</summary><div class="exb"><div>' + tx(ex.q) + '</div><div class="sol"><span class="eyebrow">Solution</span>' + tx(ex.s) + '</div></div></details>';
  });
  if (l.mistakes) html += '<div class="callout" style="border-left:3px solid var(--bad)"><span class="eyebrow">Common mistakes</span>' + tx(l.mistakes) + '</div>';
  if (l.research) html += '<div class="callout"><span class="eyebrow">In research</span>' + tx(l.research) + '</div>';
  if (l.oral) html += '<div class="callout" style="border-left:3px solid var(--accent)"><span class="eyebrow">An examiner might ask</span><p><b>' + tx(l.oral) + '</b></p><p class="muted" style="font-size:.9rem;margin-top:4px">Answer out loud in under two minutes before moving on. The <a href="#drill">Exam drill</a> has model answers.</p></div>';
  if (l.connects && l.connects.length) html += '<div style="margin-top:20px"><span class="eyebrow">Connects to</span><div class="connects">' + l.connects.filter(id => LES[id]).map(id => '<a class="chip" href="#les-' + id + '" style="--mc:var(--' + MOD[LES[id].mod].color + ')"><span class="pip" style="background:var(--mc)"></span>' + esc(LES[id].title) + '</a>').join("") + '</div></div>';
  el.innerHTML = html;
  const qs = (m.problems || []).filter(p => p.lesson === l.id).slice(0, 2);
  if (qs.length) {
    el.appendChild(h('<h2 style="margin-top:34px">Check your understanding</h2>'));
    qs.forEach(p => el.appendChild(problemCard(p)));
  }
  const prev = m.lessons[l.idx - 1], next = m.lessons[l.idx + 1];
  const foot = h('<div class="les-foot"><div>' + (prev ? '<a class="btn" href="#les-' + prev.id + '">← ' + esc(prev.title) + '</a>' : '<a class="btn" href="#mod-' + m.id + '">← Module overview</a>') + '</div><div class="row"></div></div>');
  const done = h('<button class="btn">' + (S.l[l.id] ? "✓ Completed" : "Mark complete") + '</button>');
  done.onclick = () => { S.l[l.id] = !S.l[l.id]; if (!S.l[l.id]) delete S.l[l.id]; save(); done.textContent = S.l[l.id] ? "✓ Completed" : "Mark complete"; renderSide(parse()); };
  const nx = h(next ? '<a class="btn pri" href="#les-' + next.id + '">Next: ' + esc(next.title) + ' →</a>' : '<a class="btn pri" href="#practice-' + m.id + '">Practice this module →</a>');
  nx.addEventListener("click", () => { if (!S.l[l.id]) { S.l[l.id] = true; save(); } });
  $(".row", foot).append(done, nx);
  el.appendChild(foot);
  view.appendChild(el);
  el.querySelectorAll("[data-widget]").forEach(w => mountWidget(w.dataset.widget, w));
}

/* ---------- problem card ---------- */
function problemCard(p, onDone){
  const m = MOD[p.mod];
  const el = h('<div class="prob" style="--mc:var(--' + m.color + ')"></div>');
  let hintsShown = 0, revealed = false, sel = null;
  const head = '<div class="ph"><span class="chip lvl' + p.lvl + '"><span class="pip"></span>' + LVL[p.lvl] + '</span>' + (p.skill ? '<span class="chip">' + esc(p.skill) + '</span>' : '') + (p.src ? '<span class="src">' + esc(p.src) + '</span>' : '') + '</div>';
  el.innerHTML = head + '<div class="q">' + tx(p.q) + '</div><div class="ans"></div><div class="row btns" style="margin-top:6px"></div><div class="fbz"></div><div class="hints"></div><div class="solz"></div>';
  const ans = $(".ans", el), btns = $(".btns", el), fbz = $(".fbz", el), hints = $(".hints", el), solz = $(".solz", el);
  let getVal;
  if (p.type === "mc") {
    const wrap = h('<div class="choices" role="radiogroup"></div>');
    p.choices.forEach((c, i) => {
      const b = h('<button class="choice" role="radio" aria-checked="false"><span class="ltr">' + "ABCDEF"[i] + '</span><span>' + tx(c) + '</span></button>');
      b.onclick = () => { sel = i; wrap.querySelectorAll(".choice").forEach((x, j) => { x.classList.toggle("sel", j === i); x.setAttribute("aria-checked", String(j === i)); }); };
      wrap.appendChild(b);
    });
    ans.appendChild(wrap);
    getVal = () => sel;
  } else if (p.type === "num") {
    const id = "in-" + p.id;
    const r = h('<div class="numrow"><label for="' + id + '" class="muted" style="font-size:.9rem">Your answer</label><input id="' + id + '" inputmode="decimal" autocomplete="off" placeholder="e.g. 4.2 or 3e5"><span class="unit">' + tx(p.unit || "") + '</span></div>');
    ans.appendChild(r);
    const inp = $("input", r);
    inp.addEventListener("keydown", e => { if (e.key === "Enter") check(); });
    getVal = () => { const v = inp.value.trim().replace(/×\s*10\^?/, "e").replace(/\*\s*10\^/, "e").replace(/,/g, ""); return v === "" ? null : Number(v); };
  } else {
    ans.appendChild(h('<textarea class="notes" id="ta-' + p.id + '" aria-label="Your answer" placeholder="Sketch your answer: the governing balance, the estimate, the assumptions."></textarea>'));
    getVal = () => true;
  }
  const bCheck = h('<button class="btn pri sm">' + (p.type === "oral" ? "Compare with model answer" : "Check") + '</button>');
  const bHint = h('<button class="btn sm">Hint</button>');
  const bSol = h('<button class="btn sm">Show solution</button>');
  btns.append(bCheck);
  if (p.hints && p.hints.length) btns.append(bHint);
  if (p.type !== "oral") btns.append(bSol);
  bCheck.onclick = check; bHint.onclick = () => { if (hintsShown < p.hints.length) { hints.appendChild(h('<div class="hint"><b>Hint ' + (hintsShown + 1) + ':</b> ' + tx(p.hints[hintsShown]) + '</div>')); hintsShown++; } if (hintsShown >= p.hints.length) bHint.disabled = true; };
  bSol.onclick = showSol;
  function record(ok){ const r = S.p[p.id] || {c:false, a:0}; r.a++; if (ok && !revealed) r.c = true; S.p[p.id] = r; save(); if (onDone) onDone(ok); }
  function showSol(){ if (revealed) return; revealed = true; if (!S.p[p.id]) { S.p[p.id] = {c:false, a:1}; save(); if (onDone) onDone(false); } solz.appendChild(h('<div class="sol"><span class="eyebrow">Solution</span>' + tx(p.sol) + '</div>')); bSol.disabled = true; }
  function check(){
    const v = getVal();
    if (p.type === "oral") {
      if (revealed) return; revealed = true;
      solz.appendChild(h('<div class="sol"><span class="eyebrow">Model answer</span>' + tx(p.sol) + '</div>'));
      const rate = h('<div class="row" style="margin-top:12px"><span class="muted" style="font-size:.9rem">How did you do?</span></div>');
      const y = h('<button class="btn sm">I covered the key points</button>'), n = h('<button class="btn sm">Not yet</button>');
      y.onclick = () => { const r = S.p[p.id] || {c:false, a:0}; r.a++; r.c = true; S.p[p.id] = r; save(); rate.innerHTML = '<span class="fb ok" style="margin:0">Marked as solved.</span>'; if (onDone) onDone(true); };
      n.onclick = () => { const r = S.p[p.id] || {c:false, a:0}; r.a++; S.p[p.id] = r; save(); rate.innerHTML = '<span class="fb no" style="margin:0">Logged. Revisit the linked lesson and try again later.</span>'; if (onDone) onDone(false); };
      rate.append(y, n); solz.appendChild(rate); bCheck.disabled = true; return;
    }
    if (v == null || (p.type === "num" && !isFinite(v))) { fbz.innerHTML = '<div class="fb no">' + (p.type === "mc" ? "Pick an answer first." : "Enter a number (scientific notation like 3.2e5 is fine).") + '</div>'; return; }
    let ok;
    if (p.type === "mc") ok = v === p.ans;
    else { const tol = p.tol == null ? .05 : p.tol; ok = Math.abs(v - p.ans) <= tol * Math.abs(p.ans) + 1e-12; }
    record(ok);
    fbz.innerHTML = ok ? '<div class="fb ok"><b>Correct.</b> ' + (p.type === "num" ? "Reference answer: " + fmt(p.ans) + " " + esc(p.unitText || stripTex(p.unit)) + "." : "") + (revealed ? " (Solution was shown, so this doesn't count toward mastery.)" : "") + '</div>'
      : '<div class="fb no"><b>Not quite.</b> ' + (p.type === "num" ? "Check units and powers of ten. " : "") + (p.hints && hintsShown < p.hints.length ? "Try a hint." : "Open the solution to see the reasoning.") + '</div>';
    if (ok) showSolSoft();
  }
  function showSolSoft(){ if (!$(".sol", solz)) solz.appendChild(h('<div class="sol"><span class="eyebrow">Why</span>' + tx(p.sol) + '</div>')); bSol.disabled = true; }
  if (p.lesson && LES[p.lesson]) el.appendChild(h('<p class="src" style="margin-top:12px">Review: <a href="#les-' + p.lesson + '">' + esc(LES[p.lesson].title) + '</a></p>'));
  return el;
}
function stripTex(s){ return String(s || "").replace(/\\\(|\\\)|\\mathrm|\\,|[{}]/g, "").replace(/\^/g, ""); }

/* ---------- practice ---------- */
let practiceStart = null;
function renderPractice(id){
  const isMixed = id === "mixed", m = MOD[id];
  let pool = isMixed ? [] : m.problems.slice();
  if (isMixed) {
    const all = Object.values(PROB);
    const unsolved = shuffle(all.filter(p => !(S.p[p.id] && S.p[p.id].c))), solved = shuffle(all.filter(p => S.p[p.id] && S.p[p.id].c));
    pool = unsolved.concat(solved).slice(0, 12);
  }
  let lv = 0, i = 0;
  if (practiceStart) { const k = pool.findIndex(p => p.id === practiceStart); if (k >= 0) i = k; practiceStart = null; }
  const el = h('<div style="max-width:820px;' + (m ? '--mc:var(--' + m.color + ')' : '') + '"></div>');
  el.innerHTML = '<div class="crumbs"><a href="#home">Course</a>' + (m ? ' / <a href="#mod-' + m.id + '">' + esc(m.title) + '</a>' : '') + '</div>'
    + '<span class="eyebrow">' + (isMixed ? "Interleaved across all modules · unsolved first" : "Practice set") + '</span><h1 style="margin-top:6px">' + (isMixed ? "Mixed review" : esc(m.title)) + '</h1>'
    + '<div class="filters" role="group" aria-label="Filter by level"></div><div class="squares" style="margin:6px 0 4px"></div><div class="slot"></div>'
    + '<div class="row" style="justify-content:space-between;margin-top:6px"><button class="btn prev">← Previous</button><span class="muted pos mono" style="font-size:.85rem"></span><button class="btn pri next">Next →</button></div>'
    + (isMixed ? '<p style="margin-top:16px"><button class="btn sm reshuf">Draw a new set</button></p>' : '');
  const filt = $(".filters", el), sqs = $(".squares", el), slot = $(".slot", el);
  const list = () => pool.filter(p => !lv || p.lvl === lv);
  ["All", "Concept", "Apply", "Extend"].forEach((t, k) => { const b = h('<button class="' + (k === 0 ? "on" : "") + '">' + t + '</button>'); b.onclick = () => { lv = k; i = 0; filt.querySelectorAll("button").forEach((x, j) => x.classList.toggle("on", j === k)); draw(); }; filt.appendChild(b); });
  function draw(){
    const L = list();
    sqs.innerHTML = "";
    L.forEach((p, k) => { const r = S.p[p.id]; const b = h('<button class="sq ' + (r ? (r.c ? "ok" : "tried") : "") + (k === i ? " cur" : "") + '" aria-label="Problem ' + (k + 1) + '"></button>'); b.onclick = () => { i = k; draw(); }; sqs.appendChild(b); });
    slot.innerHTML = "";
    if (!L.length) { slot.appendChild(h('<p class="muted">No problems at this level yet.</p>')); return; }
    i = Math.max(0, Math.min(i, L.length - 1));
    const p = L[i];
    if (isMixed) slot.appendChild(h('<span class="chip" style="margin-top:8px;--mc:var(--' + MOD[p.mod].color + ')"><span class="pip" style="background:var(--mc)"></span>' + esc(MOD[p.mod].title) + '</span>'));
    slot.appendChild(problemCard(p, () => { const r = S.p[p.id]; const b = sqs.children[i]; if (b) b.className = "sq cur " + (r && r.c ? "ok" : "tried"); renderSide(parse()); }));
    $(".pos", el).textContent = (i + 1) + " / " + L.length;
    $(".prev", el).disabled = i === 0; $(".next", el).disabled = i === L.length - 1;
  }
  $(".prev", el).onclick = () => { i--; draw(); window.scrollTo(0, 0); };
  $(".next", el).onclick = () => { i++; draw(); window.scrollTo(0, 0); };
  if (isMixed) $(".reshuf", el).onclick = () => route();
  view.appendChild(el); draw();
}

/* ---------- drill ---------- */
function renderDrill(){
  const D = C.drill || [];
  const cats = [...new Set(D.map(d => d.cat))];
  let cat = "All", order = shuffle(D), i = 0, timer = null, tleft = 0;
  const el = h('<div style="max-width:820px"></div>');
  el.innerHTML = '<span class="eyebrow">Qualifying exam · fellowship interview</span><h1 style="margin-top:6px">Exam &amp; interview drill</h1>'
    + '<p class="muted" style="margin:12px 0 16px;max-width:68ch">Panels probe whether you can reason from first principles, estimate fast, and connect your field to physics. Answer each question out loud with the timer running, then compare with the model answer and rate yourself honestly.</p>'
    + '<details class="ex"><summary>A structure for any oral answer</summary><div class="exb"><ol style="padding-left:1.2em;margin:0"><li><b>Name the balance.</b> “This is a force balance between buoyancy and viscous drag…”</li><li><b>Write the one equation</b> that captures it, and define terms.</li><li><b>Put in numbers</b> to one significant figure. Say the answer with units.</li><li><b>State the assumption that could break</b> and what happens if it does.</li><li><b>Tie to an observation</b> or dataset (GPS, tide gauges, seismograms, InSAR, heat flow).</li></ol><p class="muted" style="margin-top:10px">If you get stuck, say what you would need to know and how you would estimate it. Panels reward visible reasoning more than a memorised result.</p></div></details>'
    + '<div class="row" style="justify-content:space-between;margin:14px 0 4px"><div class="filters" role="group" aria-label="Category"></div><span class="mono muted tally" style="font-size:.85rem"></span></div><div class="slot"></div>';
  const filt = $(".filters", el), slot = $(".slot", el);
  ["All"].concat(cats).forEach(c => { const b = h('<button class="' + (c === "All" ? "on" : "") + '">' + esc(c) + '</button>'); b.onclick = () => { cat = c; i = 0; filt.querySelectorAll("button").forEach(x => x.classList.toggle("on", x === b)); draw(); }; filt.appendChild(b); });
  function list(){ return order.filter(d => cat === "All" || d.cat === cat); }
  function tally(){ const v = Object.values(S.d); $(".tally", el).textContent = "Nailed " + v.filter(x => x === "n").length + " · Shaky " + v.filter(x => x === "s").length + " · Missed " + v.filter(x => x === "m").length; }
  function draw(){
    clearInterval(timer); tally();
    const L = list(); slot.innerHTML = "";
    if (!L.length) return;
    i = (i + L.length) % L.length;
    const d = L[i], mm = MOD[d.mod];
    const card = h('<div class="drill-card" style="--mc:var(--' + (mm ? mm.color : "accent") + ')"><div class="row" style="justify-content:space-between"><div class="row"><span class="chip">' + esc(d.cat) + '</span>' + (mm ? '<span class="chip"><span class="pip" style="background:var(--mc)"></span>' + esc(mm.title) + '</span>' : '') + (S.d[d.id] ? '<span class="state">last: ' + ({n:"nailed", s:"shaky", m:"missed"})[S.d[d.id]] + '</span>' : '') + '</div><span class="mono muted" style="font-size:.85rem">' + (i + 1) + ' / ' + L.length + '</span></div>'
      + '<div class="drill-q">' + tx(d.q) + '</div>'
      + '<div class="row"><button class="btn sm go">Start 2-minute timer</button><span class="timer">2:00</span></div>'
      + '<textarea class="notes" id="drill-notes" aria-label="Notes" placeholder="Optional: jot the equation and the number you would say."></textarea>'
      + '<div class="row"><button class="btn pri rev">Reveal model answer</button><button class="btn nx">Skip →</button></div><div class="ma"></div></div>');
    const tEl = $(".timer", card);
    $(".go", card).onclick = () => { clearInterval(timer); tleft = 120; tEl.textContent = "2:00"; timer = setInterval(() => { tleft--; tEl.textContent = Math.floor(tleft / 60) + ":" + String(tleft % 60).padStart(2, "0"); if (tleft <= 0) { clearInterval(timer); tEl.textContent = "Time. Wrap up in one sentence."; } }, 1000); };
    $(".nx", card).onclick = () => { i++; draw(); };
    $(".rev", card).onclick = e => {
      clearInterval(timer); e.currentTarget.disabled = true;
      const ma = $(".ma", card);
      ma.appendChild(h('<div class="sol"><span class="eyebrow">Model answer</span>' + tx(d.a) + '</div>'));
      if (d.follow) ma.appendChild(h('<div class="callout" style="border-left:3px solid var(--warn)"><span class="eyebrow">Likely follow-up</span>' + tx(d.follow) + (d.followA ? '<details style="margin-top:6px"><summary style="cursor:pointer">Show a good response</summary><div style="margin-top:6px">' + tx(d.followA) + '</div></details>' : '') + '</div>'));
      if (d.lesson && LES[d.lesson]) ma.appendChild(h('<p class="src">Review: <a href="#les-' + d.lesson + '">' + esc(LES[d.lesson].title) + '</a></p>'));
      const rate = h('<div class="row rate" style="margin-top:14px"><span class="muted" style="font-size:.9rem">Rate yourself:</span></div>');
      [["n", "Nailed it"], ["s", "Shaky"], ["m", "Missed"]].forEach(([k, t]) => { const b = h('<button class="btn sm">' + t + '</button>'); b.onclick = () => { S.d[d.id] = k; save(); i++; draw(); }; rate.appendChild(b); });
      ma.appendChild(rate);
    };
    slot.appendChild(card);
  }
  view.appendChild(el); draw();
}

/* ---------- widgets ---------- */
function slider(id, label, min, max, step, val, show){
  return '<div class="ctrl"><label for="' + id + '"><span>' + label + '</span><b id="' + id + '-v"></b></label><input type="range" id="' + id + '" min="' + min + '" max="' + max + '" step="' + step + '" value="' + val + '"></div>';
}
function plotSVG(cfg){
  const W = cfg.w || 560, H = cfg.h || 260, L = 52, R = 14, T = 14, B = 38;
  const [x0, x1] = cfg.xlim, [y0, y1] = cfg.ylim;
  const X = x => L + (x - x0) / (x1 - x0) * (W - L - R), Y = y => T + (1 - (y - y0) / (y1 - y0)) * (H - T - B);
  let s = '<svg class="plot" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="' + esc(cfg.aria || "plot") + '">';
  (cfg.xticks || []).forEach(t => { s += '<line class="grid" x1="' + X(t) + '" x2="' + X(t) + '" y1="' + T + '" y2="' + (H - B) + '"/><text x="' + X(t) + '" y="' + (H - B + 15) + '" text-anchor="middle">' + t + '</text>'; });
  (cfg.yticks || []).forEach(t => { s += '<line class="grid" x1="' + L + '" x2="' + (W - R) + '" y1="' + Y(t) + '" y2="' + Y(t) + '"/><text x="' + (L - 6) + '" y="' + (Y(t) + 4) + '" text-anchor="end">' + t + '</text>'; });
  s += '<rect class="ax" x="' + L + '" y="' + T + '" width="' + (W - L - R) + '" height="' + (H - T - B) + '"/>';
  (cfg.series || []).forEach(se => {
    let d = "", pen = false;
    se.pts.forEach(([x, y]) => { if (!isFinite(y) || y < y0 - (y1 - y0) || y > y1 + (y1 - y0)) { pen = false; return; } const yy = Math.max(T - 2, Math.min(H - B + 2, Y(y))); d += (pen ? "L" : "M") + X(x).toFixed(1) + " " + yy.toFixed(1); pen = true; });
    s += '<path class="' + (se.cls || "s1") + '" d="' + d + '"/>';
  });
  (cfg.marks || []).forEach(mk => { s += '<circle class="dot" cx="' + X(mk.x) + '" cy="' + Math.max(T, Math.min(H - B, Y(mk.y))) + '" r="5.5"/>' + (mk.label ? '<text class="lbl" x="' + (X(mk.x) + 9) + '" y="' + (Math.max(T + 10, Math.min(H - B - 4, Y(mk.y))) - 6) + '">' + esc(mk.label) + '</text>' : ''); });
  (cfg.notes || []).forEach(n => { s += '<text x="' + X(n.x) + '" y="' + Y(n.y) + '" text-anchor="' + (n.anchor || "start") + '">' + esc(n.t) + '</text>'; });
  s += '<text x="' + ((L + W - R) / 2) + '" y="' + (H - 4) + '" text-anchor="middle">' + esc(cfg.xlab || "") + '</text>';
  s += '<text transform="translate(12 ' + ((T + H - B) / 2) + ') rotate(-90)" text-anchor="middle">' + esc(cfg.ylab || "") + '</text>';
  return s + '</svg>';
}
const W = {};
function mountWidget(name, el){ if (W[name]) { try { W[name](el); } catch (e) { el.innerHTML = '<p class="muted">Interactive model failed to load.</p>'; console.error(e); } } }
function bind(el, ids, fn){ ids.forEach(id => { const i = $("#" + id, el); i.addEventListener("input", fn); }); fn(); }
const val = (el, id) => Number($("#" + id, el).value);
const setv = (el, id, t) => { $("#" + id + "-v", el).textContent = t; };

W.isostasy = el => {
  el.className = "widget";
  el.innerHTML = '<div class="wt"><h3>Floating continent explorer</h3><span class="src">Lecture 1b, eqs (1)–(9)</span></div><div class="ctrls">'
    + slider("iso-h", "Crustal thickness h", 10, 70, 1, 35) + slider("iso-c", "Crust density ρc", 2600, 3000, 10, 2750) + slider("iso-m", "Mantle density ρm", 3150, 3450, 10, 3300) + '</div>'
    + '<div class="two" style="gap:10px"><div class="iso-pic"></div><div class="iso-prof"></div></div><div class="readout"></div>';
  bind(el, ["iso-h", "iso-c", "iso-m"], () => {
    const hk = val(el, "iso-h"), rc = val(el, "iso-c"), rm = Math.max(val(el, "iso-m"), rc + 10), g = 9.8, hh = hk * 1e3;
    setv(el, "iso-h", hk + " km"); setv(el, "iso-c", rc + " kg/m³"); setv(el, "iso-m", rm + " kg/m³");
    const b = rc / rm * hk, fb = hk - b, dst = -.5 * (1 - rc / rm) * rc * g * hh / 1e6, y0 = .5 * (1 - rc / rm) * hk;
    const sc = 150 / 75, top = 20 + (75 - (hk)) * 0, svgH = 190;
    const surf = 40, bx = 90, bw = 120;
    const pic = '<svg class="plot" viewBox="0 0 300 ' + svgH + '" role="img" aria-label="Crustal block floating in mantle"><rect x="0" y="' + surf + '" width="300" height="' + (svgH - surf) + '" fill="color-mix(in srgb,var(--crust) 16%,var(--surface))"/>'
      + '<line x1="0" x2="300" y1="' + surf + '" y2="' + surf + '" stroke="var(--crust)" stroke-width="2"/>'
      + '<rect x="' + bx + '" y="' + (surf - fb * sc) + '" width="' + bw + '" height="' + (hk * sc) + '" fill="color-mix(in srgb,var(--found) 30%,var(--surface))" stroke="var(--ink)" stroke-width="1.4"/>'
      + '<text x="' + (bx + bw / 2) + '" y="' + (surf - fb * sc + hk * sc / 2) + '" text-anchor="middle" class="lbl">ρc</text><text x="30" y="' + (surf + 30) + '" class="lbl">mantle ρm</text>'
      + '<text x="' + (bx + bw + 6) + '" y="' + (surf - fb * sc / 2 + 4) + '">h−b = ' + fb.toFixed(1) + ' km</text><text x="' + (bx + bw + 6) + '" y="' + (surf + b * sc / 2) + '">b = ' + b.toFixed(1) + ' km</text></svg>';
    $(".iso-pic", el).innerHTML = pic;
    const pts = []; for (let y = 0; y <= hk; y += hk / 60) pts.push([(rc * g * y * 1e3) / 1e6 + dst, y]);
    const vpts = []; for (let y = 0; y <= hk; y += hk / 60) vpts.push([(rc * g * y * 1e3) / 1e6, y]);
    const xmax = Math.ceil(rc * g * hh / 1e6 / 200) * 200;
    // plot depth downward: map y -> -y
    $(".iso-prof", el).innerHTML = plotSVG({w:320, h:220, xlim:[-150, xmax], ylim:[-hk, 0], xticks:[0, Math.round(xmax / 2), xmax], yticks:[-hk, Math.round(-hk / 2), 0], xlab:"stress (MPa), compression +", ylab:"−depth (km)", aria:"Horizontal and vertical stress versus depth",
      series:[{pts:pts.map(([s, y]) => [s, -y]), cls:"s1"}, {pts:vpts.map(([s, y]) => [s, -y]), cls:"s2"}], notes:[{x:-140, y:-hk * .92, t:"— σh   - - σv"}]});
    $(".readout", el).innerHTML = '<div><span>Root b</span><b>' + b.toFixed(1) + ' km</b></div><div><span>Freeboard h−b</span><b>' + fb.toFixed(2) + ' km</b></div><div><span>Δσ_tect</span><b>' + dst.toFixed(0) + ' MPa</b></div><div><span>σh = 0 at depth</span><b>' + y0.toFixed(1) + ' km</b></div>';
  });
};

W.tides = el => {
  el.className = "widget";
  el.innerHTML = '<div class="wt"><h3>Equatorial tide: inertia vs. pressure</h3><span class="src">Lecture 5, eqs (32)–(45)</span></div><div class="ctrls">' + slider("td-H", "Ocean depth H", 0.5, 60, 0.5, 4) + '</div><div class="td-plot"></div><div class="readout"></div>'
    + '<p class="muted" style="font-size:.88rem;margin-top:8px">With \\(A_{eq}=\\tfrac34 GM_M a^2/(gR^3)\\approx 0.27\\) m and \\(r=a\\Omega/c\\), the lecture result (32) simplifies to \\(A = A_{eq}/(1-r^2)\\). Negative A means low water under the Moon: an inverted tide.</p>';
  el.querySelector("p.muted").innerHTML = tx(el.querySelector("p.muted").innerHTML);
  const a = 6.371e6, Om = 7.27e-5, g = 9.8, Aeq = .75 * 6.67e-11 * 7.35e22 * a * a / (g * Math.pow(3.85e8, 3));
  const curve = []; for (let r = .05; r <= 4; r += .01) curve.push([r, 1 / (1 - r * r)]);
  bind(el, ["td-H"], () => {
    const H = val(el, "td-H") * 1e3, c = Math.sqrt(g * H), r = a * Om / c, A = Aeq / (1 - r * r);
    setv(el, "td-H", (H / 1e3).toFixed(1) + " km");
    $(".td-plot", el).innerHTML = plotSVG({xlim:[0, 4], ylim:[-3, 3], xticks:[0, 1, 2, 3, 4], yticks:[-3, -2, -1, 0, 1, 2, 3], xlab:"aΩ / c", ylab:"A / A_eq", aria:"Tide amplitude versus aΩ/c",
      series:[{pts:curve.filter(p => p[0] < .995), cls:"s1"}, {pts:curve.filter(p => p[0] > 1.005), cls:"s1"}, {pts:[[1, -3], [1, 3]], cls:"s2"}, {pts:[[0, 1], [4, 1]], cls:"s3"}],
      marks:[{x:r, y:A / Aeq, label:"H = " + (H / 1e3).toFixed(1) + " km"}], notes:[{x:1.05, y:2.6, t:"resonance aΩ = c"}, {x:3.95, y:1.2, t:"equilibrium A_eq", anchor:"end"}, {x:2.2, y:-2.6, t:"inverted tides"}]});
    $(".readout", el).innerHTML = '<div><span>Wave speed c=√(gH)</span><b>' + c.toFixed(0) + ' m/s</b></div><div><span>Tidal sweep aΩ</span><b>' + (a * Om).toFixed(0) + ' m/s</b></div><div><span>aΩ / c</span><b>' + r.toFixed(2) + '</b></div><div><span>Amplitude A</span><b>' + (Math.abs(A) > 50 ? "≫ 1 m (resonant)" : A.toFixed(3) + " m") + '</b></div><div><span>Regime</span><b>' + (Math.abs(r - 1) < .08 ? "Near resonance" : r > 1 ? "Inverted (inertia)" : "Direct (equilibrium-like)") + '</b></div>';
  });
};

W.tsunami = el => {
  el.className = "widget";
  el.innerHTML = '<div class="wt"><h3>Megathrust tsunami, linear theory</h3><span class="src">Lecture 4, eq (18)</span></div><div class="ctrls">' + slider("ts-H", "Ocean depth H", 500, 6000, 100, 4000) + slider("ts-t", "Time since rupture", 0, 40, .5, 0) + '</div>'
    + '<canvas class="wcan" width="640" height="240" aria-label="Sea-surface height versus distance"></canvas><div class="row" style="margin-top:10px"><button class="btn sm play">Play</button><span class="muted" style="font-size:.85rem">Coast at −300 km (landward), trench at 0. η(x,t) = ½η₀(x−ct) + ½η₀(x+ct).</span></div><div class="readout"></div>';
  const cv = $("canvas", el), tIn = $("#ts-t", el);
  const eta0 = x => { const up = 3.2 * Math.exp(-Math.pow((x + 35) / 38, 2)) * (x > 0 ? Math.exp(-Math.pow(x / 6, 2)) : 1); const dn = -2.2 * Math.exp(-Math.pow((x + 175) / 32, 2)); return up + dn; };
  let raf = null;
  function draw(){
    const H = val(el, "ts-H"), t = val(el, "ts-t") * 60, c = Math.sqrt(9.8 * H), ckm = c / 1e3;
    setv(el, "ts-H", H + " m"); setv(el, "ts-t", (t / 60).toFixed(1) + " min");
    const dpr = window.devicePixelRatio || 1, Wd = cv.clientWidth || 640, Hd = Math.round(Wd * .38);
    cv.width = Wd * dpr; cv.height = Hd * dpr; const g = cv.getContext("2d"); g.scale(dpr, dpr);
    const X = x => (x + 1000) / 2000 * Wd, Y = y => Hd / 2 - y / 5 * (Hd / 2 - 14);
    g.strokeStyle = css("--line"); g.lineWidth = 1; g.font = "11px 'IBM Plex Mono', monospace"; g.fillStyle = css("--muted");
    [-1000, -500, 0, 500, 1000].forEach(x => { g.beginPath(); g.moveTo(X(x), 8); g.lineTo(X(x), Hd - 16); g.stroke(); g.fillText(x + " km", X(x) + (x === 1000 ? -46 : x === -1000 ? 2 : -18), Hd - 4); });
    g.beginPath(); g.moveTo(0, Y(0)); g.lineTo(Wd, Y(0)); g.stroke();
    g.strokeStyle = css("--thermal"); g.setLineDash([4, 4]); g.beginPath(); g.moveTo(X(-300), 8); g.lineTo(X(-300), Hd - 16); g.stroke(); g.setLineDash([]); g.fillStyle = css("--thermal"); g.fillText("coast", X(-300) + 4, 20);
    g.strokeStyle = css("--muted"); g.setLineDash([2, 3]); g.beginPath(); for (let px = 0; px <= Wd; px++) { const x = px / Wd * 2000 - 1000; const y = eta0(x); px ? g.lineTo(px, Y(y)) : g.moveTo(px, Y(y)); } g.stroke(); g.setLineDash([]);
    g.strokeStyle = css("--cont"); g.lineWidth = 2.2; g.beginPath();
    for (let px = 0; px <= Wd; px++) { const x = px / Wd * 2000 - 1000; const y = .5 * eta0(x - ckm * t) + .5 * eta0(x + ckm * t); px ? g.lineTo(px, Y(y)) : g.moveTo(px, Y(y)); }
    g.stroke(); g.fillStyle = css("--ink"); g.fillText("η (m), dotted = seafloor uplift η₀", 8, 20);
    const tc = Math.max(0, (300 - 175 - 50) * 1e3 / c);
    $(".readout", el).innerHTML = '<div><span>c = √(gH)</span><b>' + c.toFixed(0) + ' m/s · ' + (c * 3.6).toFixed(0) + ' km/h</b></div><div><span>Trough reaches coast</span><b>~' + (tc / 60).toFixed(0) + ' min</b></div><div><span>Uplift crest reaches coast</span><b>~' + ((300 - 35) * 1e3 / c / 60).toFixed(0) + ' min</b></div><div><span>Wave period ~ λ/c (λ≈100 km)</span><b>' + (1e5 / c / 60).toFixed(0) + ' min</b></div>';
  }
  $(".play", el).onclick = e => {
    if (raf) { cancelAnimationFrame(raf); raf = null; e.currentTarget.textContent = "Play"; return; }
    e.currentTarget.textContent = "Pause"; if (val(el, "ts-t") >= 40) tIn.value = 0;
    let last = performance.now();
    const step = now => { const dt = (now - last) / 1000; last = now; let v = val(el, "ts-t") + dt * 3; if (v >= 40) { v = 40; tIn.value = v; draw(); raf = null; $(".play", el).textContent = "Play"; return; } tIn.value = v; draw(); raf = requestAnimationFrame(step); };
    raf = requestAnimationFrame(step);
  };
  bind(el, ["ts-H", "ts-t"], draw);
  window.addEventListener("resize", draw);
};

W.magnitude = el => {
  el.className = "widget";
  el.innerHTML = '<div class="wt"><h3>Seismic moment and magnitude</h3><span class="src">M₀ = μAD, Mw = ⅔(log₁₀M₀ − 9.1)</span></div><div class="ctrls">'
    + slider("mg-L", "Rupture length L", 0, 3, .01, 1.7) + slider("mg-W", "Width W", 1, 250, 1, 15) + slider("mg-D", "Average slip D", -2, 1.7, .01, 0) + slider("mg-mu", "Shear modulus μ", 10, 70, 1, 30) + '</div><div class="readout"></div>';
  bind(el, ["mg-L", "mg-W", "mg-D", "mg-mu"], () => {
    const L = Math.pow(10, val(el, "mg-L")), Wd = Math.min(val(el, "mg-W"), L), D = Math.pow(10, val(el, "mg-D")), mu = val(el, "mg-mu") * 1e9;
    setv(el, "mg-L", L.toFixed(L < 10 ? 1 : 0) + " km"); setv(el, "mg-W", Wd.toFixed(0) + " km"); setv(el, "mg-D", D.toFixed(D < 1 ? 2 : 1) + " m"); setv(el, "mg-mu", (mu / 1e9) + " GPa");
    const M0 = mu * L * 1e3 * Wd * 1e3 * D, Mw = 2 / 3 * (Math.log10(M0) - 9.1), ds = 2 / Math.PI * mu * D / (Wd * 1e3);
    $(".readout", el).innerHTML = '<div><span>M₀</span><b>' + fmt(M0) + ' N·m</b></div><div><span>Mw</span><b>' + Mw.toFixed(2) + '</b></div><div><span>Energy vs Mw 6</span><b>×' + fmt(Math.pow(10, 1.5 * (Mw - 6)), 2) + '</b></div><div><span>Stress drop ~ μD/W</span><b>' + fmt(ds / 1e6, 2) + ' MPa</b></div><div><span>Rupture time L/(2.5 km/s)</span><b>' + fmt(L / 2.5, 2) + ' s</b></div>';
  });
};

W.mogi = el => {
  el.className = "widget";
  el.innerHTML = '<div class="wt"><h3>Mogi point source</h3><span class="src">elastic half-space, ν = 0.25</span></div><div class="ctrls">' + slider("mo-d", "Source depth d", 1, 15, .5, 5) + slider("mo-V", "Volume change ΔV (log₁₀ m³)", 5, 8, .1, 7) + '</div><div class="mo-plot"></div><div class="readout"></div>';
  bind(el, ["mo-d", "mo-V"], () => {
    const d = val(el, "mo-d") * 1e3, dV = Math.pow(10, val(el, "mo-V")), nu = .25;
    setv(el, "mo-d", (d / 1e3).toFixed(1) + " km"); setv(el, "mo-V", fmt(dV, 2) + " m³");
    const uz = r => (1 - nu) * dV * d / (Math.PI * Math.pow(r * r + d * d, 1.5)), ur = r => (1 - nu) * dV * r / (Math.PI * Math.pow(r * r + d * d, 1.5));
    const umax = uz(0) * 100, pz = [], pr = [];
    for (let r = 0; r <= 30e3; r += 300) { pz.push([r / 1e3, uz(r) * 100]); pr.push([r / 1e3, ur(r) * 100]); }
    const top = Math.max(1, Math.ceil(umax * 1.1));
    $(".mo-plot", el).innerHTML = plotSVG({xlim:[0, 30], ylim:[0, top], xticks:[0, 10, 20, 30], yticks:[0, +(top / 2).toFixed(1), top], xlab:"radial distance r (km)", ylab:"displacement (cm)", aria:"Vertical and radial surface displacement", series:[{pts:pz, cls:"s1"}, {pts:pr, cls:"s2"}], notes:[{x:29, y:top * .9, t:"— vertical   - - radial", anchor:"end"}]});
    $(".readout", el).innerHTML = '<div><span>Peak uplift</span><b>' + fmt(umax, 3) + ' cm</b></div><div><span>Half-max radius 0.77d</span><b>' + (0.766 * d / 1e3).toFixed(1) + ' km</b></div><div><span>Peak radial at d/√2</span><b>' + (d / Math.SQRT2 / 1e3).toFixed(1) + ' km</b></div><div><span>C-band fringes (2.8 cm)</span><b>' + Math.floor(umax / 2.8) + '</b></div>';
  });
};

W.flexure = el => {
  el.className = "widget";
  el.innerHTML = '<div class="wt"><h3>Flexure under a line load</h3><span class="src">thin elastic plate on fluid mantle</span></div><div class="ctrls">' + slider("fx-T", "Elastic thickness Te", 5, 80, 1, 30) + slider("fx-E", "Young’s modulus E", 30, 120, 5, 70) + '</div><div class="fx-plot"></div><div class="readout"></div>';
  bind(el, ["fx-T", "fx-E"], () => {
    const Te = val(el, "fx-T") * 1e3, E = val(el, "fx-E") * 1e9, nu = .25, drho = 3300 - 1000, g = 9.8;
    setv(el, "fx-T", Te / 1e3 + " km"); setv(el, "fx-E", E / 1e9 + " GPa");
    const D = E * Te * Te * Te / (12 * (1 - nu * nu)), al = Math.pow(4 * D / (drho * g), .25);
    const pts = []; for (let x = 0; x <= 600e3; x += 3e3) { const s = x / al; pts.push([x / 1e3, Math.exp(-s) * (Math.cos(s) + Math.sin(s))]); }
    $(".fx-plot", el).innerHTML = plotSVG({xlim:[0, 600], ylim:[-1, .1], xticks:[0, 200, 400, 600], yticks:[-1, -.5, 0], xlab:"distance from load (km)", ylab:"w / w₀", aria:"Deflection profile", series:[{pts:pts.map(([x, w]) => [x, -w]), cls:"s1"}], marks:[{x:Math.PI * al / 1e3, y:Math.exp(-Math.PI) , label:"forebulge"}]});
    $(".readout", el).innerHTML = '<div><span>Rigidity D</span><b>' + fmt(D, 2) + ' N·m</b></div><div><span>Flexural parameter α</span><b>' + (al / 1e3).toFixed(0) + ' km</b></div><div><span>First zero 3πα/4</span><b>' + (3 * Math.PI * al / 4e3).toFixed(0) + ' km</b></div><div><span>Forebulge πα (height w₀e^{−π})</span><b>' + (Math.PI * al / 1e3).toFixed(0) + ' km · 4%</b></div>';
  });
};

W.cooling = el => {
  el.className = "widget";
  el.innerHTML = '<div class="wt"><h3>Cooling half-space</h3><span class="src">T = T₀ + (T_m − T₀) erf(z / 2√κt)</span></div><div class="ctrls">' + slider("hc-t", "Plate age t", 1, 180, 1, 50) + '</div><div class="hc-plot"></div><div class="readout"></div>';
  const erf = x => { const t = 1 / (1 + .3275911 * Math.abs(x)); const y = 1 - (((((1.061405429 * t - 1.453152027) * t) + 1.421413741) * t - .284496736) * t + .254829592) * t * Math.exp(-x * x); return x >= 0 ? y : -y; };
  bind(el, ["hc-t"], () => {
    const tMy = val(el, "hc-t"), t = tMy * 3.156e13, k = 1e-6, Tm = 1350, T0 = 0, L = 2 * Math.sqrt(k * t);
    setv(el, "hc-t", tMy + " Myr");
    const pts = []; for (let z = 0; z <= 200e3; z += 2e3) pts.push([T0 + (Tm - T0) * erf(z / L), -z / 1e3]);
    const zl = 2.32 * Math.sqrt(k * t) / 1e3;
    $(".hc-plot", el).innerHTML = plotSVG({xlim:[0, 1400], ylim:[-200, 0], xticks:[0, 350, 700, 1050, 1400], yticks:[-200, -150, -100, -50, 0], xlab:"temperature (°C)", ylab:"−depth (km)", aria:"Geotherm", series:[{pts, cls:"s1"}, {pts:[[0, -zl], [1400, -zl]], cls:"s2"}], notes:[{x:20, y:-zl + 6, t:"thermal lithosphere (T = 0.9 T_m)"}]});
    const q = 3.3 * Tm / Math.sqrt(Math.PI * k * t) * 1e3;
    $(".readout", el).innerHTML = '<div><span>Diffusion length √(κt)</span><b>' + (Math.sqrt(k * t) / 1e3).toFixed(1) + ' km</b></div><div><span>Lithosphere 2.32√(κt)</span><b>' + zl.toFixed(0) + ' km</b></div><div><span>Surface heat flow</span><b>' + q.toFixed(0) + ' mW/m²</b></div><div><span>Seafloor depth ≈ 2.5 + 0.35√t</span><b>' + (2.5 + .35 * Math.sqrt(tMy)).toFixed(2) + ' km</b></div>';
  });
};

W.map = el => {
  const N = [
    ["hydro", "Hydrostatic balance", 80, 60], ["stress", "Deviatoric stress", 260, 60], ["elasticity", "Elasticity", 440, 60], ["viscous", "Viscous flow", 620, 60], ["heat", "Heat conduction", 800, 60],
    ["isostasy", "Isostasy", 80, 190], ["anderson", "Faulting & friction", 260, 190], ["flexure", "Flexure", 440, 190], ["glaciers", "Glaciers & ice sheets", 620, 190], ["lithcool", "Plate cooling", 800, 190],
    ["swe", "Shallow-water waves", 80, 320], ["source", "Earthquake source", 260, 320], ["waves", "Seismic waves", 440, 320], ["pgr", "Post-glacial rebound", 620, 320], ["rt", "Plumes & R–T", 800, 320],
    ["tides", "Tides", 80, 450], ["tsunami", "Tsunamis", 260, 450], ["poro", "Poromechanics", 440, 450], ["chamber", "Magma chambers", 620, 450], ["eruption", "Eruption dynamics", 800, 450]
  ];
  const E = [["hydro", "isostasy", "+ buoyancy"], ["hydro", "stress", "not enough"], ["stress", "anderson", "σv ≠ σh"], ["stress", "elasticity", "constitutive law"], ["elasticity", "flexure", "thin plate"], ["isostasy", "flexure", "local limit"],
    ["viscous", "glaciers", "shear flow"], ["viscous", "pgr", "η ~ 10²¹"], ["flexure", "pgr", "load"], ["heat", "lithcool", "√κt"], ["lithcool", "isostasy", "subsidence"], ["viscous", "rt", "Stokes"], ["heat", "rt", "buoyancy"],
    ["hydro", "swe", "∂p/∂x"], ["swe", "tides", "+ forcing"], ["swe", "tsunami", "IC = uplift"], ["source", "tsunami", "seafloor slip"], ["anderson", "source", "slip"], ["elasticity", "waves", "√(μ/ρ)"], ["source", "waves", "radiates"],
    ["elasticity", "poro", "+ fluid"], ["anderson", "poro", "σ − p"], ["poro", "chamber", "compressibility"], ["elasticity", "chamber", "wall"], ["chamber", "eruption", "overpressure"], ["rt", "chamber", "diapirs"]];
  const pos = {}; N.forEach(n => pos[n[0]] = n);
  let s = '<div class="mapwrap"><svg viewBox="0 0 900 510" role="img" aria-label="Concept map linking course topics">';
  E.forEach(([a, b, t]) => { const A = pos[a], B = pos[b]; if (!A || !B) return; const x1 = A[2], y1 = A[3], x2 = B[2], y2 = B[3]; s += '<path class="map-edge" d="M' + x1 + ' ' + y1 + ' L' + x2 + ' ' + y2 + '"/><text class="map-elab" x="' + ((x1 + x2) / 2 + 4) + '" y="' + ((y1 + y2) / 2 - 4) + '">' + esc(t) + '</text>'; });
  N.forEach(([id, t, x, y]) => { const l = LES[id]; const col = l ? MOD[l.mod].color : "muted"; s += '<g class="map-node" tabindex="0" role="link" data-id="' + id + '" style="--mc:var(--' + col + ')"><rect x="' + (x - 76) + '" y="' + (y - 17) + '" width="152" height="34" rx="8"/><text x="' + x + '" y="' + (y + 4) + '" text-anchor="middle">' + esc(t) + '</text></g>'; });
  s += '</svg></div><p class="muted" style="font-size:.85rem;margin-top:8px">Select a box to open that lesson. Box colour = module.</p>';
  el.className = "widget"; el.innerHTML = '<div class="wt"><h3>How the course fits together</h3><span class="src">select a node</span></div>' + s;
  el.querySelectorAll(".map-node").forEach(g => { const go = () => { if (LES[g.dataset.id]) location.hash = "les-" + g.dataset.id; }; g.addEventListener("click", go); g.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); go(); } }); });
};

(C.widgets || []).forEach(fn => fn(W, {slider, plotSVG, bind, val, setv, fmt, css, $, tx}));
route();
})();
