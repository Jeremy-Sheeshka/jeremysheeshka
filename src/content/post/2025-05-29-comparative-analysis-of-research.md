---
title: "ETEC 511 IP#2:  Artificial Intelligence"
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

  /* 2. STYLE HEADERS & TITLES */
  .chart-title { 
    text-align: center; 
    font-size: 2rem; 
    margin-bottom: 2rem; 
    border-bottom: 2px solid var(--theme-accent); 
    padding-bottom: 1rem; 
    color: var(--theme-accent) !important; 
  }

  .fake-h2 {
      display: block;
      font-size: 1.5rem;
      font-weight: bold;
      margin: 2rem 0 1rem 0;
      color: var(--theme-accent) !important;
  }

  /* 3. PIONEER CARDS THEME LOCK */
  .pioneer-card { 
      display: flex; 
      border: 1px solid #444; 
      border-radius: 8px; 
      margin-bottom: 2rem; 
      background: var(--theme-bg-card, rgba(0,0,0,0.05)); 
      overflow: hidden; 
  }
  
  .profile-section { flex: 0 0 200px; padding: 1.5rem; text-align: center; border-right: 1px solid #444; background: rgba(0,0,0,0.03); }
  .profile-image { width: 100px; height: 100px; border-radius: 50%; object-fit: cover; margin-bottom: 1rem; border: 2px solid var(--theme-accent); }
  .profile-name { font-size: 1.1rem; margin: 0.5rem 0; color: var(--theme-accent) !important; font-weight: bold; }
  .profile-years { font-size: 0.8rem; color: var(--theme-text) !important; opacity: 0.8; }
  .image-caption a { color: #3182ce !important; font-size: 0.7rem; text-decoration: underline; }

  .chatgpt-analysis, .perspective-section { flex: 1; padding: 1.5rem; }
  .chatgpt-analysis { border-right: 1px solid #444; }
  .analysis-button { background: var(--theme-accent); color: #fff !important; border: none; padding: 0.5rem 1rem; border-radius: 4px; cursor: pointer; font-size: 0.8rem; margin-bottom: 1rem; }
  .analysis-content { font-style: italic; font-size: 0.95rem; line-height: 1.5; color: var(--theme-text) !important; }
  .section-title { font-size: 1.1rem; margin-bottom: 0.5rem; color: var(--theme-accent) !important; font-weight: bold; }
  .perspective-content { font-size: 0.95rem; line-height: 1.5; color: var(--theme-text) !important; }

  @media (max-width: 800px) {
    .pioneer-card { flex-direction: column; }
    .profile-section, .chatgpt-analysis { border-right: none; border-bottom: 1px solid #444; }
  }
</style>

<div style="color: var(--theme-text) !important;">

<div class="chart-title">Pioneers of AI</div>

<div class="pioneer-container">
  <div class="pioneer-card">
    <div class="profile-section">
      <img src="https://upload.wikimedia.org/wikipedia/commons/a/a1/Alan_Turing_Aged_16.jpg" alt="Alan Turing" class="profile-image">
      <div class="image-caption"><a href="https://commons.wikimedia.org/wiki/File:Alan_Turing_Aged_16.jpg" target="_blank">Photo: Wikimedia Commons</a></div>
      <div class="profile-name">Alan M. Turing</div>
      <div class="profile-years">1912 - 1954</div>
    </div>
    <div class="chatgpt-analysis">
      <button class="analysis-button" data-analysis-key="turing">Click here to cycle through AI responses</button>
      <div class="analysis-content">Click to see AI perspectives...</div>
    </div>
    <div class="perspective-section">
      <div class="section-title">My Perspective</div>
      <div class="perspective-content">Alan Turing conceptualized the computer as a brain laying down the foundation for modern algorithms and computer programming languages. He predicted computers could oneday imitate human intelligence. "I believe that at the end of the century [...] one will be able to speak of machines thinking without expecting to be contradicted" (Turing, 1950, p. 8)."</div>
    </div>
  </div>

  <div class="pioneer-card">
    <div class="profile-section">
      <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/John_McCarthy_Stanford.jpg/960px-John_McCarthy_Stanford.jpg" alt="John McCarthy" class="profile-image">
      <div class="image-caption"><a href="https://commons.wikimedia.org/wiki/File:John_McCarthy_Stanford.jpg" target="_blank">Photo: Wikimedia Commons</a></div>
      <div class="profile-name">John McCarthy</div>
      <div class="profile-years">1927 - 2011</div>
    </div>
    <div class="chatgpt-analysis">
      <button class="analysis-button" data-analysis-key="mccarthy">Click here to cycle through AI responses</button>
      <div class="analysis-content">Click to see AI perspectives...</div>
    </div>
    <div class="perspective-section">
      <div class="section-title">My Perspective</div>
      <div class="perspective-content">John McCarthy was a visionary in artificial intelligence. He created the LISP programming language, which later went on to contribute to other contemporary languages like JavaScript and Python. He believed that computers and AI would one day be able to reason as humans do.</div>
    </div>
  </div>

  <div class="pioneer-card">
    <div class="profile-section">
      <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Timnit_Gebru_crop.jpg/1280px-Timnit_Gebru_crop.jpg" alt="Timnit Gebru" class="profile-image">
      <div class="image-caption"><a href="https://commons.wikimedia.org/wiki/File:Timnit_Gebru_crop.jpg" target="_blank">Photo: Wikimedia Commons</a></div>
      <div class="profile-name">Timnit Gebru</div>
      <div class="profile-years">1983 – Present</div>
    </div>
    <div class="chatgpt-analysis">
      <button class="analysis-button" data-analysis-key="gebru">Click here to cycle through AI responses</button>
      <div class="analysis-content">Click to see AI perspectives...</div>
    </div>
    <div class="perspective-section">
      <div class="section-title">My Perspective</div>
      <div class="perspective-content">Gebru is a computer scientist known for contributions towards ethical AI through exposing systemic bias and social harms. Gebru believes intelligence cannot be identified in current AI and that machine learning lacks true understanding and impartiality.</div>
    </div>
  </div>
</div>

<div class="fake-h2">Thinking about language</div>
<p>Machine languages fundamentally differ from human languages in that they rely on strict predefined structures, do not evolve organically, and are not influenced by cultural considerations. They are systems of symbols and rules designed to enable humans to control a machine's actions and output. In contrast, human languages take many forms and convey subtle nuances including body language, spoken language, and tonal or emotional inflections, all of which can vary widely in interpretation. While both machine and human languages serve the purpose of communication, machine languages are deterministic and task-oriented, while human languages are expressive, flexible, and shaped by social and cultural contexts (Harris, 2018).</p>

<div class="fake-h2">Thinking about intelligence</div>
<p>Unlike human intelligence, machine intelligence seems to be directly proportional to the confines of its programming and data. The output of machine intelligence depends entirely on pre-existing inputs, leaving little room for creativity and abstract reasoning. Comparatively speaking, machines cannot transfer knowledge or develop new and original ideas, thereby making AI inherently limited in depth and adaptability in foreign contexts (Crawford, 2021).</p>

<div class="fake-h2">Machine Learning vs Human Learning</div>
<p>Human learning is multidimensional and shaped by sensory input, experiences, and social contexts that collectively influence how our knowledge and understanding of the world develop. In contrast, machine learning occurs in two main ways: by encoding prior knowledge directly into the system or by training it on large datasets to improve task-specific objectives (Chollet, 2019).</p>

<div class="fake-h2">How are my responses different than AI?</div>
<p>In working through the questions above, my approach differed from that of a machine as I was able to explore multiple sources and make my own judgments rather than rely on narrowly focused or surface-level materials and understandings. While AI depends on structured data and human-codified search parameters, it does not reflect on its own biases or adapt its approach when responding to questions. This refinement of self-awareness through writing is inherently a human based process which is something I believe generative AI will never be able to fully replicate.</p>

![a beautiful rainbow](../../assets/images/blog/rainbow.jpg)

<div style="margin-top: 4rem; border-top: 1px solid #ccc; padding-top: 2rem;">

<span style="display: block; margin-bottom: 1.5rem; color: var(--theme-accent) !important; font-size: 1.2rem; font-weight: bold;">References</span>

<p style="color: var(--theme-text) !important; margin-bottom: 1rem;"><b>BBC. (2016a, January 26).</b> Ai pioneer Marvin Minsky dies aged 88. <i>BBC News</i>. https://www.bbc.com/news/technology-35409119</p>

<p style="color: var(--theme-text) !important; margin-bottom: 1rem;"><b>Chollet, F. (2019, November 25).</b> On the measure of Intelligence. <i>arXiv.org</i>. https://arxiv.org/abs/1911.01547</p>

<p style="color: var(--theme-text) !important; margin-bottom: 1rem;"><b>Crawford, K. (2021).</b> <i>Atlas of AI: Power, politics, and the planetary costs of artificial intelligence</i>. Yale University Press.</p>

<p style="color: var(--theme-text) !important;"><b>Turing, A. M. (1950).</b> Computing, machinery and intelligence. <i>Mind</i>, 49(236), 433-460.</p>

</div>

</div>

<script is:inline>
  const responses = {
    'turing': [
      "Turing saw intelligence as machines passing the Turing Test—imitating human conversation indistinguishably.",
      "He believed machines exhibit intelligence if their responses are indistinguishable from a human's.",
    ],
    'mccarthy': [
      "McCarthy viewed intelligence as symbolic reasoning, formalizing AI's goals through logic.",
      "He advancing AI by defining intelligence as logic-driven symbol manipulation.",
    ],
    'gebru': [
      "Gebru identifies intelligence in AI ethically, emphasizing bias mitigation and social justice.",
      "She redefines intelligence to include social responsibility and transparency.",
    ]
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
