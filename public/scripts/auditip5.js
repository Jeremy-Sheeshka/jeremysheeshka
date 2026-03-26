(function () {
  var practices = [
    "I audit the games I bring into class for whose stories and bodies are centered.",
    "I interrupt gatekeeping or gendered language immediately and publicly.",
    "I debrief after cooperative game sessions on who assumed authority — and why.",
    "I invite guest speakers or share examples from diverse gaming and development backgrounds.",
    "I share resources like Feminist Frequency or AnyKey educator guides with students."
  ];
 
  function init() {
    var container = document.getElementById('audit-items');
    var bar = document.getElementById('audit-bar');
    var msg = document.getElementById('audit-msg');
    if (!container || !bar || !msg) return;
 
    var checked = 0;
 
    practices.forEach(function (text) {
      var wrap = document.createElement('label');
      wrap.style.cssText = 'display:flex;align-items:flex-start;gap:0.75rem;margin-bottom:0.875rem;cursor:pointer;font-size:0.875rem;line-height:1.55;';
 
      var input = document.createElement('input');
      input.type = 'checkbox';
      input.style.cssText = 'margin-top:0.2rem;accent-color:#6366f1;width:1.05rem;height:1.05rem;flex-shrink:0;cursor:pointer;';
 
      input.addEventListener('change', function () {
        checked = checked + (input.checked ? 1 : -1);
        var pct = (checked / practices.length) * 100;
        bar.style.width = pct + '%';
        if (checked === practices.length) {
          msg.textContent = '\u2713 All 5 practices active \u2014 strong foundation for inclusive gaming culture.';
          bar.style.background = '#10b981';
        } else {
          bar.style.background = '#6366f1';
          msg.textContent = checked + ' of ' + practices.length + ' practices checked';
        }
      });
 
      var span = document.createElement('span');
      span.textContent = text;
      wrap.appendChild(input);
      wrap.appendChild(span);
      container.appendChild(wrap);
    });
  }
 
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();