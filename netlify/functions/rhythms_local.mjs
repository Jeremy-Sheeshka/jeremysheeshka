const FB = "https://rhythm-studio-39713-default-rtdb.firebaseio.com";
function hdrs(){ return {"Access-Control-Allow-Origin":"*","Access-Control-Allow-Methods":"GET,POST,DELETE,OPTIONS","Access-Control-Allow-Headers":"Content-Type","Content-Type":"application/json"}; }
function json(b,s){ return new Response(JSON.stringify(b), {status:s||200, headers:hdrs()}); }
async function readBest(){ return null; }
async function listAll(){ try{ const r=await fetch(FB+"/rhythms_local.json"); if(!r.ok) return []; const o=await r.json(); if(!o||typeof o!=="object") return []; const a=[]; for(const k of Object.keys(o)){ const it=o[k]; if(it&&typeof it==="object"){ it.id=k; a.push(it);} } a.sort((x,y)=>(x.ts||0)-(y.ts||0)); return a; }catch(e){ return []; } }
async function put(id,item){ const r=await fetch(FB+"/rhythms_local/"+encodeURIComponent(id)+".json",{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify(item)}); return r.ok; }
async function get(id){ try{ const r=await fetch(FB+"/rhythms_local/"+encodeURIComponent(id)+".json"); if(!r.ok) return null; const o=await r.json(); return (o&&typeof o==="object")?o:null; }catch(e){ return null; } }
async function del(id){ const r=await fetch(FB+"/rhythms_local/"+encodeURIComponent(id)+".json",{method:"DELETE"}); return r.ok; }
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
      const token=(crypto&&crypto.randomUUID)?crypto.randomUUID():("tk-"+Date.now()+"-"+Math.floor(Math.random()*1e9));
      const item={id,name,bpm,tiles,token,ts:Date.now()};
      await put(id,item);
      return json(item,201);
    }
    if(req.method==="DELETE"){
      let body={}; try{ body=await req.json(); }catch(e){ return json({error:"bad json"},400); }
      if(!body.id) return json({error:"missing id"},400);
      const cur=await get(body.id);
      if(!cur) return json({error:"not found"},404);
      if(!body.token||cur.token!==body.token) return json({error:"forbidden"},403);
      await del(body.id);
      return json({ok:true});
    }
    return json({error:"method not allowed"},405);
  }catch(e){ return json({error:"server error",detail:String((e&&e.message)||e)},500); }
};
