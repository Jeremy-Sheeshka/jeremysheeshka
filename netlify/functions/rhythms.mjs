import { randomUUID } from "node:crypto";

const FB = "https://rhythm-studio-39713-default-rtdb.firebaseio.com";
const SEED = {
  "1": { id: "1", name: "Example", bpm: 88, seed: true, ts: 1, tiles: [
    {type:"note",onset:0,dur:2},{type:"note",onset:2,dur:2},{type:"note",onset:4,dur:2},{type:"note",onset:6,dur:2},
    {type:"note",onset:8,dur:2},{type:"note",onset:10,dur:2},{type:"note",onset:12,dur:2},{type:"note",onset:14,dur:2}
  ]}
};

function hdrs(){
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,DELETE,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json"
  };
}
function json(body, status){ return new Response(JSON.stringify(body), { status: status || 200, headers: hdrs() }); }
function enc(s){ return encodeURIComponent(String(s)); }

async function fbGet(p){
  const r = await fetch(FB + p + ".json");
  if(!r.ok) throw new Error("fb get " + r.status);
  return await r.json();
}
async function fbPut(p, obj){
  const r = await fetch(FB + p + ".json", { method: "PUT", headers: {"Content-Type":"application/json"}, body: JSON.stringify(obj) });
  if(!r.ok) throw new Error("fb put " + r.status);
  return await r.json();
}
async function fbDel(p){
  const r = await fetch(FB + p + ".json", { method: "DELETE" });
  if(!r.ok) throw new Error("fb del " + r.status);
  return true;
}
function objToArray(obj){
  const arr = [];
  if(!obj || typeof obj !== "object") return arr;
  const ks = Object.keys(obj);
  for(let i=0;i<ks.length;i++){ const it = obj[ks[i]]; if(it && typeof it === "object"){ it.id = ks[i]; arr.push(it); } }
  arr.sort(function(a,b){ return (a.ts||0)-(b.ts||0); });
  return arr;
}
async function loadAll(){
  let obj = null;
  try { obj = await fbGet("/rhythms"); } catch(e){ obj = null; }
  if(!obj || (typeof obj === "object" && Object.keys(obj).length === 0)){
    try { await fbPut("/rhythms", SEED); } catch(e){}
    return objToArray(SEED);
  }
  return objToArray(obj);
}

export default async (req, context) => {
  if(req.method === "OPTIONS") return new Response(null, { status: 204, headers: hdrs() });
  if(typeof fetch === "undefined") return json({ error: "runtime has no fetch - set NODE_VERSION=20 in Netlify site settings" }, 502);
  try {
    if(req.method === "GET"){
      return json(await loadAll());
    }
    if(req.method === "POST"){
      let body = {};
      try { body = await req.json(); } catch(e){ return json({ error: "bad json" }, 400); }
      const name = String(body.name || "Anonymous").slice(0, 24);
      const bpm = Math.max(40, Math.min(240, parseInt(body.bpm, 10) || 88));
      const tiles = Array.isArray(body.tiles) ? body.tiles.slice(0, 64) : [];
      const id = String(Date.now()) + "-" + Math.floor(Math.random() * 1000000);
      const token = randomUUID();
      const item = { id: id, name: name, bpm: bpm, tiles: tiles, token: token, ts: Date.now() };
      await fbPut("/rhythms/" + enc(id), item);
      return json(item, 201);
    }
    if(req.method === "DELETE"){
      let body = {};
      try { body = await req.json(); } catch(e){ return json({ error: "bad json" }, 400); }
      if(!body.id) return json({ error: "missing id" }, 400);
      let cur = null;
      try { cur = await fbGet("/rhythms/" + enc(body.id)); } catch(e){ cur = null; }
      if(!cur) return json({ error: "not found" }, 404);
      if(!body.token || cur.token !== body.token) return json({ error: "forbidden" }, 403);
      await fbDel("/rhythms/" + enc(body.id));
      return json({ ok: true });
    }
    return json({ error: "method not allowed" }, 405);
  } catch(e){
    return json({ error: "server error", detail: String((e && e.message) || e) }, 500);
  }
};
