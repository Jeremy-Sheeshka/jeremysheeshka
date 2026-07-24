const FB = "https://rhythm-studio-39713-default-rtdb.firebaseio.com";
function hdrs(){ return {"Access-Control-Allow-Origin":"*","Access-Control-Allow-Methods":"GET,POST,OPTIONS","Access-Control-Allow-Headers":"Content-Type","Content-Type":"application/json"}; }
function json(b,s){ return new Response(JSON.stringify(b), {status:s||200, headers:hdrs()}); }
async function readBest(){ try{ const r=await fetch(FB+"/rhythm_hi.json"); if(!r.ok) return null; const o=await r.json(); return (o&&typeof o==="object")?o:null; }catch(e){ return null; } }
async function writeBest(o){ const r=await fetch(FB+"/rhythm_hi.json",{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify(o)}); return r.ok; }
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
