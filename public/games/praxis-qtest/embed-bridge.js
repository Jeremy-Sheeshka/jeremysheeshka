(function(){
  var IS_COOP = (window.__PRAXIS_COOP===true) || /[?&]praxis=coop\b/.test(location.search);

  /* ===================== CO-OP BRANCH ===================== */
  if(IS_COOP){
  (function(){
    ['RhythmPlayer','Rhythm','RhythmComponent','RhythmImage','Afspilning','Toneafspilning','Nodebillede','Opgave'].forEach(function(n){
      try{ if(!window['Music'+n] && window['Musikipedia'+n]) window['Music'+n]=window['Musikipedia'+n]; }catch(e){}
    });
    var playing=false, rhythmObj=null, rhythmImage=null, renderedRhythm=null;
    var flowState='init', exerciseCount=0, currentTempo=88;
    var numBars=8, splitMode='2s', lastData=null, owner=[], seq=0;
    var settings={loop:false};
    var clockTimer=null, clockEighth=0;
    var runId=0, completedId=-1, aidMode='none';

    function P(){return window.MusicRhythmPlayer||null;}
    (function(){
      var p=P(); if(!p)return;
      var origInit=p.initialisation;
      p.initialisation=function(cfg){
        if(cfg.rhythmImage) rhythmImage=cfg.rhythmImage;
        cfg.unitsPerStep=72;
        cfg.finishedTappingCallback=function(){ completeExercise(); };
        cfg.afterStoppingCallback=function(){ completeExercise(); };
        var origStatus=cfg.changeStatusCallback;
        cfg.changeStatusCallback=function(s){
          if(s==='play'||s==='tap'){ flowState='playing'; startClock(); }
          if(s==='stop'||s==='countout'){ stopClock(); if(flowState==='playing'){ flowState='stopping'; completeExercise(); } }
          if(origStatus)origStatus(s);
        };
        return origInit.call(this,cfg);
      };
      var origSR=p.setRhythm;
      p.setRhythm=function(t){ rhythmObj=t; return origSR.apply(this,arguments); };
    })();

    function randBar(){
      var beats=[],i;
      for(i=0;i<4;i++){
        if(Math.random()<0.30) beats.push([{length:72,rest:false},{length:72,rest:false}]);
        else beats.push([{length:144,rest:false}]);
      }
      var comps=[],idx=0;
      while(idx<4){
        var rem=4-idx,r=Math.random(),g=1;
        if(rem>=4&&r<0.10)g=4; else if(rem>=2&&r<0.32)g=2;
        if(g===4)comps.push({length:576,rest:false});
        else if(g===2)comps.push({length:288,rest:false});
        else comps=comps.concat(beats[idx]);
        idx+=g;
      }
      return {components:comps};
    }
    function randRhythm(){ var bars=[],i; for(i=0;i<numBars;i++)bars.push(randBar()); return {metricalStructure:"4/4",bars:bars}; }
    function computeSplit(n,mode){ var o=[],i,block=(mode==='4s')?4:2; if(n<=4)block=2; for(i=0;i<n;i++){ o.push((Math.floor(i/block)%2===0)?'A':'B'); } return o; }
    function setInfo(t,s,img){ if(!rhythmImage)return; try{ rhythmImage.setInfoBoxText(t); rhythmImage.setInfoBoxState(s||''); if(img!==undefined)rhythmImage.setInfoBoxImage(img); }catch(e){} }
    function applyTempo(){ if(rhythmObj&&rhythmObj.metricalStructure)rhythmObj.metricalStructure.tempo=currentTempo; }
    function postSplit(){ post({type:'coop-split', seq:seq, numBars:numBars, splitMode:splitMode, owner:owner, bars:lastData?lastData.bars:[]}); }

    /* counting aids drawn UNDER each notehead (inside the iframe's SVG) */
    function renderAids(){
      try{
        var svg=document.querySelector('#spoergsmaal svg');
        if(!svg)return;
        var old=svg.querySelectorAll('text.praxis-aid'),k;
        for(k=0;k<old.length;k++){ if(old[k].parentNode)old[k].parentNode.removeChild(old[k]); }
        if(aidMode==='none'||!renderedRhythm||!renderedRhythm.bars)return;
        var ns='http://www.w3.org/2000/svg';
        for(var b=0;b<renderedRhythm.bars.length;b++){
          var comps=renderedRhythm.bars[b].components||[];
          for(var c=0;c<comps.length;c++){
            var comp=comps[c];
            if(!comp||comp.rest)continue;
            var x=comp.x, y=comp.y;
            if(!(isFinite(x)&&isFinite(y)))continue;
            var pos=(comp.position!=null)?comp.position:0;
            var beat=Math.floor(pos/144)+1, isPlus=(pos%144)>=72;
            var label;
            if(aidMode==='syllables'){ label=(comp.length>=144)?'ta':'ti'; }
            else { label=isPlus?'+':String(beat); }
            var t=document.createElementNS(ns,'text');
            t.setAttribute('class','praxis-aid');
            t.setAttribute('x',x); t.setAttribute('y',y+34);
            t.setAttribute('text-anchor','middle');
            t.setAttribute('font-size','13');
            t.setAttribute('font-family','system-ui, sans-serif');
            t.setAttribute('font-weight','700');
            t.setAttribute('fill', (owner[b]==='B')?'#b45309':'#1d4ed8');
            t.textContent=label;
            svg.appendChild(t);
          }
        }
      }catch(e){ console.log('[coop] aid err', e&&e.message); }
    }

    function showExercise(data){
      var p=P(); if(!p||!rhythmImage)return;
      try{p.stop();}catch(e){} stopClock();
      lastData=data;
      var rhythm=new MusicRhythm(data);
      rhythmImage.setRhythm(rhythm);
      renderedRhythm=rhythmImage.getRhythm();
      p.setRhythm(renderedRhythm);
      applyTempo();
      try{p.removeMetronome();}catch(e){}
      rhythmImage.showInfoBox(true); p.showButton(); p.setMarkNotesDuringTapping(false);
      owner=computeSplit(numBars,splitMode); seq++;
      flowState='showing';
      setInfo('Press Play','','1');
      postSplit();
      renderAids();
      setTimeout(renderAids,160);
    }
    function nextExercise(){ exerciseCount++; showExercise(randRhythm()); post({type:'drill-state',playing:false,exercise:exerciseCount}); }

    function beginPlay(){
      var p=P(); if(!p)return;
      try{ if(window.Howler&&window.Howler.ctx&&window.Howler.ctx.state==='suspended')window.Howler.ctx.resume(); }catch(e){}
      applyTempo(); runId++; completedId=-1; flowState='playing'; playing=true;
      try{p.play();}catch(e){}
      post({type:'drill-state',playing:true});
    }
    function hardStop(){
      var p=P();
      try{if(p)p.stop();}catch(e){} try{if(p)p.skipCountOut();}catch(e){}
      try{if(window.Howler&&typeof window.Howler.stop==='function')window.Howler.stop();}catch(e){}
      stopClock(); playing=false;
    }
    function completeExercise(){
      if(completedId===runId)return; completedId=runId;
      hardStop();
      if(settings.loop){ setTimeout(function(){ if(lastData){ showExercise(lastData); beginPlay(); } },500); }
      else { flowState='done'; post({type:'drill-state',playing:false}); }
    }
    function setTempo(b){ if(!b)return; currentTempo=b; applyTempo(); }
    function tap(){ var p=P(); if(p&&typeof p.tap==='function'){ try{p.tap();}catch(e){} } }
    function post(m){ try{if(window.parent&&window.parent!==window)window.parent.postMessage(m,'*');}catch(e){} }

    function tickClock(){
      var bar=Math.floor(clockEighth/8); if(bar>=numBars)bar=numBars-1;
      var eib=clockEighth%8, ow=owner[bar]||'A';
      post({type:'coop-beat', bar:bar, eighthInBar:eib, owner:ow});
      clockEighth++;
    }
    function startClock(){ stopClock(); clockEighth=0; tickClock(); clockTimer=setInterval(tickClock, 30000/currentTempo); }
    function stopClock(){ if(clockTimer){clearInterval(clockTimer);clockTimer=null;} }

    window.addEventListener('message',function(ev){
      var d=ev.data; if(!d)return;
      if(d.type==='praxis-metro'){
        if(d.tempo!=null)setTempo(d.tempo);
        if(d.playing){ if(flowState==='showing'||flowState==='done'||flowState==='init'){ if(flowState!=='showing'){ exerciseCount++; showExercise(randRhythm()); } beginPlay(); } else if(!playing){ beginPlay(); } }
        else { hardStop(); flowState='done'; post({type:'drill-state',playing:false}); }
      }else if(d.type==='praxis-tap'){
        if(flowState==='playing'||flowState==='tapping')tap();
      }else if(d.type==='praxis-bars'){
        var nb=d.bars||8; if(nb===numBars)return; numBars=nb;
        hardStop(); exerciseCount++; showExercise(randRhythm());
        if(playing) beginPlay();
      }else if(d.type==='praxis-split'){
        splitMode=d.split||'2s'; owner=computeSplit(numBars,splitMode); postSplit(); renderAids();
      }else if(d.type==='praxis-aid'){
        aidMode=d.mode||'none'; renderAids();
      }else if(d.type==='praxis-settings'){
        if(d.settings){ for(var k in d.settings){ if(k==='loop')settings.loop=d.settings[k]; } }
      }
    });

    (function(){
      var hidden=false;
      function tryHide(){
        if(hidden)return;
        var els=document.querySelectorAll('*'),i;
        for(i=0;i<els.length;i++){
          var el=els[i];
          if(el.children.length<=6&&/TEMPO/i.test(el.textContent)&&el.textContent.length<40){
            var pEl=el,j; for(j=0;j<4&&pEl.parentElement;j++)pEl=pEl.parentElement;
            pEl.style.setProperty('display','none','important'); hidden=true; return;
          }
        }
      }
      try{var obs=new MutationObserver(function(){tryHide();});obs.observe(document.documentElement,{childList:true,subtree:true});}catch(e){}
      setTimeout(tryHide,1500);setTimeout(tryHide,4000);setTimeout(tryHide,9000);
    })();

    window.addEventListener('load',function(){
      setTimeout(function(){
        if(window.MusicOpgave){
          try{window.MusicOpgave.userHasAnsweredTheRequiredNumberOfQuestionsCorrectly=function(){return false;};}catch(e){}
          try{window.MusicOpgave.forkertSvar=function(){};}catch(e){}
        }
        nextExercise();
        post({type:'drill-ready',tempo:currentTempo});
      },1000);
    });
  })();
  return;
  }

  /* ===================== FREE-PLAY BRANCH (unchanged) ===================== */
  (function(){
    ['RhythmPlayer','Rhythm','RhythmComponent','RhythmImage','Afspilning','Toneafspilning','Nodebillede','Opgave'].forEach(function(n){
      try{ if(!window['Music'+n] && window['Musikipedia'+n]) window['Music'+n]=window['Musikipedia'+n]; }catch(e){}
    });
    var playing=false, audioUnlocked=false, rhythmObj=null, rhythmImage=null;
    var flowState='init', exerciseCount=0, numBars=2, currentTempo=88;
    function P(){return window.MusicRhythmPlayer||null;}
    (function(){
      var p=P(); if(!p)return;
      var origInit=p.initialisation;
      p.initialisation=function(cfg){
        if(cfg.rhythmImage) rhythmImage=cfg.rhythmImage;
        cfg.unitsPerStep=72;
        cfg.finishedTappingCallback=function(){ onExerciseComplete(); };
        var origStatus=cfg.changeStatusCallback;
        cfg.changeStatusCallback=function(s){ if(s==='tap')flowState='tapping'; if(origStatus)origStatus(s); };
        return origInit.call(this,cfg);
      };
      var origSR=p.setRhythm;
      p.setRhythm=function(t){ rhythmObj=t; return origSR.apply(this,arguments); };
    })();
    function randBar(){
      var beats=[],i;
      for(i=0;i<4;i++){
        if(Math.random()<0.30) beats.push([{length:72,rest:false},{length:72,rest:false}]);
        else beats.push([{length:144,rest:false}]);
      }
      var comps=[],idx=0;
      while(idx<4){
        var rem=4-idx,r=Math.random(),g=1;
        if(rem>=4&&r<0.10)g=4; else if(rem>=2&&r<0.32)g=2;
        if(g===4)comps.push({length:576,rest:false});
        else if(g===2)comps.push({length:288,rest:false});
        else comps=comps.concat(beats[idx]);
        idx+=g;
      }
      return {components:comps};
    }
    function randRhythm(){ var bars=[],i; for(i=0;i<numBars;i++)bars.push(randBar()); return {metricalStructure:"4/4",bars:bars}; }
    function setInfo(text,state,img){ if(!rhythmImage)return; try{ rhythmImage.setInfoBoxText(text); rhythmImage.setInfoBoxState(state||''); if(img!==undefined)rhythmImage.setInfoBoxImage(img); }catch(e){} }
    function applyTempo(){ if(rhythmObj&&rhythmObj.metricalStructure)rhythmObj.metricalStructure.tempo=currentTempo; }
    function showExercise(data){
      var p=P(); if(!p||!rhythmImage)return;
      try{p.stop();}catch(e){}
      var rhythm=new MusicRhythm(data);
      rhythmImage.setRhythm(rhythm);
      p.setRhythm(rhythmImage.getRhythm());
      applyTempo();
      rhythmImage.showInfoBox(true); p.showButton(); p.setMarkNotesDuringTapping(false);
      flowState='showing'; setInfo('Click to start','','1');
    }
    function nextExercise(){ exerciseCount++; showExercise(randRhythm()); post({type:'drill-state',playing:false,exercise:exerciseCount}); }
    function unlockAudio(){
      try{ if(window.Howler&&window.Howler.ctx&&window.Howler.ctx.state==='suspended')window.Howler.ctx.resume(); }catch(e){}
      if(audioUnlocked)return;
      try{
        if(window.Howler){ window.Howler.mute(false); if(typeof window.Howler.volume==='function')window.Howler.volume(1); }
        var AC=window.AudioContext||window.webkitAudioContext;
        if(AC){var c=new AC(); if(c.state==='suspended')c.resume(); c.close&&c.close();}
        audioUnlocked=true;
      }catch(e){}
    }
    function beginPlay(){ var p=P(); if(!p)return; unlockAudio(); applyTempo(); flowState='playing'; playing=true; try{p.play();}catch(e){} post({type:'drill-state',playing:true}); }
    function hardStop(){ var p=P(); try{if(p)p.stop();}catch(e){} try{if(p)p.skipCountOut();}catch(e){} try{if(window.Howler&&typeof window.Howler.stop==='function')window.Howler.stop();}catch(e){} playing=false; }
    function onExerciseComplete(){ hardStop(); flowState='done'; if(rhythmImage){try{rhythmImage.removeAllLabels();}catch(e){}} setInfo('Click for next','√',''); post({type:'drill-state',playing:false}); }
    function setTempo(b){ if(!b)return; currentTempo=b; applyTempo(); }
    function tap(){ var p=P(); if(p&&typeof p.tap==='function'){try{p.tap();}catch(e){try{p.tap(performance.now());}catch(e2){}}} }
    function post(m){ try{if(window.parent&&window.parent!==window)window.parent.postMessage(m,'*');}catch(e){} }
    function handleActivate(){
      if(flowState==='init'||flowState==='done'){ nextExercise(); }
      else if(flowState==='showing'){ beginPlay(); }
      else if(flowState==='playing'||flowState==='tapping'){ tap(); post({type:'drill-tap'}); }
    }
    document.addEventListener('pointerdown',function(e){ var t=e.target; if(t&&t.closest&&(t.closest('input')||t.closest('button')||t.closest('select')||t.closest('a')))return; e.preventDefault(); handleActivate(); },true);
    document.addEventListener('click',function(e){e.preventDefault();e.stopPropagation();},true);
    document.addEventListener('keydown',function(e){ if(e.repeat)return; if(e.key===' '||e.code==='Space'||e.key==='v'||e.key==='V'||e.key==='b'||e.key==='B'){e.preventDefault();handleActivate();} },true);
    function transportPlay(){ if(playing)return; if(flowState==='showing'){ beginPlay(); } else { exerciseCount++; showExercise(randRhythm()); beginPlay(); } }
    function transportStop(){ if(!playing&&flowState!=='playing'&&flowState!=='tapping')return; hardStop(); flowState='done'; setInfo('Click for next','',''); post({type:'drill-state',playing:false}); }
    window.addEventListener('message',function(ev){
      var d=ev.data; if(!d)return;
      if(d.type==='praxis-metro'){ if(d.tempo!=null)setTempo(d.tempo); if(d.playing)transportPlay(); else transportStop(); }
      else if(d.type==='praxis-tap'){ if(flowState==='playing'||flowState==='tapping')tap(); else handleActivate(); }
      else if(d.type==='praxis-bars'){ var nb=d.bars||2; if(nb===numBars)return; numBars=nb; if(playing){ hardStop(); exerciseCount++; showExercise(randRhythm()); beginPlay(); } else { nextExercise(); } }
    });
    (function(){
      var hidden=false;
      function tryHide(){ if(hidden)return; var els=document.querySelectorAll('*'),i; for(i=0;i<els.length;i++){ var el=els[i]; if(el.children.length<=6&&/TEMPO/i.test(el.textContent)&&el.textContent.length<40){ var pEl=el,j; for(j=0;j<4&&pEl.parentElement;j++)pEl=pEl.parentElement; pEl.style.setProperty('display','none','important'); hidden=true; return; } } }
      try{var obs=new MutationObserver(function(){tryHide();});obs.observe(document.documentElement,{childList:true,subtree:true});}catch(e){}
      setTimeout(tryHide,1500);setTimeout(tryHide,4000);setTimeout(tryHide,9000);
    })();
    window.addEventListener('load',function(){
      setTimeout(function(){
        if(window.MusicOpgave){ try{window.MusicOpgave.userHasAnsweredTheRequiredNumberOfQuestionsCorrectly=function(){return false;};}catch(e){} try{window.MusicOpgave.forkertSvar=function(){};}catch(e){} }
        nextExercise(); post({type:'drill-ready',tempo:currentTempo});
      },1000);
    });
  })();
})();
