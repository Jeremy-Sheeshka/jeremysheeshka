---
title: 'The Squiggle Challenge'
description: "Testing out Firebase in my Grade 2 classroom through the squiggle challenge"
category: blogpost
key: 'Kids Art'
tags: kids art
date: 2025-12-02
---

<!-- get rid of header and footer -->
<style>
  header, nav, .site-header, .main-nav {
    display: none !important;
  }

  footer, .site-footer {
    display: none !important;
  }

  body {
    margin: 0 !important;
    padding: 0 !important;
  }
  main {
    padding: 0 !important;
  }
</style>
<!-- end - get rid of header and footer -->


## What can you make from a squiggle?

<div id="draw-a-squiggle-app">

<script src="https://cdn.tailwindcss.com"></script>

<style>
  html, body {
    overflow-x: hidden !important;
    max-width: 100%;
  }

  #draw-a-squiggle-app {
    margin-top: 2rem;
    margin-bottom: 3rem;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, "Inter", sans-serif;
  }

  #squiggle-toolbar {
    background: #ffffff;
    border: 1px solid #e5e7eb;
    border-radius: 0.75rem;
    padding: 0.75rem 1rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
    flex-wrap: wrap;
    box-shadow: 0 1px 3px rgba(0,0,0,0.06);
    width: 100%;
    max-width: 100%;
  }

  #squiggle-toolbar-left {
    font-weight: 700;
    font-size: 1rem;
    color: #111827;
    display: flex;
    align-items: center;
    white-space: nowrap;
  }

  /* ⭐ Prevent toolbar items from shifting around */
  #squiggle-toolbar-right {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    flex-wrap: nowrap;
    max-width: 100%;
  }

  /* Allow wrapping ONLY on mobile */
  @media (max-width: 640px) {
    #squiggle-toolbar-right {
      flex-wrap: wrap;
    }
  }

  .control-btn {
    padding: 0.45rem 1rem;
    font-weight: 600;
    font-size: 0.95rem;
    border-radius: 9999px;
    border: none;
    cursor: pointer;
    background: #e5e7eb;
    color: #374151;
    transition: all 0.15s ease;
    white-space: nowrap;
  }

  .control-btn.primary { background: #16a34a; color: white; }
  .control-btn.primary:hover { background: #15803d; }

  .control-btn.danger { background: #fee2e2; color: #b91c1c; }
  .control-btn.danger:hover { background: #fecaca; }

  .color-option {
    width: 2rem;
    height: 2rem;
    border-radius: 9999px;
    cursor: pointer;
    border: 2px solid transparent;
    flex-shrink: 0;
  }

  .color-option.selected {
    border-color: #4f46e5;
    border-width: 3px;
  }

  #squiggle-toolbar-right label {
    font-size: 0.95rem;
    white-space: nowrap;
  }

  /* ⭐ Larger slider that never shrinks or overlaps */
  #brushSize {
    min-width: 130px;
    height: 1rem;
  }

  #sizeValue {
    font-size: 0.95rem;
    font-weight: 600;
  }

  #squiggle-canvas-wrapper {
    margin-top: 1rem;
    margin-bottom: 1.5rem;
    display: flex;
    justify-content: center;
    width: 100%;
    overflow-x: hidden;
  }

  #squiggle-canvas-inner {
    position: relative;
    width: 100%;
  }

  #duckBase {
    display: block;
    width: 100%;
    height: auto;
    border-radius: 0.75rem;
    max-height: 800px;
    box-shadow: 0 4px 10px rgba(0,0,0,0.12);
  }

  #drawingCanvas {
    position: absolute;
    top: 0;
    left: 0;
    cursor: crosshair;
    border-radius: 0.75rem;
    background: transparent;
  }

  #duckGallery {
    display: grid;
    gap: 0.75rem;
    grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
    width: 100%;
  }

  .squiggle-card {
    background: white;
    border-radius: 0.5rem;
    overflow: hidden;
    box-shadow: 0 2px 6px rgba(0,0,0,0.08);
    position: relative;
  }

  .squiggle-card img { width: 100%; display: block; }

  .moderator-delete-btn {
    position: absolute;
    top: 6px;
    right: 6px;
    background: #dc2626;
    color: white;
    padding: 0.3rem 0.6rem;
    border-radius: 0.4rem;
    font-size: 0.75rem;
    font-weight: bold;
    cursor: pointer;
    opacity: 0.9;
  }
  .moderator-delete-btn:hover { opacity: 1; }

  .modal-backdrop {
    position: fixed;
    inset: 0;
    background-color: rgba(31,41,55,.5);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem;
    z-index: 50;
  }

  .modal-card {
    background: white;
    border-radius: 0.75rem;
    padding: 1.25rem 1.5rem;
    max-width: 22rem;
    width: 100%;
    box-shadow: 0 10px 25px rgba(0,0,0,0.15);
  }

  #errorModal.hidden {
    display: none !important;
    visibility: hidden !important;
    opacity: 0 !important;
    pointer-events: none !important;
  }

</style>

