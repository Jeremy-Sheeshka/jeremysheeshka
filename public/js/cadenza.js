/* ==========================================================================
   Cadenza Studio Website - JavaScript
   Navigation, FAQ toggles, smooth scrolling, and interactions
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // ---------- Mobile Menu ----------
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const mobileMenu = document.querySelector('.mobile-menu');

  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('active');
      document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    });

    // Close menu on link click
    mobileMenu.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }

  // ---------- Navbar Scroll Effect ----------
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 10) {
        navbar.style.boxShadow = '0 4px 6px -1px rgba(0,0,0,0.1)';
      } else {
        navbar.style.boxShadow = 'none';
      }
    });
  }

  // ---------- FAQ Toggles ----------
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    if (question) {
      question.addEventListener('click', () => {
        const isActive = item.classList.contains('active');

        // Close all other FAQs
        faqItems.forEach(other => {
          if (other !== item) {
            other.classList.remove('active');
          }
        });

        // Toggle current
        item.classList.toggle('active', !isActive);
      });
    }
  });

  // ---------- Smooth Scroll for Anchor Links ----------
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // ---------- Pricing Toggle (Monthly/Annual) ----------
  const pricingToggle = document.querySelector('.pricing-toggle');
  if (pricingToggle) {
    const toggleBtns = pricingToggle.querySelectorAll('.toggle-btn');
    const monthlyPrices = document.querySelectorAll('.price-monthly');
    const annualPrices = document.querySelectorAll('.price-annual');

    toggleBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        toggleBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const isAnnual = btn.dataset.period === 'annual';
        monthlyPrices.forEach(el => el.style.display = isAnnual ? 'none' : 'block');
        annualPrices.forEach(el => el.style.display = isAnnual ? 'block' : 'none');
      });
    });
  }

  // ---------- Contact Form ----------
  const contactForm = document.querySelector('.contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Get form data
      const formData = new FormData(contactForm);
      const data = Object.fromEntries(formData);

      // Simple validation
      if (!data.name || !data.email || !data.message) {
        alert('Please fill in all required fields.');
        return;
      }

      // Simulate submission
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.textContent = 'Sending...';
      submitBtn.disabled = true;

      setTimeout(() => {
        alert('Thank you for your message! We\'ll get back to you within 24 hours.');
        contactForm.reset();
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      }, 1000);
    });
  }

  // ---------- Intersection Observer for Animations ----------
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe elements with animation class
  document.querySelectorAll('.feature-card, .pricing-card, .testimonial-card, .blog-card, .step-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(el);
  });

  // Add animation class styles
  const style = document.createElement('style');
  style.textContent = `
    .animate-in {
      opacity: 1 !important;
      transform: translateY(0) !important;
    }
  `;
  document.head.appendChild(style);

  // ---------- Compare Table Highlight ----------
  const compareRows = document.querySelectorAll('.compare-table tbody tr');
  compareRows.forEach(row => {
    row.addEventListener('mouseenter', () => {
      row.style.backgroundColor = 'rgba(99, 102, 241, 0.04)';
    });
    row.addEventListener('mouseleave', () => {
      row.style.backgroundColor = '';
    });
  });

  // ---------- Copy to Clipboard for Code Blocks ----------
  document.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const code = btn.closest('.code-block').querySelector('code');
      if (code) {
        navigator.clipboard.writeText(code.textContent).then(() => {
          btn.textContent = 'Copied!';
          setTimeout(() => {
            btn.textContent = 'Copy';
          }, 2000);
        });
      }
    });
  });

  // ── Blog lightbox (click to zoom images) ──
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
});
