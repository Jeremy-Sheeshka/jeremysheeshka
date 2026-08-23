import { createSign, randomUUID } from "node:crypto";

const FB = "https://rhythm-studio-39713-default-rtdb.firebaseio.com";
const ADMIN_SECRET = process.env.RR_ADMIN_SECRET || "RR-CURATE-531";

// --- Firebase auth (service account OAuth2, bypasses RTDB rules) ---
// Reads the service-account JSON from FIREBASE_SERVICE_ACCOUNT (set in Netlify env).
// If the env var is missing we fall back to unauthenticated calls (the old behaviour)
// so a deploy never breaks the live site before the credential is configured.
const SA_JSON = process.env.FIREBASE_SERVICE_ACCOUNT || "";
let _tok = null, _tokExp = 0;

async function fbToken(){
  if(_tok && Date.now() < _tokExp) return _tok;
  if(!SA_JSON) return null;
  const sa = JSON.parse(SA_JSON);
  const now = Math.floor(Date.now() / 1000);
  const b64 = (o) => Buffer.from(JSON.stringify(o)).toString("base64url");
  const h = b64({ alg: "RS256", typ: "JWT" });
  const c = b64({
    iss: sa.client_email,
    scope: "https://www.googleapis.com/auth/firebase.database https://www.googleapis.com/auth/userinfo.email",
    aud: "https://oauth2.googleapis.com/token",
    iat: now,
    exp: now + 3600
  });
  const sig = createSign("RSA-SHA256").update(h + "." + c).sign(sa.private_key, "base64url");
  const r = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer", assertion: h + "." + c + "." + sig })
  });
  if(!r.ok) throw new Error("oauth token http " + r.status);
  const t = await r.json();
  if(!t.access_token) throw new Error("oauth token error: " + (t.error_description || t.error || "no access_token"));
  _tok = t.access_token;
  _tokExp = Date.now() + Math.max(60, (t.expires_in || 3600) - 60) * 1000;
  return _tok;
}

async function fbURL(path){
  const t = await fbToken();
  return FB + path + ".json" + (t ? "?access_token=" + encodeURIComponent(t) : "");
}

function hdrs(){ return {"Access-Control-Allow-Origin":"*","Access-Control-Allow-Methods":"GET,POST,DELETE,OPTIONS","Access-Control-Allow-Headers":"Content-Type","Content-Type":"application/json"}; }
function json(b,s){ return new Response(JSON.stringify(b), {status:s||200, headers:hdrs()}); }
async function readBest(){ return null; }
async function listAll(){ try{ const r=await fetch(await fbURL("/rhythms_local")); if(!r.ok) return []; const o=await r.json(); if(!o||typeof o!=="object") return []; const a=[]; for(const k of Object.keys(o)){ const it=o[k]; if(it&&typeof it==="object"){ it.id=k; a.push(it);} } a.sort((x,y)=>(x.ts||0)-(y.ts||0)); return a; }catch(e){ return []; } }
async function put(id,item){ const r=await fetch(await fbURL("/rhythms_local/"+encodeURIComponent(id)),{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify(item)}); return r.ok; }
async function get(id){ try{ const r=await fetch(await fbURL("/rhythms_local/"+encodeURIComponent(id))); if(!r.ok) return null; const o=await r.json(); return (o&&typeof o==="object")?o:null; }catch(e){ return null; } }
async function del(id){ const r=await fetch(await fbURL("/rhythms_local/"+encodeURIComponent(id)),{method:"DELETE"}); return r.ok; }
export default async (req, context) => {
  if(req.method==="OPTIONS") return new Response(null,{status:204,headers:hdrs()});
  try{
    if(req.method==="GET"){ return json(await listAll()); }
    if(req.method==="POST"){
      let body={}; try{ body=await req.json(); }catch(e){ return json({error:"bad json"},400); }
      const name=String(body.name||"Untitled").slice(0,60);
      const bpm=Math.max(20,Math.min(400,parseInt(body.bpm,10)||88));
      const tiles=Array.isArray(body.tiles)?body.tiles.slice(0,64):[];
      const id=String(Date.now())+"-"+Math.floor(Math.random()*1000000);
      const token=randomUUID();
      const unit = (body && body.unit==="s16") ? "s16" : "e8";
    const item={id,name,bpm,tiles, unit,token,ts:Date.now()};
      await put(id,item);
      return json(item,201);
    }
    if(req.method==="DELETE"){
      let body={}; try{ body=await req.json(); }catch(e){ return json({error:"bad json"},400); }
      if(!body.id) return json({error:"missing id"},400);
      const cur=await get(body.id);
      if(!cur) return json({error:"not found"},404);
      if(!((body.token&&cur.token===body.token)||(body.admin&&body.admin===ADMIN_SECRET))) return json({error:"forbidden"},403);
      await del(body.id);
      return json({ok:true});
    }
    return json({error:"method not allowed"},405);
  }catch(e){ return json({error:"server error",detail:String((e&&e.message)||e)},500); }
};