<!-- ERROR MODAL -->
<div id="errorModal" class="hidden modal-backdrop">
  <div class="modal-card">
    <h3 class="text-lg font-bold text-red-600 mb-2">Error</h3>
    <p id="errorMessage" class="text-sm text-gray-700"></p>
    <div class="mt-4 flex justify-end">
      <button id="closeError" class="control-btn danger text-white" style="background:#ef4444;">Close</button>
    </div>
  </div>
</div>

<!-- TOOLBAR -->
<div id="squiggle-toolbar">
  <div id="squiggle-toolbar-left">Brush:</div>

  <div id="squiggle-toolbar-right">
    <div id="colorPicker" class="flex items-center gap-2">
      <div class="color-option bg-black selected" data-color="#000000"></div>
      <div class="color-option bg-red-500" data-color="#ef4444"></div>
      <div class="color-option bg-blue-500" data-color="#3b82f6"></div>
      <div class="color-option bg-green-500" data-color="#10b981"></div>
      <div class="color-option bg-yellow-400" data-color="#facc15"></div>
    </div>
    <div class="flex items-center gap-2">
      <label class="text-xs text-gray-700">Size</label>
      <!-- ⭐ UPDATED SLIDER (bigger + max=20) -->
      <input type="range" id="brushSize" min="1" max="20" value="3" class="w-32 accent-indigo-600" />
      <span id="sizeValue" class="text-xs text-gray-600 font-mono">3</span>
    </div>
    <button id="undoButton" class="control-btn">↩ Undo</button>
    <button id="eraserButton" class="control-btn">🩹 Eraser</button>
    <button id="clearAllButton" class="control-btn danger">🗑 Clear All</button>
    <button id="submitDuckBtn" class="control-btn primary">✅ Submit Squiggle</button>
  </div>
</div>

<!-- CANVAS -->
<div id="squiggle-canvas-wrapper">
  <div id="squiggle-canvas-inner">
    <img
      id="duckBase"
      src="/assets/images/blog/squigglechallenge.png"
      alt="squiggle drawing template"
    />
    <canvas id="drawingCanvas"></canvas>
  </div>
</div>

<br>

<h2 class="mt-6 mb-4 font-bold text-lg">Squiggle Gallery</h2>
<div id="duckGallery"></div>

