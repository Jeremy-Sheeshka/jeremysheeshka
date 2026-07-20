(function(){
  var frame=document.getElementById('drill-frame')||document.querySelector('iframe');
  var playing=false, tempo=88, beats=4, bars=2, timer=null;
  function post(){if(frame&&frame.contentWindow){frame.contentWindow.postMessage({type:'praxis-metro',playing:playing,tempo:tempo,beats:beats},'*');}}
  function postBars(){if(frame&&frame.contentWindow){frame.contentWindow.postMessage({type:'praxis-bars',bars:bars},'*');}}
  function setToggle(){document.querySelectorAll('[data-metro-toggle]').forEach(function(b){b.textContent=playing?'Stop':'Play';b.classList.toggle('active',playing);b.setAttribute('aria-pressed',String(playing));});}
  function setBpm(){
    document.querySelectorAll('[data-metro-bpm]').forEach(function(o){o.textContent=tempo+' BPM';});
    document.querySelectorAll('[data-metro-bpm-input]').forEach(function(i){i.value=tempo;});
  }
  function setSliders(){document.querySelectorAll('[data-metro-tempo]').forEach(function(i){i.value=tempo;});}
  function buildLights(){document.querySelectorAll('[data-metro-lights]').forEach(function(c){c.innerHTML='';for(var i=0;i<beats;i++){var d=document.createElement('i');if(i===0)d.className='accent';c.appendChild(d);}});}
  function lights(beat){document.querySelectorAll('[data-metro-lights]').forEach(function(c){Array.prototype.forEach.call(c.children,function(d,i){d.classList.toggle('on',i===beat);});});}
  function startTimer(){stopTimer();var beat=0;lights(0);timer=setInterval(function(){beat=(beat+1)%beats;lights(beat);},Math.round(60000/tempo));}
  function stopTimer(){if(timer){clearInterval(timer);timer=null;}lights(-1);}

  document.addEventListener('click',function(e){
    var b=e.target&&e.target.closest?e.target.closest('[data-metro-toggle]'):null;
    if(b){e.stopImmediatePropagation();e.preventDefault();playing=!playing;setToggle();if(playing){startTimer();}else{stopTimer();}post();}
  },true);

  document.addEventListener('input',function(e){
    if(e.target&&e.target.matches&&e.target.matches('[data-metro-tempo]')){
      e.stopImmediatePropagation();tempo=+e.target.value||tempo;setBpm();setSliders();if(playing){startTimer();}post();
    }
    if(e.target&&e.target.matches&&e.target.matches('[data-metro-bpm-input]')){
      e.stopImmediatePropagation();
      var v=parseInt(e.target.value,10);
      if(v>=40&&v<=208){tempo=v;setBpm();setSliders();if(playing){startTimer();}post();}
    }
  },true);

  document.addEventListener('change',function(e){
    if(e.target&&e.target.matches&&e.target.matches('[data-metro-beats]')){e.stopImmediatePropagation();beats=+e.target.value||beats;buildLights();if(playing){startTimer();}post();}
    if(e.target&&e.target.matches&&e.target.matches('[data-metro-bars]')){e.stopImmediatePropagation();bars=+e.target.value||2;postBars();}
    if(e.target&&e.target.matches&&e.target.matches('[data-metro-bpm-input]')){
      var v=parseInt(e.target.value,10);
      if(v>=40&&v<=208){tempo=v;setBpm();setSliders();if(playing){startTimer();}post();}
      else{e.target.value=tempo;}
    }
  },true);

  document.addEventListener('keydown',function(e){
    if(e.repeat)return;
    if(e.key===' '||e.code==='Space'){
      e.preventDefault();
      if(frame&&frame.contentWindow){frame.contentWindow.postMessage({type:'praxis-tap'},'*');}
    }
  });

  window.addEventListener('message',function(ev){
    var d=ev.data;if(!d)return;
    if(d.type==='drill-state'){playing=!!d.playing;setToggle();if(playing){startTimer();}else{stopTimer();}}
    if(d.type==='drill-ready'){post();postBars();}
  });

  window.addEventListener('load',function(){
    var tp=document.querySelector('[data-metro-tempo]');if(tp)tempo=+tp.value||88;
    var bt=document.querySelector('[data-metro-beats]');if(bt)beats=+bt.value||4;
    var br=document.querySelector('[data-metro-bars]');if(br)bars=+br.value||2;
    buildLights();setBpm();setToggle();setSliders();
    setTimeout(function(){post();postBars();},400);
  });
})();
