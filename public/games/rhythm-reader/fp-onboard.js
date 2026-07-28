
(function(){
  var $=function(s){return document.querySelector(s);};
  var $$=function(s){return Array.prototype.slice.call(document.querySelectorAll(s));};
  var NS="http://www.w3.org/2000/svg";
  var CHK="\u2713", CRS="\u2717", ARR="\u2192", PLAY="\u25B6", HAND="\u270B";
  var EASY={bpm:80,tiles:[{t:"n",o:0,d:4},{t:"n",o:4,d:4},{t:"n",o:8,d:2},{t:"n",o:10,d:2},{t:"n",o:12,d:4},{t:"n",o:16,d:4},{t:"n",o:20,d:4},{t:"n",o:24,d:2},{t:"n",o:26,d:2},{t:"n",o:28,d:4}]};
  var HARD={bpm:90,tiles:[{t:"n",o:0,d:6},{t:"n",o:6,d:2},{t:"n",o:8,d:2},{t:"n",o:10,d:2},{t:"n",o:12,d:4},{t:"r",o:16,d:4},{t:"n",o:20,d:1},{t:"n",o:21,d:1},{t:"n",o:22,d:1},{t:"n",o:23,d:1},{t:"n",o:24,d:2},{t:"n",o:26,d:2},{t:"n",o:28,d:4}]};
  var diff=null, overlayOpen=false, phase="start", resultPass=false, playing=false;
  var curTiles=null, box=null, svg=null;
  var VW=720,VH=132,LM=64,RM=18,SY=72,SLOTS=32,SW=(VW-LM-RM)/SLOTS,hr=6,WIN=0.17;
  var tapActive=false, tapExp=[], tapSlots=[], tapJudged=[], tapNotes=[], tapHits=0, tapMusicStart=0, tapSix=0, tapSvg=null, tapTimer=null;
  var playBtn=null, listenBtn=null, drawBtn=null, aidSeg=null, gearBtn=null;
  var walkI=0, walkDone=null;
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
      for(i=0;i<tiles.length;i++){var u=tiles[i];if(u.t!=="n"){continue;}var lab=aid==="syl"?syl(u.d,u.o):num(u.o);var tx=mk(svg,"text",{x:sx(u.o),y:SY+34,"font-size":14,"font-weight":"800","text-anchor":"middle",fill:"#1d4ed8","font-family":"system-ui,sans-serif"});tx.textContent=lab;}
    }
    mk(svg,"g",{id:"ob-marks"});
    mk(svg,"line",{id:"ob-ph",x1:LM,x2:LM,y1:SY-32,y2:SY+18,stroke:"#e11d48","stroke-width":2,opacity:0});
  }
  function clearMarks(s){var g=s.querySelector("#ob-marks");if(!g){return;}while(g.firstChild){g.removeChild(g.firstChild);}}
  function markHit(s,o){var g=s.querySelector("#ob-marks");if(!g){return;}var t=mk(g,"text",{x:sx(o),y:SY-44,"font-size":18,"font-weight":"900","text-anchor":"middle",fill:"#16a34a"});t.textContent=CHK;}
  function markMiss(s,o){var g=s.querySelector("#ob-marks");if(!g){return;}var t=mk(g,"text",{x:sx(o),y:SY-44,"font-size":17,"font-weight":"900","text-anchor":"middle",fill:"#dc2626"});t.textContent=CRS;}
  function markMissX(s,x){var g=s.querySelector("#ob-marks");if(!g){return;}var t=mk(g,"text",{x:x,y:SY-44,"font-size":16,"font-weight":"900","text-anchor":"middle",fill:"#dc2626",opacity:0.55});t.textContent=CRS;}
  function ac(){var AC=window.AudioContext||window.webkitAudioContext;if(!AC){return null;}ac._c=ac._c||new AC();if(ac._c.state==="suspended"){ac._c.resume();}return ac._c;}
  function clk(a,t,f,v){var o=a.createOscillator(),g=a.createGain();o.type="sine";o.frequency.value=f;g.gain.setValueAtTime(0.0001,t);g.gain.exponentialRampToValueAtTime(v,t+0.004);g.gain.exponentialRampToValueAtTime(0.0001,t+0.09);o.connect(g).connect(a.destination);o.start(t);o.stop(t+0.11);}
  function sweep(s,perfStart,six,dur){var ph=s.querySelector("#ob-ph");if(!ph){return;}(function f(){var el=performance.now()-perfStart;if(el<0){requestAnimationFrame(f);return;}var v=el/(six*1000);if(v>=dur){ph.setAttribute("opacity","0");return;}ph.setAttribute("opacity","0.9");var x=LM+v*SW;ph.setAttribute("x1",x);ph.setAttribute("x2",x);requestAnimationFrame(f);})();}
  function setBox(b,small,big,tap){b.className="ob-box"+(tap?" tap":"");b.innerHTML='<div class="ob-small">'+small+'</div>'+(big?('<div class="ob-big">'+big+'</div>'):"");}
  function okAt(o,d){return o%d===0 && o+d<=16 && (d===16 || !(o<8 && o+d>8));}
  function randBar(dff){
    var noteSet=dff==="hard"?[1,2,4,6,8,16]:[2,4,8,16];
    var restSet=dff==="hard"?[2,4,8,16]:[2,4,8,16];
    var tiles=[],pos=0,guard=0;
    while(pos<16 && guard<80){guard++;
      var rem=16-pos;
      var wantRest=tiles.length>0?Math.random()<0.16:Math.random()<0.08;
      var set=wantRest?restSet:noteSet;
      var allowed=[],i;
      for(i=0;i<set.length;i++){var d=set[i];if(d<=rem && okAt(pos,d)){allowed.push(d);}}
      var dd,useRest=wantRest;
      if(allowed.length===0){var fb=0;for(i=0;i<noteSet.length;i++){if(noteSet[i]<=rem && okAt(pos,noteSet[i]) && noteSet[i]>fb){fb=noteSet[i];}}dd=fb||1;useRest=false;}
      else{dd=allowed[Math.floor(Math.random()*allowed.length)];}
      tiles.push({t:useRest?"r":"n",o:pos,d:dd});pos+=dd;
    }
    if(pos<16){tiles.push({t:"n",o:pos,d:16-pos});}
    if(!tiles.some(function(t){return t.t==="n";})){return randBar(dff);}
    return tiles;
  }
  function genTiles(dff){var a=randBar(dff);var b=randBar(dff).map(function(t){return {t:t.t,o:t.o+16,d:t.d};});return a.concat(b);}
  function playListen(b,s,tiles,bpm,done){
    playing=true;var a=ac();if(!a){playing=false;done();return;}
    var six=60/bpm/4,beat=60/bpm,cs=a.currentTime+0.12,i;
    for(i=0;i<4;i++){(function(k){var bt=cs+k*beat;clk(a,bt,k===0?1320:990,0.5);setTimeout(function(){setBox(b,"Get ready",String(k+1));},Math.max(0,(bt-a.currentTime)*1000));})(i);}
    var ms=cs+4*beat;
    setTimeout(function(){setBox(b,"Listen","");},Math.max(0,(ms-a.currentTime)*1000));
    for(i=0;i<tiles.length;i++){var t=tiles[i];if(t.t==="n"){clk(a,ms+t.o*six,1500,0.34);}}
    for(i=0;i<8;i++){(function(k){var bt=ms+k*beat;clk(a,bt,k%4===0?1100:880,0.11);})(i);}
    sweep(s,performance.now()+(ms-a.currentTime)*1000,six,32);
    setTimeout(function(){playing=false;done();},(ms+32*six-a.currentTime)*1000+120);
  }
  function enterTap(b,s,tiles,bpm,done){
    playing=true;var a=ac();var notes=tiles.filter(function(t){return t.t==="n";});
    if(!a){playing=false;done(false,0,notes.length);return;}
    tapSvg=s;tapHits=0;tapSix=60/bpm/4;var beat=60/bpm,cs=a.currentTime+0.12;
    tapMusicStart=cs+4*beat;tapExp=[];tapSlots=[];tapJudged=[];tapNotes=notes;
    notes.forEach(function(t){tapExp.push(tapMusicStart+t.o*tapSix);tapSlots.push(t.o);tapJudged.push(false);});
    var i;
    for(i=0;i<4;i++){(function(k){var bt=cs+k*beat;clk(a,bt,k===0?1320:990,0.5);setTimeout(function(){setBox(b,"Now you",String(k+1));},Math.max(0,(bt-a.currentTime)*1000));})(i);}
    setTimeout(function(){setBox(b,"TAP","",true);tapActive=true;},Math.max(0,(tapMusicStart-a.currentTime)*1000));
    for(i=0;i<8;i++){(function(k){var bt=tapMusicStart+k*beat;clk(a,bt,k%4===0?1100:880,0.3);})(i);}
    sweep(s,performance.now()+(tapMusicStart-a.currentTime)*1000,tapSix,32);
    tapTimer=setTimeout(function(){
      tapActive=false;playing=false;
      for(var j=0;j<tapExp.length;j++){if(!tapJudged[j]){markMiss(s,tapNotes[j].o);}}
      done(tapHits>=Math.ceil(tapNotes.length*0.8),tapHits,tapNotes.length);
    },(tapMusicStart+32*tapSix+0.3-a.currentTime)*1000);
  }
  function registerTap(t){
    if(!tapActive){return;}
    var best=-1,bd=1e9,i;
    for(i=0;i<tapExp.length;i++){if(tapJudged[i]){continue;}var d=Math.abs(tapExp[i]-t);if(d<bd){bd=d;best=i;}}
    if(best>=0&&bd<WIN){tapJudged[best]=true;tapHits++;markHit(tapSvg,tapSlots[best]);}
    else{var slot=Math.round((t-tapMusicStart)/tapSix);if(slot<0){slot=0;}if(slot>31){slot=31;}markMissX(tapSvg,sx(slot));}
  }
  function curBpm(){var inp=document.querySelector("[data-metro-bpm-input]");var v=inp?parseInt(inp.value,10):NaN;if(!isFinite(v)||v<20||v>300){v=diff==="hard"?90:80;}return v;}
  function setBpm(b){try{var a=document.querySelector("[data-metro-bpm-input]"),r=document.querySelector("[data-metro-tempo]");if(a){a.value=b;a.dispatchEvent(new Event("input",{bubbles:true}));}if(r){r.value=b;r.dispatchEvent(new Event("input",{bubbles:true}));}}catch(e){}}
  function aidButtons(){var scope=document.querySelector(".metronome--top")||document.querySelector(".dock")||document;var bs=Array.prototype.slice.call(scope.querySelectorAll("button"));return bs.filter(function(b){var t=(b.textContent||"").trim();return /^(none|ta\s*\/\s*ti|1\s*\+?)$/i.test(t);});}
  function aidModeOf(b){var t=(b.textContent||"").trim();if(/none/i.test(t)){return "none";}if(/ta|ti/i.test(t)){return "syl";}return "num";}
  function readToolbarAid(){var bs=aidButtons();var act=null,i;for(i=0;i<bs.length;i++){if(bs[i].classList.contains("on")||bs[i].classList.contains("selected")||bs[i].getAttribute("aria-pressed")==="true"){act=bs[i];break;}}if(!act&&bs.length){for(i=0;i<bs.length;i++){if(/ta|ti/i.test(bs[i].textContent)){act=bs[i];break;}}}return act?aidModeOf(act):"syl";}
  function setToolbarAid(mode){var bs=aidButtons(),i;for(i=0;i<bs.length;i++){if(aidModeOf(bs[i])===mode){if(!bs[i].classList.contains("on")){bs[i].click();}return;}}}
  function attachAidListeners(){aidButtons().forEach(function(b){b.addEventListener("click",redrawCur);});}
  function redrawCur(){if(!curTiles||!svg){return;}draw(svg,curTiles,readToolbarAid());}
  function ensureWrap(){
    if(box&&svg){return;}
    var stage=document.querySelector(".stage");
    var wrap=document.createElement("div");wrap.id="ob-exwrap";
    wrap.innerHTML='<h1 class="ob-exh">Tap the rhythm</h1><svg id="ob-exsvg" viewBox="0 0 720 132" role="img" aria-label="rhythm"></svg><div class="ob-box" id="ob-exbox"></div><button class="ob-chg" id="ob-chg">change level</button>';
    if(stage){stage.appendChild(wrap);}else{wrap.style.position="fixed";wrap.style.top="0";document.body.appendChild(wrap);}
    box=document.getElementById("ob-exbox");svg=document.getElementById("ob-exsvg");
    document.getElementById("ob-chg").addEventListener("click",function(e){e.stopPropagation();showGate();});
    box.addEventListener("pointerdown",function(e){if(tapActive){e.preventDefault();var a=ac();registerTap(a?a.currentTime:0);}});
  }
  function onResult(pass,hits,n){phase="result";resultPass=pass;setBox(box,(pass?(CHK+" "):(" "+CRS+" "))+(pass?("Nice! "+hits+"/"+n+"  -  click for next"):("Almost "+hits+"/"+n+"  -  click to try again")),"");box.onclick=primaryAction;}
  function doStart(){phase="listen";clearMarks(svg);try{if(document.activeElement&&document.activeElement.blur){document.activeElement.blur();}}catch(e){}playListen(box,svg,curTiles,curBpm(),function(){enterTap(box,svg,curTiles,curBpm(),onResult);});}
  function retry(){clearMarks(svg);doStart();}
  function nextExercise(){curTiles=genTiles(diff);draw(svg,curTiles,readToolbarAid());phase="start";setBox(box,"Click to start","");box.onclick=primaryAction;}
  function primaryAction(){if(playing){return;}if(phase==="start"){doStart();}else if(phase==="result"){if(resultPass){nextExercise();}else{retry();}}}
  function hearOnly(){if(playing||!curTiles){return;}playing=true;var savedHTML=box.innerHTML;var savedClass=box.className;setBox(box,"Listen","");var a=ac();if(!a){playing=false;box.innerHTML=savedHTML;box.className=savedClass;return;}var six=60/curBpm()/4,ms=a.currentTime+0.12,i;for(i=0;i<curTiles.length;i++){var t=curTiles[i];if(t.t==="n"){clk(a,ms+t.o*six,1500,0.34);}}for(i=0;i<8;i++){(function(k){var bt=ms+k*beatOf(six);clk(a,bt,k%4===0?1100:880,0.11);})(i);}sweep(svg,performance.now()+(ms-a.currentTime)*1000,six,32);setTimeout(function(){playing=false;box.innerHTML=savedHTML;box.className=savedClass;},(ms+32*six-a.currentTime)*1000+120);}
  function beatOf(six){return six*4;}
  function firstExercise(tiles){curTiles=tiles;setBpm(diff==="hard"?90:80);setToolbarAid("syl");draw(svg,curTiles,readToolbarAid());phase="start";resultPass=false;setBox(box,"Click to start","");box.onclick=primaryAction;}
  function startFirst(){clearSpot();overlayOpen=false;var r=$("#ob-root");if(r){r.style.display="none";}ensureWrap();firstExercise(diff==="hard"?HARD.tiles:EASY.tiles);}
  var CSS="#ob-root{position:fixed;inset:0;z-index:99999;display:flex;align-items:center;justify-content:center;padding:20px;overflow:auto;font-family:system-ui,-apple-system,sans-serif}#ob-root.gate{background:radial-gradient(900px 500px at 15% 10%,rgba(96,165,250,.18),transparent 60%),radial-gradient(800px 460px at 85% 90%,rgba(232,168,62,.16),transparent 60%),rgba(11,16,23,.66);backdrop-filter:blur(3px)}#ob-root.tour{background:transparent;backdrop-filter:none}#ob-root *{box-sizing:border-box}#ob-card{position:relative;width:min(660px,94vw);background:var(--praxis-surface,#fff);color:var(--praxis-ink,#111827);border:1px solid var(--praxis-line,#d8dee7);border-radius:20px;box-shadow:0 30px 80px rgba(15,23,42,.45);padding:30px clamp(20px,4vw,40px);overflow:hidden;animation:obpop .3s ease both}#ob-card::before{content:'';position:absolute;left:0;right:0;top:0;height:3px;background:linear-gradient(90deg,var(--praxis-accent,#1d4ed8),#7c3aed)}@keyframes obpop{from{opacity:0;transform:translateY(10px) scale(.98)}to{opacity:1;transform:none}}#ob-eyebrow{font-size:11px;font-weight:900;letter-spacing:.16em;text-transform:uppercase;color:var(--praxis-gold,#e8a83e)}#ob-q{margin:12px 0 6px;font-size:clamp(26px,5vw,42px);line-height:1.03;letter-spacing:-.03em;font-weight:900}#ob-sub{margin:0 0 22px;color:var(--praxis-muted,#5b6472);font-size:15px;line-height:1.6;max-width:48ch}#ob-btns{display:flex;flex-wrap:wrap;gap:12px}#ob-btns button{flex:1 1 220px;min-height:64px;border-radius:14px;border:1px solid var(--praxis-line,#d8dee7);background:var(--praxis-surface,#fff);color:var(--praxis-ink,#111827);font:inherit;font-weight:800;font-size:15px;cursor:pointer;text-align:left;padding:14px 17px;transition:transform .15s,box-shadow .15s,border-color .15s}#ob-btns button small{display:block;font-weight:600;font-size:12px;color:var(--praxis-muted,#5b6472);margin-top:4px}#ob-btns button:hover{transform:translateY(-2px);border-color:var(--praxis-accent,#1d4ed8);box-shadow:0 10px 26px rgba(29,78,216,.18)}#ob-btns .yes{background:linear-gradient(135deg,var(--praxis-accent,#1d4ed8),#7c3aed);border-color:transparent;color:#fff}#ob-btns .yes small{color:rgba(255,255,255,.82)}#ob-hl{position:fixed;border-radius:12px;border:2px solid rgba(96,165,250,.9);box-shadow:0 0 0 9999px rgba(11,16,23,.78);pointer-events:none;z-index:100011;transition:all .2s ease}#ob-anno{position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:100012;overflow:visible}#ob-click{position:fixed;inset:0;background:transparent;pointer-events:auto;z-index:100013;cursor:pointer}#ob-tip{position:fixed;z-index:100014;width:min(330px,86vw);background:var(--praxis-surface,#fff);color:var(--praxis-ink,#111827);border:1px solid var(--praxis-line,#d8dee7);border-radius:14px;box-shadow:0 18px 50px rgba(15,23,42,.35);padding:16px 18px;cursor:pointer}#ob-tip h4{margin:0 0 6px;font-size:15px;font-weight:900}#ob-tip p{margin:0 0 10px;color:var(--praxis-muted,#5b6472);font-size:13px;line-height:1.55}#ob-tip .ob-hint{font-size:11px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:var(--praxis-gold,#e8a83e)}#ob-tip .row{display:flex;align-items:center;gap:8px;justify-content:space-between;margin-top:4px}#ob-tip .step{font-size:11px;font-weight:800;color:var(--praxis-gold,#e8a83e);letter-spacing:.1em;margin-bottom:6px}#ob-tip button{border:1px solid var(--praxis-line,#d8dee7);background:var(--praxis-surface,#fff);border-radius:9px;padding:7px 12px;font:inherit;font-weight:800;font-size:12px;cursor:pointer}#ob-tip button.primary{background:linear-gradient(135deg,var(--praxis-accent,#1d4ed8),#7c3aed);color:#fff;border-color:transparent}.topbar{z-index:100000 !important}.nav-menu{z-index:100001 !important}.stage{position:relative !important}#ob-exwrap{position:absolute;inset:0;z-index:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:16px;background:#fff;pointer-events:none;padding:8px 12px}#ob-exwrap .ob-box,#ob-exwrap .ob-chg{pointer-events:auto}#draw-canvas{z-index:5 !important}#draw-palette{z-index:6 !important}#drill-frame{pointer-events:none !important}.ob-exh{font-size:clamp(26px,4vw,40px);font-weight:800;color:#1c1917;letter-spacing:-.02em;margin:0}#ob-exsvg{width:min(1100px,94%);height:auto;display:block}.ob-box{min-width:280px;max-width:440px;width:62%;min-height:140px;border-radius:14px;background:#ececec;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;cursor:pointer;user-select:none;text-align:center;padding:14px 18px;transition:background .12s,border-color .12s}.ob-box.tap{background:color-mix(in srgb,#1d4ed8 8%,#fff);border:2px dashed #1d4ed8}.ob-box .ob-small{font-size:15px;font-weight:800;color:#44403c}.ob-box .ob-big{font-size:54px;font-weight:900;color:#1c1917;line-height:1}.ob-box.tap .ob-small{color:#1d4ed8}.ob-chg{margin-top:2px;background:none;border:none;color:#a8a29e;font:inherit;font-size:12px;text-decoration:underline;cursor:pointer}";
  function injectCSS(){if($("#ob-css")){return;}var s=document.createElement("style");s.id="ob-css";s.textContent=CSS;document.head.appendChild(s);}
  function root(){var r=$("#ob-root");if(!r){r=document.createElement("div");r.id="ob-root";document.body.appendChild(r);}return r;}
  function clearSpot(){["ob-hl","ob-anno","ob-tip","ob-click"].forEach(function(id){var e=document.getElementById(id);if(e){e.remove();}});}
  var gateHTML='<div id="ob-card"><div id="ob-eyebrow">Rhythm Reader - Free Play</div><h1 id="ob-q">Are you new to reading rhythms?</h1><p id="ob-sub">Pick a starting point.</p><div id="ob-btns"><button class="no" data-pick="easy">No - I&#39;m new to this<small>Take a quick tour of the controls, and try a guided exercise using quarter notes and eighth notes.</small></button><button class="yes" data-pick="hard">Yes - I&#39;ve read rhythms before<small>Explore sixteenth note rhythms starting at a more comfortable pace. Let&#39;s get to it!</small></button></div></div>';
  function showGate(){clearSpot();overlayOpen=true;var r=root();r.className="gate";r.style.display="flex";r.innerHTML=gateHTML;$$("#ob-btns [data-pick]").forEach(function(b){b.addEventListener("click",function(){diff=b.getAttribute("data-pick");if(diff==="easy"){showWalk(startFirst);}else{startFirst();}});});}
  var WALK=[
    {find:"play",h:"Play / pause",p:"Starts the metronome and the exercise. The click is your pulse - every note lines up to it."},
    {find:"listen",h:"Listen",p:"Plays the rhythm for you first with a 1-2-3-4 count-in, so you can hear it before you tap."},
    {find:"draw",h:"Draw",p:"Turns on a drawing layer so you can scribble handwritten notes to yourself on the staff before you read or practice a rhythm."},
    {find:"aid",h:"Counting aid",p:"Writes the count under each note - ta / ti for quarters and eighths, and ti-ka-ti-ka (or 1 e + a) for sixteenths - so you can read it out loud as you go."},
    {find:"gear",h:"Settings",p:"More options live here, like the line cursor and visual pulse. The counting aid and draw buttons are up in the bar."},
    {find:"stage",h:"The stage",p:"The rhythm appears here. Tap on the beat as it plays - a green "+CHK+" when you are with it, a red "+CRS+" when you drift."}
  ];
  function btnByText(t){var scope=document.querySelector(".metronome--top")||document.querySelector(".dock")||document;var bs=Array.prototype.slice.call(scope.querySelectorAll("button"));var low=t.toLowerCase();var i;for(i=0;i<bs.length;i++){if((bs[i].textContent||"").trim().toLowerCase()===low){return bs[i];}}return null;}
  function findControls(){playBtn=btnByText("Play");listenBtn=btnByText("Listen");drawBtn=btnByText("Draw");gearBtn=document.querySelector("[data-metro-gear]")||document.querySelector('button[aria-label="Settings"]');var ab=aidButtons();aidSeg=null;for(var i=0;i<ab.length;i++){if(/ta|ti/i.test(ab[i].textContent)){aidSeg=ab[i].parentElement;break;}}}
  function getTarget(kind){if(kind==="stage"){var w=innerWidth,h=innerHeight;return {synth:true,rect:{left:w*0.16,top:h*0.30,width:w*0.68,height:h*0.30}};}var el=kind==="play"?playBtn:kind==="listen"?listenBtn:kind==="draw"?drawBtn:kind==="gear"?gearBtn:kind==="aid"?aidSeg:null;if(!el){return null;}return {synth:false,rect:el.getBoundingClientRect()};}
  function wobble(cx,cy,rx,ry){var pts=[],n=26,i;for(i=0;i<=n+3;i++){var t=(i/n)*Math.PI*2;var w=1+0.05*Math.sin(3*t+1.3)+0.035*Math.sin(5*t+0.7);pts.push([cx+rx*w*Math.cos(t),cy+ry*w*Math.sin(t)]);}var d="M "+pts[0][0].toFixed(1)+" "+pts[0][1].toFixed(1);for(i=1;i<pts.length;i++){d+=" L "+pts[i][0].toFixed(1)+" "+pts[i][1].toFixed(1);}return d;}
  function arrowPath(r){var hx=r.left+r.width*0.5,hy=r.top+r.height+2;var tx=r.left+r.width*0.5+34,ty=r.top+r.height+58;var cxp=(hx+tx)/2+18,cyp=(hy+ty)/2;var shaft="M "+tx.toFixed(1)+" "+ty.toFixed(1)+" Q "+cxp.toFixed(1)+" "+cyp.toFixed(1)+" "+hx.toFixed(1)+" "+hy.toFixed(1);var a1x=hx+10,a1y=hy+12,a2x=hx-9,a2y=hy+10;return shaft+" M "+a1x.toFixed(1)+" "+a1y.toFixed(1)+" L "+hx.toFixed(1)+" "+hy.toFixed(1)+" L "+a2x.toFixed(1)+" "+a2y.toFixed(1);}
  function drawAnno(anno,r){while(anno.firstChild){anno.removeChild(anno.firstChild);}var cx=r.left+r.width/2,cy=r.top+r.height/2,rx=r.width/2+13,ry=r.height/2+13;var e=document.createElementNS(NS,"path");e.setAttribute("d",wobble(cx,cy,rx,ry));e.setAttribute("fill","none");e.setAttribute("stroke","#e8231b");e.setAttribute("stroke-width","3.5");e.setAttribute("stroke-linecap","round");e.setAttribute("stroke-linejoin","round");e.setAttribute("opacity","0.95");anno.appendChild(e);var a=document.createElementNS(NS,"path");a.setAttribute("d",arrowPath(r));a.setAttribute("fill","none");a.setAttribute("stroke","#e8231b");a.setAttribute("stroke-width","3.5");a.setAttribute("stroke-linecap","round");a.setAttribute("stroke-linejoin","round");anno.appendChild(a);}
  function placeTip(rect){var tip=$("#ob-tip");if(!tip){return;}var th=tip.offsetHeight||150;var below=rect.bottom+16;if(below+th>window.innerHeight){below=rect.top-16-th;}var left=rect.left+rect.width/2-165;if(left+330>window.innerWidth-10){left=window.innerWidth-10-330;}if(left<10){left=10;}tip.style.top=Math.max(10,below)+"px";tip.style.left=left+"px";}
  function advance(){if(walkI>=WALK.length-1){clearSpot();overlayOpen=false;if(walkDone){walkDone();}}else{walkI++;showWalkStep();}}
  function showWalkStep(){
    var step=WALK[walkI];var tgt=getTarget(step.find);
    var hl=$("#ob-hl"),anno=$("#ob-anno"),tip=$("#ob-tip");
    if(tgt){var r=tgt.rect,pad=9;hl.style.display="block";hl.style.left=(r.left-pad)+"px";hl.style.top=(r.top-pad)+"px";hl.style.width=(r.width+pad*2)+"px";hl.style.height=(r.height+pad*2)+"px";drawAnno(anno,r);}
    else{hl.style.display="none";while(anno.firstChild){anno.removeChild(anno.firstChild);}}
    var last=walkI===WALK.length-1;
    tip.innerHTML='<div class="step">QUICK TOUR  '+(walkI+1)+' / '+WALK.length+'</div><h4>'+step.h+'</h4><p>'+step.p+'</p><p class="ob-hint">Click anywhere to continue</p><div class="row"><button id="ob-wback"'+(walkI===0?' style="visibility:hidden"':'')+'>Back</button><button id="ob-wnext" class="primary">'+(last?("Begin "+ARR):("Next "+ARR))+'</button></div>';
    tip.style.transform="";
    if(tgt){placeTip(tgt.rect);}else{tip.style.left="50%";tip.style.top="50%";tip.style.transform="translate(-50%,-50%)";}
    var nb=$("#ob-wnext"),bb=$("#ob-wback");
    nb.addEventListener("click",function(e){e.stopPropagation();advance();});
    bb.addEventListener("click",function(e){e.stopPropagation();if(walkI>0){walkI--;showWalkStep();}});
    tip.onclick=function(){advance();};
  }
  function showWalk(done){clearSpot();overlayOpen=true;walkDone=done;walkI=0;var r=root();r.className="tour";r.style.display="flex";r.innerHTML="";var hl=document.createElement("div");hl.id="ob-hl";document.body.appendChild(hl);var anno=document.createElementNS(NS,"svg");anno.id="ob-anno";document.body.appendChild(anno);var click=document.createElement("div");click.id="ob-click";click.onclick=function(){advance();};document.body.appendChild(click);var tip=document.createElement("div");tip.id="ob-tip";document.body.appendChild(tip);showWalkStep();}
  function isPlay(t){return playBtn&&(t===playBtn||(playBtn.contains&&playBtn.contains(t)));}
  function isListen(t){return listenBtn&&(t===listenBtn||(listenBtn.contains&&listenBtn.contains(t)));}
  function attachIntercepts(){
    document.addEventListener("pointerdown",function(e){var t=e.target;if(isPlay(t)||isListen(t)){e.preventDefault();e.stopImmediatePropagation();if(isPlay(t)){primaryAction();}else{hearOnly();}}},true);
    document.addEventListener("click",function(e){var t=e.target;if(isPlay(t)||isListen(t)){e.preventDefault();e.stopImmediatePropagation();}},true);
  }
  injectCSS();
  findControls();
  attachAidListeners();
  attachIntercepts();
  try{localStorage.removeItem("rr_difficulty");}catch(e){}
  document.addEventListener("keydown",function(e){
    if(e.code!=="Space"&&e.key!==" "){return;}
    var ae=document.activeElement;var tag=ae?ae.tagName:"";
    if(tapActive){e.preventDefault();e.stopPropagation();var a=ac();registerTap(a?a.currentTime:0);return;}
    if(tag==="BUTTON"||tag==="INPUT"||tag==="TEXTAREA"||tag==="SELECT"){return;}
    if(!overlayOpen&&!playing&&(phase==="start"||phase==="result")){e.preventDefault();primaryAction();}
  },true);
  window.addEventListener("resize",function(){var tip=$("#ob-tip");if(tip&&WALK[walkI]){var tgt=getTarget(WALK[walkI].find);if(tgt){placeTip(tgt.rect);}}});
  showGate();
})();
