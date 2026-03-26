(function () {
 
  /* ─── Inject scoped styles ─────────────────────────────────────────── */
  var styleTag = document.createElement('style');
  styleTag.textContent = [
    '@import url("https://fonts.googleapis.com/css2?family=DM+Mono:ital,wght@0,300;0,400;0,500;1,300&family=Syne:wght@600;700;800&display=swap");',
 
    '#sgm-root {',
    '  --sgm-bg: #0d0d14;',
    '  --sgm-surface: #13131f;',
    '  --sgm-border: rgba(255,255,255,0.07);',
    '  --sgm-indigo: #818cf8;',
    '  --sgm-rose: #fb7185;',
    '  --sgm-amber: #fbbf24;',
    '  --sgm-muted: rgba(255,255,255,0.38);',
    '  --sgm-body: rgba(255,255,255,0.75);',
    '  --sgm-head: #ffffff;',
    '  font-family: "DM Mono", monospace;',
    '  background: var(--sgm-bg);',
    '  border: 1px solid var(--sgm-border);',
    '  border-radius: 1rem;',
    '  overflow: hidden;',
    '  margin: 2.5rem 0;',
    '}',
 
    /* ── header bar ── */
    '#sgm-header {',
    '  padding: 1.25rem 1.5rem 0;',
    '  border-bottom: 1px solid var(--sgm-border);',
    '}',
    '#sgm-eyebrow {',
    '  font-size: 0.65rem;',
    '  letter-spacing: 0.12em;',
    '  text-transform: uppercase;',
    '  color: var(--sgm-rose);',
    '  margin: 0 0 0.3rem;',
    '}',
    '#sgm-title {',
    '  font-family: "Syne", sans-serif;',
    '  font-weight: 800;',
    '  font-size: 1.1rem;',
    '  color: var(--sgm-head);',
    '  margin: 0 0 1rem;',
    '  line-height: 1.25;',
    '}',
 
    /* ── tabs ── */
    '#sgm-tabs {',
    '  display: flex;',
    '  gap: 0;',
    '  margin-top: 0;',
    '}',
    '.sgm-tab {',
    '  flex: 1;',
    '  padding: 0.65rem 0.5rem;',
    '  font-family: "DM Mono", monospace;',
    '  font-size: 0.7rem;',
    '  letter-spacing: 0.04em;',
    '  text-align: center;',
    '  color: var(--sgm-muted);',
    '  background: none;',
    '  border: none;',
    '  border-bottom: 2px solid transparent;',
    '  cursor: pointer;',
    '  transition: color 0.2s, border-color 0.2s;',
    '  line-height: 1.35;',
    '}',
    '.sgm-tab:hover { color: var(--sgm-body); }',
    '.sgm-tab.active {',
    '  color: var(--sgm-head);',
    '  border-bottom-color: var(--sgm-rose);',
    '}',
 
    /* ── panels ── */
    '#sgm-panels { padding: 1.5rem; min-height: 280px; }',
    '.sgm-panel { display: none; animation: sgmFadeIn 0.3s ease; }',
    '.sgm-panel.active { display: block; }',
    '@keyframes sgmFadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }',
 
    /* ── panel 1: pipeline ── */
    '#sgm-pipeline {',
    '  display: grid;',
    '  grid-template-columns: 1fr auto 1fr;',
    '  gap: 1rem;',
    '  align-items: center;',
    '  margin-bottom: 1.25rem;',
    '}',
    '.sgm-pipe-stat {',
    '  text-align: center;',
    '}',
    '.sgm-pipe-num {',
    '  font-family: "Syne", sans-serif;',
    '  font-weight: 800;',
    '  font-size: 3.5rem;',
    '  line-height: 1;',
    '  display: block;',
    '}',
    '.sgm-pipe-num.players { color: var(--sgm-indigo); }',
    '.sgm-pipe-num.pros { color: var(--sgm-rose); }',
    '.sgm-pipe-label {',
    '  font-size: 0.72rem;',
    '  color: var(--sgm-muted);',
    '  display: block;',
    '  margin-top: 0.35rem;',
    '  letter-spacing: 0.05em;',
    '  text-transform: uppercase;',
    '}',
    '.sgm-pipe-arrow {',
    '  font-size: 1.5rem;',
    '  color: var(--sgm-border);',
    '  text-align: center;',
    '}',
    '#sgm-gap-bar {',
    '  height: 6px;',
    '  background: rgba(255,255,255,0.06);',
    '  border-radius: 99px;',
    '  overflow: hidden;',
    '  margin-bottom: 1rem;',
    '}',
    '#sgm-gap-fill {',
    '  height: 100%;',
    '  width: 0;',
    '  background: linear-gradient(90deg, var(--sgm-indigo), var(--sgm-rose));',
    '  border-radius: 99px;',
    '  transition: width 1.4s cubic-bezier(0.22,1,0.36,1);',
    '}',
 
    /* ── panel 2: harassment bars ── */
    '.sgm-hrow {',
    '  margin-bottom: 1.25rem;',
    '}',
    '.sgm-hrow-head {',
    '  display: flex;',
    '  justify-content: space-between;',
    '  align-items: baseline;',
    '  margin-bottom: 0.4rem;',
    '}',
    '.sgm-hrow-label {',
    '  font-size: 0.75rem;',
    '  color: var(--sgm-body);',
    '}',
    '.sgm-hrow-mult {',
    '  font-family: "Syne", sans-serif;',
    '  font-weight: 700;',
    '  font-size: 1rem;',
    '}',
    '.sgm-hrow-track {',
    '  height: 8px;',
    '  background: rgba(255,255,255,0.06);',
    '  border-radius: 99px;',
    '  overflow: hidden;',
    '  position: relative;',
    '}',
    '.sgm-hrow-fill {',
    '  height: 100%;',
    '  width: 0;',
    '  border-radius: 99px;',
    '  transition: width 1.2s cubic-bezier(0.22,1,0.36,1);',
    '}',
    '.sgm-baseline-mark {',
    '  position: absolute;',
    '  top: 0;',
    '  height: 100%;',
    '  width: 2px;',
    '  background: rgba(255,255,255,0.18);',
    '}',
 
    /* ── panel 3: strategy cards ── */
    '#sgm-strategies {',
    '  display: grid;',
    '  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));',
    '  gap: 0.875rem;',
    '}',
    '.sgm-card {',
    '  background: var(--sgm-surface);',
    '  border: 1px solid var(--sgm-border);',
    '  border-radius: 0.75rem;',
    '  padding: 1rem;',
    '  cursor: pointer;',
    '  transition: border-color 0.2s, transform 0.2s;',
    '  position: relative;',
    '  overflow: hidden;',
    '}',
    '.sgm-card:hover {',
    '  border-color: rgba(255,255,255,0.18);',
    '  transform: translateY(-2px);',
    '}',
    '.sgm-card-icon {',
    '  font-size: 1.4rem;',
    '  display: block;',
    '  margin-bottom: 0.5rem;',
    '}',
    '.sgm-card-title {',
    '  font-family: "Syne", sans-serif;',
    '  font-size: 0.8rem;',
    '  font-weight: 700;',
    '  color: var(--sgm-head);',
    '  display: block;',
    '  margin-bottom: 0.4rem;',
    '  line-height: 1.3;',
    '}',
    '.sgm-card-body {',
    '  font-size: 0.72rem;',
    '  color: var(--sgm-muted);',
    '  line-height: 1.55;',
    '  display: block;',
    '}',
    '.sgm-card-accent {',
    '  position: absolute;',
    '  top: 0; left: 0; right: 0;',
    '  height: 2px;',
    '  border-radius: 0.75rem 0.75rem 0 0;',
    '}',
 
    /* ── footer ── */
    '#sgm-footer {',
    '  padding: 0.75rem 1.5rem;',
    '  border-top: 1px solid var(--sgm-border);',
    '  display: flex;',
    '  justify-content: space-between;',
    '  align-items: center;',
    '  flex-wrap: wrap;',
    '  gap: 0.5rem;',
    '}',
    '#sgm-source {',
    '  font-size: 0.65rem;',
    '  color: var(--sgm-muted);',
    '  font-style: italic;',
    '}',
    '#sgm-source span { color: var(--sgm-indigo); }',
    '#sgm-note {',
    '  font-size: 0.65rem;',
    '  color: var(--sgm-muted);',
    '}',
 
    /* ── shared ── */
    '.sgm-cite {',
    '  font-size: 0.65rem;',
    '  color: var(--sgm-indigo);',
    '  display: inline-block;',
    '  margin-left: 0.3rem;',
    '  font-style: normal;',
    '}',
    '.sgm-section-label {',
    '  font-size: 0.65rem;',
    '  letter-spacing: 0.1em;',
    '  text-transform: uppercase;',
    '  color: var(--sgm-muted);',
    '  margin: 0 0 1rem;',
    '}',
    '.sgm-insight {',
    '  background: rgba(251,113,133,0.07);',
    '  border-left: 2px solid var(--sgm-rose);',
    '  border-radius: 0 0.4rem 0.4rem 0;',
    '  padding: 0.6rem 0.875rem;',
    '  font-size: 0.78rem;',
    '  color: var(--sgm-body);',
    '  line-height: 1.6;',
    '  margin-top: 1rem;',
    '}'
  ].join('\n');
  document.head.appendChild(styleTag);
 
  /* ─── Data ─────────────────────────────────────────────────────────── */
 
  var harassmentRows = [
    {
      label: 'Negative voice-chat feedback',
      mult: 3.0,
      pct: 28,   /* 3/10.5 * 100 scaled to max */
      color: '#818cf8',
      cite: 'Crothers et al., 2024'
    },
    {
      label: 'General sexual remarks (multiplayer)',
      mult: 1.8,
      pct: 17,
      color: '#a78bfa',
      cite: 'Crothers et al., 2024'
    },
    {
      label: 'Sexual remarks while streaming',
      mult: 10.5,
      pct: 100,
      color: '#fb7185',
      cite: 'Crothers et al., 2024'
    }
  ];
 
  var strategyCards = [
    {
      icon: '🎭',
      title: 'Gender Masking',
      body: 'Women frequently hide their voices or use gender-neutral gamertags to avoid targeting. Abuse typically begins the moment a female voice is detected.',
      accent: '#818cf8',
      cite: 'Crothers et al., 2024'
    },
    {
      icon: '🩺',
      title: 'The "Mercy Stereotype"',
      body: 'Women are channelled into passive support roles and face hostility when attempting high-skill or damage positions — regardless of their actual ability.',
      accent: '#fb7185',
      cite: 'Crothers et al., 2024'
    },
    {
      icon: '🏟️',
      title: 'All-Female Tournaments',
      body: 'Separate leagues relieve women of representing their entire gender in every match. The trade-off: they leave the dominant culture intact and untouched.',
      accent: '#fbbf24',
      cite: 'Witkowski, 2018'
    },
    {
      icon: '⚗️',
      title: 'Stereotype Threat',
      body: 'Awareness of negative stereotypes measurably impairs women\'s in-game performance — a mechanism by which culture directly shapes competitive outcomes.',
      accent: '#34d399',
      cite: 'Rogstad, 2022'
    }
  ];
 
  var sourcesByPanel = [
    'Rogstad (2022); general esports participation data',
    'Crothers, Scott-Brown & Cunningham (2024)',
    'Crothers et al. (2024); Witkowski (2018); Rogstad (2022)'
  ];
 
  /* ─── Build DOM ─────────────────────────────────────────────────────── */
 
  function el(tag, attrs, children) {
    var node = document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach(function (k) {
        if (k === 'className') { node.className = attrs[k]; }
        else if (k === 'style') { node.style.cssText = attrs[k]; }
        else { node.setAttribute(k, attrs[k]); }
      });
    }
    if (children) {
      if (typeof children === 'string') { node.innerHTML = children; }
      else { children.forEach(function (c) { if (c) node.appendChild(c); }); }
    }
    return node;
  }
 
  function txt(content) { return document.createTextNode(content); }
 
  /* ── Panel 1 ── */
  function buildPipelinePanel() {
    var panel = el('div', { className: 'sgm-panel active', id: 'sgm-p0' });
 
    var lbl = el('p', { className: 'sgm-section-label' });
    lbl.textContent = 'The professional participation gap';
    panel.appendChild(lbl);
 
    var grid = el('div', { id: 'sgm-pipeline' });
 
    /* players side */
    var ps = el('div', { className: 'sgm-pipe-stat' });
    var pn = el('span', { className: 'sgm-pipe-num players', id: 'sgm-pct-players' });
    pn.textContent = '0%';
    var pl = el('span', { className: 'sgm-pipe-label' });
    pl.textContent = 'of esports players';
    ps.appendChild(pn);
    ps.appendChild(pl);
 
    var arrow = el('div', { className: 'sgm-pipe-arrow' });
    arrow.innerHTML = '&#8594;';
 
    /* pros side */
    var prs = el('div', { className: 'sgm-pipe-stat' });
    var prn = el('span', { className: 'sgm-pipe-num pros', id: 'sgm-pct-pros' });
    prn.textContent = '0%';
    var prl = el('span', { className: 'sgm-pipe-label' });
    prl.textContent = 'of professional competitors';
    prs.appendChild(prn);
    prs.appendChild(prl);
 
    grid.appendChild(ps);
    grid.appendChild(arrow);
    grid.appendChild(prs);
    panel.appendChild(grid);
 
    var gapBar = el('div', { id: 'sgm-gap-bar' });
    var gapFill = el('div', { id: 'sgm-gap-fill' });
    gapBar.appendChild(gapFill);
    panel.appendChild(gapBar);
 
    var subLabel = el('p', { style: 'font-size:0.7rem;color:rgba(255,255,255,0.38);margin:0 0 0.75rem;' });
    subLabel.textContent = 'Gap between participation and professional representation — are women players';
    panel.appendChild(subLabel);
 
    var insight = el('div', { className: 'sgm-insight' });
    insight.innerHTML = 'While women comprise <strong style="color:#818cf8">35%</strong> of all esports players, they hold only <strong style="color:#fb7185">5%</strong> of professional-tier competitive slots. The pipeline doesn\'t leak — it is structurally sealed. <em class="sgm-cite">[Rogstad, 2022]</em>';
    panel.appendChild(insight);
 
    return panel;
  }
 
  /* ── Panel 2 ── */
  function buildHarassmentPanel() {
    var panel = el('div', { className: 'sgm-panel', id: 'sgm-p1' });
 
    var lbl = el('p', { className: 'sgm-section-label' });
    lbl.textContent = 'Harassment frequency vs. male counterparts — women are...';
    panel.appendChild(lbl);
 
    harassmentRows.forEach(function (row, i) {
      var wrap = el('div', { className: 'sgm-hrow' });
 
      var head = el('div', { className: 'sgm-hrow-head' });
      var label = el('span', { className: 'sgm-hrow-label' });
      label.textContent = row.label;
      var mult = el('span', { className: 'sgm-hrow-mult', style: 'color:' + row.color });
      mult.textContent = row.mult + 'x more likely';
      head.appendChild(label);
      head.appendChild(mult);
 
      var track = el('div', { className: 'sgm-hrow-track' });
      var fill = el('div', {
        className: 'sgm-hrow-fill',
        id: 'sgm-hfill-' + i,
        style: 'background:' + row.color + ';transition-delay:' + (i * 0.15) + 's'
      });
      var mark = el('div', {
        className: 'sgm-baseline-mark',
        style: 'left:' + (100 / 10.5) + '%'
      });
      track.appendChild(fill);
      track.appendChild(mark);
 
      var cite = el('span', { style: 'font-size:0.63rem;color:rgba(255,255,255,0.28);display:block;margin-top:0.25rem;' });
      cite.textContent = row.cite;
 
      wrap.appendChild(head);
      wrap.appendChild(track);
      wrap.appendChild(cite);
      panel.appendChild(wrap);
    });
 
    var insight = el('div', { className: 'sgm-insight' });
    insight.innerHTML = 'The baseline marker on each bar represents the male experience (1x). The 10.5x streaming figure is not an outlier — it reflects that streaming makes gender identity impossible to conceal, removing the option of masking. <em class="sgm-cite">[Crothers et al., 2024]</em>';
    panel.appendChild(insight);
 
    return panel;
  }
 
  /* ── Panel 3 ── */
  function buildStrategiesPanel() {
    var panel = el('div', { className: 'sgm-panel', id: 'sgm-p2' });
 
    var lbl = el('p', { className: 'sgm-section-label' });
    lbl.textContent = 'How women navigate — and what the navigation costs';
    panel.appendChild(lbl);
 
    var grid = el('div', { id: 'sgm-strategies' });
 
    strategyCards.forEach(function (card) {
      var c = el('div', { className: 'sgm-card' });
 
      var accent = el('div', { className: 'sgm-card-accent', style: 'background:' + card.accent });
      var icon = el('span', { className: 'sgm-card-icon' });
      icon.textContent = card.icon;
      var title = el('span', { className: 'sgm-card-title' });
      title.textContent = card.title;
      var body = el('span', { className: 'sgm-card-body' });
      body.textContent = card.body + ' ';
      var cite = el('em', { className: 'sgm-cite' });
      cite.textContent = '[' + card.cite + ']';
      body.appendChild(cite);
 
      c.appendChild(accent);
      c.appendChild(icon);
      c.appendChild(title);
      c.appendChild(body);
      grid.appendChild(c);
    });
 
    panel.appendChild(grid);
    return panel;
  }
 
  /* ─── Assemble ──────────────────────────────────────────────────────── */
 
  function build(container) {
    var root = el('div', { id: 'sgm-root' });
 
    /* header */
    var header = el('div', { id: 'sgm-header' });
    var eyebrow = el('p', { id: 'sgm-eyebrow' });
    eyebrow.textContent = 'Data Visualization · Interactive';
    var title = el('h3', { id: 'sgm-title' });
    title.textContent = 'Breaking the Glass Monitor: Systemic Barriers for Women in Gaming';
 
    var tabBar = el('div', { id: 'sgm-tabs' });
    var tabLabels = [
      ['01', 'Participation', 'Gap'],
      ['02', 'Harassment', 'Multipliers'],
      ['03', 'Survival', 'Strategies']
    ];
    tabLabels.forEach(function (t, i) {
      var tab = el('button', { className: 'sgm-tab' + (i === 0 ? ' active' : ''), 'data-panel': i });
      tab.innerHTML = '<span style="opacity:0.4;display:block;font-size:0.58rem;margin-bottom:0.1rem;">' + t[0] + '</span>' + t[1] + '<br />' + t[2];
      tabBar.appendChild(tab);
    });
 
    header.appendChild(eyebrow);
    header.appendChild(title);
    header.appendChild(tabBar);
    root.appendChild(header);
 
    /* panels */
    var panelWrap = el('div', { id: 'sgm-panels' });
    panelWrap.appendChild(buildPipelinePanel());
    panelWrap.appendChild(buildHarassmentPanel());
    panelWrap.appendChild(buildStrategiesPanel());
    root.appendChild(panelWrap);
 
    /* footer */
    var footer = el('div', { id: 'sgm-footer' });
    var source = el('p', { id: 'sgm-source' });
    source.innerHTML = 'Sources: <span id="sgm-source-text">' + sourcesByPanel[0] + '</span>';
    var note = el('p', { id: 'sgm-note' });
    note.textContent = 'Harassment multipliers are relative to male counterparts (1x baseline)';
    footer.appendChild(source);
    footer.appendChild(note);
    root.appendChild(footer);
 
    container.appendChild(root);
  }
 
  /* ─── Tab switching ─────────────────────────────────────────────────── */
 
  function setupTabs() {
    var tabs = document.querySelectorAll('.sgm-tab');
    var panels = document.querySelectorAll('.sgm-panel');
    var sourceText = document.getElementById('sgm-source-text');
 
    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        var idx = parseInt(tab.getAttribute('data-panel'), 10);
 
        tabs.forEach(function (t) { t.classList.remove('active'); });
        panels.forEach(function (p) { p.classList.remove('active'); });
 
        tab.classList.add('active');
        panels[idx].classList.add('active');
        if (sourceText) { sourceText.textContent = sourcesByPanel[idx]; }
 
        /* trigger animations on the newly visible panel */
        if (idx === 1) { animateHarassmentBars(); }
        if (idx === 0) { animatePipeline(); }
      });
    });
  }
 
  /* ─── Animations ────────────────────────────────────────────────────── */
 
  var pipelineAnimated = false;
  var harassmentAnimated = false;
 
  function animatePipeline() {
    if (pipelineAnimated) return;
    pipelineAnimated = true;
 
    var playersEl = document.getElementById('sgm-pct-players');
    var prosEl = document.getElementById('sgm-pct-pros');
    var fill = document.getElementById('sgm-gap-fill');
 
    if (!playersEl || !prosEl || !fill) return;
 
    var start = Date.now();
    var duration = 1400;
 
    function easeOut(t) { return 1 - Math.pow(1 - t, 3); }
 
    function tick() {
      var elapsed = Date.now() - start;
      var progress = Math.min(elapsed / duration, 1);
      var eased = easeOut(progress);
 
      var players = Math.round(eased * 35);
      var pros = Math.round(eased * 5);
 
      playersEl.textContent = players + '%';
      prosEl.textContent = pros + '%';
 
      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        playersEl.textContent = '35%';
        prosEl.textContent = '5%';
        setTimeout(function () {
          fill.style.width = '100%';
        }, 100);
      }
    }
 
    requestAnimationFrame(tick);
  }
 
  function animateHarassmentBars() {
    if (harassmentAnimated) return;
    harassmentAnimated = true;
 
    harassmentRows.forEach(function (row, i) {
      var fill = document.getElementById('sgm-hfill-' + i);
      if (!fill) return;
      setTimeout(function () {
        fill.style.width = row.pct + '%';
      }, 80);
    });
  }
 
  /* ─── IntersectionObserver trigger ─────────────────────────────────── */
 
  function setupObserver() {
    if (!window.IntersectionObserver) {
      animatePipeline();
      return;
    }
    var root = document.getElementById('sgm-root');
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animatePipeline();
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.25 });
    if (root) { observer.observe(root); }
  }
 
  /* ─── Init ──────────────────────────────────────────────────────────── */
 
  function init() {
    var container = document.getElementById('stat-reveal-viz');
    if (!container) return;
    build(container);
    setupTabs();
    setupObserver();
  }
 
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
 
})();