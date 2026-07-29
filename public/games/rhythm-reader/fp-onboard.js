
(function(){
  var $=function(s){return document.querySelector(s);};
  var $$=function(s){return Array.prototype.slice.call(document.querySelectorAll(s));};
  var NS="http://www.w3.org/2000/svg";
  var CHK="\u2713", CRS="\u2717", ARR="\u2192";
  var EASY={bpm:80,tiles:[{t:"n",o:0,d:4},{t:"n",o:4,d:4},{t:"n",o:8,d:2},{t:"n",o:10,d:2},{t:"n",o:12,d:4},{t:"n",o:16,d:4},{t:"n",o:20,d:4},{t:"n",o:24,d:2},{t:"n",o:26,d:2},{t:"n",o:28,d:4}]};
  var HARD={bpm:90,tiles:[{t:"n",o:0,d:6},{t:"n",o:6,d:2},{t:"n",o:8,d:2},{t:"n",o:10,d:2},{t:"n",o:12,d:4},{t:"r",o:16,d:4},{t:"n",o:20,d:1},{t:"n",o:21,d:1},{t:"n",o:22,d:1},{t:"n",o:23,d:1},{t:"n",o:24,d:2},{t:"n",o:26,d:2},{t:"n",o:28,d:4}]};
  var ROWCAP=2;
  var PAT_HARD=[
    {w:5,p:[["n",4]]},
    {w:5,p:[["n",2],["n",2]]},
    {w:2,p:[["n",2],["r",2]]},
    {w:2,p:[["r",2],["n",2]]},
    {w:1,p:[["r",4]]},
    {w:4,p:[["n",1],["n",1],["n",1],["n",1]]},
    {w:3,p:[["n",1],["n",1],["r",2]]},
    {w:3,p:[["r",2],["n",1],["n",1],["n",1]]},
    {w:3,p:[["n",1],["n",1],["n",1],["r",2]]}
  ];
  var overlayOpen=false, walkI=0, walkDone=null;
  var playBtn=null, listenBtn=null, drawBtn=null, gearBtn=null, aidBtn=null;
  var guidedActive=false, guidedDiff="easy", walkthroughMode=false, gState="listen", gMode="free", gTiles=null, gbox=null, gsvg=null, playing=false, isRandom=false, gTimers=[];
  var tapActive=false, tapExp=[], tapSlots=[], tapJudged=[], tapNotes=[], tapHits=0, tapMusicStart=0, tapSix=0;
  var masterGain=null, sweepGen=0;
  var drawCanvas=null, drawCtx=null, drawOn=false, drawColor="#dc2626", drawing=false, lastDX=0, lastDY=0, DPR=1;
  var barSel=null;
  function fpChecked(substrs){var pop=document.getElementById('praxis-settings-pop');if(!pop){return true;}var labels=pop.querySelectorAll('label');for(var i=0;i<labels.length;i++){var tx=(labels[i].textContent||'').toLowerCase();for(var s=0;s<substrs.length;s++){if(tx.indexOf(substrs[s])>-1){var inp=labels[i].querySelector('input[type=checkbox]');if(inp){return inp.checked;}return true;}}}return true;}
  function cursorOn(){return fpChecked(['line cursor','cursor']);}
  function marksOn(){return fpChecked(['mark','\u2713','\u2717']);}
  function sizeDrawCanvas(){if(!drawCanvas||!drawCtx){return;}DPR=window.devicePixelRatio||1;var W=Math.max(1,Math.round(window.innerWidth*DPR)),H=Math.max(1,Math.round(window.innerHeight*DPR));if(drawCanvas.width!==W||drawCanvas.height!==H){drawCanvas.width=W;drawCanvas.height=H;}drawCtx.lineCap="round";drawCtx.lineJoin="round";drawCtx.lineWidth=3*DPR;}
  function clearDrawCanvas(){if(drawCtx&&drawCanvas){try{drawCtx.clearRect(0,0,drawCanvas.width,drawCanvas.height);}catch(e){}}}
  function applyDrawOn(){if(drawCanvas){drawCanvas.style.pointerEvents=drawOn?"auto":"none";}if(drawOn){sizeDrawCanvas();}}
  function setDrawOn(v){drawOn=!!v;applyDrawOn();}
  function evpos(ev){var r=drawCanvas.getBoundingClientRect();var cx=(ev.touches&&ev.touches[0])?ev.touches[0].clientX:ev.clientX;var cy=(ev.touches&&ev.touches[0])?ev.touches[0].clientY:ev.clientY;var sx=drawCanvas.width/(r.width||1),sy=drawCanvas.height/(r.height||1);return [(cx-r.left)*sx,(cy-r.top)*sy];}
  function hideMuteBtns(){var bs=document.querySelectorAll("button");for(var i=0;i<bs.length;i++){var b=bs[i];var t=(b.textContent||"").trim();var cn=(b.className||"")+" "+(b.id||"");if(/mute/i.test(cn)||t==="\uD83D\uDD0A"||t==="\uD83D\uDD07"){if(!/draw|play|listen/i.test(t)){b.style.display="none";}}}}
  function installDraw(){
    var orig=document.getElementById("draw-canvas");if(orig){orig.style.display="none";}
    drawCanvas=document.createElement("canvas");drawCanvas.id="ob-drawcanvas";
    drawCanvas.style.cssText="position:fixed;inset:0;z-index:8;pointer-events:none;touch-action:none;";
    document.body.appendChild(drawCanvas);drawCtx=drawCanvas.getContext("2d");sizeDrawCanvas();
    drawCanvas.addEventListener("pointerdown",function(ev){if(!drawOn){return;}ev.preventDefault();sizeDrawCanvas();drawing=true;var p=evpos(ev);lastDX=p[0];lastDY=p[1];});
    drawCanvas.addEventListener("pointermove",function(ev){if(!drawOn||!drawing){return;}ev.preventDefault();var p=evpos(ev);drawCtx.strokeStyle=drawColor;drawCtx.beginPath();drawCtx.moveTo(lastDX,lastDY);drawCtx.lineTo(p[0],p[1]);drawCtx.stroke();lastDX=p[0];lastDY=p[1];});
    window.addEventListener("pointerup",function(){drawing=false;});
    window.addEventListener("resize",function(){if(drawCanvas){sizeDrawCanvas();}});
    document.addEventListener("click",function(e){var t=e.target;var db=t&&t.closest?t.closest("button"):null;if(db&&(db.textContent||"").trim().toLowerCase()==="draw"){e.stopImmediatePropagation();e.preventDefault();setDrawOn(!drawOn);db.classList.toggle("draw-on",drawOn);}},true);
  }
  function initBars(){barSel=document.querySelector("[data-metro-bars]");}
  function applyBarOptions(diff){if(!barSel){return;}barSel.innerHTML='<option value="2">2</option><option value="4">4</option>';var cur=barSel.value;barSel.value=(cur==="4")?"4":"2";}
  var LISTEN_EY="STEP 1", LISTEN_IN="Press the Listen button first to listen to the rhythm and try to say it or clap the rhythm out loud along with it.";
  var TURN_EY="STEP 2", TURN_IN="Now press the Play button. After the 1-2-3-4 count-in, tap this box (or press Space) on the beat.";
  var READY_EY="GET READY", READY_IN="tap on the beat";
  var TAP_EY="NOW", TAP_IN="tap on the beat";
  var FREE_EY="", FREE_IN="Click to start. Press the spacebar to tap or click here";
  var DONE_IN="Tap the box for the next rhythm.";
  var VW=720, WIN=0.17, SLOTS=32;
  var L={rowCap:ROWCAP,numRows:1,uSlot:10,slot:10,BW:10,hr:6,ROW_H:116,LM:56,RM:14,CY0:60,bpRow:ROWCAP};
  function recompute(t){var m=0,i;for(i=0;i<t.length;i++){var e=t[i].o+t[i].d;if(e>m){m=e;}}SLOTS=Math.max(16,Math.ceil(m/16)*16);}
  function layout(){var B=SLOTS/16;var rc=ROWCAP;if(rc<1){rc=1;}L.rowCap=rc;L.bpRow=rc;L.numRows=Math.ceil(B/rc);L.LM=56;L.RM=14;L.ROW_H=116;L.CY0=60;L.uSlot=(VW-L.LM-L.RM)/(L.rowCap*16);L.slot=L.uSlot;L.BW=16*L.uSlot;L.hr=6;}
  function pos(o){if(o<0){o=0;}var perRow=L.rowCap*16;var row=Math.floor(o/perRow);if(row>=L.numRows){row=L.numRows-1;}if(row<0){row=0;}var local=o-row*perRow;var x=L.LM+(local+0.5)*L.uSlot;var cy=row*L.ROW_H+L.CY0;return {row:row,x:x,cy:cy};}
  function rowInfo(v){var perRow=L.rowCap*16;var row=Math.floor(v/perRow);if(row<0){row=0;}if(row>=L.numRows){row=L.numRows-1;}var rowStartBar=row*L.rowCap;var rowBars=L.rowCap;if(rowStartBar+rowBars>SLOTS/16){rowBars=SLOTS/16-rowStartBar;}if(rowBars<0){rowBars=0;}var rowEndSix=row*perRow+rowBars*16;var local=v-row*perRow;return {row:row,rowBars:rowBars,rowEndSix:rowEndSix,local:local};}
  function cursorX(v){if(v<0){v=0;}if(v>SLOTS){v=SLOTS;}var ri=rowInfo(v);var local=ri.local;var atEnd=false;if(local>=ri.rowBars*16-0.5){local=ri.rowBars*16-0.5;atEnd=true;}if(local<0){local=0;}var x=L.LM+(local+0.5)*L.uSlot;var cy=ri.row*L.ROW_H+L.CY0;return {x:x,cy:cy,row:ri.row,atEnd:atEnd,rowEndSix:ri.rowEndSix};}
  function mk(svg,t,a){var e=document.createElementNS(NS,t);for(var k in a){e.setAttribute(k,String(a[k]));}svg.appendChild(e);return e;}
  function syl(d,o){if(d>=4){return "ta";}if(d===2){return "ti";}return ["ti","ka","ti","ka"][o%4];}
  function num(o){var b=(Math.floor(o/4)%4)+1;var p=o%4;return p===0?String(b):(p===1?"e":(p===2?"+":"a"));}
  function curAid(){var ab=aidBtns(),i;for(i=0;i<ab.length;i++){if(ab[i].classList.contains("on")){var t=(ab[i].textContent||"").trim();return /none/i.test(t)?"none":(/ta|ti/i.test(t)?"syl":"num");}}return "syl";}
  function pickPat(){var tot=0,i;for(i=0;i<PAT_HARD.length;i++){tot+=PAT_HARD[i].w;}var r=Math.random()*tot,acc=0;for(i=0;i<PAT_HARD.length;i++){acc+=PAT_HARD[i].w;if(r<acc){return PAT_HARD[i].p;}}return PAT_HARD[0].p;}
  function expandBeat(p,b){var out=[],o=0,i;for(i=0;i<p.length;i++){out.push({t:p[i][0],o:b*4+o,d:p[i][1]});o+=p[i][1];}return out;}
  function randBarHard(){var tiles=[],b,i;for(b=0;b<4;b++){var beat=expandBeat(pickPat(),b);for(i=0;i<beat.length;i++){tiles.push(beat[i]);}}return tiles;}
  function randBarEasy(){
    var tiles=[],b=0,guard=0;
    var r=Math.random();
    if(r<0.10){return [{t:"n",o:0,d:16}];}
    if(r<0.115){return [{t:"r",o:0,d:16}];}
    while(b<4&&guard<30){guard++;var remB=4-b;
      if(remB>=2&&Math.random()<0.30){if(Math.random()<0.05){tiles.push({t:"r",o:b*4,d:8});}else{tiles.push({t:"n",o:b*4,d:8});}b+=2;continue;}
      var q=Math.random();
      if(q<0.16){tiles.push({t:"r",o:b*4,d:4});}
      else if(q<0.46){tiles.push({t:"n",o:b*4,d:2});tiles.push({t:"n",o:b*4+2,d:2});}
      else{tiles.push({t:"n",o:b*4,d:4});}
      b+=1;
    }
    return tiles;
  }
  function buildBar(diff){for(var tries=0;tries<30;tries++){var b=diff==="hard"?randBarHard():randBarEasy();var hasN=false,i;for(i=0;i<b.length;i++){if(b[i].t==="n"){hasN=true;break;}}if(hasN){return b;}}return diff==="hard"?[{t:"n",o:0,d:4},{t:"n",o:4,d:4},{t:"n",o:8,d:4},{t:"n",o:12,d:4}]:[{t:"n",o:0,d:4},{t:"n",o:4,d:4},{t:"n",o:8,d:2},{t:"n",o:10,d:2},{t:"n",o:12,d:4}];}
  function genTiles(diff,bars){var out=[],b,i;for(b=0;b<bars;b++){var bar=buildBar(diff);for(i=0;i<bar.length;i++){out.push({t:bar[i].t,o:bar[i].o+b*16,d:bar[i].d});}}return out;}
  function readBars(){var sel=document.querySelector("[data-metro-bars]");var v=sel?parseInt(sel.value,10):2;if(!isFinite(v)||v<2){v=2;}if(v>4){v=4;}return v;}
  function setBars2(){var sel=document.querySelector("[data-metro-bars]");if(sel){sel.value="2";sel.dispatchEvent(new Event("change",{bubbles:true}));sel.dispatchEvent(new Event("input",{bubbles:true}));}}
  function beams(tiles){var groups=[],cur=[],i;function flush(){if(cur.length>1){groups.push(cur);}cur=[];}for(i=0;i<tiles.length;i++){var t=tiles[i];if(t.t==="n"&&t.d<=2){var last=cur[cur.length-1];if(!last){cur=[t];}else if(Math.floor(t.o/4)===Math.floor(last.o/4)&&t.o===last.o+last.d){cur.push(t);}else{flush();cur=[t];}}else{flush();}}flush();var beamed={};groups.forEach(function(g){g.forEach(function(t){beamed[t.o]=true;});});return {groups:groups,beamed:beamed};}
  function restAt(svg,x,cy,d){if(d>=16){mk(svg,"rect",{x:x-7,y:cy,width:14,height:4,fill:"#222"});}else if(d>=8){mk(svg,"rect",{x:x-7,y:cy-4,width:14,height:4,fill:"#222"});}else if(d>=4){mk(svg,"path",{d:"M "+(x+2)+" "+(cy-11)+" C "+(x-3)+" "+(cy-7)+" "+(x+3)+" "+(cy-3)+" "+(x-1)+" "+(cy+1)+" C "+(x+3)+" "+(cy+5)+" "+(x-3)+" "+(cy+9)+" "+(x+1)+" "+(cy+12),fill:"none",stroke:"#222","stroke-width":1.6});}else if(d>=2){mk(svg,"circle",{cx:x+2,cy:cy-8,r:1.8,fill:"#222"});mk(svg,"line",{x1:x+2,y1:cy-8,x2:x-2,y2:cy+4,stroke:"#222","stroke-width":1.6});}else{mk(svg,"circle",{cx:x+2,cy:cy-10,r:1.5,fill:"#222"});mk(svg,"line",{x1:x+2,y1:cy-10,x2:x-2,y2:cy+1,stroke:"#222","stroke-width":1.3});mk(svg,"circle",{cx:x+2,cy:cy-4,r:1.5,fill:"#222"});mk(svg,"line",{x1:x+2,y1:cy-4,x2:x-2,y2:cy+7,stroke:"#222","stroke-width":1.3});}}
  function drawBeams(svg,groups){
    var HR=L.hr, slot=L.uSlot;
    groups.forEach(function(gr){
      if(gr.length<2){return;}
      var cy=pos(gr[0].o).cy;
      var x1=pos(gr[0].o).x+HR*0.85, x2=pos(gr[gr.length-1].o).x+HR*0.85;
      mk(svg,"rect",{x:x1,y:cy-35,width:Math.max(1,x2-x1),height:3,fill:"#222",rx:0.5});
      for(var j=0;j<gr.length;j++){
        if(gr[j].d!==1){continue;}
        var sxj=pos(gr[j].o).x+HR*0.85;
        var right=j+1<gr.length?gr[j+1]:null; var left=j-1>=0?gr[j-1]:null;
        if(right&&right.d===1){ var sxr=pos(gr[j+1].o).x+HR*0.85; mk(svg,"rect",{x:sxj,y:cy-31,width:Math.max(1,sxr-sxj),height:3,fill:"#222",rx:0.5}); }
        else if(right&&right.d===2){ var sxr2=pos(gr[j+1].o).x+HR*0.85; var wdt=Math.min(0.4*slot,(sxr2-sxj)*0.5-1); if(wdt>1){mk(svg,"rect",{x:sxj,y:cy-31,width:wdt,height:3,fill:"#222",rx:0.5});} }
        if(left&&left.d===2){ var sxl=pos(gr[j-1].o).x+HR*0.85; var wdl=Math.min(0.4*slot,(sxj-sxl)*0.5-1); if(wdl>1){mk(svg,"rect",{x:sxj-wdl,y:cy-31,width:wdl,height:3,fill:"#222",rx:0.5});} }
      }
    });
  }
  function draw(svg,tiles,aid){
    while(svg.firstChild){svg.removeChild(svg.firstChild);}
    recompute(tiles);layout();
    var HR=L.hr;
    var totalH=L.numRows*L.ROW_H+8;
    svg.setAttribute("viewBox","0 0 "+VW+" "+totalH);
    mk(svg,"rect",{x:0,y:0,width:VW,height:totalH,fill:"#fff",rx:10});
    var B=SLOTS/16,row;
    for(row=0;row<L.numRows;row++){
      var cy=row*L.ROW_H+L.CY0;
      var rowStartBar=row*L.rowCap;var rowBars=L.rowCap;if(rowStartBar+rowBars>B){rowBars=B-rowStartBar;}if(rowBars<0){rowBars=0;}
      var lineEnd=L.LM+rowBars*16*L.uSlot+4;
      mk(svg,"line",{x1:L.LM-6,y1:cy,x2:lineEnd,y2:cy,stroke:"#222","stroke-width":1.5});
      mk(svg,"rect",{x:18,y:cy-18,width:4,height:36,fill:"#222",rx:1});
      mk(svg,"rect",{x:27,y:cy-18,width:4,height:36,fill:"#222",rx:1});
      var t1=mk(svg,"text",{x:46,y:cy-2,"font-size":20,"font-weight":"bold","text-anchor":"middle",fill:"#222","font-family":"serif"});t1.textContent="4";
      var t2=mk(svg,"text",{x:46,y:cy+18,"font-size":20,"font-weight":"bold","text-anchor":"middle",fill:"#222","font-family":"serif"});t2.textContent="4";
      var k;for(k=1;k<=rowBars;k++){var lx=L.LM+k*16*L.uSlot;var isFinal=(rowStartBar+k===B);if(isFinal){mk(svg,"line",{x1:lx-4,y1:cy-28,x2:lx-4,y2:cy+18,stroke:"#222","stroke-width":1.5});mk(svg,"line",{x1:lx,y1:cy-28,x2:lx,y2:cy+18,stroke:"#222","stroke-width":2.5});}else{mk(svg,"line",{x1:lx,y1:cy-28,x2:lx,y2:cy+18,stroke:"#222","stroke-width":1.5});}}
    }
    var bm=beams(tiles),i;
    for(i=0;i<tiles.length;i++){
      var t=tiles[i];var p=pos(t.o);var x=p.x,cy2=p.cy;var isB=!!bm.beamed[t.o];
      if(t.t==="r"){restAt(svg,x,cy2,t.d);continue;}
      var open=t.d>=8;
      if(t.d<16){var stx=x+HR*0.85;mk(svg,"line",{x1:stx,y1:cy2-1,x2:stx,y2:cy2-35,stroke:"#222","stroke-width":1.8});}
      mk(svg,"ellipse",{cx:x,cy:cy2,rx:HR,ry:HR*0.72,fill:open?"none":"#222",stroke:"#222","stroke-width":open?2:0.5,transform:"rotate(-15 "+x+" "+cy2+")"});
      if(t.d===3||t.d===6||t.d===12){mk(svg,"circle",{cx:x+HR+5,cy:cy2-8,r:2.3,fill:"#222"});}
      if(!isB&&t.d<4){var fx=x+HR*0.85;mk(svg,"path",{d:"M"+fx+" "+(cy2-35)+" q 8 4 6 13",fill:"none",stroke:"#222","stroke-width":1.8});if(t.d===1){mk(svg,"path",{d:"M"+fx+" "+(cy2-31)+" q 8 4 6 13",fill:"none",stroke:"#222","stroke-width":1.8});}}
    }
    drawBeams(svg,bm.groups);
    for(i=0;i<tiles.length;i++){var u=tiles[i];if(u.tied&&i+1<tiles.length){var xa=pos(u.o).x+HR*0.6,xb=pos(tiles[i+1].o).x-HR*0.6,ym=pos(u.o).cy+11;mk(svg,"path",{d:"M"+xa+" "+ym+" Q "+((xa+xb)/2)+" "+(ym+8)+" "+xb+" "+ym,fill:"none",stroke:"#222","stroke-width":1.4});}}
    if(aid!=="none"){for(i=0;i<tiles.length;i++){var u=tiles[i];if(u.t!=="n"){continue;}var pu=pos(u.o);var lab=aid==="syl"?syl(u.d,u.o):num(u.o);var tx=mk(svg,"text",{x:pu.x,y:pu.cy+30,"font-size":14,"font-weight":"800","text-anchor":"middle",fill:"#1d4ed8","font-family":"system-ui,sans-serif"});tx.textContent=lab;}}
    mk(svg,"g",{id:"ob-marks"});
    mk(svg,"line",{id:"ob-ph",x1:L.LM,x2:L.LM,y1:L.CY0-32,y2:L.CY0+18,stroke:"#e11d48","stroke-width":2,opacity:0});
  }
  function clearMarks(s){var g=s.querySelector("#ob-marks");if(!g){return;}while(g.firstChild){g.removeChild(g.firstChild);}}
  function markHit(s,o){if(!marksOn()){return;}var g=s.querySelector("#ob-marks");if(!g){return;}var p=pos(o);var t=mk(g,"text",{x:p.x,y:p.cy+46,"font-size":17,"font-weight":"900","text-anchor":"middle",fill:"#16a34a"});t.textContent=CHK;}
  function markMiss(s,o){if(!marksOn()){return;}var g=s.querySelector("#ob-marks");if(!g){return;}var p=pos(o);var t=mk(g,"text",{x:p.x,y:p.cy+46,"font-size":16,"font-weight":"900","text-anchor":"middle",fill:"#dc2626"});t.textContent=CRS;}
  function markMissX(s,slot){if(!marksOn()){return;}var g=s.querySelector("#ob-marks");if(!g){return;}var p=pos(slot);var t=mk(g,"text",{x:p.x,y:p.cy+46,"font-size":15,"font-weight":"900","text-anchor":"middle",fill:"#dc2626",opacity:0.55});t.textContent=CRS;}
  function ac(){var AC=window.AudioContext||window.webkitAudioContext;if(!AC){return null;}ac._c=ac._c||new AC();if(ac._c.state==="suspended"){ac._c.resume();}return ac._c;}
  function ensureMaster(){var a=ac();if(!a){return null;}if(!masterGain){masterGain=a.createGain();masterGain.gain.value=1;masterGain.connect(a.destination);}return masterGain;}
  function silenceMaster(){try{var a=ac();if(a&&masterGain){masterGain.gain.cancelScheduledValues(a.currentTime);masterGain.gain.setValueAtTime(0,a.currentTime);}}catch(e){}masterGain=null;}
  function clk(a,t,f,v){var mg=ensureMaster();if(!mg){return;}var o=a.createOscillator(),g=a.createGain();o.type="sine";o.frequency.value=f;g.gain.setValueAtTime(0.0001,t);g.gain.exponentialRampToValueAtTime(v,t+0.004);g.gain.exponentialRampToValueAtTime(0.0001,t+0.09);o.connect(g).connect(mg);o.start(t);o.stop(t+0.11);}
  function sweep(s,perfStart,six,dur){var ph=s.querySelector("#ob-ph");if(!ph){return;}var myGen=sweepGen;var prevRow=-1;var enterT=performance.now();(function f(){if(myGen!==sweepGen){ph.setAttribute("opacity","0");return;}var el=performance.now()-perfStart;if(el<0){requestAnimationFrame(f);return;}var v=el/(six*1000);if(v>=dur||v<0){ph.setAttribute("opacity","0");return;}var c=cursorX(v);var now=performance.now();if(c.row!==prevRow){prevRow=c.row;enterT=now;}var op=0.9;var fi=now-enterT;if(fi<70){op=0.9*(fi/70);}if(c.atEnd&&c.row<L.numRows-1){var pe=(v-(c.rowEndSix-0.5))/0.5;if(pe<0){pe=0;}if(pe>1){pe=1;}op*=(1-pe);}var vis=cursorOn();ph.setAttribute("opacity",vis?String(op):"0");ph.setAttribute("x1",c.x);ph.setAttribute("x2",c.x);ph.setAttribute("y1",c.cy-32);ph.setAttribute("y2",c.cy+18);requestAnimationFrame(f);})();}
  function clearGTimers(){for(var i=0;i<gTimers.length;i++){clearTimeout(gTimers[i]);}gTimers.length=0;}
  function gSet(fn,ms){var id=setTimeout(fn,ms);gTimers.push(id);return id;}
  function setGBox(ey,instr,big,tap){if(!gbox){return;}gbox.className="ob-gbox"+(tap?" tap":"");gbox.innerHTML=(ey?'<div class="ey">'+ey+'</div>':'')+(instr?'<div class="s">'+instr+'</div>':'')+(big?'<div class="b">'+big+'</div>':'');}
  function setPlayLabel(stop){if(playBtn){playBtn.textContent=stop?"Stop":"Play";}}
  function stopAll(){clearGTimers();sweepGen++;silenceMaster();playing=false;tapActive=false;setPlayLabel(false);if(gsvg){var ph=gsvg.querySelector("#ob-ph");if(ph){ph.setAttribute("opacity","0");}clearMarks(gsvg);}if(gMode==="free"){gState="free";setGBox(FREE_EY,FREE_IN);}else if(gMode==="walk-listen"){gState="listen";setGBox(LISTEN_EY,LISTEN_IN);}else{gState="turn";setGBox(TURN_EY,TURN_IN);}}
  function curBpm(){var inp=document.querySelector("[data-metro-bpm-input]");var v=inp?parseInt(inp.value,10):NaN;if(!isFinite(v)||v<20||v>300){v=guidedDiff==="hard"?90:80;}return v;}
  function setBpm(b){try{var a=document.querySelector("[data-metro-bpm-input]"),r=document.querySelector("[data-metro-tempo]");if(a){a.value=b;a.dispatchEvent(new Event("input",{bubbles:true}));}if(r){r.value=b;r.dispatchEvent(new Event("input",{bubbles:true}));}}catch(e){}}
  function aidBtns(){var scope=document.querySelector(".metronome--top")||document.querySelector(".dock")||document;var bs=Array.prototype.slice.call(scope.querySelectorAll("button"));return bs.filter(function(b){return /^(none|ta\s*\/\s*ti|1\s*\+?)$/i.test((b.textContent||"").trim());});}
  function btnByText(t){var scope=document.querySelector(".metronome--top")||document.querySelector(".dock")||document;var bs=Array.prototype.slice.call(scope.querySelectorAll("button"));var low=t.toLowerCase();for(var i=0;i<bs.length;i++){if((bs[i].textContent||"").trim().toLowerCase()===low){return bs[i];}}return null;}
  function findControls(){playBtn=btnByText("play");listenBtn=btnByText("listen");drawBtn=btnByText("draw");gearBtn=document.querySelector("[data-metro-gear]")||document.querySelector('button[aria-label="Settings"]')||document.querySelector('button[aria-label="Tools"]');if(gearBtn){gearBtn.style.setProperty("font-size","1.9rem","important");gearBtn.style.setProperty("line-height","1","important");gearBtn.style.setProperty("min-height","42px","important");gearBtn.style.setProperty("max-height","42px","important");gearBtn.style.setProperty("height","42px","important");gearBtn.style.setProperty("padding","0 12px","important");gearBtn.style.setProperty("display","inline-flex","important");gearBtn.style.setProperty("align-items","center","important");gearBtn.style.setProperty("justify-content","center","important");var gi=gearBtn.querySelector("svg");if(gi){gi.setAttribute("width","24");gi.setAttribute("height","24");gi.style.width="24px";gi.style.height="24px";}}var ab=aidBtns();aidBtn=null;for(var i=0;i<ab.length;i++){if(/ta|ti/i.test(ab[i].textContent)){aidBtn=ab[i];break;}}}
  function setAid(mode){var ab=aidBtns(),i;for(i=0;i<ab.length;i++){var t=(ab[i].textContent||"").trim();var m=/none/i.test(t)?"none":(/ta|ti/i.test(t)?"syl":"num");if(m===mode){if(!ab[i].classList.contains("on")){ab[i].click();}return;}}}
  function applyChoice(d){guidedDiff=d;try{window.__fpDiff=d;}catch(e){}applyBarOptions(d);try{if(d==="easy"){setBpm(80);setAid("syl");}else{setBpm(90);setAid("syl");}}catch(e){}}
  function playListen(done){playing=true;setPlayLabel(true);recompute(gTiles);layout();var a=ac();if(!a){playing=false;setPlayLabel(false);if(done){done();}return;}var bpm=curBpm(),six=60/bpm/4,beat=60/bpm,cs=a.currentTime+0.12,i,beats=SLOTS/4;var ms=cs+4*beat;for(i=0;i<4;i++){(function(k){var bt=cs+k*beat;clk(a,bt,k===0?1320:990,0.5);})(i);}for(i=0;i<gTiles.length;i++){var t=gTiles[i];if(t.t==="n"){clk(a,ms+t.o*six,1500,0.34);}}for(i=0;i<beats;i++){(function(k){var bt=ms+k*beat;clk(a,bt,k%4===0?1100:880,0.11);})(i);}sweep(gsvg,performance.now()+(ms-a.currentTime)*1000,six,SLOTS);gSet(function(){playing=false;setPlayLabel(false);if(done){done();}},(ms+SLOTS*six-a.currentTime)*1000+120);}
  function registerTap(t){if(!tapActive){return;}if(t<tapMusicStart-WIN){return;}var best=-1,bd=1e9,i;for(i=0;i<tapExp.length;i++){if(tapJudged[i]){continue;}var d=Math.abs(tapExp[i]-t);if(d<bd){bd=d;best=i;}}var a=ac();if(best>=0&&bd<WIN){tapJudged[best]=true;tapHits++;markHit(gsvg,tapSlots[best]);if(a){clk(a,a.currentTime,1500,0.32);}}else{var slot=Math.round((t-tapMusicStart)/tapSix);if(slot<0){slot=0;}if(slot>SLOTS-1){slot=SLOTS-1;}markMissX(gsvg,slot);}}
  function startTap(){playing=true;setPlayLabel(true);clearMarks(gsvg);clearGTimers();clearDrawCanvas();recompute(gTiles);layout();var a=ac();var notes=gTiles.filter(function(t){return t.t==="n";});if(!a){playing=false;setPlayLabel(false);gState="done";setGBox("",DONE_IN);return;}var bpm=curBpm();tapSix=60/bpm/4;var beat=60/bpm,cs=a.currentTime+0.12,beats=SLOTS/4;tapMusicStart=cs+4*beat;tapActive=true;tapExp=[];tapSlots=[];tapJudged=[];tapNotes=notes;tapHits=0;notes.forEach(function(t){tapExp.push(tapMusicStart+t.o*tapSix);tapSlots.push(t.o);tapJudged.push(false);});var i;for(i=0;i<4;i++){(function(k){var bt=cs+k*beat;clk(a,bt,k===0?1320:990,0.5);gSet(function(){setGBox(READY_EY,READY_IN,String(k+1));},Math.max(0,(bt-a.currentTime)*1000));})(i);}gSet(function(){setGBox(TAP_EY,TAP_IN,"",true);},Math.max(0,(tapMusicStart-a.currentTime)*1000));for(i=0;i<notes.length;i++){(function(idx){var fireAt=tapMusicStart+notes[idx].o*tapSix+WIN;gSet(function(){if(tapActive&&!tapJudged[idx]){tapJudged[idx]=true;markMiss(gsvg,notes[idx].o);}},Math.max(0,(fireAt-a.currentTime)*1000));})(i);}for(i=0;i<beats;i++){(function(k){var bt=tapMusicStart+k*beat;clk(a,bt,k%4===0?1100:880,0.3);})(i);}sweep(gsvg,performance.now()+(tapMusicStart-a.currentTime)*1000,tapSix,SLOTS);gState="tap";gSet(function(){tapActive=false;playing=false;setPlayLabel(false);if(walkthroughMode&&!isRandom){walkthroughMode=false;doNextFree();}else{gState="done";setGBox("",DONE_IN);}},(tapMusicStart+SLOTS*tapSix+0.3-a.currentTime)*1000);}
  function onGuidedListen(){if(!guidedActive||playing){return;}if(gState==="tap"){return;}var was=gState;playListen(function(){if(walkthroughMode&&was==="listen"&&gState!=="tap"){gState="turn";gMode="walk-turn";setGBox(TURN_EY,TURN_IN);}});}
  function onGuidedPlay(){if(!guidedActive||playing){return;}if(gState==="tap"){return;}if(gState==="listen"){setGBox(LISTEN_EY,LISTEN_IN);return;}startTap();}
  function doNextFree(){walkthroughMode=false;isRandom=true;gMode="free";gTiles=genTiles(guidedDiff,readBars());gState="free";playing=false;tapActive=false;clearGTimers();clearMarks(gsvg);clearDrawCanvas();draw(gsvg,gTiles,curAid());setGBox(FREE_EY,FREE_IN);}
  function buildGuided(){var stage=document.querySelector(".stage");if(!stage){stage=document.body;}var old=document.getElementById("ob-guided");if(old){old.remove();}var w=document.createElement("div");w.id="ob-guided";w.innerHTML='<h1>Tap the rhythm</h1><svg id="ob-gsvg" viewBox="0 0 720 132" role="img" aria-label="rhythm"></svg><div class="ob-gbox" id="ob-gbox"></div>';stage.appendChild(w);gsvg=document.getElementById("ob-gsvg");gbox=document.getElementById("ob-gbox");draw(gsvg,gTiles,curAid());clearDrawCanvas();aidBtns().forEach(function(b){b.addEventListener("click",function(){if(gsvg&&gTiles){draw(gsvg,gTiles,curAid());}});});gbox.addEventListener("pointerdown",function(e){if(!guidedActive){return;}if(gState==="tap"&&tapActive){e.preventDefault();var a=ac();registerTap(a?a.currentTime:0);return;}if(playing){return;}if(gState==="free"){e.preventDefault();startTap();}else if(gState==="done"){e.preventDefault();doNextFree();}});}
  function startGuided(){guidedActive=true;isRandom=false;clearGTimers();setBars2();var fr=document.getElementById("drill-frame");if(fr){fr.style.display="none";}if(guidedDiff==="easy"){walkthroughMode=true;gMode="walk-listen";gTiles=EASY.tiles;gState="listen";buildGuided();setGBox(LISTEN_EY,LISTEN_IN);}else{walkthroughMode=false;gMode="free";gTiles=HARD.tiles;gState="free";buildGuided();setGBox(FREE_EY,FREE_IN);}}
  function hideGate(){var r=$("#ob-root");if(r){r.style.display="none";}}
  function getTarget(kind){if(kind==="stage"){var st=document.querySelector(".stage");if(st){return st.getBoundingClientRect();}var w=window.innerWidth,h=window.innerHeight;return {left:w*0.13,top:h*0.30,width:w*0.74,height:h*0.22};}var el=kind==="play"?playBtn:kind==="listen"?listenBtn:kind==="draw"?drawBtn:kind==="gear"?gearBtn:kind==="aid"?aidBtn:null;if(!el){return null;}return el.getBoundingClientRect();}
  function wobble(cx,cy,rx,ry){var pts=[],n=26,i;for(i=0;i<=n+3;i++){var t=(i/n)*Math.PI*2;var w=1+0.05*Math.sin(3*t+1.3)+0.035*Math.sin(5*t+0.7);pts.push([cx+rx*w*Math.cos(t),cy+ry*w*Math.sin(t)]);}var d="M "+pts[0][0].toFixed(1)+" "+pts[0][1].toFixed(1);for(i=1;i<pts.length;i++){d+=" L "+pts[i][0].toFixed(1)+" "+pts[i][1].toFixed(1);}return d;}
  function arrowPath(r){var hx=r.left+r.width*0.5,hy=r.top+r.height+2;var tx=hx+30,ty=hy+52;var cxp=(hx+tx)/2+16,cyp=(hy+ty)/2;var shaft="M "+tx.toFixed(1)+" "+ty.toFixed(1)+" Q "+cxp.toFixed(1)+" "+cyp.toFixed(1)+" "+hx.toFixed(1)+" "+hy.toFixed(1);var a1x=hx+9,a1y=hy+11,a2x=hx-8,a2y=hy+9;return shaft+" M "+a1x.toFixed(1)+" "+a1y.toFixed(1)+" L "+hx.toFixed(1)+" "+hy.toFixed(1)+" L "+a2x.toFixed(1)+" "+a2y.toFixed(1);}
  function drawAnno(anno,r){while(anno.firstChild){anno.removeChild(anno.firstChild);}var cx=r.left+r.width/2,cy=r.top+r.height/2,rx=r.width/2+13,ry=r.height/2+13;var e=document.createElementNS(NS,"path");e.setAttribute("d",wobble(cx,cy,rx,ry));e.setAttribute("fill","none");e.setAttribute("stroke","#e8231b");e.setAttribute("stroke-width","3.5");e.setAttribute("stroke-linecap","round");e.setAttribute("stroke-linejoin","round");e.setAttribute("opacity","0.95");anno.appendChild(e);var a=document.createElementNS(NS,"path");a.setAttribute("d",arrowPath(r));a.setAttribute("fill","none");a.setAttribute("stroke","#e8231b");a.setAttribute("stroke-width","3.5");a.setAttribute("stroke-linecap","round");a.setAttribute("stroke-linejoin","round");anno.appendChild(a);}
  function placeTip(rect){var tip=$("#ob-tip");if(!tip){return;}var th=tip.offsetHeight||150;var below=rect.bottom+16;if(below+th>window.innerHeight){below=rect.top-16-th;}var left=rect.left+rect.width/2-165;if(left+330>window.innerWidth-10){left=window.innerWidth-10-330;}if(left<10){left=10;}tip.style.top=Math.max(10,below)+"px";tip.style.left=left+"px";}
  function advance(){if(walkI>=WALK.length-1){overlayOpen=false;clearSpot();if(walkDone){walkDone();}}else{walkI++;showWalkStep();}}
  function showWalkStep(){var step=WALK[walkI];var tgt=getTarget(step.find);var hl=$("#ob-hl"),anno=$("#ob-anno"),tip=$("#ob-tip");if(tgt){var r=tgt,pad=10;hl.style.display="block";hl.style.left=(r.left-pad)+"px";hl.style.top=(r.top-pad)+"px";hl.style.width=(r.width+pad*2)+"px";hl.style.height=(r.height+pad*2)+"px";drawAnno(anno,r);}else{hl.style.display="none";while(anno.firstChild){anno.removeChild(anno.firstChild);}}var last=walkI===WALK.length-1;tip.innerHTML='<div class="step">QUICK TOUR  '+(walkI+1)+' / '+WALK.length+'</div><h4>'+step.h+'</h4><p>'+step.p+'</p><p class="ob-hint">Click anywhere to continue</p><div class="row"><button id="ob-wback"'+(walkI===0?' style="visibility:hidden"':'')+'>Back</button><button id="ob-wnext" class="primary">'+(last?('Begin '+ARR):('Next '+ARR))+'</button></div>';tip.style.transform="";if(tgt){placeTip(tgt);}else{tip.style.left="50%";tip.style.top="50%";tip.style.transform="translate(-50%,-50%)";}var nb=$("#ob-wnext"),bb=$("#ob-wback");nb.addEventListener("click",function(e){e.stopPropagation();advance();});bb.addEventListener("click",function(e){e.stopPropagation();if(walkI>0){walkI--;showWalkStep();}});tip.onclick=function(){advance();};}
  function showWalk(done){clearSpot();overlayOpen=true;walkDone=done;walkI=0;findControls();var r=$("#ob-root");if(r){r.style.display="none";}var hl=document.createElement("div");hl.id="ob-hl";document.body.appendChild(hl);var anno=document.createElementNS(NS,"svg");anno.id="ob-anno";document.body.appendChild(anno);var click=document.createElement("div");click.id="ob-click";click.onclick=function(){advance();};document.body.appendChild(click);var tip=document.createElement("div");tip.id="ob-tip";document.body.appendChild(tip);showWalkStep();}
  var WALK=[
    {find:"play",h:"Play / Stop",p:"Starts the metronome and the exercise. While it is playing, this same button becomes Stop - press it to halt everything and reset."},
    {find:"listen",h:"Listen",p:"Plays the rhythm for you first with a 1-2-3-4 count-in, so you can hear it before you tap."},
    {find:"draw",h:"Draw",p:"Turns on a red drawing layer so you can scribble notes to yourself on the staff before you read or practice a rhythm."},
    {find:"aid",h:"Counting aid",p:"Writes the count under each note - ta / ti for quarters and eighths, and ti-ka-ti-ka (or 1 e + a) for sixteenths - so you can read it out loud as you go."},
    {find:"gear",h:"Settings",p:"More options live here, like the line cursor and the check / cross marks. The counting aid and draw buttons are up in the bar."},
    {find:"stage",h:"The stage",p:"The rhythm appears here. Tap on the beat as it plays - a green "+CHK+" when you land on it, a red "+CRS+" when you drift."}
  ];
  var gateHTML='<div id="ob-card"><div id="ob-eyebrow">Rhythm Reader - Free Play</div><h1 id="ob-q">Are you new to reading rhythms?</h1><p id="ob-sub">Pick a starting point.</p><div id="ob-btns"><button class="no" data-pick="easy">No, let&#39;s take the tour.<small>Try a guided exercise using whole, half, quarter and some eighth notes.</small></button><button class="yes" data-pick="hard">Yes, I&#39;ve read rhythms before<small>Jump right in and explore patterns using whole, half, quarter, eighth and sixteenth note rhythms.</small></button></div></div>';
  function showGate(){clearSpot();overlayOpen=true;var r=$("#ob-root");if(!r){r=document.createElement("div");r.id="ob-root";document.body.appendChild(r);}r.className="gate";r.style.display="flex";r.innerHTML=gateHTML;$$("#ob-btns [data-pick]").forEach(function(b){b.addEventListener("click",function(){var d=b.getAttribute("data-pick");applyChoice(d);startGuided();hideGate();if(d==="easy"){showWalk(function(){gState="listen";gMode="walk-listen";setGBox(LISTEN_EY,LISTEN_IN);});}else{overlayOpen=false;}});});}
  function clearSpot(){["ob-hl","ob-anno","ob-click","ob-tip"].forEach(function(id){var e=document.getElementById(id);if(e){e.remove();}});}
  function isListenEl(t){return !!(t&&t.closest&&(t.closest("[data-listen]")||(t.tagName==="BUTTON"&&/^listen$/i.test((t.textContent||"").trim()))));}
  function isPlayEl(t){return !!(t&&t.closest&&(t.closest("[data-metro-toggle]")||(t.tagName==="BUTTON"&&/^(play|stop)$/i.test((t.textContent||"").trim()))));}
  var CSS="#ob-root{position:fixed;inset:0;z-index:99999;display:flex;align-items:center;justify-content:center;padding:20px;overflow:auto;font-family:system-ui,-apple-system,sans-serif}#ob-root.gate{background:radial-gradient(900px 500px at 15% 10%,rgba(96,165,250,.18),transparent 60%),radial-gradient(800px 460px at 85% 90%,rgba(232,168,62,.16),transparent 60%),rgba(11,16,23,.66);backdrop-filter:blur(3px)}#ob-root *{box-sizing:border-box}#ob-card{position:relative;width:min(660px,94vw);background:var(--praxis-surface,#fff);color:var(--praxis-ink,#111827);border:1px solid var(--praxis-line,#d8dee7);border-radius:20px;box-shadow:0 30px 80px rgba(15,23,42,.45);padding:30px clamp(20px,4vw,40px);overflow:hidden;animation:obpop .3s ease both}#ob-card::before{content:'';position:absolute;left:0;right:0;top:0;height:3px;background:linear-gradient(90deg,var(--praxis-accent,#1d4ed8),#7c3aed)}@keyframes obpop{from{opacity:0;transform:translateY(10px) scale(.98)}to{opacity:1;transform:none}}#ob-eyebrow{font-size:11px;font-weight:900;letter-spacing:.16em;text-transform:uppercase;color:var(--praxis-gold,#e8a83e)}#ob-q{margin:12px 0 6px;font-size:clamp(26px,5vw,42px);line-height:1.03;letter-spacing:-.03em;font-weight:900}#ob-sub{margin:0 0 22px;color:var(--praxis-muted,#5b6472);font-size:15px;line-height:1.6;max-width:48ch}#ob-btns{display:flex;flex-wrap:wrap;gap:12px}#ob-btns button{flex:1 1 220px;min-height:64px;border-radius:14px;border:1px solid var(--praxis-line,#d8dee7);background:var(--praxis-surface,#fff);color:var(--praxis-ink,#111827);font:inherit;font-weight:800;font-size:15px;cursor:pointer;text-align:left;padding:14px 17px;transition:transform .15s,box-shadow .15s,border-color .15s}#ob-btns button small{display:block;font-weight:600;font-size:12px;color:var(--praxis-muted,#5b6472);margin-top:4px}#ob-btns button:hover{transform:translateY(-2px);border-color:var(--praxis-accent,#1d4ed8);box-shadow:0 10px 26px rgba(29,78,216,.18)}#ob-btns .yes{background:linear-gradient(135deg,var(--praxis-accent,#1d4ed8),#7c3aed);border-color:transparent;color:#fff}#ob-btns .yes small{color:rgba(255,255,255,.82)}#ob-hl{position:fixed;border-radius:14px;box-shadow:0 0 0 9999px rgba(11,16,23,.80);pointer-events:none;z-index:100011;transition:all .2s ease}#ob-anno{position:fixed;left:0;top:0;width:100%;height:100%;pointer-events:none;z-index:100012;overflow:visible}#ob-click{position:fixed;inset:0;background:transparent;pointer-events:auto;z-index:100013;cursor:pointer}#ob-tip{position:fixed;z-index:100014;width:min(330px,86vw);background:var(--praxis-surface,#fff);color:var(--praxis-ink,#111827);border:1px solid var(--praxis-line,#d8dee7);border-radius:14px;box-shadow:0 18px 50px rgba(15,23,42,.4);padding:16px 18px;cursor:pointer}#ob-tip h4{margin:0 0 6px;font-size:15px;font-weight:900}#ob-tip p{margin:0 0 10px;color:var(--praxis-muted,#5b6472);font-size:13px;line-height:1.55}#ob-tip .ob-hint{font-size:11px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:var(--praxis-gold,#e8a83e)}#ob-tip .row{display:flex;align-items:center;gap:8px;justify-content:space-between;margin-top:4px}#ob-tip .step{font-size:11px;font-weight:800;color:var(--praxis-gold,#e8a83e);letter-spacing:.1em;margin-bottom:6px}#ob-tip button{border:1px solid var(--praxis-line,#d8dee7);background:var(--praxis-surface,#fff);border-radius:9px;padding:7px 12px;font:inherit;font-weight:800;font-size:12px;cursor:pointer}#ob-tip button.primary{background:linear-gradient(135deg,var(--praxis-accent,#1d4ed8),#7c3aed);color:#fff;border-color:transparent}.stage{position:relative !important}#ob-guided{position:absolute;inset:0;z-index:2;background:#fff;display:flex;flex-direction:column;align-items:center;justify-content:safe center;gap:18px;padding:14px 14px;overflow-y:auto}#ob-guided h1{font-size:clamp(26px,4vw,40px);font-weight:800;color:#1c1917;margin:0;letter-spacing:-.02em}#ob-guided svg{width:min(1040px,96%);height:auto;display:block}.ob-gbox{min-width:300px;max-width:520px;width:64%;min-height:132px;border-radius:16px;background:#ececec;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;cursor:pointer;user-select:none;text-align:center;padding:16px 24px;transition:background .12s}.ob-gbox.tap{outline:none}.ob-gbox .ey{font-size:11px;font-weight:900;letter-spacing:.14em;text-transform:uppercase;color:#b45309}.ob-gbox .s{font-size:15px;line-height:1.45;font-weight:700;color:#44403c;max-width:36ch}.ob-gbox .b{font-size:44px;font-weight:900;color:#1c1917;line-height:1}#draw-canvas{display:none !important}#draw-palette{display:none !important}#ob-drawcanvas{position:fixed;inset:0;z-index:8;pointer-events:none;touch-action:none}[data-metro-gear]{font-size:1.9rem !important;line-height:1 !important;min-height:42px !important;max-height:42px !important;height:42px !important;padding:0 12px !important;display:inline-flex !important;align-items:center !important;justify-content:center !important}[data-metro-gear] svg{width:24px !important;height:24px !important}#mute-btn,.metro-mute,[data-metro-mute]{display:none !important}@media(min-width:861px){.topbar{flex-wrap:nowrap !important;gap:12px !important}.topbar__nav{flex:0 0 auto !important;gap:2px !important}.topbar__nav a{padding:6px 9px !important;font-size:.82rem !important}.metronome--top,.dock{flex:1 1 auto !important;flex-wrap:nowrap !important;justify-content:flex-end !important;gap:8px !important;min-width:0 !important}.metronome--top .metro-toggle,.dock .metro-toggle{min-height:34px !important;padding:5px 11px !important;font-size:12.5px !important}.metronome--top [data-metro-tempo],.dock [data-metro-tempo]{width:100px !important;min-width:72px !important}.metronome--top [data-metro-bpm-input],.dock [data-metro-bpm-input]{width:54px !important;min-width:54px !important}}";
  function injectCSS(){if($("#ob-css")){return;}var s=document.createElement("style");s.id="ob-css";s.textContent=CSS;document.head.appendChild(s);}
  injectCSS();
  window.addEventListener("click",function(e){if(overlayOpen){return;}if(!guidedActive){return;}var t=e.target;if(isListenEl(t)){e.preventDefault();e.stopImmediatePropagation();onGuidedListen();return;}if(isPlayEl(t)){e.preventDefault();e.stopImmediatePropagation();if(playing){stopAll();}else{onGuidedPlay();}return;}},true);
  document.addEventListener("keydown",function(e){if(e.code==="Space"||e.key===" "){if(overlayOpen){e.preventDefault();return;}if(guidedActive){e.preventDefault();e.stopPropagation();if(gState==="tap"&&tapActive){var a=ac();registerTap(a?a.currentTime:0);return;}if(playing){return;}if(gState==="free"){startTap();}else if(gState==="done"){doNextFree();}else if(gState==="turn"){startTap();}else if(gState==="listen"){setGBox(LISTEN_EY,LISTEN_IN);}return;}}if(e.key==="Escape"&&guidedActive&&!overlayOpen){stopAll();}},true);
  window.addEventListener("resize",function(){var tip=$("#ob-tip");if(tip&&WALK[walkI]){var tgt=getTarget(WALK[walkI].find);if(tgt){placeTip(tgt);}}if(guidedActive&&gsvg&&gTiles){draw(gsvg,gTiles,curAid());}});
  initBars();
  applyBarOptions("easy");
  hideMuteBtns();
  findControls();
  installDraw();
  showGate();
})();
