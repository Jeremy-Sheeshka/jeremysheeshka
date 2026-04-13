// public/scripts/etec542-learner-portfolio.js

// ✅ Feel free to tweak these numbers if your header/footer are larger than average
const HEADER_HEIGHT = 120; 
const FOOTER_HEIGHT = 120; 

// ✅ Updated with the polished "Option 1" rationale
const CENTER_INFO = {
  id: 'center', tag: 'Learner Portfolio', tagColor: '#C9952A',
  title: 'Learner Portfolio',
  subtitle: 'Trusting the process',
  text: `This portfolio explores four moments of learning throughout ETEC 542 through a relational mind map. The individual nodes of the mind map simultaneously attract and repel each other across the page (much like my own ideas of culture and communication).

Each node represents a distinct artifact and reflection from the course together depicting my understanding and evolution through various collegial exchanges.

Select a node to read the artifact and my reflection.`
};

const ARTIFACTS = [
  { id: 'discussion', label: 'Discussion', color: '#C4622D', tag: 'Discussion Post', title: 'Listening and Presence as Cultural Considerations', subtitle: 'Reflection on Online Seminar #1 - Feb. 14 2026', text: 'I chose to include this discussion post reflecting on my Online Seminar #1 because it started out of a genuine cultural curiosity I had towards something I was already familiar with. I thought it was valuable to include because it connected how exploring listening as a cultural characteristic carries assumptions with it depending on the context and environment just as talking might. Listening carries its own communicative weight through restraint, timing, and phrasing, all of which shape meaning just as much as the words themselves. Mapping out Jazz and Westernized examples of what listening looks like and comparing them to Indigenous and Chinese perspectives made it clear to me that what counts as active listening, whether that be respectful silence or meaningful participation, simply looks different to different people. What mattered most to me about sharing this was arriving at the instructional design implications, because that is where I began to understand listening not just as a behavior but as a form of communication in itself.', image: '/assets/images/blog/discussionss.jpg' },
  { id: 'logbook', label: 'Logbook', color: '#3A7A58', tag: 'Logbook Reflection', title: 'A person is a person through other persons', subtitle: 'Logbook Entry - Feb 16 2026', text: 'I chose this logbook entry because Gunawardena et al.\'s framework of Ubuntuism and Navajo "wisdom keepers" felt immediately relatable to me and my understanding of how knowledge gets passed down and lived through community and culture. What I found compelling about it was essentially the question sitting underneath the quote: what actually separates wisdom from knowledge, and how does that distinction shape what gets communicated to others over time? The quote "a person is a person through other persons" particularly struck a chord with me because it captures how knowledge doesn\'t stay as information when it moves through people and relationships. It becomes something lived. This made me reflect on how identity, knowledge, community, and place all intersect to create something bigger rather than being separate and individual things.', image: '/assets/images/blog/logbookss.jpg' },
  { id: 'feedback', label: 'Feedback', color: '#7B4A8A', tag: 'Feedback Comment', title: '"Culture is a river not a lake"', subtitle: 'Left for E.B.', text: 'This feedback exchange was a moment I chose to include because it represented a conversation that got me thinking about and extending my perception of culture by comparing it to a river. While it sounds a bit obvious at first, the river metaphor was something I found I could articulate in a way that opened things up. Rivers are predictable but not entirely. They are both capable of carrying someone along, while also being able to carve out new paths entirely over time. This comparison brought me to a point of understanding about the careful balance between performative cultural norms and the individual agency that lives within them. Professional norms can create a kind of flow that insiders navigate without thinking, but when newcomers come along, they might genuinely struggle to find their own path through it. What if their path was one which came because of this flow? No river became a river by starting off on its own. What I kept coming back to was the difference between reviewing norms and thinking about who actually has the power to redistribute or refine them. Seems like it’s a balance between navigating a process and inducing a structural shift altogether. Writing out this feedback exchange was a moment of authentic self-observation that I will take with me and float on.', image: '/assets/images/blog/feedbackss.jpg' },
  { id: 'contribution', label: 'Contribution', color: '#1B6B8A', tag: 'Classmate Contribution', title: "Indigenous peoples in education and leadership", subtitle: 'By R.B.', text: "This was a peer contribution where my colleague responded to a question I had about culturally responsive teaching and brought to my attention how dismal representation and diversity truly is in fields beyond education and in leadership roles. The statistic that only 1.2% of nursing education faculty identify as Indigenous stayed with me. It prompted me to consider how cultural responsiveness isn't simply an issue of curriculum design choices but a question of who holds power and whose knowledge gets centered through ongoing institutional representation. The connection my colleague drew between Indigenous leadership values and an industry outside my own school district made me think about authentic representation as a form of cultural responsiveness in itself, rather than just being about content and approach. I’m not sure I had truly thought about that before. I appreciated that this response didn't simply validate what I was asking but pushed it further by questioning whether surface-level cultural additions to a Western framework constitute genuine responsiveness at all.", image: '/assets/images/blog/contributionss.jpg' }
];

