
(function(){
  var $=function(s){return document.querySelector(s);};
  var $$=function(s){return Array.prototype.slice.call(document.querySelectorAll(s));};
  var NS="http://www.w3.org/2000/svg";
  var CHK="\u2713", CRS="\u2717", ARR="\u2192", APO="\u2019", EMD="\u2014", PLAY="\u25B6", HAND="\u270B";
  var EASY={bpm:80,tiles:[{t:"n",o:0,d:4},{t:"n",o:4,d:4},{t:"n",o:8,d:2},{t:"n",o:10,d:2},{t:"n",o:12,d:4},{t:"n",o:16,d:4},{t:"n",o:20,d:4},{t:"n",o:24,d:2},{t:"n",o:26,d:2},{t:"n",o:28,d:4}]};
  var HARD={bpm:100,tiles:[{t:"n",o:0,d:6},{t:"n",o:6,d:2},{t:"n",o:8,d:2},{t:"n",o:10,d:2},{t:"n",o:12,d:4},{t:"r",o:16,d:4},{t:"n",o:20,d:1},{t:"n",o:21,d:1},{t:"n",o:22,d:1},{t:"n",o:23,d:1},{t:"n",o:24,d:2},{t:"n",o:26,d:2},{t:"n",o:28,d:4}]};
  var diff=null, overlayOpen=false, tapActive=false;
  var curTiles=null, curIsFirst=false, curBpm=80, exN=0;
  var VW=720,VH=132,LM=64,RM=18,SY=72,SLOTS=32,SW=(VW-LM-RM)/SLOTS,hr=6,WIN=0.17;
  var tapExp=[],tapSlots=[],tapJudged=[],tapHits=0,tapMusicStart=0,tapSix=0,tapSvg=null,tapTimer=null;
  function sx(o){return LM+(o+0.5)*SW;}
  function mk(svg,t,a){var e=document.createElementNS(NS,t);for(var k in a){e.setAttribute(k,String(a[k]));}svg.appendChild(e);return e;}
  function syl(d,o){if(d>=4){return "ta";}if(d===2){return "ti";}return ["ti","ka","ti","ka"][o%4];}
  function num(o){var b=(Math.floor(o/4)%4)+1;var p=o%4;return p===0?String(b):(p===1?"e":(p===2?"+":"a"));}
  function beams(tiles){
    var g=[],cur=[],i;
    function flush(){if(cur.length>1){g.push(cur);}cur=[];}
    for(i=0;i<tiles.length;i++){var t=tiles[i];if(t.t==="n"&&t.d<=2){var last=cur[cur.length-1];if(!last){cur=[t];}else if(Math.floor(t.o/4)===Math.floor(last.o/4)&&t.o===last.o+last.d){cur.push(t);}else{flush();cur=[t];}}else{flush();}}
    flush();
    var m={};g.forEach(function(gr){gr.forEach(function(t,j){m[t.o]={j:j,grp:gr};});});return m;
  }
  function restGlyph(svg,o,d){
    var x=sx(o+(d-1)/2);
    if(d>=16){mk(svg,"rect",{x:x-7,y:SY,width:14,height:4,fill:"#222"});}
    else if(d>=8){mk(svg,"rect",{x:x-7,y:SY-4,width:14,height:4,fill:"#222"});}
    else if(d>=4){mk(svg,"path",{d:"M "+(x+2)+" "+(SY-11)+" C "+(x-3)+" "+(SY-7)+" "+(x+3)+" "+(SY-3)+" "+(x-1)+" "+(SY+1)+" C "+(x+3)+" "+(SY+5)+" "+(x-3)+" "+(SY+9)+" "+(x+1)+" "+(SY+12),fill:"none",stroke:"#222","stroke-width":1.6});}
    else if(d>=2){mk(svg,"circle",{cx:x+2,cy:SY-8,r:1.8,fill:"#222"});mk(svg,"line",{x1:x+2,y1:SY-8,x2:x-2,y2:SY+4,stroke:"#222","stroke-width":1.6});}
    else{mk(svg,"circle",{cx:x+2,cy:SY-10,r:1.5,fill:"#222"});mk(svg,"line",{x1:x+2,y1:SY-10,x2:x-2,y2:SY+1,stroke:"#222","stroke-width":1.3});mk(svg,"circle",{cx:x+2,cy:SY-4,r:1.5,fill:"#222"});mk(svg,"line",{x1:x+2,y1:SY-4,x2:x-2,y2:SY+7,stroke:"#222","stroke-width":1.3});}
  }
  function draw(svg,tiles,aid){
    while(svg.firstChild){svg.removeChild(svg.firstChild);}
    svg.setAttribute("viewBox","0 0 "+VW+" "+VH);
    mk(svg,"rect",{x:0,y:0,width:VW,height:VH,fill:"#fff",rx:10});
    mk(svg,"line",{x1:LM-6,y1:SY,x2:VW-RM+5,y2:SY,stroke:"#222","stroke-width":1.5});
    mk(svg,"rect",{x:18,y:SY-18,width:4,height:36,fill:"#222",rx:1});
    mk(svg,"rect",{x:27,y:SY-18,width:4,height:36,fill:"#222",rx:1});
    var t1=mk(svg,"text",{x:46,y:SY-2,"font-size":20,"font-weight":"bold","text-anchor":"middle",fill:"#222","font-family":"serif"});t1.textContent="4";
    var t2=mk(svg,"text",{x:46,y:SY+18,"font-size":20,"font-weight":"bold","text-anchor":"middle",fill:"#222","font-family":"serif"});t2.textContent="4";
    var bm=beams(tiles),i;
    for(i=0;i<tiles.length;i++){
      var t=tiles[i];
      if(t.t==="r"){restGlyph(svg,t.o,t.d);continue;}
      var x=sx(t.o),open=t.d>=8,b=bm[t.o];
      if(t.d<16){var stx=x+hr*0.85;mk(svg,"line",{x1:stx,y1:SY-1,x2:stx,y2:SY-35,stroke:"#222","stroke-width":1.8});}
      mk(svg,"ellipse",{cx:x,cy:SY,rx:hr,ry:hr*0.72,fill:open?"none":"#222",stroke:"#222","stroke-width":open?2:0.5,transform:"rotate(-15 "+x+" "+SY+")"});
      if(t.d===3||t.d===6||t.d===12){mk(svg,"circle",{cx:x+hr+5,cy:SY-8,r:2.3,fill:"#222"});}
      if(!b){
        if(t.d===2){var f1=x+hr*0.85;mk(svg,"path",{d:"M"+f1+" "+(SY-35)+" q 8 4 6 13",fill:"none",stroke:"#222","stroke-width":1.8});}
        else if(t.d===1){var f2=x+hr*0.85;mk(svg,"path",{d:"M"+f2+" "+(SY-35)+" q 8 4 6 13",fill:"none",stroke:"#222","stroke-width":1.8});mk(svg,"path",{d:"M"+f2+" "+(SY-31)+" q 8 4 6 13",fill:"none",stroke:"#222","stroke-width":1.8});}
      }
    }
    var keys=Object.keys(bm).map(Number).sort(function(a,b){return a-b;});
    for(i=0;i<keys.length;i++){var o=keys[i],b2=bm[o],gr=b2.grp;if(b2.j===0&&gr.length>1){var x1=sx(gr[0].o)+hr*0.85,x2=sx(gr[gr.length-1].o)+hr*0.85;mk(svg,"rect",{x:x1,y:SY-35,width:Math.max(1,x2-x1),height:3,fill:"#222",rx:0.5});}}
    for(i=0;i<keys.length;i++){
      var o2=keys[i],b3=bm[o2],gr2=b3.grp,tile=gr2[b3.j];
      if(tile.d!==1){continue;}
      var X=sx(o2)+hr*0.85;
      var right=b3.j+1<gr2.length?gr2[b3.j+1]:null;
      var left=b3.j>0?gr2[b3.j-1]:null;
      if(right){var rx2=sx(right.o)+hr*0.85;mk(svg,"rect",{x:X,y:SY-31,width:Math.max(1,(right.d===1?rx2:X+SW*0.6)-X),height:3,fill:"#222",rx:0.5});}
      if(left&&left.d!==1){mk(svg,"rect",{x:X-SW*0.6,y:SY-31,width:Math.max(1,SW*0.6),height:3,fill:"#222",rx:0.5});}
    }
    mk(svg,"line",{x1:sx(16)-SW*0.5,y1:SY-28,x2:sx(16)-SW*0.5,y2:SY+18,stroke:"#222","stroke-width":1.5});
    var fx=LM+32*SW;mk(svg,"line",{x1:fx-4,y1:SY-28,x2:fx-4,y2:SY+18,stroke:"#222","stroke-width":1.5});mk(svg,"line",{x1:fx,y1:SY-28,x2:fx,y2:SY+18,stroke:"#222","stroke-width":2.5});
    if(aid!=="none"){
      for(i=0;i<tiles.length;i++){var u=tiles[i];if(u.t!=="n"){continue;}var lab=aid==="syl"?syl(u.d,u.o):num(u.o);var tx=mk(svg,"text",{x:sx(u.o),y:SY+34,"font-size":14,"font-weight":800,"text-anchor":"middle",fill:"#1d4ed8","font-family":"system-ui,sans-serif"});tx.textContent=lab;}
    }
    mk(svg,"g",{id:"ob-marks"});
    mk(svg,"line",{id:"ob-ph",x1:LM,x2:LM,y1:SY-32,y2:SY+18,stroke:"#e11d48","stroke-width":2,opacity:0});
  }
  function clearMarks(svg){var g=svg.querySelector("#ob-marks");if(!g){return;}while(g.firstChild){g.removeChild(g.firstChild);}}
  function markHit(svg,o){var g=svg.querySelector("#ob-marks");if(!g){return;}var t=mk(g,"text",{x:sx(o),y:SY-44,"font-size":18,"font-weight":"900","text-anchor":"middle",fill:"#16a34a"});t.textContent=CHK;}
  function markMiss(svg,o){var g=svg.querySelector("#ob-marks");if(!g){return;}var t=mk(g,"text",{x:sx(o),y:SY-44,"font-size":17,"font-weight":"900","text-anchor":"middle",fill:"#dc2626"});t.textContent=CRS;}
  function markMissX(svg,x){var g=svg.querySelector("#ob-marks");if(!g){return;}var t=mk(g,"text",{x:x,y:SY-44,"font-size":16,"font-weight":"900","text-anchor":"middle",fill:"#dc2626",opacity:0.55});t.textContent=CRS;}
  function ac(){var AC=window.AudioContext||window.webkitAudioContext;if(!AC){return null;}ac._c=ac._c||new AC();if(ac._c.state==="suspended"){ac._c.resume();}return ac._c;}
  function clk(a,t,f,v){var o=a.createOscillator(),g=a.createGain();o.type="sine";o.frequency.value=f;g.gain.setValueAtTime(0.0001,t);g.gain.exponentialRampToValueAtTime(v,t+0.004);g.gain.exponentialRampToValueAtTime(0.0001,t+0.09);o.connect(g).connect(a.destination);o.start(t);o.stop(t+0.11);}
  function showNum(c,txt,tapMode){var n=c.querySelector("#ob-num");if(!n){n=document.createElement("div");n.id="ob-num";c.appendChild(n);}n.textContent=txt||"";if(txt){n.style.display="flex";n.className=tapMode?"tap":"";n.style.animation="none";void n.offsetWidth;n.style.animation="";}else{n.style.display="none";}}
  function sweep(svg,perfStart,six,dur){var ph=svg.querySelector("#ob-ph");if(!ph){return;}(function f(){var el=performance.now()-perfStart;if(el<0){requestAnimationFrame(f);return;}var s=el/(six*1000);if(s>=dur){ph.setAttribute("opacity","0");return;}ph.setAttribute("opacity","0.9");var x=LM+s*SW;ph.setAttribute("x1",x);ph.setAttribute("x2",x);requestAnimationFrame(f);})();}
  function hear(svg,tiles,bpm,onDone){
    var a=ac();if(!a){if(onDone){onDone();}return;}
    var six=60/bpm/4,beat=60/bpm,cs=a.currentTime+0.12,ms=cs+4*beat,i,staff=svg.parentNode;
    for(i=0;i<4;i++){(function(k){var bt=cs+k*beat;clk(a,bt,k===0?1320:990,0.5);setTimeout(function(){showNum(staff,String(k+1));},Math.max(0,(bt-a.currentTime)*1000));})(i);}
    for(i=0;i<tiles.length;i++){var t=tiles[i];if(t.t==="n"){clk(a,ms+t.o*six,1500,0.34);}}
    for(i=0;i<8;i++){(function(k){var bt=ms+k*beat;clk(a,bt,k%4===0?1100:880,0.11);})(i);}
    setTimeout(function(){showNum(staff,"");},Math.max(0,(ms-a.currentTime)*1000));
    sweep(svg,performance.now()+(ms-a.currentTime)*1000,six,32);
    setTimeout(function(){if(onDone){onDone();}},(ms+32*six-a.currentTime)*1000+120);
  }
  function registerTap(t){
    if(!tapActive){return;}
    var best=-1,bd=1e9,i;
    for(i=0;i<tapExp.length;i++){if(tapJudged[i]){continue;}var d=Math.abs(tapExp[i]-t);if(d<bd){bd=d;best=i;}}
    if(best>=0&&bd<WIN){tapJudged[best]=true;tapHits++;markHit(tapSvg,tapSlots[best]);}
    else{var slot=Math.round((t-tapMusicStart)/tapSix);if(slot<0){slot=0;}if(slot>31){slot=31;}markMissX(tapSvg,sx(slot));}
  }
  function beginTap(svg,tiles,bpm,onDone){
    var a=ac();if(!a){onDone(false,0,tiles.filter(function(t){return t.t==="n";}).length);return;}
    tapSvg=svg;tapHits=0;tapSix=60/bpm/4;var beat=60/bpm,cs=a.currentTime+0.12;tapMusicStart=cs+4*beat;
    tapExp=[];tapSlots=[];tapJudged=[];
    var notes=tiles.filter(function(t){return t.t==="n";});
    notes.forEach(function(t){tapExp.push(tapMusicStart+t.o*tapSix);tapSlots.push(t.o);tapJudged.push(false);});
    var staff=svg.parentNode,i;
    for(i=0;i<4;i++){(function(k){var bt=cs+k*beat;clk(a,bt,k===0?1320:990,0.5);setTimeout(function(){showNum(staff,String(k+1));},Math.max(0,(bt-a.currentTime)*1000));})(i);}
    for(i=0;i<8;i++){(function(k){var bt=tapMusicStart+k*beat;clk(a,bt,k%4===0?1100:880,0.3);})(i);}
    setTimeout(function(){showNum(staff,"TAP",true);},Math.max(0,(tapMusicStart-a.currentTime)*1000));
    tapActive=true;
    sweep(svg,performance.now()+(tapMusicStart-a.currentTime)*1000,tapSix,32);
    var endMs=(tapMusicStart+32*tapSix+0.3-a.currentTime)*1000;
    tapTimer=setTimeout(function(){
      tapActive=false;showNum(staff,"");
      for(var j=0;j<tapExp.length;j++){if(!tapJudged[j]){markMiss(svg,notes[j].o);}}
      onDone(tapHits>=Math.ceil(notes.length*0.8),tapHits,notes.length);
    },endMs);
  }
  function setBpm(b){try{var a=$("[data-metro-bpm-input]"),r=$("[data-metro-tempo]");if(a){a.value=b;a.dispatchEvent(new Event("input",{bubbles:true}));}if(r){r.value=b;r.dispatchEvent(new Event("input",{bubbles:true}));}}catch(e){}}
  function randBar(diff){
    var noteDurs=diff==="hard"?[1,1,2,2,4,4,8]:[2,2,4,4,8];
    var restDurs=[2,4,8];
    var tiles=[],pos=0,tries=0;
    while(pos<16){
      var rem=16-pos;
      var wantRest=tiles.length>0?Math.random()<0.18:Math.random()<0.10;
      var pool=(wantRest?restDurs:noteDurs).filter(function(d){return d<=rem;});
      var tt,dd;
      if(pool.length===0){tt="n";dd=1;}
      else{dd=pool[Math.floor(Math.random()*pool.length)];tt=wantRest?"r":"n";}
      tiles.push({t:tt,o:pos,d:dd});pos+=dd;
    }
    var hasNote=tiles.some(function(t){return t.t==="n";});
    if(!hasNote&&tries<8){return randBar(diff);}
    return tiles;
  }
  function genTiles(diff){var a=randBar(diff);var b=randBar(diff).map(function(t){return {t:t.t,o:t.o+16,d:t.d};});return a.concat(b);}
  var CSS="#ob-root{position:fixed;inset:0;z-index:99999;display:flex;align-items:center;justify-content:center;padding:20px;overflow:auto;background:radial-gradient(900px 500px at 15% 10%,rgba(96,165,250,.18),transparent 60%),radial-gradient(800px 460px at 85% 90%,rgba(232,168,62,.16),transparent 60%),rgba(11,16,23,.66);backdrop-filter:blur(3px);font-family:system-ui,-apple-system,sans-serif}#ob-root *{box-sizing:border-box}#ob-card{position:relative;width:min(660px,94vw);background:var(--praxis-surface,#fff);color:var(--praxis-ink,#111827);border:1px solid var(--praxis-line,#d8dee7);border-radius:20px;box-shadow:0 30px 80px rgba(15,23,42,.45);padding:30px clamp(20px,4vw,40px);overflow:hidden;animation:obpop .3s ease both}#ob-card::before{content:'';position:absolute;left:0;right:0;top:0;height:3px;background:linear-gradient(90deg,var(--praxis-accent,#1d4ed8),#7c3aed)}@keyframes obpop{from{opacity:0;transform:translateY(10px) scale(.98)}to{opacity:1;transform:none}}#ob-eyebrow{font-size:11px;font-weight:900;letter-spacing:.16em;text-transform:uppercase;color:var(--praxis-gold,#e8a83e)}#ob-q{margin:12px 0 6px;font-size:clamp(26px,5vw,42px);line-height:1.03;letter-spacing:-.03em;font-weight:900}#ob-sub{margin:0 0 22px;color:var(--praxis-muted,#5b6472);font-size:15px;line-height:1.6;max-width:48ch}#ob-btns{display:flex;flex-wrap:wrap;gap:12px}#ob-btns button{flex:1 1 220px;min-height:64px;border-radius:14px;border:1px solid var(--praxis-line,#d8dee7);background:var(--praxis-surface,#fff);color:var(--praxis-ink,#111827);font:inherit;font-weight:800;font-size:15px;cursor:pointer;text-align:left;padding:14px 17px;transition:transform .15s,box-shadow .15s,border-color .15s}#ob-btns button small{display:block;font-weight:600;font-size:12px;color:var(--praxis-muted,#5b6472);margin-top:4px}#ob-btns button:hover{transform:translateY(-2px);border-color:var(--praxis-accent,#1d4ed8);box-shadow:0 10px 26px rgba(29,78,216,.18)}#ob-btns .yes{background:linear-gradient(135deg,var(--praxis-accent,#1d4ed8),#7c3aed);border-color:transparent;color:#fff}#ob-btns .yes small{color:rgba(255,255,255,.82)}#ob-head{display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap;margin-bottom:12px}#ob-tag{font-size:12px;font-weight:800;letter-spacing:.05em;padding:4px 12px;border-radius:999px;border:1px solid var(--praxis-line,#d8dee7)}#ob-tag.easy{color:var(--praxis-accent,#1d4ed8);border-color:var(--praxis-accent,#1d4ed8)}#ob-tag.hard{color:var(--praxis-gold,#e8a83e);border-color:var(--praxis-gold,#e8a83e)}#ob-aids{display:flex;gap:6px}#ob-aids button{border:1px solid var(--praxis-line,#d8dee7);background:var(--praxis-surface,#fff);color:var(--praxis-muted,#5b6472);border-radius:8px;padding:6px 11px;font:inherit;font-size:12px;font-weight:700;cursor:pointer;transition:background .15s,color .15s}#ob-aids button.on{background:var(--praxis-accent,#1d4ed8);color:#fff;border-color:var(--praxis-accent,#1d4ed8)}#ob-staff{position:relative;border:1px solid var(--praxis-line,#d8dee7);border-radius:14px;overflow:hidden;background:#fff}#ob-staff svg{display:block;width:100%;height:auto}#ob-num{position:absolute;inset:0;display:none;align-items:center;justify-content:center;font-size:64px;font-weight:900;color:var(--praxis-accent,#1d4ed8);pointer-events:none;text-shadow:0 2px 14px rgba(255,255,255,.75);animation:obpulse .4s ease}#ob-num.tap{color:var(--praxis-gold,#e8a83e);font-size:24px;letter-spacing:.2em}@keyframes obpulse{from{transform:scale(.6);opacity:0}to{transform:scale(1);opacity:1}}#ob-foot{display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin-top:16px}#ob-foot button{border:1px solid var(--praxis-line,#d8dee7);background:var(--praxis-surface,#fff);color:var(--praxis-ink,#111827);border-radius:11px;padding:11px 16px;font:inherit;font-weight:800;cursor:pointer;transition:transform .14s,box-shadow .14s}#ob-foot button:hover{transform:translateY(-1px);box-shadow:0 6px 16px rgba(15,23,42,.12)}#ob-foot button.primary{background:linear-gradient(135deg,var(--praxis-accent,#1d4ed8),#7c3aed);color:#fff;border-color:transparent}#ob-foot button.ghost{background:transparent;color:var(--praxis-muted,#5b6472);border-color:transparent;text-decoration:underline}#ob-pad{flex:1 1 100%;min-height:76px;display:flex;align-items:center;justify-content:center;text-align:center;border:2px dashed var(--praxis-accent,#1d4ed8);border-radius:14px;background:color-mix(in srgb,var(--praxis-accent,#1d4ed8) 9%,transparent);color:var(--praxis-accent,#1d4ed8);font-weight:800;font-size:15px;cursor:pointer;user-select:none;touch-action:manipulation;transition:background .12s}#ob-pad:active{background:var(--praxis-accent,#1d4ed8);color:#fff}#ob-result{flex:1 1 100%;font-weight:800;font-size:15px}#ob-result .ok{color:#16a34a}#ob-result .no{color:#dc2626}#ob-hl{position:fixed;border-radius:12px;border:2px solid var(--praxis-accent,#1d4ed8);box-shadow:0 0 0 9999px rgba(11,16,23,.78);pointer-events:none;z-index:100000;transition:all .25s ease}#ob-tip{position:fixed;z-index:100001;width:min(330px,86vw);background:var(--praxis-surface,#fff);color:var(--praxis-ink,#111827);border:1px solid var(--praxis-line,#d8dee7);border-radius:14px;box-shadow:0 18px 50px rgba(15,23,42,.35);padding:16px 18px}#ob-tip h4{margin:0 0 6px;font-size:15px;font-weight:900}#ob-tip p{margin:0 0 12px;color:var(--praxis-muted,#5b6472);font-size:13px;line-height:1.55}#ob-tip .row{display:flex;align-items:center;gap:8px;justify-content:space-between}#ob-tip .step{font-size:11px;font-weight:800;color:var(--praxis-gold,#e8a83e);letter-spacing:.1em}#ob-tip button{border:1px solid var(--praxis-line,#d8dee7);background:var(--praxis-surface,#fff);border-radius:9px;padding:7px 12px;font:inherit;font-weight:800;font-size:12px;cursor:pointer}#ob-tip button.primary{background:linear-gradient(135deg,var(--praxis-accent,#1d4ed8),#7c3aed);color:#fff;border-color:transparent}#ob-tip a{color:var(--praxis-accent,#1d4ed8);font-weight:800}.topbar{z-index:100002 !important}.nav-menu{z-index:100003 !important}.metronome--top{z-index:100002 !important}.dock{z-index:100002 !important}";
  function injectCSS(){if($("#ob-css")){return;}var s=document.createElement("style");s.id="ob-css";s.textContent=CSS;document.head.appendChild(s);}
  function root(){var r=$("#ob-root");if(!r){r=document.createElement("div");r.id="ob-root";document.body.appendChild(r);}return r;}
  function clearSpot(){var a=$("#ob-hl");if(a){a.remove();}var b=$("#ob-tip");if(b){b.remove();}}
  function setScrim(on){var r=root();r.style.background=on?"":"transparent";r.style.backdropFilter=on?"":"none";}
  function foot(html){var f=$("#ob-foot");if(f){f.innerHTML=html;}}
  function hideChrome(on){var e=$("#drill-frame");if(e){e.style.display=on?"none":"";}}
  function curAid(){var on=document.querySelector("#ob-aids button.on");return on?on.getAttribute("data-aid"):"syl";}
  function setHead(isFirst){
    var tag=$("#ob-tag");tag.className=diff;
    tag.textContent=diff==="hard"?("Reading rhythms "+EMD+" sixteenths"):("New to rhythms "+EMD+" eighths and quarters");
    var eb=$("#ob-eyebrow");
    eb.textContent=isFirst?("Your first rhythm "+EMD+" hear it, then tap it back"):("Practice "+(exN>0?"#"+exN+" ":"")+EMD+" hear it, then tap it back");
  }
  function bindAid(){
    $$("#ob-aids button").forEach(function(b){
      b.addEventListener("click",function(){
        $$("#ob-aids button").forEach(function(x){x.classList.remove("on");});
        b.classList.add("on");
        draw($("#ob-svg"),curTiles,b.getAttribute("data-aid"));
      });
    });
  }
  var gateHTML='<div id="ob-card"><div id="ob-eyebrow">Rhythm Reader '+EMD+' Free Play</div><h1 id="ob-q">Are you new to reading rhythms?</h1><p id="ob-sub">Pick a starting point. This appears every time you open the page.</p><div id="ob-btns"><button class="no" data-pick="easy">No '+EMD+' I'+APO+'m new to this<small>Quarters and eighths at a gentle tempo, plus a quick tour of the controls.</small></button><button class="yes" data-pick="hard">Yes '+EMD+' I'+APO+'ve read rhythms<small>Sixteenth-note patterns at 100 BPM, straight into it.</small></button></div></div>';
  function showGate(){
    clearSpot();hideChrome(true);setScrim(true);overlayOpen=true;
    var r=root();r.style.display="flex";r.innerHTML=gateHTML;
    $$("[data-pick]").forEach(function(b){
      b.addEventListener("click",function(){
        diff=b.getAttribute("data-pick");
        if(diff==="easy"){showWalk(startFirst);}else{startFirst();}
      });
    });
  }
  var WALK=[
    {sel:"[data-metro-toggle]",h:"Play / pause",p:"Starts the metronome and the exercise. The click is your pulse "+EMD+" every note lines up to it."},
    {sel:"[data-listen]",h:"Listen",p:"Plays the rhythm for you first with a 1-2-3-4 count-in, so you can hear it before you tap."},
    {sel:"[data-metro-gear]",h:"Settings (gear)",p:"Turn on the counting aid (ta / ti or numbers) and the draw layer. The aid writes the count under each note."},
    {sel:".stage, #drill-frame",h:"The stage",p:"Notation lives here. Tap the rhythm on the beat "+EMD+" a green "+CHK+" when you are with it, a red "+CRS+" when you drift."}
  ];
  var walkI=0,walkDone=null;
  function placeTip(rect){var tip=$("#ob-tip");if(!tip){return;}var below=rect.bottom+14;if(below+180>window.innerHeight){below=rect.top-14-tip.offsetHeight;}var left=rect.left;if(left+tip.offsetWidth>window.innerWidth-10){left=window.innerWidth-10-tip.offsetWidth;}if(left<10){left=10;}tip.style.top=Math.max(10,below)+"px";tip.style.left=left+"px";}
  function showWalkStep(){
    var step=WALK[walkI];var el=step.sel?$(step.sel):null;var hl=$("#ob-hl"),tip=$("#ob-tip");
    if(el){var rc=el.getBoundingClientRect();if(!hl){hl=document.createElement("div");hl.id="ob-hl";document.body.appendChild(hl);}hl.style.display="block";hl.style.left=(rc.left-6)+"px";hl.style.top=(rc.top-6)+"px";hl.style.width=(rc.width+12)+"px";hl.style.height=(rc.height+12)+"px";}else if(hl){hl.style.display="none";}
    if(!tip){tip=document.createElement("div");tip.id="ob-tip";document.body.appendChild(tip);}
    var last=walkI===WALK.length-1;
    var extra=last?'<p style="margin-top:4px">For the thinking and references behind this, see the <a href="./index.html">Resources / Gallery page</a>.</p>':"";
    tip.innerHTML='<div class="step">QUICK TOUR  '+(walkI+1)+' / '+WALK.length+'</div><h4>'+step.h+'</h4><p>'+step.p+extra+'</p><div class="row"><button id="ob-wback"'+(walkI===0?' style="visibility:hidden"':'')+'>Back</button><button id="ob-wnext" class="primary">'+(last?("Begin "+ARR):("Next "+ARR))+'</button></div>';
    tip.style.transform="";
    if(el){placeTip(el.getBoundingClientRect());}else{tip.style.left="50%";tip.style.top="50%";tip.style.transform="translate(-50%,-50%)";}
    var nb=$("#ob-wnext"),bb=$("#ob-wback");
    if(nb){nb.addEventListener("click",function(){if(last){clearSpot();walkDone();}else{walkI++;showWalkStep();}});}
    if(bb){bb.addEventListener("click",function(){if(walkI>0){walkI--;showWalkStep();}});}
  }
  function showWalk(done){clearSpot();hideChrome(false);setScrim(false);overlayOpen=true;walkDone=done;walkI=0;var r=root();r.style.display="flex";r.innerHTML="";showWalkStep();}
  function startFirst(){loadExercise(diff==="hard"?HARD.tiles:EASY.tiles,true);}
  var exHTML='<div id="ob-card"><div id="ob-head"><span id="ob-tag"></span><div id="ob-aids"><button data-aid="none">None</button><button data-aid="syl" class="on">Ta / ti</button><button data-aid="num">Numbers</button></div></div><div id="ob-eyebrow"></div><div id="ob-staff"><svg id="ob-svg" viewBox="0 0 '+VW+' '+VH+'" role="img" aria-label="rhythm"></svg></div><div id="ob-foot"></div></div>';
  function loadExercise(tiles,isFirst){
    curTiles=tiles;curIsFirst=isFirst;curBpm=diff==="hard"?100:80;
    if(!isFirst){exN++;}
    clearSpot();hideChrome(true);setScrim(true);overlayOpen=true;
    var r=root();r.style.display="flex";r.innerHTML=exHTML;
    var svg=$("#ob-svg");draw(svg,tiles,curAid());setBpm(curBpm);setHead(isFirst);bindAid();stateP1();
  }
  function stateP1(){
    var svg=$("#ob-svg");
    foot('<button id="ob-hear">'+PLAY+' Hear this rhythm</button><button id="ob-tap" class="primary">'+HAND+' Tap it back</button><button id="ob-change" class="ghost">change level</button>');
    $("#ob-hear").addEventListener("click",function(){draw(svg,curTiles,curAid());hear(svg,curTiles,curBpm,function(){});});
    $("#ob-tap").addEventListener("click",stateP2);
    $("#ob-change").addEventListener("click",showGate);
  }
  function stateP2(){
    var svg=$("#ob-svg");clearMarks(svg);
    foot('<div id="ob-pad" data-tappad>Tap here, or press Space, on the beat</div>');
    try{if(document.activeElement&&document.activeElement.blur){document.activeElement.blur();}}catch(e){}
    beginTap(svg,curTiles,curBpm,function(pass,hits,n){stateP3(pass,hits,n);});
  }
  function stateP3(pass,hits,n){
    var svg=$("#ob-svg");
    var cls=pass?"ok":"no";
    var msg=pass?("Nice - "+hits+" / "+n+" on the beat."):("Almost - "+hits+" / "+n+". Give it another go.");
    var html='<div id="ob-result"><span class="'+cls+'">'+(pass?CHK+" ":CRS+" ")+'</span>'+msg+'</div>';
    if(pass){html+='<button id="ob-go" class="primary">'+(curIsFirst?("Continue to practice "+ARR):("Next exercise "+ARR))+'</button><button id="ob-try" class="ghost">Try again</button>';}
    else{html+='<button id="ob-try" class="primary">Try again</button><button id="ob-skip" class="ghost">skip to practice</button>';}
    html+='<button id="ob-hear3" class="ghost">hear again</button>';
    foot(html);
    if($("#ob-go")){$("#ob-go").addEventListener("click",function(){loadExercise(genTiles(diff),false);});}
    if($("#ob-skip")){$("#ob-skip").addEventListener("click",function(){loadExercise(genTiles(diff),false);});}
    if($("#ob-try")){$("#ob-try").addEventListener("click",function(){clearMarks(svg);stateP2();});}
    if($("#ob-hear3")){$("#ob-hear3").addEventListener("click",function(){draw(svg,curTiles,curAid());hear(svg,curTiles,curBpm,function(){stateP2();});});}
  }
  injectCSS();
  try{localStorage.removeItem("rr_difficulty");}catch(e){}
  document.addEventListener("pointerdown",function(e){
    if(!overlayOpen||!tapActive){return;}
    var pad=e.target&&e.target.closest?e.target.closest("[data-tappad]"):null;
    if(!pad){return;}
    e.preventDefault();var a=ac();registerTap(a?a.currentTime:0);
  },true);
  document.addEventListener("keydown",function(e){
    if(overlayOpen&&tapActive&&(e.code==="Space"||e.key===" ")){e.preventDefault();e.stopPropagation();var a=ac();registerTap(a?a.currentTime:0);}
  },true);
  window.addEventListener("resize",function(){if($("#ob-tip")&&WALK[walkI]){var el=WALK[walkI].sel?$(WALK[walkI].sel):null;if(el){placeTip(el.getBoundingClientRect());}}});
  showGate();
})();
