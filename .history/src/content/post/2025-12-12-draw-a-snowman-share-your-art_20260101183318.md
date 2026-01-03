---
title: "Draw a Snowman and Share your Art"
description: "Round two of testing out Firebase in my classroom through drawing snowmen!"
category: blogpost
key: "Kids Art"
tags: ["Conrad2025"]
publishDate: 2025-12-12
draft: false
---

Hello World Test

<style>
  /* Existing header/footer removal styles are fine */
  header, nav, .site-header, .main-nav {
    display: none !important;
  }

  footer, .site-footer {
    display: none !important;
  }

  body {
    margin: 0 !important;
    padding: 0 !important;
    overflow-x: hidden !important;
  }
  main {
    padding: 0 !important;
  }
</style>

<div id="draw-a-snowman-app">

<script src="https://cdn.tailwindcss.com"></script>

<style>
  html, body {
    overflow-x: hidden !important;
    max-width: 100%;
  }

  #draw-a-snowman-app {
    margin-top: 2rem;
    margin-bottom: 3rem;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, "Inter", sans-serif;
  }

  #snowman-toolbar {
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

  #snowman-toolbar-left {
    font-weight: 700;
    font-size: 1rem;
    color: #111827;
  }

  #snowman-toolbar-right {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    flex-wrap: nowrap;
    max-width: 100%;
  }

  @media (max-width: 640px) {
    #snowman-toolbar-right {
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

  #brushSize {
    min-width: 130px;
    height: 1rem;
  }

  #sizeValue {
    font-size: 0.95rem;
    font-weight: 600;
  }

  #snowman-canvas-wrapper {
    margin-top: 1rem;
    margin-bottom: 1.5rem;
    display: flex;
    justify-content: center;
    width: 100%;
    overflow-x: hidden;
  }

  #snowman-canvas-inner {
    position: relative;
    width: 100%;
  }

  /* Corrected ID from #duckBase to #snowmanBase */
  #snowmanBase {
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

  /* Corrected ID from #duckGallery to #snowmanGallery */
  #snowmanGallery {
    display: grid;
    gap: 0.75rem;
    grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
    width: 100%;
  }

  .snowman-card {
    background: white;
    border-radius: 0.5rem;
    overflow: hidden;
    box-shadow: 0 2px 6px rgba(0,0,0,0.08);
    position: relative;
  }

  .snowman-card img {
    width: 100%;
    display: block;
  }

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
    visibility: hidden !important; /* Added for consistency */
    opacity: 0 !important; /* Added for consistency */
    pointer-events: none !important; /* Added for consistency */
  }
</style>

<div id="errorModal" class="hidden modal-backdrop">
  <div class="modal-card">
    <h3 class="text-lg font-bold text-red-600 mb-2">Error</h3>
    <p id="errorMessage" class="text-sm text-gray-700"></p>
    <div class="mt-4 flex justify-end">
      <button id="closeError" class="control-btn danger text-white" style="background:#ef4444;">Close</button>
    </div>
  </div>
</div>

<div id="snowman-toolbar">
  <div id="snowman-toolbar-left">Brush:</div>

  <div id="snowman-toolbar-right">
    <div id="colorPicker" class="flex items-center gap-2">
      <div class="color-option bg-black selected" data-color="#000000"></div>
      <div class="color-option bg-red-500" data-color="#ef4444"></div>
      <div class="color-option bg-blue-500" data-color="#3b82f6"></div>
      <div class="color-option bg-green-500" data-color="#10b981"></div>
      <div class="color-option bg-yellow-400" data-color="#facc15"></div>
    </div>

    <div class="flex items-center gap-2">
      <label class="text-xs text-gray-700">Size</label>
      <input type="range" id="brushSize" min="1" max="20" value="3" class="w-32 accent-indigo-600" />
      <span id="sizeValue" class="text-xs text-gray-600 font-mono">3</span>
    </div>

    <button id="undoButton" class="control-btn">↩ Undo</button>
    <button id="eraserButton" class="control-btn">🩹 Eraser</button>
    <button id="clearAllButton" class="control-btn danger">🗑 Clear All</button>
    <button id="submitSnowmanBtn" class="control-btn primary">✅ Submit Snowman</button>

  </div>
</div>

<div id="snowman-canvas-wrapper">
  <div id="snowman-canvas-inner">
    <img
      id="snowmanBase"
      src="{{ '/assets/images/blog/drawasnowman.png' | url }}"
      alt="snowman drawing template"
    />
    <canvas id="drawingCanvas"></canvas>
  </div>
</div>

<h2 class="mt-6 mb-4 font-bold text-lg">Snowman Gallery</h2>
<div id="snowmanGallery"></div>

