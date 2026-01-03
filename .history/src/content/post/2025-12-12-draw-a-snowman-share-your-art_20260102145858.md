---
title: "Draw a Snowman and Share your Art"
description: "Round two of testing out Firebase in my classroom through drawing snowmen!"
publishDate: 2025-12-12
tags: ["Conrad2025"]
showToc: false
---

<style>
/* 1. Hide Site UI */
header, nav, .site-header, .main-nav, footer, .site-footer, .header-anchor {
  display: none !important;
}

body, main {
  margin: 0 !important;
  padding: 0 !important;
}

/* 2. Container Logic */
#draw-a-snowman-app {
  padding: 1rem;
  max-width: 800px;
  margin: 0 auto;
}

#snowman-toolbar {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  padding: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  flex-wrap: wrap;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  margin-bottom: 1rem;
  position: relative;
  z-index: 100;
}

/* 3. THE CANVAS LAYER FIX */
#snowman-canvas-wrapper {
  position: relative; /* Anchor for absolute children */
  width: 100%;
  line-height: 0; /* Removes ghost spacing at bottom of image */
}

#snowmanBase {
  display: block;
  width: 100%;
  height: auto;
  border-radius: 0.75rem;
  pointer-events: none; /* IMPORTANT: Clicks pass THROUGH to canvas */
  z-index: 1;
}

#drawingCanvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  cursor: crosshair;
  z-index: 50; /* MUST be higher than image */
  touch-action: none; /* Prevents scrolling while drawing */
}

.color-option {
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  cursor: pointer;
  border: 3px solid transparent;
}
.color-option.selected { border-color: #4f46e5; }

.control-btn {
  padding: 0.45rem 1rem;
  font-weight: 600;
  border-radius: 9999px;
  border: none;
  cursor: pointer;
  background: #e5e7eb;
}
.btn-primary { background: #16a34a; color: white; }
</style>

<script src="https://cdn.tailwindcss.com"></script>

<div id="draw-a-snowman-app">

<div id="snowman-toolbar">
  <div id="colorPicker" class="flex items-center gap-2">
    <div class="color-option bg-black selected" data-color="#000000"></div>
    <div class="color-option bg-red-500" data-color="#ef4444"></div>
    <div class="color-option bg-blue-500" data-color="#3b82f6"></div>
    <div class="color-option bg-green-500" data-color="#10b981"></div>
    <div class="color-option bg-yellow-400" data-color="#facc15"></div>
  </div>
  <div class="flex items-center gap-2">
    <input type="range" id="brushSize" min="1" max="20" value="3" class="w-24" />
  </div>
  <div class="flex gap-2">
    <button id="undoButton" class="control-btn">Undo</button>
    <button id="clearAllButton" class="control-btn bg-red-100 text-red-700">Clear</button>
    <button id="submitSnowmanBtn" class="control-btn btn-primary">Submit</button>
  </div>
</div>

<div id="snowman-canvas-wrapper">
  <img id="snowmanBase" src="/assets/images/blog/drawasnowman.png" alt="Snowman template" />
  <canvas id="drawingCanvas"></canvas>
</div>

<div id="snowmanGallery" class="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8"></div>

</div>

<script type="module" is:inline>
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getFirestore, collection, addDoc, onSnapshot, query, orderBy } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
import { getAuth, signInAnonymously } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

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
let currentSize = 3;

function syncCanvasSize() {
  canvas.width = snowmanBase.offsetWidth;
  canvas.height = snowmanBase.offsetHeight;
  redraw();
}

// Handle image loading and window resizing
snowmanBase.onload = syncCanvasSize;
window.addEventListener('resize', syncCanvasSize);
// Initial sync
setTimeout(syncCanvasSize, 500);

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

function getPos(e) {
  const rect = canvas.getBoundingClientRect();
  const x = e.touches ? e.touches[0].clientX : e.clientX;
  const y = e.touches ? e.touches[0].clientY : e.clientY;
  return {
    x: (x - rect.left) * (canvas.width / rect.width),
    y: (y - rect.top) * (canvas.height / rect.height)
  };
}

canvas.onmousedown = canvas.ontouchstart = (e) => {
  drawing = true;
  allStrokes.push({ color: currentColor, size: currentSize, pts: [getPos(e)] });
};

canvas.onmousemove = canvas.ontouchmove = (e) => {
  if (!drawing) return;
  if(e.touches) e.preventDefault();
  allStrokes[allStrokes.length - 1].pts.push(getPos(e));
  redraw();
};

window.onmouseup = window.ontouchend = () => { drawing = false; };

document.querySelectorAll('.color-option').forEach(opt => {
  opt.onclick = () => {
    currentColor = opt.dataset.color;
    document.querySelectorAll('.color-option').forEach(el => el.classList.remove('selected'));
    opt.classList.add('selected');
  };
});

document.getElementById("brushSize").oninput = (e) => { currentSize = e.target.value; };
document.getElementById("undoButton").onclick = () => { allStrokes.pop(); redraw(); };
document.getElementById("clearAllButton").onclick = () => { allStrokes = []; redraw(); };

const galleryCol = collection(db, "snowmanGallery");
document.getElementById("submitSnowmanBtn").onclick = async () => {
  const merged = document.createElement("canvas");
  merged.width = canvas.width; merged.height = canvas.height;
  const mctx = merged.getContext("2d");
  mctx.drawImage(snowmanBase, 0, 0, canvas.width, canvas.height);
  mctx.drawImage(canvas, 0, 0);
  await addDoc(galleryCol, { img: merged.toDataURL(), ts: Date.now() });
  alert("Snowman submitted!");
  allStrokes = []; redraw();
};

onSnapshot(query(galleryCol, orderBy("ts", "desc")), (snap) => {
  const gallery = document.getElementById("snowmanGallery");
  gallery.innerHTML = "";
  snap.forEach(d => {
    const card = document.createElement("div");
    card.innerHTML = `<img src="${d.data().img}" class="rounded shadow">`;
    gallery.appendChild(card);
  });
});
</script>
