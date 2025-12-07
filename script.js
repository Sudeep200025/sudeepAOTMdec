// Minimal JS with accessibility and small interactions.
// Keep it small and dependency-free.

(function(){
  // Helpers
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  // Nav toggle (hamburger)
  const navToggle = $('#nav-toggle');
  const primaryNav = $('#primary-nav');

  navToggle && navToggle.addEventListener('click', () => {
    const expanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!expanded));
    primaryNav.style.display = expanded ? 'none' : 'block';
    navToggle.setAttribute('aria-label', expanded ? 'Open navigation' : 'Close navigation');
  });

  // Close nav on outside click or Escape
  document.addEventListener('click', (e) => {
    if (!primaryNav || !navToggle) return;
    if (primaryNav.contains(e.target) || navToggle.contains(e.target)) return;
    if (window.innerWidth < 768 && primaryNav.style.display === 'block') {
      primaryNav.style.display = 'none';
      navToggle.setAttribute('aria-expanded', 'false');
      navToggle.setAttribute('aria-label', 'Open navigation');
    }
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (primaryNav && window.innerWidth < 768) {
        primaryNav.style.display = 'none';
        navToggle.setAttribute('aria-expanded', 'false');
      }
      // close modal if open
      closeModal();
    }
  });

  // Smooth scroll for in-page links, respectful of reduced motion
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const targetId = a.getAttribute('href').slice(1);
      const target = document.getElementById(targetId);
      if (target) {
        e.preventDefault();
        if (prefersReduced) {
          target.scrollIntoView();
        } else {
          window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 60, behavior: 'smooth' });
        }
      }
    });
  });

  // Compare toggle - show/hide metrics column values
  const toggleMetrics = $('#toggle-metrics');
  if (toggleMetrics) {
    toggleMetrics.addEventListener('change', () => {
      const show = toggleMetrics.checked;
      $$('.metrics').forEach(cell => {
        cell.style.visibility = show ? 'visible' : 'hidden';
        cell.style.height = show ? '' : '1px';
      });
    });
  }

  // FAQ accordion (keyboard accessible)
  $$('.faq-q').forEach((btn) => {
    btn.addEventListener('click', () => toggleFAQ(btn));
    btn.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        const items = $$('.faq-q');
        const idx = items.indexOf(btn);
        const next = e.key === 'ArrowDown' ? items[idx+1] || items[0] : items[idx-1] || items[items.length-1];
        next.focus();
      }
    });
  });

  function toggleFAQ(btn) {
    const expanded = btn.getAttribute('aria-expanded') === 'true';
    btn.setAttribute('aria-expanded', String(!expanded));
    const id = btn.getAttribute('aria-controls');
    const panel = document.getElementById(id);
    if (panel) {
      panel.style.display = expanded ? 'none' : 'block';
    }
  }

  // Company modals (load content from optional companies JSON if present)
  const companyBtns = $$('.company-btn');
  const modal = $('#company-modal');
  const modalBody = $('#company-modal-body');
  const modalTitle = $('#company-modal-title');

  const companies = {
    // fallback data if JSON not loaded
    starlink: {
      name: "Starlink",
      type: "LEO",
      indiaStatus: "Consumer service rolling out; regulatory checks vary.",
      equipment: "Flat panel or dish + modem",
      pros: "Low latency (LEO), wide coverage",
      cons: "Cost of hardware, availability varies"
    },
    oneweb: {
      name: "OneWeb",
      type: "LEO",
      indiaStatus: "Partnering for enterprise & government solutions.",
      equipment: "Ground-enabled terminals",
      pros: "Enterprise focus, regulatory partnerships",
      cons: "Limited consumer footprint"
    },
    jio: {
      name: "Jio Space / Jio Satellite",
      type: "Planned LEO/GEO mix (India)",
      indiaStatus: "Indian private initiative (timeline variable).",
      equipment: "TBD — locally integrated solutions",
      pros: "Local ecosystem and distribution",
      cons: "Timelines and policy dependent"
    },
    isro: {
      name: "ISRO & Space-tech Initiatives",
      type: "Government R&D & partnerships",
      indiaStatus: "Research & support for connectivity in national projects.",
      equipment: "Support for ground stations; policy guidance",
      pros: "Local expertise, national focus",
      cons: "Primarily research and national missions"
    }
  };

  companyBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const key = btn.getAttribute('data-company');
      openModalWithCompany(key);
    });
  });

  function openModalWithCompany(key) {
    const data = companies[key];
    if (!data) return;
    modalTitle.textContent = data.name;
    modalBody.innerHTML = `
      <p><strong>Service type:</strong> ${data.type}</p>
      <p><strong>India status:</strong> ${data.indiaStatus}</p>
      <p><strong>Typical equipment:</strong> ${data.equipment}</p>
      <p><strong>Pros:</strong> ${data.pros}</p>
      <p><strong>Cons:</strong> ${data.cons}</p>
      <p><a href="#" class="learn-more" data-company="${key}">Learn more (external)</a></p>
    `;
    showModal();
  }

  // Modal open/close
  function showModal(){
    modal.setAttribute('aria-hidden','false');
    modal.querySelector('.modal-panel').focus();
    // attach close handlers
    modal.querySelectorAll('[data-close]').forEach(el => {
      el.addEventListener('click', closeModal);
    });
    // trap focus simple:
    document.body.style.overflow = 'hidden';
  }
  function closeModal(){
    if (!modal) return;
    modal.setAttribute('aria-hidden','true');
    document.body.style.overflow = '';
  }

  // Modal: close on backdrop click
  document.addEventListener('click', (e) => {
    if (e.target.matches('.modal-backdrop')) closeModal();
  });

  // Basic focus management for modal (return focus to last active company button)
  let lastActiveBtn = null;
  companyBtns.forEach(btn => {
    btn.addEventListener('focus', () => lastActiveBtn = btn);
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.getAttribute('aria-hidden') === 'false') {
      closeModal();
      lastActiveBtn && lastActiveBtn.focus();
    }
  });

  // Close modal when clicking learn-more (placeholder behaviour)
  document.addEventListener('click', (e) => {
    const lm = e.target.closest('.learn-more');
    if (lm) {
      e.preventDefault();
      // In a real site, link to authoritative sources.
      alert('Open provider site to learn more (placeholder).');
    }
  });

  // On load, collapse metrics if toggle unchecked
  document.addEventListener('DOMContentLoaded', () => {
    if (toggleMetrics && !toggleMetrics.checked) {
      $$('.metrics').forEach(cell => cell.style.visibility = 'hidden');
    }
  });

})();