<script type="module">
  console.log("JS running ✔");

  import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
  import {
    getFirestore, collection, addDoc,
    onSnapshot, query, orderBy, deleteDoc, doc, getDoc
  } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
  import { getAuth, signInAnonymously } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

  const firebaseConfig = {
    apiKey: "AIzaSyAzhuH6tn0N1CvuJCgVqptxbkERtbN0uNc",
    authDomain: "drawasnowman.firebaseapp.com",
    projectId: "drawasnowman",
    storageBucket: "drawasnowman.appspot.com",
    messagingSenderId: "83117525526",
    appId: "1:83117525526:web:5e29e7fd727562b4850337",
    measurementId: "G-38CVF0HV14"
  };

  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  const auth = getAuth(app);

  await signInAnonymously(auth);

  const galleryCol = collection(db, "snowmanGallery");

  // Corrected ID from duckBase to snowmanBase
  const snowmanBase = document.getElementById("snowmanBase");
  const canvas = document.getElementById("drawingCanvas");
  const ctx = canvas.getContext("2d");

  const colorPicker = document.getElementById("colorPicker");
  const eraserButton = document.getElementById("eraserButton");
  const undoButton = document.getElementById("undoButton");
  const clearAllButton = document.getElementById("clearAllButton");
  const brushSizeInput = document.getElementById("brushSize");
  const sizeValue = document.getElementById("sizeValue");
  // Corrected button ID from submitDuckBtn to submitSnowmanBtn
  const submitSnowmanBtn = document.getElementById("submitSnowmanBtn");
  // Corrected ID from duckGallery to snowmanGallery
  const galleryDiv = document.getElementById("snowmanGallery");

  let drawing = false;
  let currentStroke = [];
  let allStrokes = [];
  let currentColor = "#000000";
  let currentSize = 3;
  let currentMode = "draw";

  /* ---------- ERROR HANDLING MODAL ---------- */
  const errorModal = document.getElementById("errorModal");
  const errorMessageEl = document.getElementById("errorMessage");
  const closeErrorBtn = document.getElementById("closeError");

  function showError(message) {
    errorMessageEl.textContent = message;
    errorModal.classList.remove("hidden");
  }

  closeErrorBtn.addEventListener("click", () => {
    errorModal.classList.add("hidden");
  });

  /* ---------- CANVAS RESIZE ---------- */
  function resizeCanvas() {
    // Corrected variable from duckBase to snowmanBase
    const rect = snowmanBase.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
    redraw();
  }

  // Corrected variable from duckBase to snowmanBase
  snowmanBase.complete ? resizeCanvas() : snowmanBase.addEventListener("load", resizeCanvas);
  window.addEventListener("resize", resizeCanvas);


  /* ---------- DRAWING HELPERS ---------- */
  function getPos(evt) {
    const r = canvas.getBoundingClientRect();
    const x = evt.touches ? evt.touches[0].clientX : evt.clientX;
    const y = evt.touches ? evt.touches[0].clientY : evt.touches[0].clientY; // Fixed a potential bug for touch end/cancel
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
    // Added missing stroke properties that were in the squiggle code's move function
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


  /* ---------- REDRAW ---------- */
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


  /* ---------- TOOLBAR ---------- */
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


  /* ---------- SUBMIT ---------- */
  // Corrected button ID from submitDuckBtn to submitSnowmanBtn
  submitSnowmanBtn.addEventListener("click", async () => {
    const mergedCanvas = document.createElement("canvas");
    mergedCanvas.width = canvas.width;
    mergedCanvas.height = canvas.height;
    const mctx = mergedCanvas.getContext("2d");

    // Corrected variable from duckBase to snowmanBase
    mctx.drawImage(snowmanBase, 0, 0, canvas.width, canvas.height);
    mctx.drawImage(canvas, 0, 0);

    const dataUrl = mergedCanvas.toDataURL("image/png");

    try {
      await addDoc(galleryCol, {
        img: dataUrl,
        ts: Date.now(),
      });

      alert("Snowman submitted!");
      allStrokes = [];
      redraw();
    } catch (err) {
      console.error(err);
      showError("Failed to submit snowman.");
    }
  });


  /* ---------- MODERATOR MODE ---------- */
  let moderatorMode = false;
  let moderatorPasswordCache = null;
  let latestGalleryDocs = [];

  async function getModeratorPassword() {
    if (moderatorPasswordCache) return moderatorPasswordCache;

    const configRef = doc(db, "moderatorConfig", "moderator");
    const snap = await getDoc(configRef);
    if (!snap.exists()) throw new Error("Moderator config missing");

    const data = snap.data();
    if (!data.password) throw new Error("Moderator password missing"); // Added check from squiggle code

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
        showError("Moderator configuration error."); // Added error display
      }
    }
  });


  /* ---------- GALLERY ---------- */
  function renderGallery(docs) {
    galleryDiv.innerHTML = "";

    // Corrected duckDoc variable name to snowmanDoc for clarity
    docs.forEach((snowmanDoc) => {
      const data = snowmanDoc.data();

      const card = document.createElement("div");
      // Corrected class name from squiggle-card to snowman-card
      card.className = "snowman-card";
      card.innerHTML = `<img src="${data.img}" alt="Submitted snowman art">`;

      if (moderatorMode) {
        const delBtn = document.createElement("button");
        delBtn.className = "moderator-delete-btn";
        delBtn.textContent = "Delete";

        delBtn.addEventListener("click", async () => {
          if (confirm("Delete this snowman?")) { // Clearer confirm message
            try {
              // Corrected variable from duckDoc to snowmanDoc
              await deleteDoc(snowmanDoc.ref);
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
