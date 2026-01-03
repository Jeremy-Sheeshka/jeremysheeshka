---
title: "Draw a Snowman and Share your Art"
description: "Round two of testing out Firebase in my classroom through drawing snowmen!"
publishDate: 2025-12-12
tags: ["ClassroomArt"]
showToc: false
---

<style>
  /* 1. Force the App to the front */
  header, nav, .site-header, .main-nav, footer, .site-footer {
    display: none !important;
  }

  body, main {
    margin: 0 !important;
    padding: 0 !important;
  }

  #draw-a-snowman-app {
    margin-top: 2rem;
    padding: 0 1rem;
    font-family: system-ui, sans-serif;
  }

  /* 2. THE STACKING FIX */
  #snowman-canvas-wrapper {
    position: relative;
    width: 100%;
    max-width: 800px;
    margin: 1rem auto;
    touch-action: none; /* Prevents page scroll while drawing */
  }

  #snowmanBase {
    display: block;
    width: 100%;
    height: auto;
    pointer-events: none; /* IMPORTANT: Clicks pass THROUGH this image to the canvas */
    z-index: 1;
    border-radius: 0.75rem;
  }

  #drawingCanvas {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 10; /* Canvas MUST be the top layer */
    cursor: crosshair;
  }

  #snowman-toolbar {
    background: #ffffff;
    border: 1px solid #e5e7eb;
    border-radius: 0.75rem;
    padding: 1rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    flex-wrap: wrap;
    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
  }

  .color-option { width: 2rem; height: 2rem; border-radius: 50%; cursor: pointer; border: 2px solid transparent; }
  .color-option.selected { border-color: #4f46e5; border-width: 3px; }
  .control-btn { padding: 0.5rem 1rem; border-radius: 9999px; font-weight: 600; cursor: pointer; border: none; }
  .btn-primary { background: #16a34a; color: white; }

  #snowmanGallery {
    display: grid;
    gap: 1rem;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    margin-top: 2rem;
  }
  .snowman-card img { width: 100%; border-radius: 8px; border: 1px solid #eee; }
</style>

<script src="https://cdn.tailwindcss.com"></script>

<div id="draw-a-snowman-app">

<div id="snowman-toolbar">
  <div id="colorPicker" class="flex gap-2">
    <div class="color-option bg-black selected" data-color="#000000"></div>
    <div class="color-option bg-red-500" data-color="#ef4444"></div>
    <div class="color-option bg-blue-500" data-color="#3b82f6"></div>
    <div class="color-option bg-green-500" data-color="#10b981"></div>
    <div class="color-option bg-yellow-400" data-color="#facc15"></div>
  </div>
  <div class="flex items-center gap-2">
    <input type="range" id="brushSize" min="1" max="25" value="4" class="w-32" />
  </div>
  <div class="flex gap-2">
    <button id="undoButton" class="control-btn bg-gray-200">Undo</button>
    <button id="clearAllButton" class="control-btn bg-red-100 text-red-600">Clear</button>
    <button id="submitSnowmanBtn" class="control-btn btn-primary">Submit</button>
  </div>
</div>

<div id="snowman-canvas-wrapper">
  <img id="snowmanBase" src="/assets/images/blog/drawasnowman.png" alt="Snowman template" />
  <canvas id="drawingCanvas"></canvas>
</div>

<div id="snowmanGallery"></div>

</div>

<script type="module" is:inline>
  import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
  import { getFirestore, collection, addDoc, onSnapshot, query, orderBy } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
  import { getAuth, signInAnonymously } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

  const firebaseConfig = {
    apiKey: "AIzaSyAzhuH6tn0N1CvuJCgVqptxbkERtbN0uNc",
    authDomain: "drawasnowman.firebaseapp.com",
    projectId: "drawasnowman",
    storageBucket: "drawasnowman.appspot.com",
    messagingSenderId: "83117525526",
    appId: "1:83117525526:web:5e29e7fd727562b4850337"
  };

  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  const auth = getAuth(app);
  await signInAnonymously(auth);

  const canvas = document.getElementById("drawingCanvas");
  const snowmanBase = document.getElementById("snowmanBase");
  const ctx = canvas.getContext("2d");

  let drawing = false;
  let allStrokes = [];
  let currentColor = "#000000";
  let currentSize = 4;

  // ENSURE CANVAS MATCHES IMAGE RESOLUTION
  function resize() {
    canvas.width = snowmanBase.offsetWidth;
    canvas.height = snowmanBase.offsetHeight;
    redraw();
  }
  snowmanBase.onload = resize;
  window.onresize = resize;
  setTimeout(resize, 500); // Astro-specific safety delay

  function getPos(e) {
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    
    // Scale position based on actual canvas pixels vs CSS pixels
    return {
      x: (clientX - rect.left) * (canvas.width / rect.width),
      y: (clientY - rect.top) * (canvas.height / rect.height)
    };
  }

  function redraw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    allStrokes.forEach(s => {
      ctx.beginPath();
      ctx.strokeStyle = s.color;
      ctx.lineWidth = s.size;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.moveTo(s.pts[0].x, s.pts[0].y);
      s.pts.forEach(p => ctx.lineTo(p.x, p.y));
      ctx.stroke();
    });
  }

  canvas.onmousedown = canvas.ontouchstart = (e) => {
    drawing = true;
    allStrokes.push({ pts: [getPos(e)], color: currentColor, size: currentSize });
  };

  canvas.onmousemove = canvas.ontouchmove = (e) => {
    if (!drawing) return;
    if (e.touches) e.preventDefault(); // Stop mobile scrolling
    allStrokes[allStrokes.length - 1].pts.push(getPos(e));
    redraw();
  };

  window.onmouseup = window.ontouchend = () => { drawing = false; };

  document.getElementById("submitSnowmanBtn").onclick = async () => {
    const merged = document.createElement("canvas");
    merged.width = canvas.width; merged.height = canvas.height;
    const mctx = merged.getContext("2d");
    mctx.drawImage(snowmanBase, 0, 0, canvas.width, canvas.height);
    mctx.drawImage(canvas, 0, 0);
    await addDoc(collection(db, "snowmanGallery"), { img: merged.toDataURL(), ts: Date.now() });
    alert("Shared!");
    allStrokes = []; redraw();
  };

  onSnapshot(query(collection(db, "snowmanGallery"), orderBy("ts", "desc")), (snap) => {
    const gal = document.getElementById("snowmanGallery");
    gal.innerHTML = "";
    snap.forEach(d => {
      const card = document.createElement("div");
      card.className = "snowman-card";
      card.innerHTML = `<img src="${d.data().img}">`;
      gal.appendChild(card);
    });
  });

  document.querySelectorAll('.color-option').forEach(opt => {
    opt.onclick = () => {
      currentColor = opt.dataset.color;
      document.querySelectorAll('.color-option').forEach(el => el.classList.remove('selected'));
      opt.classList.add('selected');
    };
  });

  document.getElementById("brushSize").oninput = (e) => currentSize = e.target.value;
  document.getElementById("undoButton").onclick = () => { allStrokes.pop(); redraw(); };
  document.getElementById("clearAllButton").onclick = () => { allStrokes = []; redraw(); };
</script>