function waitForD3(cb) {
  if (window.d3) { cb(); return; }
  const s = document.createElement('script');
  s.src = 'https://cdnjs.cloudflare.com/ajax/libs/d3/7.8.5/d3.min.js';
  s.onload = cb;
  document.head.appendChild(s);
}
waitForD3(init);

function init() {
  const wrap = document.getElementById('pm-wrap');
  const svgEl = document.getElementById('pm-graph');
  const hint = document.getElementById('pm-hint');
  const backdrop = document.getElementById('pm-backdrop');
  const panel = document.getElementById('pm-panel');

  if (!wrap || !svgEl) return;
  if (!wrap.hasAttribute('tabindex')) wrap.setAttribute('tabindex', '0');
  wrap.style.outline = 'none';

  let W = wrap.clientWidth || 680;
  let H = wrap.clientHeight || 480;

  const getNR = (w, h) => Math.min(w, h) * 0.09;
  const getCR = (w, h) => Math.min(w, h) * 0.12;

  let NR = getNR(W, H);
  let CR = getCR(W, H);
  const DIST = CR + NR * 2.6;
  const PAD = 14;

  const svg = d3.select(svgEl).attr('viewBox', `0 0 ${W} ${H}`);
  svg.selectAll('*').remove();

  let absLeft = 0, absTop = 0, docW = 0, docH = 0;
  
  function updateDocumentBounds() {
    const rect = wrap.getBoundingClientRect();
    absLeft = rect.left + window.scrollX;
    absTop = rect.top + window.scrollY;
    
    docW = Math.max(document.body.scrollWidth, document.documentElement.scrollWidth);
    docH = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
  }
  
  // Set initial bounds
  updateDocumentBounds();

  const centerNode = { ...CENTER_INFO, x: W/2, y: H/2, fx: null, fy: null };
  const artifactNodes = ARTIFACTS.map((d, i) => {
    const angle = -Math.PI/2 + i * (Math.PI/2);
    return { ...d, x: W/2 + Math.cos(angle) * DIST, y: H/2 + Math.sin(angle) * DIST, fx: null, fy: null };
  });
  const allNodes = [centerNode, ...artifactNodes];

  const liveRegion = document.createElement('div');
  liveRegion.setAttribute('aria-live', 'polite');
  liveRegion.setAttribute('aria-atomic', 'true');
  liveRegion.className = 'sr-only';
  document.body.appendChild(liveRegion);

  // ── SIMULATION: Natural Orbital Drift ──
  const sim = d3.forceSimulation(allNodes)
    .force('charge', d3.forceManyBody().strength(-280))
    .force('collide', d3.forceCollide(d => d.id === 'center' ? CR * 1.25 : NR * 1.15).strength(0.85).iterations(2))
    .force('orbit', () => {
      const rotSpeed = 0.00035;
      artifactNodes.forEach(d => {
        if (d.fx != null || d.fy != null) return;
        const dx = d.x - centerNode.x;
        const dy = d.y - centerNode.y;
        const dist = Math.sqrt(dx*dx + dy*dy) || 1;
        
        const tx = -dy / dist;
        const ty = dx / dist;
        d.vx += tx * rotSpeed * dist;
        d.vy += ty * rotSpeed * dist;
        
        const drift = (dist - DIST) * 0.005;
        d.vx -= (dx / dist) * drift;
        d.vy -= (dy / dist) * drift;
      });
    })
    .force('microJitter', () => {
      artifactNodes.forEach(d => {
        if (d.fx != null || d.fy != null) return;
        d.vx += (Math.random() - 0.5) * 0.035;
        d.vy += (Math.random() - 0.5) * 0.035;
      });
    })
    .alphaDecay(0.012).alphaMin(0.0005)
    .on('tick', ticked);

  function ticked() {
    allNodes.forEach(n => {
      const r = n.id === 'center' ? CR : NR;
      
      n.x = Math.max(-absLeft + r + PAD, Math.min(docW - absLeft - r - PAD, n.x));
      n.y = Math.max(HEADER_HEIGHT - absTop + r + PAD, Math.min(docH - FOOTER_HEIGHT - absTop - r - PAD, n.y));
    });
    nodeGs.attr('transform', d => `translate(${d.x},${d.y})`);
  }

  // ── DRAWING ──
  const nodeGs = svg.selectAll('g.node')
    .data(allNodes, d => d.id)
    .join('g')
    .attr('class', d => d.id === 'center' ? 'pm-center-node' : 'pm-art-node')
    .attr('id', d => d.id === 'center' ? 'pm-center' : `pm-anode-${d.id}`)
    .attr('role', 'button').attr('tabindex', '0')
    .style('cursor', 'grab')
    .call(d3.drag().on('start', dragstarted).on('drag', dragged).on('end', dragended));

  const centerOnly = nodeGs.filter(d => d.id === 'center');
  for (let i = 0; i < 3; i++) centerOnly.append('circle').attr('class', 'pm-pulse-ring').attr('cx', 0).attr('cy', 0).attr('r', 2);
  centerOnly.append('circle').attr('class', 'pm-focus-ring').attr('r', CR + 10);
  centerOnly.append('circle').attr('class', 'pm-center-main').attr('r', CR).attr('fill', '#C9952A').attr('stroke', 'rgba(255,215,100,0.25)').attr('stroke-width', 2)
    .style('--r-start', CR+'px').style('--r-end', CR*1.12+'px');
  centerOnly.append('text').attr('text-anchor', 'middle').attr('y', -CR*0.18).attr('font-size', Math.max(11, CR*0.28)+'px').text('Learner');
  centerOnly.append('text').attr('text-anchor', 'middle').attr('y', CR*0.24).attr('font-size', Math.max(9, CR*0.21)+'px').attr('fill', 'rgba(255,255,255,0.7)').text('Portfolio');

  const artsOnly = nodeGs.filter(d => d.id !== 'center');
  artsOnly.append('circle').attr('class', 'pm-focus-ring').attr('r', NR + 10);
  artsOnly.append('circle').attr('class', 'pm-bg-ring').attr('r', NR + 3).attr('stroke', d => d.color).attr('stroke-width', 1.5);
  artsOnly.append('circle').attr('r', NR * 1.25).attr('fill', d => d.color).attr('opacity', 0.06);
  artsOnly.append('circle').attr('class', 'pm-main-c').attr('r', NR).attr('fill', d => d.color).attr('stroke', 'rgba(255,255,255,0.15)').attr('stroke-width', 1.2)
    .style('--r-start', NR+'px').style('--r-end', NR*1.12+'px');
  
  artsOnly.append('text')
    .attr('text-anchor', 'middle')
    .attr('y', 0)
    .attr('font-family', "'Playfair Display', Georgia, serif")
    .attr('font-weight', '500')
    .attr('font-size', Math.max(10.5, NR * 0.22) + 'px')
    .attr('fill', 'rgba(255,255,255,0.95)')
    .attr('dominant-baseline', 'central')
    .attr('letter-spacing', '0.02em')
    .text(d => d.label);

  // ── INTERACTIONS ──
  let dragStartPos = { x: 0, y: 0 };

  function dragstarted(event, d) {
    updateDocumentBounds();
    
    dragStartPos = { x: event.sourceEvent.clientX, y: event.sourceEvent.clientY };
    if (!event.active) sim.alphaTarget(0.2).restart();
    d.fx = d.x; d.fy = d.y;
    if (navigator.vibrate) navigator.vibrate(8);
  }
  function dragged(event, d) { d.fx = event.x; d.fy = event.y; }
  function dragended(event, d) {
    if (!event.active) sim.alphaTarget(0);
    d.fx = null; d.fy = null;
  }

  function handleClick(d, clientX, clientY) {
    if (Math.hypot(clientX - dragStartPos.x, clientY - dragStartPos.y) < 6) openPanel(d, clientX, clientY, d.id);
  }

  nodeGs.on('click', (e, d) => handleClick(d, e.clientX, e.clientY));
  nodeGs.on('keydown', (e, d) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openPanel(d, 0, 0, d.id); } });

  wrap.addEventListener('keydown', (e) => {
    const focused = document.activeElement;
    if (focused !== wrap && !nodeGs.nodes().includes(focused)) return;
    if (!['ArrowRight','ArrowLeft','ArrowDown','ArrowUp'].includes(e.key)) return;
    e.preventDefault();
    const f = [...nodeGs.nodes()];
    let idx = f.includes(focused) ? f.indexOf(focused) : 0;
    if (idx === -1) idx = 0;
    let next = idx;
    if (e.key === 'ArrowRight') next = (idx + 1) % f.length;
    if (e.key === 'ArrowLeft') next = (idx - 1 + f.length) % f.length;
    if (e.key === 'ArrowDown') next = Math.min(idx + 2, f.length - 1);
    if (e.key === 'ArrowUp') next = Math.max(idx - 2, 0);
    if (next !== idx) f[next].focus();
  });

  let currentId = null;
  function openPanel(d, _ox, _oy, id) {
    currentId = id;
    document.getElementById('pm-ov-tag').textContent = d.tag;
    document.getElementById('pm-ov-tag').style.background = (d.tagColor || d.color) + 'cc';
    document.getElementById('pm-ov-title').textContent = d.title;
    document.getElementById('pm-ov-sub').textContent = d.subtitle;
    
    const textContainer = document.getElementById('pm-ov-text');
    textContainer.innerHTML = ''; 

    if (d.text) {
      const p = document.createElement('div');
      p.className = 'pm-ov-body-text';
      p.textContent = d.text;
      p.style.marginBottom = d.image ? '1.5rem' : '0';
      textContainer.appendChild(p);
    }

    if (d.image) {
      const img = document.createElement('img');
      img.src = d.image;
      img.alt = d.title || 'Artifact Screenshot';
      img.className = 'pm-ov-img';
      textContainer.appendChild(img);
    }

    document.getElementById('pm-ov-header').style.borderBottomColor = (d.tagColor || d.color) + '30';
    
    if (id !== 'center') {
      d3.selectAll('.pm-art-node').classed('pm-active', false);
      d3.select(`#pm-anode-${id}`).classed('pm-active', true);
    }

    backdrop.style.display = 'block';
    panel.style.display = 'flex';
    void backdrop.offsetWidth; 

    backdrop.classList.add('pm-visible');
    panel.classList.add('pm-panel-open');
    panel.removeAttribute('aria-hidden');
    hint.style.opacity = '0';
    sim.stop();
    liveRegion.textContent = `Opened: ${d.title}`;
    setTimeout(() => document.getElementById('pm-ov-back').focus(), 80);
  }

  document.getElementById('pm-ov-back').addEventListener('click', () => {
    backdrop.classList.remove('pm-visible');
    panel.classList.remove('pm-panel-open');
    panel.setAttribute('aria-hidden', 'true');
    hint.style.opacity = '1';
    d3.selectAll('.pm-art-node').classed('pm-active', false);
    currentId = null;
    sim.alpha(0.25).restart();

    setTimeout(() => {
      if (!backdrop.classList.contains('pm-visible')) {
        backdrop.style.display = 'none';
        panel.style.display = 'none';
      }
    }, 350);
  });
  
  backdrop.addEventListener('click', () => document.getElementById('pm-ov-back').click());
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && currentId) document.getElementById('pm-ov-back').click(); });

  new ResizeObserver(entries => {
    const r = entries[0].contentRect;
    if (Math.abs(r.width - W) > 2 || Math.abs(r.height - H) > 2) {
      W = r.width; H = r.height;
      NR = getNR(W, H); CR = getCR(W, H);
      svg.attr('viewBox', `0 0 ${W} ${H}`);
      
      updateDocumentBounds();
      sim.alpha(0.2).restart();
    }
  }).observe(wrap);
}