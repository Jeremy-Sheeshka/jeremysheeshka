(function(){
  ['RhythmPlayer','Rhythm','RhythmComponent','RhythmImage','Afspilning','Toneafspilning','Nodebillede','Opgave'].forEach(function(n){
    try{ if(!window['Music'+n] && window['Musikipedia'+n]) window['Music'+n]=window['Musikipedia'+n]; }catch(e){}
  });

  var playing=false, audioUnlocked=false, rhythmObj=null, rhythmImage=null;
  var flowState='init', exerciseCount=0, numBars=2, currentTempo=88;

  function P(){return window.MusicRhythmPlayer||null;}

  /* === patch init + setRhythm === */
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

  /* === generator: NO rests, eighths only in pairs === */
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
  function randRhythm(){
    var bars=[],i; for(i=0;i<numBars;i++)bars.push(randBar());
    return {metricalStructure:"4/4",bars:bars};
  }

  function setInfo(text,state,img){
    if(!rhythmImage)return;
    try{ rhythmImage.setInfoBoxText(text); rhythmImage.setInfoBoxState(state||''); if(img!==undefined)rhythmImage.setInfoBoxImage(img); }catch(e){}
  }
  function applyTempo(){ if(rhythmObj&&rhythmObj.metricalStructure)rhythmObj.metricalStructure.tempo=currentTempo; }

  function showExercise(data){
    var p=P(); if(!p||!rhythmImage)return;
    try{p.stop();}catch(e){}
    var rhythm=new MusicRhythm(data);
    rhythmImage.setRhythm(rhythm);
    p.setRhythm(rhythmImage.getRhythm());
    applyTempo();
    rhythmImage.showInfoBox(true); p.showButton(); p.setMarkNotesDuringTapping(false);
    flowState='showing';
    setInfo('Click to start','','1');
  }
  function nextExercise(){
    exerciseCount++;
    showExercise(randRhythm());
    post({type:'drill-state',playing:false,exercise:exerciseCount});
  }

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
  function beginPlay(){
    var p=P(); if(!p)return;
    unlockAudio(); applyTempo();
    flowState='playing'; playing=true;
    try{p.play();}catch(e){}
    post({type:'drill-state',playing:true});
  }
  function hardStop(){
    var p=P();
    try{if(p)p.stop();}catch(e){}
    try{if(p)p.skipCountOut();}catch(e){}
    try{if(window.Howler&&typeof window.Howler.stop==='function')window.Howler.stop();}catch(e){}
    playing=false;
  }
  function onExerciseComplete(){
    hardStop();
    flowState='done';
    if(rhythmImage){try{rhythmImage.removeAllLabels();}catch(e){}}
    setInfo('Click for next','\u221A','');
    post({type:'drill-state',playing:false});
  }
  function setTempo(b){ if(!b)return; currentTempo=b; applyTempo(); }
  function tap(){ var p=P(); if(p&&typeof p.tap==='function'){try{p.tap();}catch(e){try{p.tap(performance.now());}catch(e2){}}} }
  function post(m){ try{if(window.parent&&window.parent!==window)window.parent.postMessage(m,'*');}catch(e){} }

  /* === in-iframe input === */
  function handleActivate(){
    if(flowState==='init'||flowState==='done'){ nextExercise(); }
    else if(flowState==='showing'){ beginPlay(); }
    else if(flowState==='playing'||flowState==='tapping'){ tap(); post({type:'drill-tap'}); }
  }
  document.addEventListener('pointerdown',function(e){
    var t=e.target;
    if(t&&t.closest&&(t.closest('input')||t.closest('button')||t.closest('select')||t.closest('a')))return;
    e.preventDefault(); handleActivate();
  },true);
  document.addEventListener('click',function(e){e.preventDefault();e.stopPropagation();},true);
  document.addEventListener('keydown',function(e){
    if(e.repeat)return;
    if(e.key===' '||e.code==='Space'||e.key==='v'||e.key==='V'||e.key==='b'||e.key==='B'){e.preventDefault();handleActivate();}
  },true);

  /* === transport from parent === */
  function transportPlay(){
    if(playing)return;
    if(flowState==='showing'){ beginPlay(); }
    else { exerciseCount++; showExercise(randRhythm()); beginPlay(); }
  }
  function transportStop(){
    if(!playing&&flowState!=='playing'&&flowState!=='tapping')return;
    hardStop();
    flowState='done';
    setInfo('Click for next','','');
    post({type:'drill-state',playing:false});
  }

  window.addEventListener('message',function(ev){
    var d=ev.data; if(!d)return;
    if(d.type==='praxis-metro'){
      if(d.tempo!=null)setTempo(d.tempo);
      if(d.playing)transportPlay(); else transportStop();
    }else if(d.type==='praxis-tap'){
      if(flowState==='playing'||flowState==='tapping')tap(); else handleActivate();
    }else if(d.type==='praxis-bars'){
      var nb=d.bars||2; if(nb===numBars)return; numBars=nb;
      if(playing){ hardStop(); exerciseCount++; showExercise(randRhythm()); beginPlay(); }
      else { nextExercise(); }
    }
  });

  /* === hide drill native toolbar === */
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

  /* === init === */
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
