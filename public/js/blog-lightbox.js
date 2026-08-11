// Lightbox for blog post images — click to zoom, click/ESC to close
document.addEventListener('click', function(e) {
  var link = e.target.closest('.blog-lightbox');
  if (!link) return;
  e.preventDefault();
  var overlay = document.createElement('div');
  overlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;z-index:9999;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,0.85);cursor:zoom-out;';
  var img = document.createElement('img');
  img.src = link.href;
  var figImg = link.querySelector('img');
  img.alt = figImg ? figImg.alt : '';
  img.style.cssText = 'max-width:95vw;max-height:95vh;object-fit:contain;border-radius:8px;';
  overlay.appendChild(img);
  document.body.appendChild(overlay);
  overlay.addEventListener('click', function() { overlay.remove(); });
  document.addEventListener('keydown', function esc(ev) {
    if (ev.key === 'Escape') { overlay.remove(); document.removeEventListener('keydown', esc); }
  });
});
