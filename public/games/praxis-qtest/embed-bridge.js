(function(){
  ['RhythmPlayer','Rhythm','RhythmComponent','RhythmImage','Afspilning','Toneafspilning','Nodebillede','Opgave'].forEach(function(n){
    try{ if(!window['Music'+n] && window['Musikipedia'+n]){ window['Music'+n]=window['Musikipedia'+n]; } }catch(e){}
  });

  var playing=false, audioUnlocked=false, rhythmObj=null, rhythmImage=null;
  var flowState='init', exerciseCount=0, numBars=2, pendingTempo=null;

  function P(){return window.MusicRhythmPlayer||null;}

  (function(){
    var p=P(); if(!p)return;
    var origInit=p.initialisation;
    p.initialisation=function(cfg){
      if(cfg.rhythmImage) rhythmImage=cfg.rhythmImage;
      cfg.finishedTappingCallback=function(){ onExerciseComplete(); };
      var origStatus=cfg.changeStatusCallback;
      cfg.changeStatusCallback=function(status){
        if(status==='tap') flowState='tapping';
        if(origStatus) origStatus(status);
      };
      var origStop=cfg.afterStoppingCallback;
      cfg.afterStoppingCallback=function(){ if(origStop) origStop(); };
      cfg.unitsPerStep=72;
      return origInit.call(this,cfg);
    };
    var origSR=p.setRhythm;
    p.setRhythm=function(t){ rhythmObj=t; return origSR.apply(this,arguments); };
  })();

  /* === GENERATOR: quarter, half, whole, eighth-pairs, rests (no eighth rests) === */
  var BAR=576;
  function randBar(){
    var comps=[],rem=BAR;
    while(rem>0){
      var r=Math.random();
      if(r<0.30){
        comps.push({length:144,rest:Math.random()<0.15&&comps.length>0});
        rem-=144;
      }else if(r<0.50){
        if(rem>=144){
          comps.push({length:72,rest:false});
          comps.push({length:72,rest:false});
          rem-=144;
        }else{comps.push({length:rem,rest:false});rem=0;}
      }else if(r<0.72){
        var h=Math.min(288,rem);
        comps.push({length:h,rest:Math.random()<0.12&&comps.length>0});
        rem-=h;
      }else if(r<0.88){
        comps.push({length:144,rest:Math.random()<0.15&&comps.length>0});
        rem-=144;
      }else{
        if(rem>=576){comps.push({length:576,rest:Math.random()<0.08&&comps.length>0});rem-=576;}
        else{comps.push({length:144,rest:Math.random()<0.15&&comps.length>0});rem-=144;}
      }
      if(rem<0)rem=0;
    }
    return{components:comps};
  }
  function randRhythm(){
    var bars=[];for(var i=0;i<numBars;i++)bars.push(randBar());
    return{metricalStructure:"4/4",bars:bars};
  }

  /* === DISPLAY === */
      /* === FIT BARS PER ROW (4 per row, or 2 for 2-bar exercises) === */
  function fitBarsPerRow(){
    try{
      if(!rhythmImage||typeof rhythmImage.setZoom!=='function')return;
      var el=document.getElementById('spoergsmaal');
      if(!el)return;
      var W=el.clientWidth||900;
      var barsPerRow=Math.min(numBars,4);
      if(barsPerRow<1)barsPerRow=1;
      rhythmImage.setZoom(0.2);
      setTimeout(function(){
        var svg=el.querySelector('svg');
        if(!svg){rhythmImage.setZoom(0.6);return;}
        var svgLeft=svg.getBoundingClientRect().left;
        var texts=svg.querySelectorAll('text');
        var maxRight=0;
        for(var i=0;i<texts.length;i++){
          var r=texts[i].getBoundingClientRect();
          var rel=r.right-svgLeft;
          if(rel>maxRight)maxRight=rel;
        }
        if(maxRight<10){rhythmImage.setZoom(0.6);return;}
        var totalAtZoom1=maxRight/0.2;
        var barW=totalAtZoom1/numBars;
        var targetZoom=(W*0.88/barsPerRow)/barW;
        targetZoom=Math.max(0.3,Math.min(1.5,targetZoom));
        rhythmImage.setZoom(targetZoom);
        console.log('[praxis-bridge] fit: zoom='+targetZoom.toFixed(3)+' maxR@0.2='+maxRight.toFixed(0)+' barW@1='+barW.toFixed(0)+' W='+W+' bars='+numBars+' perRow='+barsPerRow);
      },150);
    }catch(e){console.log('[praxis-bridge] fit err',e&&e.message);}
  }
  var rzTimer=null;
  window.addEventListener('resize',function(){clearTimeout(rzTimer);rzTimer=setTimeout(fitBarsPerRow,300);});

  function showRhythm(data){
    var p=P(); if(!p||!rhythmImage)return;
    try{p.stop();}catch(e){}
    var rhythm=new MusicRhythm(data);
    rhythmImage.setRhythm(rhythm);
    p.setRhythm(rhythmImage.getRhythm());
    rhythmImage.showInfoBox(true);
    p.showButton();
    p.setMarkNotesDuringTapping(false);
    setTimeout(fitBarsPerRow,150);
  }

  /* === FLOW === */
  function nextExercise(){
    exerciseCount++;
    showRhythm(randRhythm());
    flowState='showing';
    if(rhythmImage){
      rhythmImage.setInfoBoxText('Click to start');
      rhythmImage.setInfoBoxState();
      rhythmImage.setInfoBoxImage('1');
    }
    post({type:'drill-state',playing:false,exercise:exerciseCount});
  }
  function startExercise(){
    var p=P(); if(!p)return;
    unlockAudio();
    if(pendingTempo!==null&&rhythmObj&&rhythmObj.metricalStructure){
      rhythmObj.metricalStructure.tempo=pendingTempo;
      pendingTempo=null;
    }
    flowState='playing';
    try{p.play();playing=true;}catch(e){}
    post({type:'drill-state',playing:true});
  }
  function onExerciseComplete(){
    flowState='done';
    playing=false;
    var p=P();
    if(p){try{p.skipCountOut();}catch(e){}}
    if(rhythmImage){
      rhythmImage.removeAllLabels();
      rhythmImage.setInfoBoxText('Click for next');
      rhythmImage.setInfoBoxState('\u221A');
      rhythmImage.setInfoBoxImage('');
    }
    post({type:'drill-state',playing:false});
  }

  /* === TEMPO (no restart — applies on next exercise start) === */
  function setTempo(b){
    if(!rhythmObj||!rhythmObj.metricalStructure)return;
    if(playing){pendingTempo=b;}
    else{rhythmObj.metricalStructure.tempo=b;}
  }

  /* === AUDIO === */
  function unlockAudio(){
    if(audioUnlocked)return;
    try{
      if(window.Howler){
        if(window.Howler.ctx&&window.Howler.ctx.state==='suspended')window.Howler.ctx.resume();
        window.Howler.mute(false);
        if(typeof window.Howler.volume==='function')window.Howler.volume(1);
      }
      var AC=window.AudioContext||window.webkitAudioContext;
      if(AC){var c=new AC();if(c.state==='suspended')c.resume();c.close&&c.close();}
      audioUnlocked=true;
    }catch(e){}
  }
  function tap(){
    var p=P();
    if(p&&typeof p.tap==='function'){try{p.tap();}catch(e){try{p.tap(performance.now());}catch(e2){}}}
  }
  function post(msg){try{if(window.parent&&window.parent!==window)window.parent.postMessage(msg,'*');}catch(e){}}

  /* === INPUT: pointerdown (instant) === */
  document.addEventListener('pointerdown',function(e){
    var t=e.target;
    if(t&&(t.closest('input')||t.closest('button')||t.closest('select')||t.closest('a')))return;
    e.preventDefault();
    if(flowState==='showing'){startExercise();}
    else if(flowState==='done'){nextExercise();}
    else if(flowState==='playing'||flowState==='tapping'){tap();post({type:'drill-tap'});}
  },true);
  document.addEventListener('click',function(e){e.preventDefault();e.stopPropagation();},true);

  /* === KEYBOARD: keydown (instant, no repeat) === */
  document.addEventListener('keydown',function(e){
    if(e.repeat)return;
    if(e.key===' '||e.code==='Space'||e.key==='v'||e.key==='V'||e.key==='b'||e.key==='B'){
      e.preventDefault();
      if(flowState==='showing'){startExercise();}
      else if(flowState==='done'){nextExercise();}
      else if(flowState==='playing'||flowState==='tapping'){tap();post({type:'drill-tap'});}
    }
  },true);

  /* === MESSAGES FROM PARENT === */
  window.addEventListener('message',function(ev){
    var d=ev.data;if(!d)return;
    if(d.type==='praxis-metro'){
      if(d.tempo!=null)setTempo(d.tempo);
      if(d.playing&&flowState==='showing')startExercise();
      else if(!d.playing&&playing){var p=P();if(p){try{p.stop();}catch(e){}}playing=false;flowState='done';}
    }
    if(d.type==='praxis-tap'){
      if(flowState==='showing'){startExercise();}
      else if(flowState==='done'){nextExercise();}
      else if(flowState==='playing'||flowState==='tapping'){tap();}
    }
    if(d.type==='praxis-bars'){var nb=d.bars||2;if(nb!==numBars){numBars=nb;if(flowState==='done'||flowState==='showing'){nextExercise();}}}
  });

  /* === INIT === */
  window.addEventListener('load',function(){
    setTimeout(function(){
      if(window.MusicOpgave){
        window.MusicOpgave.userHasAnsweredTheRequiredNumberOfQuestionsCorrectly=function(){return false;};
        window.MusicOpgave.forkertSvar=function(){};
      }
      nextExercise();
      post({type:'drill-ready',tempo:(rhythmObj&&rhythmObj.metricalStructure&&rhythmObj.metricalStructure.tempo)||84});
    },1000);
  });

  /* === HIDE DRILL NATIVE TOOLBAR (appears after Play) === */
  (function(){
    var hidden=false;
    function tryHide(){
      if(hidden)return;
      var els=document.querySelectorAll('*');
      for(var i=0;i<els.length;i++){
        var el=els[i];
        if(el.children.length<=6&&/TEMPO/i.test(el.textContent)&&el.textContent.length<40){
          var p=el;
          for(var j=0;j<4&&p.parentElement;j++)p=p.parentElement;
          p.style.setProperty('display','none','important');
          hidden=true;
          console.log('[praxis-bridge] hid drill toolbar');
          return;
        }
      }
    }
    var obs=new MutationObserver(function(){tryHide();});
    obs.observe(document.documentElement,{childList:true,subtree:true});
    setTimeout(function(){tryHide();},2000);
    setTimeout(function(){tryHide();},5000);
    setTimeout(function(){tryHide();},10000);
  })();

})();
