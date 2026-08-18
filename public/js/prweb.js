/* ==========================================================================
   Prince Rupert Web Design - Interactivity
   Inspired by skawennati.com: hovering over images & items triggers
   multimodal feedback (sounds, image swaps, motion) without needing
   external audio files — sounds are synthesized with the Web Audio API.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Mark JS as active so .reveal elements only hide pre-animation when JS runs
  document.documentElement.classList.add('js');

  // ---------- Sound engine (Web Audio API, no audio files needed) ----------
  let audioCtx = null;
  let muted = false;

  function getCtx() {
    if (!audioCtx) {
      try {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      } catch (e) {
        return null;
      }
    }
    if (audioCtx.state === 'suspended') audioCtx.resume();
    return audioCtx;
  }

  // Ocean wave swell: filtered noise with a slow attack
  function playWave(duration = 1.4, volume = 0.16) {
    const ctx = getCtx();
    if (!ctx) return;
    const t = ctx.currentTime;
    const bufferSize = ctx.sampleRate * duration;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      // Pink-ish noise with a swell envelope
      const swell = Math.sin((i / bufferSize) * Math.PI);
      data[i] = (Math.random() * 2 - 1) * swell * 0.6 + Math.sin(i * 0.9) * 0.15 * swell;
    }
    const src = ctx.createBufferSource();
    src.buffer = buffer;
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 420;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(volume, t + 0.35);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + duration);
    src.connect(filter).connect(gain).connect(ctx.destination);
    src.start(t);
    src.stop(t + duration);
  }

  // Low harbour foghorn: detuned sine pairs, slow swell
  function playFoghorn(duration = 1.8, volume = 0.12) {
    const ctx = getCtx();
    if (!ctx) return;
    const t = ctx.currentTime;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(volume, t + 0.5);
    gain.gain.setValueAtTime(volume, t + 1.0);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + duration);
    gain.connect(ctx.destination);
    [65, 65.8].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      osc.type = i === 0 ? 'sine' : 'triangle';
      osc.frequency.value = freq;
      osc.connect(gain);
      osc.start(t);
      osc.stop(t + duration);
    });
  }

  // Soft chime: plucked sine with quick decay
  function playChime(freq = 880, volume = 0.09) {
    const ctx = getCtx();
    if (!ctx) return;
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, t);
    osc.frequency.exponentialRampToValueAtTime(freq * 0.55, t + 0.5);
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(volume, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.7);
    osc.connect(gain).connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.75);
  }

  // Seagull-ish two-note call
  function playGull(volume = 0.07) {
    const ctx = getCtx();
    if (!ctx) return;
    const t = ctx.currentTime;
    [0, 0.22].forEach((offset, i) => {
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      const f0 = i === 0 ? 1200 : 1500;
      osc.frequency.setValueAtTime(f0, t + offset);
      osc.frequency.linearRampToValueAtTime(f0 * 0.72, t + offset + 0.18);
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.0001, t + offset);
      gain.gain.linearRampToValueAtTime(volume, t + offset + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + offset + 0.3);
      osc.connect(gain).connect(ctx.destination);
      osc.start(t + offset);
      osc.stop(t + offset + 0.32);
    });
  }

  function soundFor(kind) {
    if (muted) return;
    try {
      switch (kind) {
        case 'wave': playWave(); break;
        case 'foghorn': playFoghorn(); break;
        case 'chime': playChime(); break;
        case 'chime-high': playChime(1318.5); break;
        case 'chime-low': playChime(659.3); break;
        case 'gull': playGull(); break;
        default: playWave(0.9, 0.1);
      }
    } catch (e) { /* audio is best-effort */ }
  }

  // ---------- Sound hint pill (mute toggle) ----------
  const hint = document.createElement('button');
  hint.className = 'sound-hint';
  hint.type = 'button';
  hint.setAttribute('aria-pressed', 'false');
  hint.innerHTML = '<span class="hint-dot"></span><span class="hint-label">Hover sounds on</span>';
  document.body.appendChild(hint);

  hint.addEventListener('click', () => {
    muted = !muted;
    hint.classList.toggle('muted', muted);
    hint.querySelector('.hint-label').textContent = muted ? 'Hover sounds off' : 'Hover sounds on';
    hint.setAttribute('aria-pressed', String(muted));
  });

  // ---------- Hover sounds on interactive elements ----------
  // Attach data-sound attributes in markup; play on first hover/focus.
  document.querySelectorAll('[data-sound]').forEach(el => {
    const fire = () => soundFor(el.dataset.sound);
    el.addEventListener('mouseenter', fire);
    el.addEventListener('focus', fire);
  });

  // ---------- Image swap on hover (skawennati-style) ----------
  // <img data-swap="/alt.jpg"> swaps src while hovered, restores on leave.
  document.querySelectorAll('img[data-swap]').forEach(img => {
    const original = img.getAttribute('src');
    const swapped = img.getAttribute('data-swap');
    if (!original || !swapped) return;
    img.addEventListener('mouseenter', () => {
      img.setAttribute('src', swapped);
      img.classList.add('swapped');
    });
    img.addEventListener('mouseleave', () => {
      img.setAttribute('src', original);
      img.classList.remove('swapped');
    });
  });

  // ---------- Mobile Menu ----------
  const menuBtn = document.querySelector('.mobile-menu-btn');
  const mobileMenu = document.querySelector('.mobile-menu');
  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('active');
      document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    });
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }

  // ---------- Navbar shadow on scroll ----------
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    const onScroll = () => {
      navbar.style.boxShadow = window.scrollY > 10
        ? '0 4px 12px rgba(0,0,0,0.35)'
        : 'none';
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // ---------- Smooth scroll for anchor links ----------
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (!targetId || targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ---------- Testimonial carousel ----------
  const track = document.querySelector('.testimonial-track');
  const dotsWrap = document.querySelector('.testimonial-nav');
  if (track && dotsWrap) {
    const slides = track.querySelectorAll('.testimonial-slide');
    const dots = dotsWrap.querySelectorAll('.testimonial-dot');
    let current = 0;
    let timer = null;

    function goTo(index) {
      current = (index + slides.length) % slides.length;
      track.style.transform = `translateX(-${current * 100}%)`;
      dots.forEach((d, i) => d.classList.toggle('active', i === current));
    }

    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => { goTo(i); restart(); });
    });

    function restart() {
      if (timer) clearInterval(timer);
      timer = setInterval(() => goTo(current + 1), 6000);
    }

    // Pause on hover
    const slider = document.querySelector('.testimonial-slider');
    if (slider) {
      slider.addEventListener('mouseenter', () => { if (timer) clearInterval(timer); });
      slider.addEventListener('mouseleave', restart);
    }

    restart();
  }

  // ---------- Reveal on scroll ----------
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(el => observer.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('animate-in'));
  }

  // Safety net: never leave content hidden (e.g. if an observer edge case occurs)
  window.setTimeout(() => {
    revealEls.forEach(el => {
      if (!el.classList.contains('animate-in')) el.classList.add('animate-in');
    });
  }, 2500);

  // ---------- Quote form ----------
  const quoteForm = document.querySelector('.quote-form');
  if (quoteForm) {
    quoteForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const name = quoteForm.querySelector('#quote-name').value.trim();
      const email = quoteForm.querySelector('#quote-email').value.trim();
      const service = quoteForm.querySelector('#quote-service').value;
      const message = quoteForm.querySelector('#quote-message').value.trim();
      const status = quoteForm.querySelector('.form-status');

      // Simple validation
      if (!name || !email) {
        status.className = 'form-status error';
        status.textContent = 'Please fill in your name and email so we can get back to you.';
        status.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        status.className = 'form-status error';
        status.textContent = 'That email address doesn\'t look right — please double-check it.';
        return;
      }

      const submitBtn = quoteForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.textContent = 'Sending…';
      submitBtn.disabled = true;

      const payload = { name, email, service, message };

      // Try the configured endpoint (Netlify/GitHub Pages form proxy), else mailto fallback
      const endpoint = quoteForm.dataset.endpoint || '';
      let sent = false;

      if (endpoint) {
        try {
          const res = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          });
          sent = res.ok;
        } catch (err) {
          sent = false;
        }
      }

      if (!sent) {
        // Mailto fallback so the landing page works fully static
        const subject = encodeURIComponent(`Website quote request from ${name}`);
        const body = encodeURIComponent(
          `Name: ${name}\nEmail: ${email}\nService needed: ${service}\n\nDetails:\n${message || '(none)'}`
        );
        window.location.href = `mailto:hello@princerupertwebdesign.ca?subject=${subject}&body=${body}`;
      }

      status.className = 'form-status success';
      status.textContent = 'Thank you! Your quote request is on its way — we\'ll get back to you within one business day.';
      quoteForm.reset();
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
      status.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  }
});
