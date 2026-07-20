(function(){
  var IS_COOP=(window.__PRAXIS_COOP===true)||/[?&]praxis=coop\b/.test(location.search);
  var _ov=null,_ovT=null,_ovBusy=false;
  function watchOverlays(fn){
    function attach(){ var el=document.getElementById('spoergsmaal'); if(!el){setTimeout(attach,250);return;} if(_ovT===el)return;
      if(_ov){try{_ov.disconnect();}catch(e){}} _ovT=el;
      _ov=new MutationObserver(function(){ if(_ovBusy)return; _ovBusy=true; setTimeout(function(){_ovBusy=false; fn();},90); });
      _ov.observe(el,{childList:true,subtree:true}); }
    attach();
  }
  function withPausedWatch(fn){ if(_ov){try{_ov.disconnect();}catch(e){}} fn();
    requestAnimationFrame(function(){ if(_ov&&_ovT){try{_ov.observe(_ovT,{childList:true,subtree:true});}catch(e){}} }); }
  function findSvg(){ var c=document.getElementById('spoergsmaal'); if(!c)return null;
    if(c.tagName&&c.tagName.toLowerCase()==='svg')return c; return c.querySelector('svg'); }

  /* shared beat clock (quarter-note pulse to parent for synced audio+lights) */
  var _beatTimer=null,_beatCount=0;
  function stopBeatClock(){ if(_beatTimer){clearInterval(_beatTimer);_beatTimer=null;} }
  function startBeatClock(tempo){ stopBeatClock(); _beatCount=0; var ms=Math.max(120,60000/(tempo||88));
    function tick(){ try{ if(window.parent&&window.parent!==window)window.parent.postMessage({type:'metro-beat',beat:_beatCount,accent:(_beatCount%4===0)},'*'); }catch(e){} _beatCount++; }
    tick(); _beatTimer=setInterval(tick,ms); }

  /* shared counting-aid renderer */
  function makeRenderAids(getRendered,getOwner,getMode){
    return function(){
      try{
        var svg=findSvg(); if(!svg)return;
        var old=svg.querySelectorAll('text.praxis-aid'),k; for(k=0;k<old.length;k++){if(old[k].parentNode)old[k].parentNode.removeChild(old[k]);}
        var mode=getMode(); if(mode==='none')return;
        var rr=getRendered(); if(!rr||!rr.bars)return; var owner=getOwner?getOwner():null; var ns='http://www.w3.org/2000/svg';
        for(var b=0;b<rr.bars.length;b++){ var comps=rr.bars[b].components||[];
          for(var c=0;c<comps.length;c++){ var co=comps[c]; if(!co||co.rest)continue; var x=co.x,y=co.y; if(!(isFinite(x)&&isFinite(y)))continue;
            var pos=(co.position!=null)?co.position:0; var beat=Math.floor(pos/144)+1, isPlus=(pos%144)>=72;
            var label=(mode==='syllables')?((co.length>=144)?'ta':'ti'):(isPlus?'+':String(beat));
            var t=document.createElementNS(ns,'text'); t.setAttribute('class','praxis-aid');
            t.setAttribute('x',x); t.setAttribute('y',y+34); t.setAttribute('text-anchor','middle');
            t.setAttribute('font-size','13'); t.setAttribute('font-family','system-ui, sans-serif'); t.setAttribute('font-weight','700');
            t.setAttribute('fill',(owner&&owner[b]==='B')?'#b45309':'#1d4ed8'); t.textContent=label; svg.appendChild(t); } }
      }catch(e){console.log('[bridge] aid err',e&&e.message);}
    };
  }

  /* shared line-cursor renderer */
  function makeCursor(getRendered){
    var line=null,raf=null,svg=null;
    function geom(){
      svg=findSvg(); if(!svg||!getRendered()||!getRendered().bars)return null;
      var rr=getRendered(),minX=1e9,maxX=-1e9,minY=1e9,maxY=-1e9,any=false;
      for(var b=0;b<rr.bars.length;b++){ var comps=rr.bars[b].components||[];
        for(var c=0;c<comps.length;c++){ var co=comps[c]; if(co&&isFinite(co.x)&&isFinite(co.y)){any=true;
          if(co.x<minX)minX=co.x; if(co.x>maxX)maxX=co.x; if(co.y<minY)minY=co.y; if(co.y>maxY)maxY=co.y; } } }
      if(!any)return null;
      return {minX:minX-22,maxX:maxX+22,top:minY-40,bot:maxY+46};
    }
    function ensure(){
      var g=geom(); if(!g)return null;
      if(svg!==findSvg()){ line=null; }
      svg=findSvg();
      if(!line){ line=document.createElementNS('http://www.w3.org/2000/svg','rect');
        line.setAttribute('class','praxis-cursor'); line.setAttribute('width','3'); line.setAttribute('rx','1.5');
        line.setAttribute('fill','#dc2626'); line.setAttribute('opacity','0.9'); line.setAttribute('pointer-events','none');
        svg.appendChild(line); }
      line.setAttribute('x',g.minX); line.setAttribute('y',g.top); line.setAttribute('height',Math.max(20,g.bot-g.top));
      return g;
    }
    function stop(){ if(raf){cancelAnimationFrame(raf);raf=null;} if(line&&line.parentNode)line.parentNode.removeChild(line); line=null; }
    function play(tempo,onDone){
      stop(); var g=ensure(); if(!g){ if(onDone)onDone(); return; }
      var dur=Math.max(300,getRendered().bars.length*576*(60000/(tempo||88)/144));
      var t0=performance.now(), span=(g.maxX-g.minX)||1;
      function fr(now){ var pr=(now-t0)/dur; if(pr>=1)pr=1;
        if(line){ line.setAttribute('x',g.minX+pr*span); line.setAttribute('opacity','0.9'); }
        if(pr<1){ raf=requestAnimationFrame(fr); } else { if(onDone)onDone(); } }
      raf=requestAnimationFrame(fr);
    }
    return {play:play,stop:stop};
  }

  /* ===================== CO-OP BRANCH ===================== */
  if(IS_COOP){
  (function(){
    ['RhythmPlayer','Rhythm','RhythmComponent','RhythmImage','Afspilning','Toneafspilning','Nodebillede','Opgave'].forEach(function(n){
      try{ if(!window['Music'+n]&&window['Musikipedia'+n])window['Music'+n]=window['Musikipedia'+n]; }catch(e){} });
    var playing=false,rhythmObj=null,rhythmImage=null,renderedRhythm=null;
    var flowState='init',exerciseCount=0,currentTempo=88;
    var numBars=8,splitMode='2s',lastData=null,owner=[],seq=0;
    var settings={loop:false,ab:true,cue:true,metroSound:true,master:false,marks:true,cursor:true};
    var aidMode='none',runId=0,completedId=-1,clockTimer=null,clockEighth=0;
    console.log('[coop-bridge] co-op branch active');
    document.addEventListener('keydown',function(e){ if(e.key===' '||e.code==='Space'){e.preventDefault();e.stopImmediatePropagation();} if(e.key==='a'||e.key==='A'||e.key==='l'||e.key==='L'){ e.preventDefault(); tap(); } },true);
    function P(){return window.MusicRhythmPlayer||null;}
    var cursor=makeCursor(function(){return renderedRhythm;});
    (function(){ var p=P(); if(!p)return; var origInit=p.initialisation;
      p.initialisation=function(cfg){
        if(cfg.rhythmImage)rhythmImage=cfg.rhythmImage; cfg.unitsPerStep=72;
        cfg.includeCountIn=true; cfg.includePlaying=true; cfg.includeTapping=true; cfg.includeCountOut=false;
        cfg.markNotesDuringTapping=!!settings.marks;
        cfg.finishedTappingCallback=function(){ completeExercise(); };
        cfg.afterStoppingCallback=function(){ completeExercise(); };
        var origStatus=cfg.changeStatusCallback;
        cfg.changeStatusCallback=function(s){
          if(s==='countin'){ startBeatClock(currentTempo); }
          if(s==='play'){ flowState='playing'; if(settings.cursor)cursor.play(currentTempo); }
          if(s==='tap'){ flowState='playing'; startClock(); startBeatClock(currentTempo); if(settings.cursor)cursor.play(currentTempo); }
          if(s==='stop'||s==='countout'){ stopClock(); stopBeatClock(); cursor.stop(); if(flowState==='playing'){flowState='stopping';completeExercise();} }
          if(origStatus)origStatus(s);
        };
        return origInit.call(this,cfg);
      };
      var origSR=p.setRhythm; p.setRhythm=function(t){ rhythmObj=t; return origSR.apply(this,arguments); };
    })();
    function randBar(){ var beats=[],i; for(i=0;i<4;i++){ if(Math.random()<0.30)beats.push([{length:72,rest:false},{length:72,rest:false}]); else beats.push([{length:144,rest:false}]); }
      var comps=[],idx=0; while(idx<4){ var rem=4-idx,r=Math.random(),g=1; if(rem>=4&&r<0.10)g=4; else if(rem>=2&&r<0.32)g=2;
        if(g===4)comps.push({length:576,rest:false}); else if(g===2)comps.push({length:288,rest:false}); else comps=comps.concat(beats[idx]); idx+=g; } return {components:comps}; }
    function randRhythm(){ var bars=[],i; for(i=0;i<numBars;i++)bars.push(randBar()); return {metricalStructure:"4/4",bars:bars}; }
    function computeSplit(n,mode){ var o=[],i,block=(mode==='4s')?4:2; if(n<=4)block=2; for(i=0;i<n;i++)o.push((Math.floor(i/block)%2===0)?'A':'B'); return o; }
    function setInfo(t,s,img){ if(!rhythmImage)return; try{ rhythmImage.setInfoBoxText(t); rhythmImage.setInfoBoxState(s||''); if(img!==undefined)rhythmImage.setInfoBoxImage(img); }catch(e){} }
    function applyTempo(){ if(rhythmObj&&rhythmObj.metricalStructure)rhythmObj.metricalStructure.tempo=currentTempo; }
    function postSplit(){ post({type:'coop-split',seq:seq,numBars:numBars,splitMode:splitMode,owner:owner,bars:lastData?lastData.bars:[]}); }
    var renderAids=makeRenderAids(function(){return renderedRhythm;},function(){return owner;},function(){return aidMode;});
    function refreshOverlays(){ withPausedWatch(function(){ renderAB(); renderAids(); }); }
    function renderAB(){
      try{ var svg=findSvg(); if(!svg)return;
        var old=svg.querySelectorAll('.praxis-ab,.praxis-ab-lbl'),k; for(k=0;k<old.length;k++){if(old[k].parentNode)old[k].parentNode.removeChild(old[k]);}
        if(!settings.ab||!renderedRhythm||!renderedRhythm.bars)return; var ns='http://www.w3.org/2000/svg';
        for(var b=0;b<renderedRhythm.bars.length;b++){ var comps=renderedRhythm.bars[b].components||[],minX=1e9,maxX=-1e9,minY=1e9,maxY=-1e9,any=false;
          for(var c=0;c<comps.length;c++){var co=comps[c]; if(co&&isFinite(co.x)&&isFinite(co.y)){any=true; if(co.x<minX)minX=co.x; if(co.x>maxX)maxX=co.x; if(co.y<minY)minY=co.y; if(co.y>maxY)maxY=co.y;}}
          if(!any)continue; var left=minX-16,right=maxX+16; if(right-left<70){var mid=(left+right)/2;left=mid-35;right=mid+35;}
          var top=minY-30,h=(maxY-minY)+54, ow=owner[b]||'A';
          var rect=document.createElementNS(ns,'rect'); rect.setAttribute('class','praxis-ab');
          rect.setAttribute('x',left);rect.setAttribute('y',top);rect.setAttribute('width',right-left);rect.setAttribute('height',h);
          rect.setAttribute('rx','6');rect.setAttribute('fill',ow==='B'?'#e8a83e':'#1d4ed8');rect.setAttribute('opacity','0.13');rect.setAttribute('pointer-events','none');
          if(svg.firstChild)svg.insertBefore(rect,svg.firstChild); else svg.appendChild(rect);
          var lbl=document.createElementNS(ns,'text'); lbl.setAttribute('class','praxis-ab-lbl');
          lbl.setAttribute('x',(left+right)/2);lbl.setAttribute('y',top+12);lbl.setAttribute('text-anchor','middle');
          lbl.setAttribute('font-size','12');lbl.setAttribute('font-weight','800');lbl.setAttribute('font-family','system-ui,sans-serif');
          lbl.setAttribute('fill',ow==='B'?'#b45309':'#1d4ed8');lbl.setAttribute('opacity','0.85');lbl.setAttribute('pointer-events','none');
          lbl.textContent=ow; svg.appendChild(lbl); }
      }catch(e){console.log('[coop] ab err',e&&e.message);}
    }
    function showExercise(data){
      var p=P(); if(!p||!rhythmImage)return; try{p.stop();}catch(e){} stopClock(); cursor.stop(); lastData=data;
      var rhythm=new MusicRhythm(data); rhythmImage.setRhythm(rhythm); renderedRhythm=rhythmImage.getRhythm(); p.setRhythm(renderedRhythm);
      applyTempo(); if(!settings.metroSound||settings.master){try{p.removeMetronome();}catch(e){}}
      try{p.setMarkNotesDuringTapping(!!settings.marks);}catch(e){}
      rhythmImage.showInfoBox(true); p.showButton();
      owner=computeSplit(numBars,splitMode); seq++; flowState='showing'; setInfo('Press Play','','1'); postSplit(); post({type:'praxis-new-exercise'});
      renderAB(); renderAids(); setTimeout(function(){renderAB();renderAids();},160); watchOverlays(refreshOverlays);
      console.log('[coop-bridge] rendered bars='+numBars+' split='+splitMode+' svg='+(findSvg()?'found':'MISSING'));
    }
    function nextExercise(){ exerciseCount++; showExercise(randRhythm()); post({type:'drill-state',playing:false,exercise:exerciseCount}); }
    function beginPlay(){ var p=P(); if(!p)return; try{if(window.Howler&&window.Howler.ctx&&window.Howler.ctx.state==='suspended')window.Howler.ctx.resume();}catch(e){}
      applyTempo(); runId++; completedId=-1; flowState='playing'; playing=true; try{p.play();}catch(e){} post({type:'drill-state',playing:true,mode:'play'}); }
    function hardStop(){ var p=P(); try{if(p)p.stop();}catch(e){} try{if(p)p.skipCountOut();}catch(e){} try{if(window.Howler&&typeof window.Howler.stop==='function')window.Howler.stop();}catch(e){} stopClock(); cursor.stop(); playing=false; }
    function completeExercise(){ if(completedId===runId)return; completedId=runId; hardStop();
      if(settings.loop){ setTimeout(function(){ if(lastData){ showExercise(lastData); beginPlay(); } },500); }
      else { flowState='done'; post({type:'drill-state',playing:false}); } }
    function setTempo(b){ if(!b)return; currentTempo=b; applyTempo(); }
    function post(m){ try{if(window.parent&&window.parent!==window)window.parent.postMessage(m,'*');}catch(e){} }
    function tickClock(){ var bar=Math.floor(clockEighth/8); if(bar>=numBars)bar=numBars-1; var eib=clockEighth%8, ow=owner[bar]||'A'; post({type:'coop-beat',bar:bar,eighthInBar:eib,owner:ow}); clockEighth++; }
    function startClock(){ stopClock(); clockEighth=0; tickClock(); clockTimer=setInterval(tickClock,30000/currentTempo); }
    function stopClock(){ if(clockTimer){clearInterval(clockTimer);clockTimer=null;} }
    function tap(){ var p=P(); if(p&&typeof p.tap==='function'){try{p.tap();}catch(e){try{p.tap(performance.now());}catch(e2){}}} }
    window.addEventListener('message',function(ev){ var d=ev.data; if(!d)return;
      if(d.type==='praxis-metro'){ if(d.tempo!=null)setTempo(d.tempo);
        if(d.playing){ if(flowState==='showing'||flowState==='done'||flowState==='init'){ if(flowState!=='showing'){exerciseCount++;showExercise(randRhythm());} beginPlay(); } else if(!playing){beginPlay();} }
        else { hardStop(); flowState='done'; post({type:'drill-state',playing:false}); } }
      else if(d.type==='praxis-tap'){ tap(); }
      else if(d.type==='praxis-bars'){ var nb=d.bars||8; if(nb===numBars)return; numBars=nb; hardStop(); exerciseCount++; showExercise(randRhythm()); if(playing)beginPlay(); }
      else if(d.type==='praxis-split'){ splitMode=d.split||'2s'; owner=computeSplit(numBars,splitMode); postSplit(); renderAB(); renderAids(); }
      else if(d.type==='praxis-aid'){ aidMode=d.mode||'none'; renderAids(); }
      else if(d.type==='praxis-mute'){ try{if(window.Howler)window.Howler.mute(!!d.muted);}catch(e){} }
      else if(d.type==='praxis-settings'){ if(d.settings){ for(var k in d.settings){ if(k in settings)settings[k]=d.settings[k]; } } try{P().setMarkNotesDuringTapping(!!settings.marks);}catch(e){} renderAB(); }
    });
    (function(){ var hidden=false; function tryHide(){ if(hidden)return; var els=document.querySelectorAll('*'),i; for(i=0;i<els.length;i++){ var el=els[i]; if(el.children.length<=6&&/TEMPO/i.test(el.textContent)&&el.textContent.length<40){ var pEl=el,j; for(j=0;j<4&&pEl.parentElement;j++)pEl=pEl.parentElement; pEl.style.setProperty('display','none','important'); hidden=true; return; } } } try{var obs=new MutationObserver(function(){tryHide();});obs.observe(document.documentElement,{childList:true,subtree:true});}catch(e){} setTimeout(tryHide,1500);setTimeout(tryHide,4000);setTimeout(tryHide,9000); })();
    window.addEventListener('load',function(){ setTimeout(function(){
      if(window.MusicOpgave){ try{window.MusicOpgave.userHasAnsweredTheRequiredNumberOfQuestionsCorrectly=function(){return false;};}catch(e){} try{window.MusicOpgave.forkertSvar=function(){};}catch(e){} }
      nextExercise(); post({type:'drill-ready',tempo:currentTempo}); },1000); });
  })();
  return;
  }

  /* ===================== FREE-PLAY BRANCH ===================== */
  (function(){
    ['RhythmPlayer','Rhythm','RhythmComponent','RhythmImage','Afspilning','Toneafspilning','Nodebillede','Opgave'].forEach(function(n){
      try{ if(!window['Music'+n]&&window['Musikipedia'+n])window['Music'+n]=window['Musikipedia'+n]; }catch(e){} });
    var playing=false,audioUnlocked=false,rhythmObj=null,rhythmImage=null,renderedRhythm=null;
    var flowState='init',exerciseCount=0,numBars=2,currentTempo=88;
    var fsettings={metroSound:true,master:false,marks:true,cursor:true}, aidMode='none';
    function P(){return window.MusicRhythmPlayer||null;}
    var cursor=makeCursor(function(){return renderedRhythm;});
    (function(){ var p=P(); if(!p)return; var origInit=p.initialisation;
      p.initialisation=function(cfg){ if(cfg.rhythmImage)rhythmImage=cfg.rhythmImage; cfg.unitsPerStep=72;
        cfg.includeCountIn=true; cfg.includePlaying=true; cfg.includeTapping=true; cfg.includeCountOut=false;
        cfg.markNotesDuringTapping=!!fsettings.marks;
        cfg.finishedTappingCallback=function(){ onExerciseComplete(); };
        var origStatus=cfg.changeStatusCallback;
        cfg.changeStatusCallback=function(s){
          if(s==='countin'){startBeatClock(currentTempo);}
          if(s==='play'){ if(fsettings.cursor)cursor.play(currentTempo); }
          if(s==='tap'){ flowState='tapping'; startBeatClock(currentTempo); if(fsettings.cursor)cursor.play(currentTempo); }
          if(s==='stop'||s==='countout'){ stopBeatClock(); cursor.stop(); }
          if(origStatus)origStatus(s);
        };
        return origInit.call(this,cfg); };
      var origSR=p.setRhythm; p.setRhythm=function(t){ rhythmObj=t; return origSR.apply(this,arguments); }; })();
    function randBar(){ var beats=[],i; for(i=0;i<4;i++){ if(Math.random()<0.30)beats.push([{length:72,rest:false},{length:72,rest:false}]); else beats.push([{length:144,rest:false}]); }
      var comps=[],idx=0; while(idx<4){ var rem=4-idx,r=Math.random(),g=1; if(rem>=4&&r<0.10)g=4; else if(rem>=2&&r<0.32)g=2;
        if(g===4)comps.push({length:576,rest:false}); else if(g===2)comps.push({length:288,rest:false}); else comps=comps.concat(beats[idx]); idx+=g; } return {components:comps}; }
    function randRhythm(){ var bars=[],i; for(i=0;i<numBars;i++)bars.push(randBar()); return {metricalStructure:"4/4",bars:bars}; }
    function setInfo(text,state,img){ if(!rhythmImage)return; try{ rhythmImage.setInfoBoxText(text); rhythmImage.setInfoBoxState(state||''); if(img!==undefined)rhythmImage.setInfoBoxImage(img); }catch(e){} }
    function applyTempo(){ if(rhythmObj&&rhythmObj.metricalStructure)rhythmObj.metricalStructure.tempo=currentTempo; }
    var renderAids=makeRenderAids(function(){return renderedRhythm;},null,function(){return aidMode;});
    function refreshOverlays(){ withPausedWatch(function(){ renderAids(); }); }
    function showExercise(data){ var p=P(); if(!p||!rhythmImage)return; try{p.stop();}catch(e){} cursor.stop();
      var rhythm=new MusicRhythm(data); rhythmImage.setRhythm(rhythm); renderedRhythm=rhythmImage.getRhythm(); p.setRhythm(renderedRhythm);
      applyTempo(); if(!fsettings.metroSound||fsettings.master){try{p.removeMetronome();}catch(e){}}
      try{p.setMarkNotesDuringTapping(!!fsettings.marks);}catch(e){}
      rhythmImage.showInfoBox(true); p.showButton();
      flowState='showing'; setInfo('Click to start','','1'); post({type:'praxis-new-exercise'}); renderAids(); setTimeout(renderAids,160); watchOverlays(refreshOverlays); }
    function nextExercise(){ exerciseCount++; showExercise(randRhythm()); post({type:'drill-state',playing:false,exercise:exerciseCount}); }
    function unlockAudio(){ try{ if(window.Howler&&window.Howler.ctx&&window.Howler.ctx.state==='suspended')window.Howler.ctx.resume(); }catch(e){} if(audioUnlocked)return;
      try{ if(window.Howler){ window.Howler.mute(false); if(typeof window.Howler.volume==='function')window.Howler.volume(1); } var AC=window.AudioContext||window.webkitAudioContext; if(AC){var c=new AC(); if(c.state==='suspended')c.resume(); c.close&&c.close();} audioUnlocked=true; }catch(e){} }
    function beginPlay(){ var p=P(); if(!p)return; unlockAudio(); applyTempo(); flowState='playing'; playing=true; try{p.play();}catch(e){} post({type:'drill-state',playing:true,mode:'play'}); }
    function hardStop(){ var p=P(); try{if(p)p.stop();}catch(e){} try{if(p)p.skipCountOut();}catch(e){} try{if(window.Howler&&typeof window.Howler.stop==='function')window.Howler.stop();}catch(e){} cursor.stop(); playing=false; }
    function onExerciseComplete(){ hardStop(); flowState='done'; setInfo('Click for next','√',''); post({type:'drill-state',playing:false}); }
    function setTempo(b){ if(!b)return; currentTempo=b; applyTempo(); }
    function tap(){ var p=P(); if(p&&typeof p.tap==='function'){try{p.tap();}catch(e){try{p.tap(performance.now());}catch(e2){}}} }
    function post(m){ try{if(window.parent&&window.parent!==window)window.parent.postMessage(m,'*');}catch(e){} }
    function handleActivate(){ if(flowState==='init'||flowState==='done'){ nextExercise(); } else if(flowState==='showing'){ beginPlay(); } else if(flowState==='playing'||flowState==='tapping'){ tap(); post({type:'drill-tap'}); } }
    document.addEventListener('pointerdown',function(e){ var t=e.target; if(t&&t.closest&&(t.closest('input')||t.closest('button')||t.closest('select')||t.closest('a')))return; e.preventDefault(); handleActivate(); },true);
    document.addEventListener('click',function(e){e.preventDefault();e.stopPropagation();},true);
    document.addEventListener('keydown',function(e){ if(e.repeat)return; if(e.key===' '||e.code==='Space'||e.key==='v'||e.key==='V'||e.key==='b'||e.key==='B'){e.preventDefault();handleActivate();} },true);
    function transportPlay(){ if(playing)return; if(flowState==='showing'){ beginPlay(); } else { exerciseCount++; showExercise(randRhythm()); beginPlay(); } }
    function transportStop(){ if(!playing&&flowState!=='playing'&&flowState!=='tapping')return; hardStop(); flowState='done'; setInfo('Click for next','',''); post({type:'drill-state',playing:false}); }
    window.addEventListener('message',function(ev){ var d=ev.data; if(!d)return;
      if(d.type==='praxis-metro'){ if(d.tempo!=null)setTempo(d.tempo); if(d.playing)transportPlay(); else transportStop(); }
      else if(d.type==='praxis-tap'){ if(flowState==='playing'||flowState==='tapping')tap(); else handleActivate(); }
      else if(d.type==='praxis-bars'){ var nb=d.bars||2; if(nb===numBars)return; numBars=nb; if(playing){ hardStop(); exerciseCount++; showExercise(randRhythm()); beginPlay(); } else { nextExercise(); } }
      else if(d.type==='praxis-aid'){ aidMode=d.mode||'none'; renderAids(); }
      else if(d.type==='praxis-mute'){ try{if(window.Howler)window.Howler.mute(!!d.muted);}catch(e){} }
      else if(d.type==='praxis-settings'){ if(d.settings){ if('metroSound' in d.settings)fsettings.metroSound=d.settings.metroSound; if('master' in d.settings)fsettings.master=d.settings.master; if('marks' in d.settings)fsettings.marks=d.settings.marks; if('cursor' in d.settings)fsettings.cursor=d.settings.cursor; } try{P().setMarkNotesDuringTapping(!!fsettings.marks);}catch(e){} }
    });
    (function(){ var hidden=false; function tryHide(){ if(hidden)return; var els=document.querySelectorAll('*'),i; for(i=0;i<els.length;i++){ var el=els[i]; if(el.children.length<=6&&/TEMPO/i.test(el.textContent)&&el.textContent.length<40){ var pEl=el,j; for(j=0;j<4&&pEl.parentElement;j++)pEl=pEl.parentElement; pEl.style.setProperty('display','none','important'); hidden=true; return; } } } try{var obs=new MutationObserver(function(){tryHide();});obs.observe(document.documentElement,{childList:true,subtree:true});}catch(e){} setTimeout(tryHide,1500);setTimeout(tryHide,4000);setTimeout(tryHide,9000); })();
    window.addEventListener('load',function(){ setTimeout(function(){
      if(window.MusicOpgave){ try{window.MusicOpgave.userHasAnsweredTheRequiredNumberOfQuestionsCorrectly=function(){return false;};}catch(e){} try{window.MusicOpgave.forkertSvar=function(){};}catch(e){} }
      nextExercise(); post({type:'drill-ready',tempo:currentTempo}); },1000); });
  })();
})();