<!-- SCRIPT -->
<script type="module">
  import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
  import {
    getFirestore, collection, addDoc,
    onSnapshot, query, orderBy, deleteDoc, doc, getDoc
  } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
  import { getAuth, signInAnonymously } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

  const firebaseConfig = {
    apiKey: "AIzaSyAClLaT8V_N5ZZuauaeYVEAEOBz93_FMXk",
    authDomain: "squigglechallenge-e7568.firebaseapp.com",
    projectId: "squigglechallenge-e7568",
    storageBucket: "squigglechallenge-e7568.firebasestorage.app",
    messagingSenderId: "256814676056",
    appId: "1:256814676056:web:325b78ee8ddf1807a6f22d"
  };

  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  const auth = getAuth(app);

  await signInAnonymously(auth);

  const galleryCol = collection(db, "squiggleGallery");

  const duckBase = document.getElementById("duckBase");
  const canvas = document.getElementById("drawingCanvas");
  const ctx = canvas.getContext("2d");

  const colorPicker = document.getElementById("colorPicker");
  const eraserButton = document.getElementById("eraserButton");
  const undoButton = document.getElementById("undoButton");
  const clearAllButton = document.getElementById("clearAllButton");
  const brushSizeInput = document.getElementById("brushSize");
  const sizeValue = document.getElementById("sizeValue");
  const submitDuckBtn = document.getElementById("submitDuckBtn");
  const galleryDiv = document.getElementById("duckGallery");

  let drawing = false;
  let currentStroke = [];
  let allStrokes = [];
  let currentColor = "#000000";
  let currentSize = 3;
  let currentMode = "draw";

  function resizeCanvas() {
    const rect = duckBase.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
    redraw();
  }

  duckBase.complete ? resizeCanvas() : duckBase.addEventListener("load", resizeCanvas);
  window.addEventListener("resize", resizeCanvas);

  function getPos(evt) {
    const r = canvas.getBoundingClientRect();
    const x = evt.touches ? evt.touches[0].clientX : evt.clientX;
    const y = evt.touches ? evt.touches[0].clientY : evt.clientY;
    return { x: x - r.left, y: y - r.top };
  }

  function start(evt) {
    evt.preventDefault();
    drawing = true;
    currentStroke = [];
    const pos = getPos(evt);
    currentStroke.push(pos);

    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
    ctx.strokeStyle = currentColor;
    ctx.lineWidth = currentSize;
    ctx.globalCompositeOperation = currentMode === "erase" ? "destination-out" : "source-over";
  }

  function move(evt) {
    if (!drawing) return;
    evt.preventDefault();

    const pos = getPos(evt);
    currentStroke.push(pos);

    const prev = currentStroke[currentStroke.length - 2];
    ctx.beginPath();
    ctx.moveTo(prev.x, prev.y);
    ctx.lineTo(pos.x, pos.y);
    ctx.strokeStyle = currentColor;
    ctx.lineWidth = currentSize;
    ctx.globalCompositeOperation = currentMode === "erase" ? "destination-out" : "source-over";
    ctx.stroke();
  }

  function end() {
    if (!drawing) return;
    drawing = false;

    if (currentStroke.length > 1) {
      allStrokes.push({
        points: [...currentStroke],
        color: currentColor,
        size: currentSize,
        mode: currentMode,
      });
    }

    currentStroke = [];
    ctx.globalCompositeOperation = "source-over";
  }

  canvas.addEventListener("mousedown", start);
  canvas.addEventListener("mousemove", move);
  canvas.addEventListener("mouseup", end);
  canvas.addEventListener("mouseleave", end);

  canvas.addEventListener("touchstart", start, { passive: false });
  canvas.addEventListener("touchmove", move, { passive: false });
  canvas.addEventListener("touchend", end);

  function redraw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    allStrokes.forEach((stroke) => {
      const pts = stroke.points || [];
      if (pts.length < 2) return;

      ctx.strokeStyle = stroke.color;
      ctx.lineWidth = stroke.size;
      ctx.globalCompositeOperation =
        stroke.mode === "erase" ? "destination-out" : "source-over";

      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y);
      for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
      ctx.stroke();
    });

    ctx.globalCompositeOperation = "source-over";
  }

  colorPicker.addEventListener("click", (e) => {
    if (!e.target.dataset.color) return;
    currentColor = e.target.dataset.color;
    currentMode = "draw";

    [...colorPicker.children].forEach(c => c.classList.remove("selected"));
    e.target.classList.add("selected");

    eraserButton.classList.remove("selected-tool");
  });

  eraserButton.addEventListener("click", () => {
    currentMode = currentMode === "erase" ? "draw" : "erase";
    eraserButton.classList.toggle("selected-tool");
  });

  brushSizeInput.addEventListener("input", () => {
    currentSize = +brushSizeInput.value;
    sizeValue.textContent = currentSize;
  });

  clearAllButton.addEventListener("click", () => {
    allStrokes = [];
    redraw();
  });

  undoButton.addEventListener("click", () => {
    allStrokes.pop();
    redraw();
  });

  submitDuckBtn.addEventListener("click", async () => {
    const mergedCanvas = document.createElement("canvas");
    mergedCanvas.width = canvas.width;
    mergedCanvas.height = canvas.height;
    const mctx = mergedCanvas.getContext("2d");

    mctx.drawImage(duckBase, 0, 0, canvas.width, canvas.height);
    mctx.drawImage(canvas, 0, 0);

    const dataUrl = mergedCanvas.toDataURL("image/png");

    await addDoc(galleryCol, {
      img: dataUrl,
      ts: Date.now(),
    });

    alert("Squiggle submitted!");
    allStrokes = [];
    redraw();
  });

  let moderatorMode = false;
  let moderatorPasswordCache = null;
  let latestGalleryDocs = [];

  async function getModeratorPassword() {
    if (moderatorPasswordCache) return moderatorPasswordCache;

    const configRef = doc(db, "moderatorConfig", "moderator");
    const snap = await getDoc(configRef);

    if (!snap.exists()) throw new Error("Moderator config missing");

    const data = snap.data();
    if (!data.password) throw new Error("Moderator password missing");

    moderatorPasswordCache = data.password;
    return moderatorPasswordCache;
  }

  window.addEventListener("keydown", async (e) => {
    if (e.ctrlKey && e.key.toLowerCase() === "m") {
      const typed = prompt("Enter moderator password:");
      if (typed === null) return;

      try {
        const pw = await getModeratorPassword();
        if (typed === pw) {
          moderatorMode = !moderatorMode;
          alert("Moderator mode: " + (moderatorMode ? "ON" : "OFF"));
          renderGallery(latestGalleryDocs);
        } else {
          alert("Incorrect password.");
        }
      } catch (err) {
        console.error(err);
        showError("Moderator configuration error.");
      }
    }
  });

  function renderGallery(docs) {
    galleryDiv.innerHTML = "";

    docs.forEach((duckDoc) => {
      const data = duckDoc.data();

      const card = document.createElement("div");
      card.className = "squiggle-card";
      card.innerHTML = `<img src="${data.img}" alt="Submitted squiggle art">`;

      if (moderatorMode) {
        const delBtn = document.createElement("button");
        delBtn.className = "moderator-delete-btn";
        delBtn.textContent = "Delete";

        delBtn.addEventListener("click", async () => {
          if (confirm("Delete this squiggle?")) {
            try {
              await deleteDoc(duckDoc.ref);
            } catch (err) {
              console.error(err);
              showError("Failed to delete.");
            }
          }
        });

        card.appendChild(delBtn);
      }

      galleryDiv.appendChild(card);
    });
  }

  onSnapshot(query(galleryCol, orderBy("ts", "desc")), (snap) => {
    latestGalleryDocs = snap.docs;
    renderGallery(latestGalleryDocs);
  });

</script>

</div>
