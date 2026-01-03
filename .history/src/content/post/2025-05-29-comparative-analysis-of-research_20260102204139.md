---
title: "ETEC 511 IP#2: Artificial Intelligence"
description: "Machine Intelligence vs Human Intelligence. Who will win?"
publishDate: 2025-05-31
tags: ["ETEC 511"]
showToc: false
---

<style>
  /* 1. HIDE TOC ARTIFACTS */
  span[aria-hidden="true"], a.anchor-link, .lg\:sticky, aside, .toc-container, .header-anchor {
    display: none !important;
  }

  /* 2. GLOBAL THEME TEXT LOCK */
  .pioneer-container p, 
  .pioneer-container div, 
  .pioneer-container span, 
  .ai-post-body p, 
  .ai-post-body li, 
  .ai-post-body b,
  .analysis-content {
      color: var(--theme-text) !important;
  }

  /* 3. CARD & LAYOUT STYLING */
  .chart-title { text-align: center; font-size: 2rem; margin-bottom: 2rem; border-bottom: 2px solid var(--theme-accent); padding-bottom: 1rem; color: var(--theme-accent) !important; }
  
  .pioneer-card { 
      display: flex; 
      border: 1px solid #444; 
      border-radius: 8px; 
      margin-bottom: 2rem; 
      background: var(--theme-bg-card, #f8f9fa); /* Fallback for light theme */
      overflow: hidden; 
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  }

  /* Dark theme adjustment for cards via CSS variables if your theme supports them, otherwise: */
  :root[data-theme='dark'] .pioneer-card { background: #222; }

  .profile-section { flex: 0 0 200px; padding: 1.5rem; text-align: center; border-right: 1px solid #444; background: rgba(0,0,0,0.05); }
  .profile-image { width: 100px; height: 100px; border-radius: 50%; object-fit: cover; margin-bottom: 1rem; border: 2px solid var(--theme-accent); }
  .profile-name { font-size: 1.1rem; margin: 0.5rem 0; color: var(--theme-accent) !important; font-weight: bold; }
  .profile-years { font-size: 0.8rem; opacity: 0.7; color: var(--theme-text) !important; }
  
  .chatgpt-analysis, .perspective-section { flex: 1; padding: 1.5rem; }
  .chatgpt-analysis { border-right: 1px solid #444; }
  
  .analysis-button { background: var(--theme-accent); color: #fff; border: none; padding: 0.5rem 1rem; border-radius: 4px; cursor: pointer; font-size: 0.9rem; margin-bottom: 1rem; }
  .section-title { font-size: 1.1rem; margin-bottom: 0.5rem; color: var(--theme-accent) !important; font-weight: bold; }

  .fake-h2 {
      display: block;
      font-size: 1.5rem;
      font-weight: bold;
      margin: 2rem 0 1rem 0;
      color: var(--theme-accent) !important;
  }

  .reference-section { margin-top: 4rem; border-top: 1px solid #ccc; padding-top: 2rem; }
  .reference-title { display: block; margin-bottom: 1.5rem; color: var(--theme-accent) !important; font-size: 1.2rem; font-weight: bold; }

  @media (max-width: 800px) {
    .pioneer-card { flex-direction: column; }
    .profile-section { flex: 1; border-right: none; border-bottom: 1px solid #444; }
    .chatgpt-analysis { border-right: none; border-bottom: 1px solid #444; }
  }
</style>

<div class="ai-post-body">

<h1 class="chart-title">Pioneers of AI</h1>

[Image of a timeline of Artificial Intelligence history]

<div class="pioneer-container">
  <div class="pioneer-card">
    <div class="profile-section">
      <img src="https://upload.wikimedia.org/wikipedia/commons/a/a1/Alan_Turing_Aged_16.jpg" alt="Alan Turing" class="profile-image">
      <div class="profile-years">1912 - 1954</div>
      <h2 class="profile-name">Alan M. Turing</h2>
    </div>
    <div class="chatgpt-analysis">
      <button class="analysis-button" data-analysis-key="analysis-button1">Click to cycle AI responses</button>
      <div class="analysis-content">Click the button to see Turing's impact through an AI lens...</div>
    </div>
    <div class="perspective-section">
      <h3 class="section-title">My Perspective</h3>
      <div class="perspective-content">
        Alan Turing conceptualized the computer as a brain, laying the foundation for modern algorithms. He predicted computers could one day imitate human intelligence.
      </div>
    </div>
  </div>

  <div class="pioneer-card">
    <div class="profile-section">
      <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Timnit_Gebru_crop.jpg/1280px-Timnit_Gebru_crop.jpg" alt="Timnit Gebru" class="profile-image">
      <div class="profile-years">1983 – Present</div>
      <h2 class="profile-name">Timnit Gebru</h2>
    </div>
    <div class="chatgpt-analysis">
      <button class="analysis-button" data-analysis-key="analysis-button5">Click to cycle AI responses</button>
      <div class="analysis-content">Click the button to see Gebru's impact through an AI lens...</div>
    </div>
    <div class="perspective-section">
      <h3 class="section-title">My Perspective</h3>
      <div class="perspective-content">
        Gebru highlights social harms and systemic biases. She argues that AI replicates patterns from datasets and lacks true understanding.
      </div>
    </div>
  </div>
  
  </div>

<div class="fake-h2">Thinking about language</div>
<p>Machine languages fundamentally differ from human languages in that they rely on strict predefined structures, do not evolve organically, and are not influenced by cultural considerations. In contrast, human languages take many forms and convey subtle nuances including body language and emotional inflections.</p>

<div class="fake-h2">Thinking about intelligence</div>
<p>Unlike human intelligence, machine intelligence seems to be directly proportional to the confines of its programming and data. AI reasoning struggles to conceptualize beyond patterns and generate thoughts outside predefined parameters (Chollet, 2019).</p>

<div class="fake-h2">Machine Learning vs Human Learning</div>
<p>Human learning is multidimensional and shaped by sensory input. In contrast, machine learning occurs by encoding prior knowledge or training on large datasets. Machines lack adaptive depth and reasoning (Crawford, 2021).</p>

<div class="fake-h2">How are my responses different than AI?</div>
<p>My approach differed from that of a machine as I explored multiple sources and made my own judgments. I made conscious choices about which information to include and revised my answers over time—a refinement of self-awareness that is inherently human.</p>

![A beautiful rainbow](../../assets/images/blog/rainbow.jpg)

<div class="reference-section">
  <span class="reference-title">References</span>
  <p><b>Chollet, F. (2019).</b> <i>On the measure of Intelligence</i>. arXiv.</p>
  <p><b>Crawford, K. (2021).</b> <i>Atlas of AI: Power, politics, and the planetary costs of artificial intelligence</i>. Yale University Press.</p>
  <p><b>Harris, A. (2018).</b> <i>Human languages vs. programming languages</i>. Medium.</p>
  <p><b>Turing, A. M. (1950).</b> <i>Computing, machinery and intelligence</i>. Mind.</p>
</div>

</div>

<script is:inline>
  const responses = {
    'analysis-button1': [
      "Turing saw intelligence as machines passing the Turing Test—imitating human conversation indistinguishably.",
      "He believed machines exhibit intelligence if their responses are indistinguishable from a human's.",
    ],
    'analysis-button5': [
      "Gebru identifies intelligence in AI ethically, emphasizing bias mitigation and social justice.",
      "She redefines intelligence to include social responsibility and transparency.",
    ]
    // Add other button keys here
  };

  document.querySelectorAll('.analysis-button').forEach(button => {
    button.addEventListener('click', () => {
      const key = button.getAttribute('data-analysis-key');
      const content = button.nextElementSibling;
      const options = responses[key];
      content.textContent = options[Math.floor(Math.random() * options.length)];
    });
  });
</script>
