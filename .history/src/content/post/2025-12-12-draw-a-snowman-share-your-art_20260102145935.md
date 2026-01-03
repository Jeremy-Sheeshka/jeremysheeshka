---
title: "Draw a Snowman and Share your Art"
description: "Round two of testing out Firebase in my classroom through drawing snowmen!"
publishDate: 2025-12-12
tags: ["Conrad2025"]
showToc: false
---

<style>
/* 1. Complete UI Suppression */
header, nav, footer, aside, .site-header, .site-footer, .header-anchor {
  display: none !important;
}

body, main {
  margin: 0 !important;
  padding: 0 !important;
}

/* 2. Application Layout */
#draw-a-snowman-app {
  max-width: 800px;
  margin: 2rem auto;
  padding: 0 1rem;
  font-family: sans-serif;
}

#snowman-toolbar {
  background: #fff;
  border: 1px solid #ddd;
  padding: 1rem;
  border-radius: 12px;
  display: flex;
  gap: 1rem;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  position: relative;
  z-index: 100; /* Ensure buttons stay clickable */
}

/* 3. THE STACKING FIX - CRITICAL */
#snowman-canvas-wrapper {
  position: relative;
  width: 100%;
  display: flex; /* Removes line-height spacing issues */
  overflow: hidden;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
}

#snowmanBase {
  width: 100%;
  height: auto;
  display: block;
  z-index: 1; 
  pointer-events: none; /* Mouse/Touch passes through this image */
  -webkit-user-drag: none;
}

#drawingCanvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 10; /* Canvas is the top-most interactive layer */
  cursor: crosshair;
  touch-action: none; /* Prevents the page from moving while drawing */
}

.color-option { width: 32px; height: 32px; border-radius: 50%; cursor: pointer; border: 3px solid transparent; }
.color-option.selected { border-color: #4f46e5; }
.btn { padding: 0.5rem 1rem; border-radius: 8px; border: none; font-weight: bold; cursor: pointer; transition: 0.2s; }
.btn-primary { background: #16a34a; color: white; }
</style>

<script src="https://cdn.tailwindcss.com"></script>

<div id="draw-a-snowman-app">

<div id="snowman-toolbar">
  <div id="colorPicker" class="flex gap-2">
    <div class="color-option bg-black selected" data-color="#000000"></div>
    <div class="color-option bg-red-600" data-color="#dc2626"></div>
    <div class="color-option bg-blue-600" data-color="#2563eb"></div>
    <div class="color-option bg-green-600" data-color="#16a34a"></div>
    <div class="color-option bg-yellow-500" data-color="#eab308"></div>
  </div>
  <input type="range" id="brushSize" min="1" max="25" value="4" class="w-32" />
  <div class="flex gap-2">
    <button id="undoButton" class="btn bg-gray-200">Undo</button>
    <button id="clearAllButton" class="btn bg-red-100 text-red-700">Clear</button>
    <button id="submitSnowmanBtn" class="btn btn-primary">Submit</button>
  </div>
</div>

<div id="snowman-canvas-wrapper">
  <img id="snowmanBase" src="/assets/images/blog/drawasnowman.png" alt="Snowman template" />
  <canvas id="drawingCanvas"></canvas>
</div>

<div id="snowmanGallery" class="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12"></div>

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

// THE REDRAW ENGINE
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

// THE RESIZE HANDLER
function resize() {
  canvas.width = snowmanBase.offsetWidth;
  canvas.height = snowmanBase.offsetHeight;
  redraw();
}

// Trigger resize on load and window change
snowmanBase.onload = resize;
window.addEventListener('resize', resize);
// Safety timeout for Astro's static build
setTimeout(resize, 100);
setTimeout(resize, 1000); 

function getPos(e) {
  const rect = canvas.getBoundingClientRect();
  const clientX = e.touches ? e.touches[0].clientX : e.clientX;
  const clientY = e.touches ? e.touches[0].clientY : e.clientY;
  // Account for scaling if the canvas display size differs from coordinate size
  return {
    x: (clientX - rect.left) * (canvas.width / rect.width),
    y: (clientY - rect.top) * (canvas.height / rect.height)
  };
}

// DRAWING EVENTS
canvas.onmousedown = canvas.ontouchstart = (e) => {
  drawing = true;
  allStrokes.push({ color: currentColor, size: currentSize, pts: [getPos(e)] });
  if(e.touches) e.preventDefault();
};

canvas.onmousemove = canvas.ontouchmove = (e) => {
  if (!drawing) return;
  if(e.touches) e.preventDefault();
  allStrokes[allStrokes.length - 1].pts.push(getPos(e));
  redraw();
};

window.onmouseup = window.ontouchend = () => { drawing = false; };

// INTERFACE LOGIC
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

// FIREBASE INTEGRATION
const galleryCol = collection(db, "snowmanGallery");
document.getElementById("submitSnowmanBtn").onclick = async () => {
  const merged = document.createElement("canvas");
  merged.width = canvas.width; merged.height = canvas.height;
  const mctx = merged.getContext("2d");
  mctx.drawImage(snowmanBase, 0, 0, canvas.width, canvas.height);
  mctx.drawImage(canvas, 0, 0);
  
  try {
    await addDoc(galleryCol, { img: merged.toDataURL(), ts: Date.now() });
    alert("Snowman successfully shared!");
    allStrokes = []; redraw();
  } catch (err) {
    console.error(err);
    alert("Submission error. Check your connection.");
  }
};

onSnapshot(query(galleryCol, orderBy("ts", "desc")), (snap) => {
  const gal = document.getElementById("snowmanGallery");
  gal.innerHTML = "";
  snap.forEach(d => {
    const img = document.createElement("img");
    img.src = d.data().img;
    img.className = "rounded-lg shadow border bg-white";
    gal.appendChild(img);
  });
});
</script>
