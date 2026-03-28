// Runs after D3 is loaded via CDN script tag in the page
(function () {
  const width = 500;
  const height = width;

  const color = d3.scaleLinear()
    .domain([0, 5])
    .range(['hsl(152,80%,80%)', 'hsl(228,30%,40%)'])
    .interpolate(d3.interpolateHcl);

  // ── Tooltip content keyed by node name ──────────────────────────────────
  const tooltips = {
    // Root
    'Gender and Women in Game Culture':
      'An exploration of how gender operates as a structural force in gaming, eSports, and the game industry.',

    // Tier 1 – Category bubbles
    'Hegemonic Masculinity':
      'Game culture constructs men as the "default" gamer.',
    'Harassment and Toxicity':
      'Hyper-masculine, anonymized environments often create severe harassment that push women out of competitive spaces.',
    'Sexual Objectification':
      'Women are routinely reduced to sexualized props and are hyper-sexualized through in-game character designs.',
    'Barriers and Inequality':
      'Structural exclusions keep women underrepresented.',
    'Stereotypes and Expectations':
      'Female players face constant, compounding assumptions about their skill, role preferences, and appearance.',
    'Coping Strategies':
      'Facing relentless hostility, women develop defensive survival strategies that carry their own psychological costs.',
    'Pathways to Change':
      'Lasting change requires visible role models, safe practice spaces, and genuine institutional accountability.',
    'Case Studies':
      'Real-world examples that illustrate the systemic barriers women experience.',

    // Hegemonic Masculinity children
    'Geek vs. Athletic Masculinity':
      '',
    'Technological Mastery as Male':
      '',
    'Male Dominance in eSports':
      '',
    'Structural Sexism in Industry':
      '',

    // Harassment and Toxicity children
    'Online Abuse':
      'Women face disproportionate sexual objectification, violent threats, and toxic banter from teammates and spectators.',
    'Rape and Death Threats':
      '',
    'Sexist/Homophobic Language':
      '',
    'GamerGate Incident':
      '',
    'Workplace Assault (Ubisoft case study)':
      '',

    // Sexual Objectification children
    'Booth Babes':
      '',
    'Sexualized Game Characters':
      '',
    'Unwanted Sexual Attention':
      '',

    // Barriers and Inequality children
    'Underrepresentation in Professional Play':
      '',
    'Gender Pay Gap':
      '',
    'Lack of Promotion for Women':
      '',
    'Gender-Zoning and Exclusion':
      '',

    // Stereotypes and Expectations children
    'The Gamer Girl Trope':
      '',
    'Appearance-Based Judgment':
      '',
    'Restricted Character Roles':
      '',
    'Assumed Lower Skill Levels':
      '',

    // Coping Strategies children
    'Gender Masking/Voice Altering':
      '',
    'Avoidance of Voice Chat':
      '',
    'Withdrawal from Gaming':
      '',
    'Internalized Subordination':
      '',

    // Pathways to Change children
    'Visible Female Role Models':
      '',
    'Single-Gender Leagues':
      '',
    'Supportive Communities':
      '',
    'Institutional Accountability':
      '',
    'Encouraging Women to enter STEM fields ':
      'Broadening access to technology and coding education is foundational to long-term equity across the game industry pipeline.',

    // Case Studies children
    'Geguri (Kim Se-yeon)':
      'South Korean Overwatch pro falsely accused of using cheating software. A defining example of how women\'s skill is surveilled and disbelieved.',
    'Cheating Accusations':
      '',
    'Live-stream Verification':
      '',
    'Post-feminist Stance':
      '',
    'Ubisoft Toronto':
      'A case study on sustained workplace abuse and institutional failures.',
    'Abuse Allegations':
      '',
    'HR and Management Failures':
      '',
    'Toxic Party Culture':
      '',
  };

  const data = {
    name: 'Gender and Women in Game Culture',
    children: [
      {
        name: 'Hegemonic Masculinity',
        children: [
          { name: 'Geek vs. Athletic Masculinity', value: 1 },
          { name: 'Technological Mastery as Male', value: 1 },
          { name: 'Male Dominance in eSports', value: 1 },
          { name: 'Structural Sexism in Industry', value: 1 },
        ],
      },
      {
        name: 'Harassment and Toxicity',
        children: [
          {
            name: 'Online Abuse',
            children: [
              { name: 'Rape and Death Threats', value: 1 },
              { name: 'Sexist/Homophobic Language', value: 1 },
              { name: 'GamerGate Incident', value: 1 },
            ],
          },
          { name: 'Workplace Assault (Ubisoft Case)', value: 1 },
        ],
      },
      {
        name: 'Sexual Objectification',
        children: [
          { name: 'Booth Babes', value: 1 },
          { name: 'Sexualized Game Characters', value: 1 },
          { name: 'Unwanted Sexual Attention', value: 1 },
        ],
      },
      {
        name: 'Barriers and Inequality',
        children: [
          { name: 'Underrepresentation in Professional Play', value: 1 },
          { name: 'Gender Pay Gap', value: 1 },
          { name: 'Lack of Promotion for Women', value: 1 },
          { name: 'Gender-Zoning and Exclusion', value: 1 },
        ],
      },
      {
        name: 'Stereotypes and Expectations',
        children: [
          { name: 'The Gamer Girl Trope', value: 1 },
          { name: 'Appearance-Based Judgment', value: 1 },
          { name: 'Restricted Character Roles', value: 1 },
          { name: 'Assumed Lower Skill Levels', value: 1 },
        ],
      },
      {
        name: 'Coping Strategies',
        children: [
          { name: 'Gender Masking/Voice Altering', value: 1 },
          { name: 'Avoidance of Voice Chat', value: 1 },
          { name: 'Withdrawal from Gaming', value: 1 },
          { name: 'Internalized Subordination', value: 1 },
        ],
      },
      {
        name: 'Pathways to Change',
        children: [
          { name: 'Visible Female Role Models', value: 1 },
          { name: 'Single-Gender Leagues', value: 1 },
          { name: 'Supportive Communities', value: 1 },
          { name: 'Institutional Accountability', value: 1 },
          { name: 'Encouraging Women to enter STEM fields', value: 1 },
        ],
      },
      {
        name: 'Case Studies',
        children: [
          {
            name: 'Geguri (Kim Se-yeon)',
            children: [
              { name: 'Cheating Accusations', value: 1 },
              { name: 'Live-stream Verification', value: 1 },
              { name: 'Post-feminist Stance', value: 1 },
            ],
          },
          {
            name: 'Ubisoft Toronto',
            children: [
              { name: 'Abuse Allegations', value: 1 },
              { name: 'HR and Management Failures', value: 1 },
              { name: 'Toxic Party Culture', value: 1 },
            ],
          },
        ],
      },
    ],
  };

  const pack = (data) =>
    d3.pack()
      .size([width, height])
      .padding(3)(
        d3.hierarchy(data)
          .sum((d) => d.value)
          .sort((a, b) => b.value - a.value)
      );

  const root = pack(data);

  const container = document.getElementById('circlepack-chart');
  if (!container) return;
  container.innerHTML = '';

  // Make container a positioning context for the tooltip
  container.style.position = 'relative';

  // ── Tooltip DOM element ──────────────────────────────────────────────────
  const tip = document.createElement('div');
  Object.assign(tip.style, {
    position:      'absolute',
    pointerEvents: 'none',
    background:    'rgba(15, 15, 25, 0.88)',
    color:         '#f0f0f0',
    fontSize:      '13px',
    lineHeight:    '1.5',
    padding:       '9px 13px',
    borderRadius:  '8px',
    maxWidth:      '260px',
    boxShadow:     '0 4px 16px rgba(0,0,0,0.4)',
    backdropFilter:'blur(4px)',
    border:        '1px solid rgba(255,255,255,0.12)',
    opacity:       '0',
    transition:    'opacity 0.18s ease',
    zIndex:        '10',
    wordBreak:     'break-word',
  });
  container.appendChild(tip);

  function showTip(event, name) {
    const text = tooltips[name];
    if (!text) return;
    tip.innerHTML = `<strong style="display:block;margin-bottom:4px;font-size:12px;opacity:0.7;text-transform:uppercase;letter-spacing:0.04em;">${name}</strong>${text}`;
    tip.style.opacity = '1';
    moveTip(event);
  }

  function moveTip(event) {
    const rect = container.getBoundingClientRect();
    let x = event.clientX - rect.left + 14;
    let y = event.clientY - rect.top  - 10;
    const tipW = 270, tipH = 90;
    if (x + tipW > rect.width)  x = event.clientX - rect.left - tipW - 14;
    if (y + tipH > rect.height) y = event.clientY - rect.top  - tipH - 10;
    tip.style.left = `${x}px`;
    tip.style.top  = `${y}px`;
  }

  function hideTip() {
    tip.style.opacity = '0';
  }

  // ── SVG ──────────────────────────────────────────────────────────────────
  const svg = d3.create('svg')
    .attr('viewBox', `-${width / 2} -${height / 2} ${width} ${height}`)
    .attr('width', width)
    .attr('height', height)
    .attr('style', 'max-width:100%;height:auto;display:block;background:transparent;cursor:pointer;');

  const node = svg.append('g')
    .selectAll('circle')
    .data(root.descendants().slice(1))
    .join('circle')
    .attr('fill', (d) => (d.children ? color(d.depth) : 'white'))
    .attr('pointer-events', (d) => (!d.children ? 'none' : null))
    .on('mouseover', function (event, d) {
      d3.select(this).attr('stroke', '#000');
      showTip(event, d.data.name);
    })
    .on('mousemove', function (event) {
      moveTip(event);
    })
    .on('mouseout', function () {
      d3.select(this).attr('stroke', null);
      hideTip();
    })
    .on('click', (event, d) => {
      if (focus !== d) {
        hideTip();
        zoom(event, d);
        event.stopPropagation();
      }
    });

  // ── Word-wrap helper ─────────────────────────────────────────────────────
  function wrapWords(name, fontSize, maxWidth) {
    const charWidth = fontSize * 0.55;
    const maxChars  = Math.max(1, Math.floor(maxWidth / charWidth));
    const words     = name.split(/\s+/);
    const lines     = [];
    let current     = '';
    for (const word of words) {
      const candidate = current ? `${current} ${word}` : word;
      if (candidate.length <= maxChars) {
        current = candidate;
      } else {
        if (current) lines.push(current);
        current = word;
      }
    }
    if (current) lines.push(current);
    return lines;
  }

  // ── Labels ───────────────────────────────────────────────────────────────
  const label = svg.append('g')
    .attr('pointer-events', 'none')
    .attr('text-anchor', 'middle')
    .selectAll('text')
    .data(root.descendants())
    .join('text')
    .style('fill-opacity', (d) => (d.parent === root ? 1 : 0))
    .style('display',      (d) => (d.parent === root ? 'inline' : 'none'))
    .style('font-family',  'sans-serif');

  svg.on('click', (event) => { hideTip(); zoom(event, root); });

  let focus = root;
  let view;
  zoomTo([focus.x, focus.y, focus.r * 2]);

  function zoomTo(v) {
    const k = width / v[2];
    view = v;

    node.attr('transform', (d) => `translate(${(d.x - v[0]) * k},${(d.y - v[1]) * k})`);
    node.attr('r',          (d) => d.r * k);
    label.attr('transform', (d) => `translate(${(d.x - v[0]) * k},${(d.y - v[1]) * k})`);

    label.each(function (d, i) {
      const text = d3.select(this);
      if (text.style('fill-opacity') === '0' || text.style('display') === 'none') return;

      let radius;
      if (i === 0) {
        radius = root.r * k;
      } else {
        const circleEl = node.filter((_, idx) => idx === i - 1).node();
        if (!circleEl) return;
        radius = parseFloat(circleEl.getAttribute('r'));
      }

      const maxWidth  = radius * 1.6;
      const fontSize  = Math.min(18, Math.max(8, radius * 0.28));
      text.style('font-size', `${fontSize}px`);

      const lines      = wrapWords(d.data.name, fontSize, maxWidth);
      const lineHeight = fontSize * 1.2;
      const startY     = -(lines.length * lineHeight) / 2 + lineHeight * 0.5;

      text.selectAll('tspan').remove();
      lines.forEach((line, li) => {
        text.append('tspan')
          .attr('x', 0)
          .attr('y', startY + li * lineHeight)
          .text(line);
      });
    });
  }

  function zoom(event, d) {
    focus = d;
    const transition = svg.transition()
      .duration(event.altKey ? 7500 : 750)
      .tween('zoom', () => {
        const i = d3.interpolateZoom(view, [focus.x, focus.y, focus.r * 2]);
        return (t) => zoomTo(i(t));
      });

    label
      .filter(function (d) { return d.parent === focus || this.style.display === 'inline'; })
      .transition(transition)
      .style('fill-opacity', (d) => (d.parent === focus ? 1 : 0))
      .on('start', function (d) { if (d.parent === focus)  this.style.display = 'inline'; })
      .on('end',   function (d) { if (d.parent !== focus)  this.style.display = 'none';   });
  }

  container.appendChild(svg.node());
})();