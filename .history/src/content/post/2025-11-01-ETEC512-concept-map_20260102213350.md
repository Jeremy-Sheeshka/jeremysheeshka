---
title: "ETEC 512 - Concept Map"
description: "An exploration of the overarching concepts and themes found in ETEC512 using D3.JS"
publishDate: 2025-11-01
tags: ["ETEC 512"]
showToc: false
---

<style>
/* 1. TOC & ANCHOR CLEANUP (No header removal) */
span[aria-hidden="true"], a.anchor-link, .lg\:sticky, aside, .toc-container, .header-anchor {
  display: none !important;
  visibility: hidden !important;
}

/* 2. MAP & CARD STYLING */
.map-container { width: 100%; max-width: 1400px; margin: 2rem 0; }
.map-card { background: var(--theme-bg-card, #ffffff); border-radius: 12px; box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3); overflow: hidden; border: 1px solid #444; }
.map-header { padding: 1.5rem; border-bottom: 1px solid #e5e7eb; }

.fake-h2 { font-size: 1.5rem; font-weight: 600; color: var(--theme-accent) !important; margin-bottom: 0.5rem; display: block; }

/* 3. LEGEND STYLING */
.legend { padding: 1rem; border-top: 1px solid #e5e7eb; display: flex; flex-wrap: wrap; gap: 1rem; justify-content: center; background: rgba(0,0,0,0.05); }
.legend-item { display: flex; align-items: center; gap: 0.5rem; font-size: 0.85rem; color: var(--theme-text) !important; }
.legend-color { width: 14px; height: 14px; border-radius: 50%; border: 1px solid #ddd; flex-shrink: 0; }
.legend-label { color: var(--theme-text) !important; font-weight: 600; }

#concept-map { width: 100%; height: 800px; cursor: grab; background: #ffffff; }

.node text { 
    font-size: 14px; font-weight: 700; pointer-events: none; text-anchor: middle; fill: #000000 !important;
    paint-order: stroke fill; stroke: #ffffff; stroke-width: 4px; stroke-linecap: round; stroke-linejoin: round;
}

.link { stroke: #94a3b8; stroke-opacity: 0.4; stroke-width: 1.5px; }
.link.link-main { stroke-width: 4px; stroke: #4b5563; stroke-opacity: 0.8; }

/* 4. DROPDOWN THEME FIX (Dark Mode Support) */
.dropdown-menu { width: 100%; margin-top: 2rem; }
.dropdown-item { margin-bottom: 1rem; border: 1px solid #444; border-radius: 8px; overflow: hidden; }
.dropdown-question { background-color: #4f6b86; color: white !important; padding: 1rem; cursor: pointer; font-weight: bold; }

/* Background and Text Logic for Reflection Box */
.dropdown-answer { 
    max-height: 0; 
    overflow: hidden; 
    transition: all 0.3s ease-out; 
    padding: 0 1rem; 
    background-color: #ffffff !important; /* Default light background */
}

.dropdown-answer p, .dropdown-answer strong {
    color: #1f2937 !important; /* Default dark text */
}

/* Dark Mode Overrides */
@media (prefers-color-scheme: dark) {
  .dropdown-answer { background-color: #1a1a1a !important; }
  .dropdown-answer p, .dropdown-answer strong { color: #ffffff !important; }
}

[data-theme='dark'] .dropdown-answer { background-color: #1a1a1a !important; }
[data-theme='dark'] .dropdown-answer p, [data-theme='dark'] .dropdown-answer strong { color: #ffffff !important; }

.dropdown-item.active .dropdown-answer { max-height: 10000px; padding: 1rem; }
</style>

<div class="map-container">
<div class="map-card">
<div class="map-header">
<span class="fake-h2">My Personal Learning Theory</span>
<div class="legend">
<div class="legend-item"><div class="legend-color" style="background: #eab308;"></div><span class="legend-label">Behaviorism</span></div>
<div class="legend-item"><div class="legend-color" style="background: #22c55e;"></div><span class="legend-label">Cognitivism</span></div>
<div class="legend-item"><div class="legend-color" style="background: #3b82f6;"></div><span class="legend-label">Constructivism</span></div>
<div class="legend-item"><div class="legend-color" style="background: #f97316;"></div><span class="legend-label">Social Learning</span></div>
<div class="legend-item"><div class="legend-color" style="background: #ec4899;"></div><span class="legend-label">Neuroscience</span></div>
<div class="legend-item"><div class="legend-color" style="background: #64748b;"></div><span class="legend-label">Educational Tech</span></div>
<div class="legend-item"><div class="legend-color" style="background: #ef4444;"></div><span class="legend-label">Connectivism</span></div>
</div>
<p style="color: var(--theme-text); font-size: 0.85rem; margin-top: 0.5rem; text-align: center; opacity: 0.7;">• Scroll to zoom • Click and drag nodes to move</p>
</div>
<div class="card-content">
<svg id="concept-map"></svg>
</div>
</div>
</div>

<script is:inline src="https://d3js.org/d3.v7.min.js"></script>

<script is:inline>
/* ... (Graph logic remains identical to your original version) */
const graphData = {
    nodes: [
        { id: "personal-theory", label: "My Personal Learning Theory", group: "personal", size: 60 },
        { id: "behaviorism", label: "Behaviorism", group: "behaviorism", size: 30 },
        { id: "cognitivism", label: "Cognitivism", group: "cognitivism", size: 30 },
        { id: "constructivism-main", label: "Constructivism", group: "constructivism", size: 30 },
        { id: "social-learning-main", label: "Social Learning Theory", group: "social", size: 30 },
        { id: "neuroscience", label: "Neuroscience", group: "neuroscience", size: 30 },
        { id: "technological", label: "Educational Technology", group: "technological", size: 30 },
        { id: "connectivism", label: "Connectivism", group: "connectivism", size: 30 },
        { id: "pavlov", label: "Pavlov", group: "behaviorism", size: 12 },
        { id: "skinner", label: "Skinner", group: "behaviorism", size: 12 },
        { id: "classical-cond", label: "Classical Conditioning", group: "behaviorism", size: 9 },
        { id: "operant-cond", label: "Operant Conditioning", group: "behaviorism", size: 9 },
        { id: "reinforcement", label: "Reinforcement", group: "behaviorism", size: 9 },
        { id: "piaget-cog", label: "Piaget", group: "cognitivism", size: 12 },
        { id: "working-memory", label: "Working Memory", group: "cognitivism", size: 9 },
        { id: "long-term-memory", label: "Long-Term Memory", group: "cognitivism", size: 9 },
        { id: "schema", label: "Schema", group: "cognitivism", size: 10 },
        { id: "vygotsky", label: "Vygotsky", group: "constructivism", size: 12 },
        { id: "zpd", label: "ZPD", group: "constructivism", size: 10 },
        { id: "collaboration", label: "Collaboration", group: "constructivism", size: 9 },
        { id: "modeling", label: "Modeling", group: "social", size: 9 },
        { id: "situated-cognition", label: "Situated Cognition", group: "social", size: 12 },
        { id: "community-of-practice", label: "Community of Practice", group: "social", size: 12 },
        { id: "neuroplasticity", label: "Neuroplasticity", group: "neuroscience", size: 10 },
        { id: "dopamine", label: "Dopamine", group: "neuroscience", size: 8 },
        { id: "ai-in-education", label: "AI in Education", group: "technological", size: 12 },
        { id: "immersive-learning", label: "AR/VR/MR", group: "technological", size: 10 },
        { id: "distributed-knowledge", label: "Distributed Knowledge", group: "connectivism", size: 9 }
    ],
    links: [
        { source: "personal-theory", target: "behaviorism", class: "link-main" },
        { source: "personal-theory", target: "cognitivism", class: "link-main" },
        { source: "personal-theory", target: "constructivism-main", class: "link-main" },
        { source: "personal-theory", target: "social-learning-main", class: "link-main" },
        { source: "personal-theory", target: "neuroscience", class: "link-main" },
        { source: "personal-theory", target: "technological", class: "link-main" },
        { source: "personal-theory", target: "connectivism", class: "link-main" },
        { source: "behaviorism", target: "pavlov" },
        { source: "behaviorism", target: "skinner" },
        { source: "pavlov", target: "classical-cond" },
        { source: "skinner", target: "operant-cond" },
        { source: "operant-cond", target: "reinforcement" },
        { source: "cognitivism", target: "piaget-cog" },
        { source: "cognitivism", target: "schema" },
        { source: "piaget-cog", target: "working-memory" },
        { source: "working-memory", target: "long-term-memory" },
        { source: "constructivism-main", target: "vygotsky" },
        { source: "vygotsky", target: "zpd" },
        { source: "constructivism-main", target: "collaboration" },
        { source: "social-learning-main", target: "modeling" },
        { source: "social-learning-main", target: "situated-cognition" },
        { source: "situated-cognition", target: "community-of-practice" },
        { source: "neuroscience", target: "neuroplasticity" },
        { source: "neuroplasticity", target: "dopamine" },
        { source: "technological", target: "ai-in-education" },
        { source: "technological", target: "immersive-learning" },
        { source: "connectivism", target: "distributed-knowledge" },
        { source: "reinforcement", target: "dopamine" },
        { source: "schema", target: "neuroplasticity" },
        { source: "zpd", target: "working-memory" },
        { source: "modeling", target: "pavlov" },
        { source: "community-of-practice", target: "distributed-knowledge" },
        { source: "ai-in-education", target: "distributed-knowledge" }
    ]
};

const colorMap = { "personal": "#a855f7", "behaviorism": "#eab308", "cognitivism": "#22c55e", "constructivism": "#3b82f6", "social": "#f97316", "neuroscience": "#ec4899", "technological": "#64748b", "connectivism": "#ef4444" };

const svg = d3.select("#concept-map");
const width = svg.node().parentElement.clientWidth;
const height = 800;
svg.attr("width", width).attr("height", height);
const g = svg.append("g");

const simulation = d3.forceSimulation(graphData.nodes)
    .force("link", d3.forceLink(graphData.links).id(d => d.id).distance(90))
    .force("charge", d3.forceManyBody().strength(-550))
    .force("center", d3.forceCenter(width / 2, height / 2))
    .force("collision", d3.forceCollide().radius(d => d.size + 20));

const link = g.append("g").selectAll("line").data(graphData.links).join("line").attr("class", d => d.class ? `link ${d.class}` : "link");

const node = g.append("g").selectAll("g").data(graphData.nodes).join("g").attr("class", "node")
    .call(d3.drag().on("start", dragstarted).on("drag", dragged).on("end", dragended));

node.append("circle").attr("r", d => d.size).attr("fill", d => colorMap[d.group]);
node.append("text").text(d => d.label).attr("dy", "0.35em")
    .style("font-size", d => d.size > 25 ? "18px" : "12px");

simulation.on("tick", () => {
    link.attr("x1", d => d.source.x).attr("y1", d => d.source.y).attr("x2", d => d.target.x).attr("y2", d => d.target.y);
    node.attr("transform", d => `translate(${d.x},${d.y})`);
});

svg.call(d3.zoom().on("zoom", (e) => g.attr("transform", e.transform)));

function dragstarted(event, d) { if (!event.active) simulation.alphaTarget(0.3).restart(); d.fx = d.x; d.fy = d.y; }
function dragged(event, d) { d.fx = event.x; d.fy = event.y; }
function dragended(event, d) { if (!event.active) simulation.alphaTarget(0); d.fx = null; d.fy = null; }
</script>

<div class="dropdown-menu">
<div class="dropdown-item">
<div class="dropdown-question">Reflection</div>
<div class="dropdown-answer">
<p><strong>Tool Selection and Rationale</strong><br><br>
For my concept map, I chose to use the D3.js library to create an interactive, force-directed graph. I wanted to move beyond static mind-maps to show the constantly shifting relationship between theories. D3.js's ability to create a layout visually depicting how different educational concepts pull on, connect to, and repel each other through its use of physics has made for an interesting use of this technology as it relates to this assignment.</p>

<p><strong>Reflection and Learning</strong><br><br>
While it's not perfect by any means, I am happy with my choice to try out something new and create something indicative of the complex and ever-shifting perspective I hold towards how learning takes place. Creating this mind-map reinforces the idea that the learning process is messy, dynamic, and relational, all of which is illustrated through my force-directed graph.</p>
</div>
</div>
</div>

<script is:inline>
document.querySelectorAll('.dropdown-question').forEach((question) => {
  question.addEventListener('click', () => {
    question.parentElement.classList.toggle('active');
  });
});
</script>

<img src="/assets/images/blog/cognitivemapdraft1.jpg" alt="Concept Map first" />
