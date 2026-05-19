/* muszyński.online — shared script */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Nav toggle (mobile) ---------- */
  const nav = document.querySelector('.nav');
  const navToggle = document.querySelector('.nav__toggle');
  if (navToggle && nav) {
    navToggle.addEventListener('click', () => {
      nav.classList.toggle('nav--open');
    });
    nav.querySelectorAll('.nav__links a').forEach(a => {
      a.addEventListener('click', () => nav.classList.remove('nav--open'));
    });
  }

  /* ---------- Fade in on scroll ---------- */
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
    document.querySelectorAll('.fade-in').forEach(el => io.observe(el));
  } else {
    document.querySelectorAll('.fade-in').forEach(el => el.classList.add('visible'));
  }

  /* ---------- FAQ toggle ---------- */
  document.querySelectorAll('.faq__item').forEach(item => {
    const q = item.querySelector('.faq__q');
    if (!q) return;
    q.addEventListener('click', () => item.classList.toggle('open'));
  });

  /* ---------- Contact form ---------- */
  const contactForm = document.querySelector('[data-contact-form]');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      // Minimal client validation
      const required = contactForm.querySelectorAll('[required]');
      let ok = true;
      required.forEach(el => {
        if (el.type === 'checkbox' ? !el.checked : !(el.value || '').trim()) {
          el.style.borderColor = '#c84a4a';
          ok = false;
        } else {
          el.style.borderColor = '';
        }
      });
      if (!ok) return;

      const wrapper = document.querySelector('[data-contact-wrapper]');
      if (!wrapper) return;
      wrapper.innerHTML = `
        <div class="contact-form__success">
          <div class="contact-form__success-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M5 12l5 5L20 7" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <h3>Dostałem. Odezwę się w 24h.</h3>
          <p>Sprawdź skrzynkę za chwilę — leci potwierdzenie. Odpowiadam zwykle tego samego dnia roboczego, najpóźniej w 24h.</p>
          <a href="https://tidycal.com/pmuszynski/15-konkretna-rozmowa" target="_blank" class="btn btn-ghost">Albo umów 15 min teraz →</a>
        </div>
      `;
      wrapper.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  }

  /* ---------- Newsletter (footer) ---------- */
  document.querySelectorAll('[data-newsletter]').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = form.querySelector('input[type="email"]');
      const email = (input.value || '').trim();
      if (!email) return;
      form.innerHTML = '<p class="text-accent small">Dzięki. Pierwszy newsletter przyleci w najbliższy wtorek.</p>';
    });
  });

  /* ---------- Audit quiz ---------- */
  const quiz = document.querySelector('[data-quiz]');
  if (quiz) {
    const questions = quiz.querySelectorAll('.quiz__question');
    const resultBlock = quiz.querySelector('[data-result]');
    const scoreEl = quiz.querySelector('[data-score]');
    const tagEl = quiz.querySelector('[data-tag]');
    const gapsEl = quiz.querySelector('[data-gaps]');
    const submitBtn = quiz.querySelector('[data-submit]');

    questions.forEach(q => {
      q.addEventListener('click', () => q.classList.toggle('checked'));
      q.addEventListener('keydown', (e) => {
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault();
          q.classList.toggle('checked');
        }
      });
    });

    if (submitBtn) {
      submitBtn.addEventListener('click', (e) => {
        e.preventDefault();

        const total = questions.length;
        const checked = quiz.querySelectorAll('.quiz__question.checked');
        const got = checked.length;
        const score = Math.round((got / total) * 100);

        scoreEl.textContent = score;

        let tag = 'Przeciętna';
        let tagClass = 'quiz__tag quiz__tag--warn';
        if (score < 40) { tag = 'Kryzysowa'; tagClass = 'quiz__tag quiz__tag--red'; }
        else if (score >= 70) { tag = 'Dobra'; tagClass = 'quiz__tag quiz__tag--green'; }
        tagEl.textContent = tag;
        tagEl.className = tagClass;

        const unchecked = Array.from(questions).filter(q => !q.classList.contains('checked'));
        const topGaps = unchecked.slice(0, 3);

        gapsEl.innerHTML = '';
        if (topGaps.length === 0) {
          gapsEl.innerHTML = '<p class="text-dim" style="font-size:15px;">Wszystkie podstawy OK. Pełny audyt sprawdzi zaawansowane: architekturę, copy, technikę — i pokaże konkretne drzwi do wzrostu.</p>';
        } else {
          topGaps.forEach((q, i) => {
            const title = q.dataset.gap || (q.querySelector('.quiz__q-text') || {}).textContent || '';
            const item = document.createElement('div');
            item.className = 'quiz__gap';
            item.innerHTML = `
              <div class="quiz__gap-icon">${i + 1}</div>
              <div class="quiz__gap-text">${title}</div>
            `;
            gapsEl.appendChild(item);
          });
        }

        resultBlock.classList.add('visible');
        setTimeout(() => {
          resultBlock.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      });
    }

    /* Email capture */
    const emailForm = quiz.querySelector('[data-email-form]');
    if (emailForm) {
      emailForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const input = emailForm.querySelector('input[type="email"]');
        const email = (input.value || '').trim();
        if (!email) return;
        const block = emailForm.closest('.quiz__email-block');
        if (block) {
          block.innerHTML = `
            <h4>Dostałem.</h4>
            <p>Odezwę się w 24h z propozycją pełnego audytu (470 EUR, 48h od briefu).
            W międzyczasie — umów bezpłatną 15-min <a href="https://tidycal.com/pmuszynski/15-konkretna-rozmowa" target="_blank" class="text-accent" style="text-decoration:underline;">tutaj</a>.</p>
          `;
        }
      });
    }
  }

  /* ---------- Year in footer ---------- */
  document.querySelectorAll('[data-year]').forEach(el => {
    el.textContent = new Date().getFullYear();
  });

  /* ---------- Reduced motion guard ---------- */
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Split words (word-by-word reveal) ---------- */
  const splitNode = (node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.nodeValue;
      if (!text.trim()) return null;
      const frag = document.createDocumentFragment();
      const parts = text.split(/(\s+)/);
      parts.forEach(part => {
        if (/^\s+$/.test(part)) {
          frag.appendChild(document.createTextNode(part));
        } else if (part.length) {
          const span = document.createElement('span');
          span.className = 'word';
          span.textContent = part;
          frag.appendChild(span);
        }
      });
      return frag;
    }
    if (node.nodeType === Node.ELEMENT_NODE) {
      const tag = node.tagName.toLowerCase();
      if (tag === 'br') return node.cloneNode(true);
      const clone = node.cloneNode(false);
      node.childNodes.forEach(child => {
        const result = splitNode(child);
        if (result) clone.appendChild(result);
      });
      return clone;
    }
    return null;
  };
  document.querySelectorAll('[data-split]').forEach(el => {
    const frag = document.createDocumentFragment();
    el.childNodes.forEach(child => {
      const result = splitNode(child);
      if (result) frag.appendChild(result);
    });
    el.innerHTML = '';
    el.appendChild(frag);
    const words = el.querySelectorAll('.word');
    words.forEach((w, i) => { w.style.setProperty('--i', i); });
  });

  /* ---------- Counter animation ---------- */
  const easeOutCubic = t => 1 - Math.pow(1 - t, 3);
  const runCounter = (el) => {
    const target = parseFloat(el.dataset.count || '0');
    const duration = parseInt(el.dataset.duration || '1400', 10);
    const suffix = el.dataset.suffix || '';
    const decimals = parseInt(el.dataset.decimals || '0', 10);
    if (prefersReduced) {
      el.textContent = target.toFixed(decimals) + suffix;
      return;
    }
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min((now - start) / duration, 1);
      const v = target * easeOutCubic(t);
      el.textContent = v.toFixed(decimals) + suffix;
      if (t < 1) requestAnimationFrame(tick);
      else el.textContent = target.toFixed(decimals) + suffix;
    };
    requestAnimationFrame(tick);
  };
  if ('IntersectionObserver' in window) {
    const cio = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          runCounter(entry.target);
          cio.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    document.querySelectorAll('[data-count]').forEach(el => cio.observe(el));
  } else {
    document.querySelectorAll('[data-count]').forEach(runCounter);
  }

  /* ---------- Magnetic buttons ---------- */
  if (!prefersReduced) {
    document.querySelectorAll('[data-magnetic]').forEach(btn => {
      let raf = null;
      const strength = parseFloat(btn.dataset.strength || '0.3');
      const reset = () => {
        btn.style.transform = '';
      };
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        if (raf) cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => {
          btn.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
        });
      });
      btn.addEventListener('mouseleave', () => {
        if (raf) cancelAnimationFrame(raf);
        raf = requestAnimationFrame(reset);
      });
    });
  }

  /* ---------- 3D card tilt ---------- */
  if (!prefersReduced) {
    document.querySelectorAll('[data-tilt]').forEach(card => {
      let raf = null;
      const max = parseFloat(card.dataset.tilt || '6');
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width;
        const py = (e.clientY - rect.top) / rect.height;
        const rx = (0.5 - py) * max;
        const ry = (px - 0.5) * max;
        if (raf) cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => {
          card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-4px)`;
        });
      });
      card.addEventListener('mouseleave', () => {
        if (raf) cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => {
          card.style.transform = '';
        });
      });
    });
  }

});

/* ---------- Newsletter popup (smart, GDPR-aware) ---------- */
(function(){
  const KEY = 'np-snoozed-until';
  const SNOOZE_DAYS = 14;
  const now = Date.now();
  const snoozedUntil = parseInt(localStorage.getItem(KEY) || '0', 10);
  if (now < snoozedUntil) return;

  const html = `
  <div class="np" data-np hidden aria-hidden="true" role="dialog" aria-modal="true" aria-labelledby="np-title">
    <div class="np__backdrop" data-np-close></div>
    <div class="np__card">
      <button class="np__close" data-np-close aria-label="Zamknij">×</button>
      <div class="np__eyebrow">Newsletter</div>
      <h3 class="np__title" id="np-title">Raz w tygodniu. <em>Zero spamu.</em></h3>
      <p class="np__sub">Jak solo-twórcy budują systemy z AI — konkretnie, bez obietnic "leverage". Pierwsza wysyłka: najbliższy wtorek.</p>
      <form class="np__form" data-np-form>
        <input type="email" name="email" placeholder="twoj@email.pl" required autocomplete="email">
        <label class="np__consent">
          <input type="checkbox" required>
          <span>Zgadzam się na przetwarzanie danych w celu wysyłki newslettera i akceptuję <a href="https://www.muszynski.online/datenschutz" target="_blank" rel="noopener">informację RODO</a>. Mogę wypisać się w każdej chwili.</span>
        </label>
        <button type="submit" class="btn btn-primary">Zapisz mnie</button>
        <button type="button" class="np__later" data-np-close>Może innym razem</button>
      </form>
    </div>
  </div>`;

  function init() {
    document.body.insertAdjacentHTML('beforeend', html);
    const popup = document.querySelector('[data-np]');
    if (!popup) return;

    let shown = false;
    function show() {
      if (shown) return;
      shown = true;
      popup.hidden = false;
      popup.setAttribute('aria-hidden','false');
      requestAnimationFrame(() => popup.classList.add('is-open'));
      document.body.style.overflow = 'hidden';
    }
    function dismiss() {
      popup.classList.remove('is-open');
      popup.setAttribute('aria-hidden','true');
      setTimeout(() => { popup.hidden = true; }, 220);
      document.body.style.overflow = '';
      localStorage.setItem(KEY, String(now + SNOOZE_DAYS*24*60*60*1000));
    }

    // Trigger: 45s on page
    const t = setTimeout(show, 45000);

    // Trigger: 70% scroll
    let scrollFired = false;
    const onScroll = () => {
      if (scrollFired) return;
      const max = document.body.scrollHeight - window.innerHeight;
      if (max <= 0) return;
      const pct = window.scrollY / max;
      if (pct > 0.7) { scrollFired = true; show(); window.removeEventListener('scroll', onScroll); }
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    // Trigger: exit intent (desktop)
    if (window.matchMedia('(pointer: fine)').matches) {
      document.addEventListener('mouseout', (e) => {
        if (!e.relatedTarget && e.clientY < 10) show();
      });
    }

    // Close handlers
    popup.querySelectorAll('[data-np-close]').forEach(el => el.addEventListener('click', dismiss));
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !popup.hidden) dismiss(); });

    // Submit → success state (mailer not yet wired)
    const form = popup.querySelector('[data-np-form]');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = (form.querySelector('input[type="email"]').value || '').trim();
      if (!email) return;
      form.innerHTML = `
        <div style="padding: 12px 0;">
          <h4 style="font-family:var(--f-display); font-size:22px; font-weight:300; margin-bottom:8px;">Dzięki. Sprawdź skrzynkę.</h4>
          <p style="color:var(--text-dim); font-size:14px; line-height:1.5;">Za chwilę dostaniesz maila z linkiem potwierdzającym (double opt-in). Kliknij — i w najbliższy wtorek leci pierwszy numer.</p>
        </div>
      `;
      localStorage.setItem(KEY, String(now + 365*24*60*60*1000)); // 1 rok snooze po zapisie
      setTimeout(dismiss, 4500);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

/* ---------- Cookie notice ---------- */
(function () {
  const KEY = 'mo_cookie_ok';
  function init() {
    if (localStorage.getItem(KEY)) return;
    const notice = document.createElement('div');
    notice.className = 'cookie-notice';
    notice.setAttribute('role', 'dialog');
    notice.setAttribute('aria-label', 'Informacja o cookies');
    notice.innerHTML = `
      <div class="cookie-notice__text">
        Używamy tylko cookies niezbędnych do działania strony. Bez trackingu, bez analityki. <a href="https://www.muszynski.online/datenschutz" target="_blank" rel="noopener">Szczegóły</a>.
      </div>
      <button type="button" class="cookie-notice__btn" aria-label="Zamknij informację">OK, rozumiem</button>
    `;
    document.body.appendChild(notice);
    requestAnimationFrame(() => notice.classList.add('is-visible'));
    notice.querySelector('.cookie-notice__btn').addEventListener('click', () => {
      localStorage.setItem(KEY, '1');
      notice.classList.remove('is-visible');
      setTimeout(() => notice.remove(), 500);
    });
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
