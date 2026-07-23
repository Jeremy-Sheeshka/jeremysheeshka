import { randomUUID } from "node:crypto";

const STORE_NAME = "rhythms";
const KEY = "all";
const SEED = [
  { id: 1, name: "Example", bpm: 88, seed: true, ts: 1, tiles: [
    {type:"note",onset:0,dur:2},{type:"note",onset:2,dur:2},{type:"note",onset:4,dur:2},{type:"note",onset:6,dur:2},
    {type:"note",onset:8,dur:2},{type:"note",onset:10,dur:2},{type:"note",onset:12,dur:2},{type:"note",onset:14,dur:2}
  ]}
];

function headers(){
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,DELETE,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json"
  };
}
function json(body, status){ return new Response(JSON.stringify(body), { status: status || 200, headers: headers() }); }

async function getBlobs(){
  const mod = await import("@netlify/blobs");
  return mod.getStore(STORE_NAME);
}
async function loadAll(store){
  let arr = null;
  try { arr = await store.get(KEY, { type: "json" }); } catch(e){ arr = null; }
  if(!Array.isArray(arr) || arr.length === 0){ arr = SEED; try { await store.set(KEY, JSON.stringify(arr)); } catch(e){} }
  return arr;
}

export default async (req, context) => {
  if(req.method === "OPTIONS") return new Response(null, { status: 204, headers: headers() });
  let store;
  try { store = await getBlobs(); } catch(e){ return json({ error: "storage unavailable" }, 503); }
  try {
    if(req.method === "GET"){
      return json(await loadAll(store));
    }
    if(req.method === "POST"){
      let body = {};
      try { body = await req.json(); } catch(e){ return json({ error: "bad json" }, 400); }
      const name = String(body.name || "Anonymous").slice(0, 24);
      const bpm = Math.max(40, Math.min(240, parseInt(body.bpm, 10) || 88));
      const tiles = Array.isArray(body.tiles) ? body.tiles.slice(0, 64) : [];
      const item = { id: Date.now() + "-" + Math.floor(Math.random() * 1000000), name: name, bpm: bpm, tiles: tiles, token: randomUUID(), ts: Date.now() };
      const arr = await loadAll(store);
      arr.push(item);
      await store.set(KEY, JSON.stringify(arr));
      return json(item, 201);
    }
    if(req.method === "DELETE"){
      let body = {};
      try { body = await req.json(); } catch(e){ return json({ error: "bad json" }, 400); }
      const arr = await loadAll(store);
      const idx = arr.findIndex(function(x){ return String(x.id) === String(body.id); });
      if(idx < 0) return json({ error: "not found" }, 404);
      if(!body.token || arr[idx].token !== body.token) return json({ error: "forbidden" }, 403);
      arr.splice(idx, 1);
      await store.set(KEY, JSON.stringify(arr));
      return json({ ok: true });
    }
    return json({ error: "method not allowed" }, 405);
  } catch(e){
    return json({ error: "server error", detail: String((e && e.message) || e) }, 500);
  }
};
