(function () {
  const vals = document.querySelectorAll('.count-val');
  const duration = 1600;

  function animateCount(el) {
    const target = parseFloat(el.dataset.target);
    const suffix = el.dataset.suffix;
    const decimals = parseInt(el.dataset.decimals);
    const start = performance.now();
    function step(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      el.textContent = (target * ease).toFixed(decimals) + suffix;
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target.toFixed(decimals) + suffix;
    }
    requestAnimationFrame(step);
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        vals.forEach(animateCount);
        observer.disconnect();
      }
    });
  }, { threshold: 0.3 });

  const grid = document.getElementById('stat-grid');
  if (grid) observer.observe(grid);
})();