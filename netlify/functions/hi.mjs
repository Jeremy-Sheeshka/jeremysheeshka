import { createSign } from "node:crypto";

const FB = "https://rhythm-studio-39713-default-rtdb.firebaseio.com";

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

function hdrs(){ return {"Access-Control-Allow-Origin":"*","Access-Control-Allow-Methods":"GET,POST,OPTIONS","Access-Control-Allow-Headers":"Content-Type","Content-Type":"application/json"}; }
function json(b,s){ return new Response(JSON.stringify(b), {status:s||200, headers:hdrs()}); }
async function readBest(){ try{ const r=await fetch(await fbURL("/rhythm_hi")); if(!r.ok) return null; const o=await r.json(); return (o&&typeof o==="object")?o:null; }catch(e){ return null; } }
async function writeBest(o){ const r=await fetch(await fbURL("/rhythm_hi"),{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify(o)}); return r.ok; }
export default async (req, context) => {
  if(req.method==="OPTIONS") return new Response(null,{status:204,headers:hdrs()});
  try{
    if(req.method==="GET"){ const b=await readBest(); return json(b&&typeof b.score==="number"?b:{score:0,name:"",ts:0}); }
    if(req.method==="POST"){
      let body={}; try{ body=await req.json(); }catch(e){ return json({error:"bad json"},400); }
      let sc=Number(body.score); if(!isFinite(sc)||sc<0) return json({error:"bad score"},400);
      sc=Math.floor(sc);
      let nm=String(body.name||"").trim().slice(0,24);
      const cur=await readBest();
      const bestScore=(cur&&typeof cur.score==="number")?cur.score:0;
      if(sc>bestScore){ const nb={score:sc,name:nm,ts:Date.now()}; await writeBest(nb); return json(nb,201); }
      return json(cur&&typeof cur.score==="number"?cur:{score:0,name:"",ts:0},200);
    }
    return json({error:"method not allowed"},405);
  }catch(e){ return json({error:"server error",detail:String((e&&e.message)||e)},500); }
};
