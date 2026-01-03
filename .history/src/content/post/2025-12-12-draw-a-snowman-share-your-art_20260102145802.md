---
title: "Draw a Snowman and Share your Art"
description: "Round two of testing out Firebase in my classroom through drawing snowmen!"
publishDate: 2025-12-12
tags: ["Conrad2025"]
showToc: false
---

<style>
/* 1. Kill the site UI to prevent interference */
header, nav, .site-header, .main-nav, footer, .site-footer, .header-anchor {
  display: none !important;
  visibility: hidden !important;
}

body, main {
  margin: 0 !important;
  padding: 0 !important;
}

/* 2. App Layout */
#draw-a-snowman-app {
  padding: 1rem;
  max-width: 900px;
  margin: 0 auto;
}

#snowman-toolbar {
  background: white;
  border: 1px solid #ddd;
  padding: 1rem;
  border-radius: 12px;
  display: flex;
  gap: 1rem;
  align-items: center;
  flex-wrap: wrap;
  z-index: 100;
  position: relative; /* Ensures buttons are clickable */
}

/* 3. THE CANVAS FIXES */
#snowman-canvas-wrapper {
  position: relative;
  margin-top: 1rem;
  width: 100%;
  display: flex;
  justify-content: center;
}

#snowmanBase {
  display: block;
  width: 100%;
  height: auto;
  pointer-events: none; /* Allows clicks to pass through to the canvas */
  z-index: 1;
  border-radius: 12px;
}

#drawingCanvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 10; /* Canvas MUST be on top */
  cursor: crosshair;
  touch-action: none; /* Critical for mobile/tablet drawing */
}

.color-option {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  cursor: pointer;
  border: 3px solid transparent;
}
.color-option.selected { border-color: #4f46e5; }

.control-btn {
  padding: 0.5rem 1rem;
  border-radius: 20px;
  border: none;
  cursor: pointer;
  font-weight: bold;
}
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
  <input type="range" id="brushSize" min="1" max="20" value="3" />
  <button id="undoButton" class="control-btn bg-gray-200">Undo</button>
  <button id="clearAllButton" class="control-btn bg-red-100 text-red-600">Clear</button>
  <button id="submitSnowmanBtn" class="control-btn bg-green-600 text-white">Submit</button>
</div>

<div id="snowman-canvas-wrapper">
  <div class="relative w-full">
    <img id="snowmanBase" src="/assets/images/blog/drawasnowman.png" alt="Snowman template" />
    <canvas id="drawingCanvas"></canvas>
  </div>
</div>

<div id="snowmanGallery" class="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8"></div>

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
let currentSize = 3;

// 1. DYNAMIC RESIZE FIX
function initCanvas() {
  canvas.width = snowmanBase.clientWidth;
  canvas.height = snowmanBase.clientHeight;
  redraw();
}

snowmanBase.addEventListener('load', initCanvas);
window.addEventListener('resize', initCanvas);
initCanvas(); // Run once in case already loaded

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

// 2. POSITION FIX
function getPos(e) {
  const rect = canvas.getBoundingClientRect();
  const clientX = e.touches ? e.touches[0].clientX : e.clientX;
  const clientY = e.touches ? e.touches[0].clientY : e.clientY;
  return {
    x: (clientX - rect.left) * (canvas.width / rect.width),
    y: (clientY - rect.top) * (canvas.height / rect.height)
  };
}

// 3. EVENT LISTENERS
canvas.onmousedown = canvas.ontouchstart = (e) => {
  drawing = true;
  allStrokes.push({ color: currentColor, size: currentSize, pts: [getPos(e)] });
};

canvas.onmousemove = canvas.ontouchmove = (e) => {
  if (!drawing) return;
  e.preventDefault();
  allStrokes[allStrokes.length - 1].pts.push(getPos(e));
  redraw();
};

window.onmouseup = window.ontouchend = () => { drawing = false; };

// 4. TOOLBAR LOGIC
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

// 5. FIREBASE SUBMIT
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
  const gal = document.getElementById("snowmanGallery");
  gal.innerHTML = "";
  snap.forEach(d => {
    const img = document.createElement("img");
    img.src = d.data().img;
    img.className = "rounded shadow border";
    gal.appendChild(img);
  });
});
</script>
