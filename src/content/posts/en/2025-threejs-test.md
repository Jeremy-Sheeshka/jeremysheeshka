---
title: 'threejs test'
description: "Three.js drawing test with Supabase"
category: blogpost
key: 'ETEC 500'
tags: ETEC 500
draft: true
layout: base 
date: 2025-06-16
---

# Draw in 3D with Three.js 🎨

<div style="margin:1rem 0; display:flex; gap:1rem; align-items:center; flex-wrap:wrap;">
  <label for="colorPicker">Line Color:</label>
  <input type="color" id="colorPicker" value="#ffcc00">
  <button id="undoBtn">Undo</button>
  <button id="clearBtn">Clear All</button>
  <button id="saveBtn">Save</button>
</div>

<div id="draw-container" style="width:100%; height:500px; background:#111; position:relative;"></div>

<script type="module">
import * as THREE from 'https://unpkg.com/three@0.163.0/build/three.module.js';
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// --- Supabase setup ---
const SUPABASE_URL = "https://nxrbvtizrdcuoizhqlfl.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im54cmJ2dGl6cmRjdW9pemhxbGZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYwNTM2NjEsImV4cCI6MjA3MTYyOTY2MX0._9zfgdaeuDuIlAhSoS-PlQrRZa-9vJ-LkIWT5q5uOm0";
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// --- Three.js setup ---
const container = document.getElementById("draw-container");
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x111111);

let width = container.clientWidth;
let height = container.clientHeight;

const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(width, height);
container.appendChild(renderer.domElement);

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let isDrawing = false;
let points = [];
const drawnLines = [];
const plane = new THREE.Plane(new THREE.Vector3(0,0,1),0);

// UI Elements
const colorPicker = document.getElementById("colorPicker");
const undoBtn = document.getElementById("undoBtn");
const clearBtn = document.getElementById("clearBtn");
const saveBtn = document.getElementById("saveBtn");

// --- Mouse & Touch events ---
function onMouseDown(e){ e.preventDefault(); isDrawing=true; points=[]; }
function onMouseUp(){ isDrawing=false; if(points.length>1){ const geometry=new THREE.BufferGeometry().setFromPoints(points); const material=new THREE.LineBasicMaterial({ color:new THREE.Color(colorPicker.value) }); const line=new THREE.Line(geometry, material); scene.add(line); drawnLines.push(line); } }
function onMouseMove(e){ if(!isDrawing) return; const rect=renderer.domElement.getBoundingClientRect(); mouse.x=((e.clientX-rect.left)/rect.width)*2-1; mouse.y=-((e.clientY-rect.top)/rect.height)*2+1; raycaster.setFromCamera(mouse,camera); const intersectPoint=new THREE.Vector3(); raycaster.ray.intersectPlane(plane,intersectPoint); points.push(intersectPoint.clone()); }
function onTouchStart(e){ e.preventDefault(); isDrawing=true; points=[]; }
function onTouchEnd(){ onMouseUp(); }
function onTouchMove(e){ if(!isDrawing) return; const touch=e.touches[0]; const rect=renderer.domElement.getBoundingClientRect(); mouse.x=((touch.clientX-rect.left)/rect.width)*2-1; mouse.y=-((touch.clientY-rect.top)/rect.height)*2+1; raycaster.setFromCamera(mouse,camera); const intersectPoint=new THREE.Vector3(); raycaster.ray.intersectPlane(plane,intersectPoint); points.push(intersectPoint.clone()); }

// --- Buttons ---
undoBtn.addEventListener("click",()=>{ const lastLine=drawnLines.pop(); if(lastLine) scene.remove(lastLine); });
clearBtn.addEventListener("click",()=>{ while(drawnLines.length>0){ const line=drawnLines.pop(); scene.remove(line); } });

// --- Save Button: store as Base64 in Supabase ---
saveBtn.addEventListener("click", async ()=>{
  const base64=renderer.domElement.toDataURL("image/png");
  try{
    const {data,error}=await supabase.from("signatures").insert([{image_base64:base64}]).select("*");
    console.log("Supabase insert response:",{data,error});
    if(error) throw error;
    alert("Drawing saved!");
    renderBackgroundSignatures();
  }catch(err){ console.error("Supabase insert error:",err); alert("Failed to save to Supabase. Check console."); }
});

// --- Render saved signatures in background ---
async function renderBackgroundSignatures(){
  try{
    const {data,error}=await supabase.from("signatures").select("image_base64");
    if(error) throw error;
    document.querySelectorAll(".bg-signature").forEach(el=>el.remove());
    data.forEach(row=>{
      const img=document.createElement("img");
      img.src=row.image_base64;
      img.className="bg-signature";
      img.style.position="absolute";
      img.style.width=`${50+Math.random()*100}px`;
      img.style.top=`${Math.random()*90}vh`;
      img.style.left=`${Math.random()*90}vw`;
      img.style.transform=`rotate(${Math.random()*360}deg)`;
      img.style.opacity="0.15";
      img.style.pointerEvents="none";
      document.body.appendChild(img);
    });
  }catch(err){ console.error("Supabase fetch error:",err); }
}

// --- Animate & Resize ---
renderer.domElement.addEventListener('mousedown', onMouseDown);
renderer.domElement.addEventListener('mouseup', onMouseUp);
renderer.domElement.addEventListener('mousemove', onMouseMove);
renderer.domElement.addEventListener('touchstart', onTouchStart,{passive:false});
renderer.domElement.addEventListener('touchend', onTouchEnd,{passive:false});
renderer.domElement.addEventListener('touchmove', onTouchMove,{passive:false});

function animate(){ requestAnimationFrame(animate); renderer.render(scene,camera); }
animate();

window.addEventListener('resize',()=>{
  width=container.clientWidth; height=container.clientHeight;
  camera.aspect=width/height;
  camera.updateProjectionMatrix();
  renderer.setSize(width,height);
});

// --- Load saved signatures on page load ---
document.addEventListener("DOMContentLoaded",()=>{ renderBackgroundSignatures(); });
</script>
