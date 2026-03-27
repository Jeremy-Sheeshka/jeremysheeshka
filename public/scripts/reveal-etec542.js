(function () {
  /* ------------------------------------------------------------------
   * reveal-etec542.js — Self-contained Reveal.js presentation
   * ------------------------------------------------------------------ */

  // ========== 1. Configuration & Constants ==========
  const CONTAINER_ID = 'reveal-etec542-container';

  const REVEAL_CONFIG = {
    embedded: true,
    hash: false,
    controls: true,
    progress: true,
    slideNumber: 'c/t',
    transition: 'fade',
    transitionSpeed: 'slow',
    backgroundTransition: 'fade',
    center: false,
    margin: 0.07,
    width: 960,
    height: 560,
    keyboardCondition: 'focused',
  };

  // ========== 2. Utility Functions ==========
  const loadCSS = (href) => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    document.head.appendChild(link);
  };

  const loadScript = (src, callback) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = callback;
    document.head.appendChild(script);
  };

  // ========== 3. Styles ==========
  const CSS = `
    :root {
      --rp-navy: #0d1b2a;
      --rp-gold: #c9a84c;
      --rp-gold2: #e8c97a;
      --rp-teal: #5bb8aa;
      --rp-teal2: #7dd4c8;
      --rp-coral: #d97b6a;
      --rp-coral2: #f09585;
      --rp-ink: #f0ece4;
      --rp-ink2: #ccc8c0;
      --rp-ink3: #9a968e;
    }

    #${CONTAINER_ID} {
      height: 600px;
      border-radius: 10px;
      overflow: hidden;
      margin: 2.5rem 0;
      box-shadow: 0 8px 48px rgba(0,0,0,0.4);
    }

    #${CONTAINER_ID} .reveal-viewport {
      background: var(--rp-navy) !important;
    }

    #${CONTAINER_ID} .reveal {
      font-family: "DM Sans", sans-serif !important;
    }

    #${CONTAINER_ID} .reveal h1,
    #${CONTAINER_ID} .reveal h2 {
      font-family: "DM Serif Display", serif !important;
      font-weight: 400;
      text-transform: none;
      letter-spacing: -0.01em;
      line-height: 1.15;
      color: var(--rp-ink) !important;
      margin: 0 0 0.3em;
    }

    #${CONTAINER_ID} .reveal h1 { font-size: 2.4em; }
    #${CONTAINER_ID} .reveal h2 { font-size: 1.8em; }

    #${CONTAINER_ID} .reveal p,
    #${CONTAINER_ID} .reveal li {
      color: var(--rp-ink2);
      font-weight: 300;
      line-height: 1.7;
      margin: 0;
    }

    #${CONTAINER_ID} .reveal strong {
      color: var(--rp-ink);
      font-weight: 500;
    }

    #${CONTAINER_ID} .reveal em {
      color: var(--rp-gold2);
      font-style: italic;
    }

    #${CONTAINER_ID} .reveal .slides,
    #${CONTAINER_ID} .reveal section {
      text-align: left;
    }

    #${CONTAINER_ID} .reveal section.present::before {
      content: "";
      position: fixed;
      top: 0;
      left: 0;
      width: 3px;
      height: 100vh;
      background: var(--rp-gold);
      opacity: 0.6;
    }

    #${CONTAINER_ID} .reveal .progress { color: var(--rp-gold); }
    #${CONTAINER_ID} .reveal .controls { color: var(--rp-gold2); }

    #${CONTAINER_ID} .reveal .slide-number {
      background: transparent;
      color: var(--rp-ink3);
      font-family: "DM Sans", sans-serif;
      font-size: 13px;
    }

    #${CONTAINER_ID} .rp-eyebrow {
      display: block;
      font-size: 0.38em;
      letter-spacing: 0.22em;
      text-transform: uppercase;
      color: var(--rp-gold);
      margin-bottom: 0.5em;
      font-family: "DM Sans", sans-serif;
      font-weight: 500;
    }

    #${CONTAINER_ID} .rp-ctx {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 0.35em;
      font-size: 0.36em;
      letter-spacing: 0.18em;
      text-transform: uppercase;
      color: var(--rp-teal);
      font-family: "DM Sans", sans-serif;
      font-weight: 500;
    }

    #${CONTAINER_ID} .rp-ctx::before {
      content: "";
      display: inline-block;
      width: 26px;
      height: 1px;
      background: var(--rp-teal);
    }

    #${CONTAINER_ID} .rp-ctx.coral { color: var(--rp-coral); }
    #${CONTAINER_ID} .rp-ctx.coral::before { background: var(--rp-coral); }
    #${CONTAINER_ID} .rp-ctx.gold { color: var(--rp-gold); }
    #${CONTAINER_ID} .rp-ctx.gold::before { background: var(--rp-gold); }

    #${CONTAINER_ID} .rp-tag {
      display: inline-block;
      font-size: 0.29em;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      border-radius: 20px;
      padding: 3px 13px;
      font-family: "DM Sans", sans-serif;
      font-weight: 500;
      margin-bottom: 0.4em;
    }

    #${CONTAINER_ID} .rp-tag.teal {
      background: rgba(91,184,170,0.18);
      color: var(--rp-teal2);
    }

    #${CONTAINER_ID} .rp-tag.coral {
      background: rgba(217,123,106,0.18);
      color: var(--rp-coral2);
    }

    #${CONTAINER_ID} .rp-fw {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      border: 1px solid rgba(201,168,76,0.4);
      border-radius: 4px;
      padding: 7px 16px;
      font-size: 0.36em;
      letter-spacing: 0.1em;
      color: var(--rp-gold2);
      font-family: "DM Sans", sans-serif;
      margin-top: 0.7em;
    }

    #${CONTAINER_ID} .rp-fw span { color: var(--rp-ink3); }

    #${CONTAINER_ID} .rp-pillars {
      display: flex;
      gap: 26px;
      margin-top: 1.6em;
    }

    #${CONTAINER_ID} .rp-pillar {
      display: flex;
      align-items: center;
      gap: 7px;
      font-size: 0.32em;
      color: var(--rp-ink2);
      letter-spacing: 0.06em;
      font-family: "DM Sans", sans-serif;
    }

    #${CONTAINER_ID} .rp-dot {
      width: 5px;
      height: 5px;
      border-radius: 50%;
      flex-shrink: 0;
    }

    #${CONTAINER_ID} .rp-deco {
      position: fixed;
      right: -40px;
      top: 50%;
      transform: translateY(-50%);
      font-family: "DM Serif Display", serif;
      font-size: 26vw;
      color: rgba(201,168,76,0.045);
      line-height: 1;
      pointer-events: none;
      user-select: none;
    }

    #${CONTAINER_ID} .rp-2col {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 18px;
      margin-top: 0.45em;
    }

    #${CONTAINER_ID} .rp-3col {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 15px;
      margin-top: 0.45em;
    }

    #${CONTAINER_ID} .rp-4col {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr 1fr;
      gap: 13px;
      margin-top: 0.45em;
    }

    #${CONTAINER_ID} .rp-card {
      border-radius: 6px;
      padding: 17px 19px;
      background: rgba(255,255,255,0.05);
      border: 1px solid rgba(255,255,255,0.12);
    }

    #${CONTAINER_ID} .rp-card.teal {
      background: rgba(91,184,170,0.09);
      border-color: rgba(91,184,170,0.3);
    }

    #${CONTAINER_ID} .rp-card.coral {
      background: rgba(217,123,106,0.09);
      border-color: rgba(217,123,106,0.3);
    }

    #${CONTAINER_ID} .rp-card.gold {
      background: rgba(201,168,76,0.09);
      border-color: rgba(201,168,76,0.3);
    }

    #${CONTAINER_ID} .rp-card.lg {
      border-left: 3px solid var(--rp-gold);
      border-radius: 0 6px 6px 0;
    }

    #${CONTAINER_ID} .rp-card.lc {
      border-left: 3px solid var(--rp-coral);
      border-radius: 0 6px 6px 0;
    }

    #${CONTAINER_ID} .rp-card.lt {
      border-left: 3px solid var(--rp-teal);
      border-radius: 0 6px 6px 0;
    }

    #${CONTAINER_ID} .rp-lbl {
      font-size: 0.28em;
      letter-spacing: 0.18em;
      text-transform: uppercase;
      color: var(--rp-ink3);
      margin-bottom: 6px;
      font-family: "DM Sans", sans-serif;
      font-weight: 500;
    }

    #${CONTAINER_ID} .rp-lbl.teal { color: var(--rp-teal2); }
    #${CONTAINER_ID} .rp-lbl.coral { color: var(--rp-coral2); }
    #${CONTAINER_ID} .rp-lbl.gold { color: var(--rp-gold2); }

    #${CONTAINER_ID} .rp-card h4 {
      font-size: 0.44em;
      color: var(--rp-ink);
      font-weight: 500;
      margin: 0 0 5px;
      font-family: "DM Sans", sans-serif;
      line-height: 1.35;
    }

    #${CONTAINER_ID} .rp-card p,
    #${CONTAINER_ID} .rp-card li {
      font-size: 0.38em;
      color: var(--rp-ink2);
      line-height: 1.6;
      font-weight: 300;
    }

    #${CONTAINER_ID} .rp-card ul {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    #${CONTAINER_ID} .rp-card ul li {
      padding: 4px 0 4px 15px;
      border-bottom: 1px solid rgba(255,255,255,0.07);
      position: relative;
    }

    #${CONTAINER_ID} .rp-card ul li:last-child { border-bottom: none; }

    #${CONTAINER_ID} .rp-card ul li::before {
      content: "—";
      position: absolute;
      left: 0;
      color: var(--rp-ink3);
      font-size: 0.9em;
    }

    #${CONTAINER_ID} .rp-callout {
      border-radius: 4px;
      padding: 13px 19px;
      margin-top: 13px;
      font-size: 0.38em;
      line-height: 1.7;
      color: var(--rp-ink2);
      font-weight: 300;
    }

    #${CONTAINER_ID} .rp-callout.teal {
      background: rgba(91,184,170,0.1);
      border-left: 3px solid var(--rp-teal);
    }

    #${CONTAINER_ID} .rp-callout.gold {
      background: rgba(201,168,76,0.08);
      border: 1px solid rgba(201,168,76,0.3);
    }

    #${CONTAINER_ID} .rp-callout strong {
      color: var(--rp-ink);
      font-weight: 500;
    }

    #${CONTAINER_ID} .rp-callout em {
      color: var(--rp-gold2);
      font-style: italic;
    }

    #${CONTAINER_ID} .rp-num {
      font-family: "DM Serif Display", serif;
      font-size: 1.7em;
      color: rgba(201,168,76,0.22);
      line-height: 1;
      margin-bottom: 3px;
    }

    #${CONTAINER_ID} .rp-qlist {
      list-style: none;
      counter-reset: q;
      padding: 0;
      margin: 0;
    }

    #${CONTAINER_ID} .rp-qlist li {
      counter-increment: q;
      font-size: 0.4em;
      color: var(--rp-ink2);
      line-height: 1.65;
      padding: 9px 0 9px 32px;
      border-bottom: 1px solid rgba(255,255,255,0.07);
      position: relative;
      font-weight: 300;
    }

    #${CONTAINER_ID} .rp-qlist li:last-child { border-bottom: none; }

    #${CONTAINER_ID} .rp-qlist li::before {
      content: counter(q);
      position: absolute;
      left: 0;
      font-family: "DM Serif Display", serif;
      font-size: 1.3em;
      color: var(--rp-gold);
      line-height: 1.4;
    }

    #${CONTAINER_ID} .rp-flow-wrap {
      background: rgba(255,255,255,0.02);
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 8px;
      padding: 10px 14px 4px;
      margin-top: 12px;
    }
  `;

  // ========== 4. SVG Resources ==========
  const SVG_MARKER_DEFS = `
    <defs>
      <marker id="rpa" viewBox="0 0 10 10" refX="8" refY="5"
              markerWidth="5" markerHeight="5" orient="auto-start-reverse">
        <path d="M2 1L8 5L2 9" fill="none" stroke="#9a968e"
              stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      </marker>
    </defs>
  `;

  const FLOW_FULL = `
<svg style="width:100%;display:block;margin-top:6px;" viewBox="0 0 940 380" xmlns="http://www.w3.org/2000/svg">
  ${SVG_MARKER_DEFS}
  <rect x="330" y="6" width="280" height="48" rx="8" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.18)"/>
  <text x="470" y="28" text-anchor="middle" font-size="13" fill="#f0ece4">Karen announces event publicly</text>
  <text x="470" y="44" text-anchor="middle" font-size="11" fill="#ccc8c0">Poster to all staff</text>
  <text x="470" y="72" text-anchor="middle" font-size="10" fill="#9a968e" font-style="italic">two readings</text>
  <line x1="440" y1="54" x2="240" y2="96" stroke="#9a968e" marker-end="url(#rpa)"/>
  <line x1="500" y1="54" x2="700" y2="96" stroke="#9a968e" marker-end="url(#rpa)"/>
  <rect x="90" y="96" width="240" height="48" rx="8" fill="rgba(91,184,170,0.18)" stroke="rgba(91,184,170,0.5)"/>
  <text x="210" y="120" text-anchor="middle" font-size="13" fill="#f0ece4">Jordan's reading</text>
  <text x="210" y="136" text-anchor="middle" font-size="11" fill="#7dd4c8">No consult = lack of respect</text>
  <rect x="610" y="96" width="240" height="48" rx="8" fill="rgba(217,123,106,0.18)" stroke="rgba(217,123,106,0.5)"/>
  <text x="730" y="120" text-anchor="middle" font-size="13" fill="#f0ece4">Karen's reading</text>
  <text x="730" y="136" text-anchor="middle" font-size="11" fill="#f09585">Tradition = assumed shared knowledge</text>
  <line x1="210" y1="144" x2="210" y2="184" stroke="#9a968e" marker-end="url(#rpa)"/>
  <rect x="90" y="184" width="240" height="48" rx="8" fill="rgba(91,184,170,0.18)" stroke="rgba(91,184,170,0.5)"/>
  <text x="210" y="208" text-anchor="middle" font-size="13" fill="#f0ece4">Jordan replies</text>
  <text x="210" y="224" text-anchor="middle" font-size="11" fill="#7dd4c8">Concerned about short notice</text>
  <line x1="330" y1="208" x2="610" y2="208" stroke="#9a968e" marker-end="url(#rpa)"/>
  <rect x="610" y="184" width="240" height="48" rx="8" fill="rgba(217,123,106,0.18)" stroke="rgba(217,123,106,0.5)"/>
  <text x="730" y="206" text-anchor="middle" font-size="13" fill="#f0ece4">Karen's interpretation</text>
  <text x="730" y="222" text-anchor="middle" font-size="11" fill="#f09585">Concern = resistance / incompetence</text>
  <line x1="730" y1="232" x2="730" y2="262" stroke="#9a968e" marker-end="url(#rpa)"/>
  <rect x="610" y="262" width="240" height="44" rx="8" fill="rgba(201,140,40,0.25)" stroke="rgba(201,168,76,0.6)"/>
  <text x="730" y="284" text-anchor="middle" font-size="13" fill="#f0ece4">Escalation</text>
  <text x="730" y="300" text-anchor="middle" font-size="11" fill="#e8c97a">Reply labelled "unprofessional" → senior CC'd</text>
  <rect x="90" y="262" width="240" height="44" rx="8" fill="rgba(91,184,170,0.18)" stroke="rgba(91,184,170,0.5)"/>
  <text x="210" y="282" text-anchor="middle" font-size="13" fill="#f0ece4">Jordan clarifies</text>
  <text x="210" y="298" text-anchor="middle" font-size="11" fill="#7dd4c8">Still willing to participate</text>
  <line x1="610" y1="284" x2="330" y2="284" stroke="#9a968e" marker-end="url(#rpa)"/>
  <rect x="260" y="320" width="420" height="44" rx="8" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.25)"/>
  <text x="470" y="342" text-anchor="middle" font-size="12" fill="#f0ece4">No repair mechanism available</text>
  <text x="470" y="358" text-anchor="middle" font-size="10" fill="#ccc8c0">Email locked both parties into their interpretations</text>
  <line x1="210" y1="306" x2="360" y2="320" stroke="#9a968e" marker-end="url(#rpa)"/>
  <line x1="730" y1="306" x2="580" y2="320" stroke="#9a968e" marker-end="url(#rpa)"/>
</svg>
`;

  const FLOW_MINI = `
    <svg style="width:100%;display:block;" viewBox="0 0 940 94" xmlns="http://www.w3.org/2000/svg">
      ${SVG_MARKER_DEFS}
      <rect x="2"   y="16" width="160" height="48" rx="5" fill="rgba(201,168,76,0.08)"  stroke="rgba(201,168,76,0.3)"  stroke-width="0.8"/>
      <text x="82"  y="37" text-anchor="middle" font-family="DM Sans,sans-serif" font-size="11" fill="#f0ece4" font-weight="500">Karen announces</text>
      <text x="82"  y="53" text-anchor="middle" font-family="DM Sans,sans-serif" font-size="10" fill="#ccc8c0">Poster to all staff</text>
      <rect x="198" y="16" width="160" height="48" rx="5" fill="rgba(91,184,170,0.08)"  stroke="rgba(91,184,170,0.3)"  stroke-width="0.8"/>
      <text x="278" y="37" text-anchor="middle" font-family="DM Sans,sans-serif" font-size="11" fill="#f0ece4" font-weight="500">Jordan's reading</text>
      <text x="278" y="53" text-anchor="middle" font-family="DM Sans,sans-serif" font-size="10" fill="#ccc8c0">No consultation = no respect</text>
      <rect x="394" y="16" width="160" height="48" rx="5" fill="rgba(91,184,170,0.08)"  stroke="rgba(91,184,170,0.3)"  stroke-width="0.8"/>
      <text x="474" y="37" text-anchor="middle" font-family="DM Sans,sans-serif" font-size="11" fill="#f0ece4" font-weight="500">Jordan replies</text>
      <text x="474" y="53" text-anchor="middle" font-family="DM Sans,sans-serif" font-size="10" fill="#ccc8c0">Concern about communication</text>
      <rect x="590" y="16" width="160" height="48" rx="5" fill="rgba(217,123,106,0.08)" stroke="rgba(217,123,106,0.3)" stroke-width="0.8"/>
      <text x="670" y="37" text-anchor="middle" font-family="DM Sans,sans-serif" font-size="11" fill="#f0ece4" font-weight="500">Karen's reading</text>
      <text x="670" y="53" text-anchor="middle" font-family="DM Sans,sans-serif" font-size="10" fill="#ccc8c0">Concern = resistance + incompetence</text>
      <rect x="786" y="16" width="152" height="48" rx="5" fill="rgba(217,123,106,0.11)" stroke="rgba(217,123,106,0.4)" stroke-width="0.8"/>
      <text x="862" y="37" text-anchor="middle" font-family="DM Sans,sans-serif" font-size="11" fill="#f0ece4" font-weight="500">Escalation</text>
      <text x="862" y="53" text-anchor="middle" font-family="DM Sans,sans-serif" font-size="10" fill="#ccc8c0">Jordan called "unprofessional"</text>
      <line x1="162" y1="40" x2="196" y2="40" stroke="#9a968e" stroke-width="1" marker-end="url(#rpa)"/>
      <line x1="358" y1="40" x2="392" y2="40" stroke="#9a968e" stroke-width="1" marker-end="url(#rpa)"/>
      <line x1="554" y1="40" x2="588" y2="40" stroke="#9a968e" stroke-width="1" marker-end="url(#rpa)"/>
      <line x1="748" y1="40" x2="784" y2="40" stroke="#9a968e" stroke-width="1" marker-end="url(#rpa)"/>
      <line x1="90" y1="84" x2="850" y2="84" stroke="#6b6760" stroke-width="0.5" stroke-dasharray="3 3"/>
    </svg>
  `;

  // ========== 5. Slide Content ==========
  const SLIDES = [
    // Slide 1: Title
    `
    <section>
      <div class="rp-deco">?</div>
      <span class="rp-eyebrow">Etec542 - Online Seminar</span>
      <h1>Whose Norms <br> are <em>Normal</em>? </h1>
      <p style="font-size:0.5em;max-width:560px;margin-top:0.3em;font-weight:300;">
        Here's my example of communication breaking down in a virtual space, analyzed through Neuliep's Contextualized Model using the names Jordan and Karen as placeholders.
      </p>
    </section>
    `,

    // Slide 2: The Incident
    `
    <section>
      <span class="rp-eyebrow">Setting the Scene</span>
      <h2>The Incident</h2>
      <div class="rp-4col">
        <div class="rp-card lg"><div class="rp-lbl">Background</div><h4>Two professionals</h4><p>Coordinating a shared community event. Previously collaborated through clear advance notice of a third party.</p></div>
        <div class="rp-card lg"><div class="rp-lbl">The Trigger</div><h4>Poster distributed</h4><p>Jordan's group listed as a participant in the event to all staff without his consultation.</p></div>
        <div class="rp-card lt"><div class="rp-lbl">Jordan's reply</div><h4>Concern raised</h4><p>Jordan raised concern about short notice and scheduling challenges.</p></div>
        <div class="rp-card lc"><div class="rp-lbl">Karen's response</div><h4>"You should have known"</h4><p>Karen takes this as a signal to remove Jordan's group from the event entirely and CC's his administration.</p></div>
      </div>
      <div class="rp-callout gold"><strong>The critical incident:</strong> the virtual exchange resulted in completely opposite interpretations. <br> A question about <em>process</em> was received as a refusal to <em>participate</em>.</div>
    </section>
    `,

    // Slide 3: Perceptual Cultural Context
    `
    <section>
      <div class="rp-ctx">Neuliep — Perceptual Cultural Context</div>
      <h2>A Clash of Professional<br>Micro-Cultures</h2>
      <div class="rp-2col">
        <div class="rp-card teal"><div class="rp-lbl teal">Jordan's filter</div><div class="rp-tag teal">Low-context · Protocol-based</div><ul><li>Explicit coordination = professional respect</li><li>Advance notice = respect for autonomy</li><li>Information must be stated, not assumed</li><li>Consult before announcing publicly</li></ul></div>
        <div class="rp-card coral"><div class="rp-lbl coral">Karen's filter</div><div class="rp-tag coral">High-context · Tradition-based</div><ul><li>20-year tradition = the notification itself</li><li>Assumed shared institutional knowledge</li><li>Context carries meaning without stating it</li><li>Continuity = professional efficiency</li></ul></div>
      </div>
      <div class="rp-callout gold">Neither party was wrong. Both were judging through their own cultural lens aligning with Neuliep's definition of <strong>ethnocentrism</strong>. But whose norms get to count as the default?</div>
    </section>
    `,

    // Slide 4: Environmental Context
    `
    <section>
      <div class="rp-ctx coral">Neuliep — Environmental Context</div>
      <h2>The Effect the Medium Had</h2>
      <div class="rp-4col">
        <div class="rp-card"><div class="rp-lbl gold">01</div><h4>Asynchronous</h4><p>No real-time ability to repair meaning. Misreadings compounded with each reply rather than resolving.</p></div>
        <div class="rp-card"><div class="rp-lbl gold">02</div><h4>Written record</h4><p>Both parties shifted from problem-solving into self-protection.</p></div>
        <div class="rp-card"><div class="rp-lbl gold">03</div><h4>No external cues</h4><p>"You should have known about this event, it happens every year." <br> <br> "If you didn't know, you could have messaged the venue yourself in advance." <br> <br> Reads as dismissive rather than informative.</p></div>
        <div class="rp-card"><div class="rp-lbl gold">04</div><h4>Public visibility</h4><p>The poster was sent to all staff first and was how Jordan found out. He responded to Karen in private about a public commitment she had made in their name.</p></div>
      </div>
      <div class="rp-callout teal"><strong>Reeder et al.</strong> observes that electronically mediated communication lacks <em>dynamic real-time repair mechanisms</em> and in-the-moment tools that stop misunderstandings from snowballing.</div>
    </section>
    `,

    // Slide 5: Socio-Relational Context
    `
    <section>
      <div class="rp-ctx gold">Neuliep — Socio-Relational Context</div>
      <h2>Power, Status, and Policing</h2>
      <div class="rp-3col">
        <div class="rp-card gold"><div class="rp-lbl gold">Veteran vs. Newcomer</div><h4>Cultural capital</h4><p>Karen was guided through the event for over 20 years before through a third party that had recently left the district. She had institutional (insider) knowledge which she held Jordan accountable for but was something he did not yet possess as he was still new to the community.</p></div>
        <div class="rp-card coral"><div class="rp-lbl coral">Informal policing</div><h4>Labelled "unprofessional"</h4><p>Karen expressed that Jordan's style of communication about this was unprofessional. This brings to question whose norms of communication create the default.</p></div>
        <div class="rp-card teal"><div class="rp-lbl teal">Formal policing</div><h4>Senior colleague CC'd</h4><p>Their response: "My expectation was that I would see your group performing, as they have every year." Tradition enforced from institutional authority.</p></div>
      </div>
      <div class="rp-flow-wrap">${FLOW_MINI}</div>
    </section>
    `,

    // Slide 6: Flowchart
    `
    <section>
      <span class="rp-eyebrow">How Meaning Was Made</span>
      <h2>Step by Step</h2>
      ${FLOW_FULL}
    </section>
    `,

    // Slide 7: Insights
    `
    <section>
      <span class="rp-eyebrow">Reflection</span>
      <h2>Insights</h2>
      <div class="rp-3col">
        <div class="rp-card"><div class="rp-num">1</div><h4 style="color:var(--rp-gold2)">Virtual communication is never neutral</h4><p>Cultural and microcultural filters shape the entire interaction before either party has a correct meaning.</p></div>
        <div class="rp-card"><div class="rp-num">2</div><h4 style="color:var(--rp-gold2)">The breakdown transcends the email</h4><p>What started as a virtual misunderstanding led to real-world consequences and complexities. Refusal to mediate, sustained misinterpretation, and lasting professional and social fallout.</p></div>
        <div class="rp-card"><div class="rp-num">3</div><h4 style="color:var(--rp-gold2)">Whose norms are the default?</h4><p>Often in shared professional spaces, one cultural framework quietly becomes the standard and everyone else is measured against it.</p></div>
      </div>
    </section>
    `,

    // Slide 8: Discussion Questions
    `
    <section>
      <span class="rp-eyebrow">Things to think about</span>
      <h2>Discussion Questions</h2>
      <div class="rp-card" style="margin-top:15px;padding:17px 22px;">
        <div class="rp-lbl gold" style="margin-bottom:10px;">Discussion Questions</div>
        <ol class="rp-qlist">
          <li>In shared professional spaces, whose cultural norms get to count as the default? <strong>How is that established, and what happens to everyone else?</strong></li>
          <li>At what point does <strong>"this is how we do things"</strong> stop being an orientation and start being a barrier to one's autonomy?</li>
          <li>What happens when you're expected to carry a tradition or cultural norms <strong>that were never yours to begin with?</strong></li>
        </ol>
      </div>
    </section>
    `,
  ];

  // ========== 6. Initialization ==========
  const buildPresentation = () => {
    const container = document.getElementById(CONTAINER_ID);
    if (!container) return;

    const styleTag = document.createElement('style');
    styleTag.textContent = CSS;
    document.head.appendChild(styleTag);

    container.innerHTML = `
      <div class="reveal" style="height:600px;">
        <div class="slides">
          ${SLIDES.join('')}
        </div>
      </div>
    `;

    const deck = new Reveal(container.querySelector('.reveal'), REVEAL_CONFIG);
    deck.initialize();
  };

  const loadDependencies = () => {
    loadCSS('https://cdnjs.cloudflare.com/ajax/libs/reveal.js/4.6.1/reveal.min.css');
    loadCSS('https://cdnjs.cloudflare.com/ajax/libs/reveal.js/4.6.1/theme/black.min.css');
    loadCSS('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500&display=swap');
    loadScript('https://cdnjs.cloudflare.com/ajax/libs/reveal.js/4.6.1/reveal.min.js', buildPresentation);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadDependencies);
  } else {
    loadDependencies();
  }
})();