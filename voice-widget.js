(function () {
  'use strict';

  /* ===== KONFIGURACJA =====
     AGENT_ID: wklej ID agenta z ElevenLabs (Agents Platform), żeby włączyć widget.
     Pusty string = widget wyłączony, strona działa bez zmian. */
  var AGENT_ID = '';

  var CONFIG = {
    widgetSrc: 'https://unpkg.com/@elevenlabs/convai-widget-embed',
    privacyUrl: 'datenschutz.html',
    storageKey: 'mo-voice-consent',
    texts: {
      button: 'Porozmawiaj z asystentem AI',
      badge: 'AI',
      header: 'Rozmawiasz z asystentem AI (sztuczna inteligencja)',
      consent: 'Po kliknięciu „Rozpocznij rozmowę" przeglądarka poprosi o dostęp do mikrofonu, a Twój głos będzie przetwarzany przez ElevenLabs (serwery w UE) wyłącznie po to, żeby asystent odpowiedział na Twoje pytania. Zgoda obowiązuje na czas tej wizyty.',
      privacyLink: 'Szczegóły w polityce prywatności',
      start: 'Rozpocznij rozmowę',
      notNow: 'Nie teraz'
    }
  };
  /* ===== KONIEC KONFIGURACJI ===== */

  if (!AGENT_ID) return;

  var css = ''
    + '.mo-voice-btn{position:fixed;right:20px;bottom:20px;z-index:9999;display:flex;align-items:center;gap:10px;'
    + 'padding:13px 20px;background:#16110b;color:#d4890a;border:1px solid #d4890a;border-radius:999px;'
    + "font-family:'Inter',system-ui,sans-serif;font-size:14px;font-weight:600;letter-spacing:0.01em;cursor:pointer;"
    + 'box-shadow:0 4px 24px rgba(0,0,0,0.5);transition:background 0.2s,box-shadow 0.2s,transform 0.2s;}'
    + '.mo-voice-btn:hover{background:#1f1810;box-shadow:0 4px 28px rgba(212,137,10,0.35);transform:translateY(-1px);}'
    + '.mo-voice-btn__badge{display:inline-flex;align-items:center;justify-content:center;padding:2px 7px;'
    + 'background:rgba(212,137,10,0.2);border-radius:6px;font-size:11px;font-weight:700;letter-spacing:0.08em;}'
    + '.mo-voice-panel{position:fixed;right:20px;bottom:84px;z-index:9999;width:min(360px,calc(100vw - 32px));'
    + 'background:#16110b;border:1px solid rgba(212,137,10,0.35);border-radius:14px;padding:22px;'
    + "font-family:'Inter',system-ui,sans-serif;box-shadow:0 12px 48px rgba(0,0,0,0.65);}"
    + ".mo-voice-panel h3{font-family:'Fraunces',Georgia,serif;font-size:17px;font-weight:600;color:#f5f0e8;"
    + 'line-height:1.4;margin:0 0 10px;}'
    + '.mo-voice-panel p{font-size:13px;line-height:1.6;color:rgba(245,240,232,0.65);margin:0 0 10px;}'
    + '.mo-voice-panel a{color:#d4890a;text-decoration:underline;font-size:13px;}'
    + '.mo-voice-panel__actions{display:flex;gap:10px;margin-top:16px;}'
    + '.mo-voice-panel__actions button{flex:1;padding:11px 14px;border-radius:8px;font-family:inherit;font-size:13px;'
    + 'font-weight:600;cursor:pointer;transition:background 0.2s,color 0.2s;}'
    + '.mo-voice-start{background:#d4890a;color:#0d0a08;border:1px solid #d4890a;}'
    + '.mo-voice-start:hover{background:#f0a020;border-color:#f0a020;}'
    + '.mo-voice-later{background:transparent;color:rgba(245,240,232,0.65);border:1px solid rgba(212,137,10,0.3);}'
    + '.mo-voice-later:hover{color:#f5f0e8;}'
    + '@media (max-width:520px){.mo-voice-btn{right:14px;bottom:14px;padding:11px 16px;font-size:13px;}'
    + '.mo-voice-panel{right:14px;bottom:72px;}}';

  var btn = null;
  var panel = null;

  function injectStyles() {
    var style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);
  }

  function loadWidget() {
    if (document.querySelector('elevenlabs-convai')) return;
    var s = document.createElement('script');
    s.src = CONFIG.widgetSrc;
    s.async = true;
    document.body.appendChild(s);
    var el = document.createElement('elevenlabs-convai');
    el.setAttribute('agent-id', AGENT_ID);
    el.setAttribute('disable-banner', 'true');
    document.body.appendChild(el);
    if (btn) btn.style.display = 'none';
    if (panel) panel.remove();
  }

  function acceptConsent() {
    try { sessionStorage.setItem(CONFIG.storageKey, '1'); } catch (e) {}
    loadWidget();
  }

  function hasConsent() {
    try { return sessionStorage.getItem(CONFIG.storageKey) === '1'; } catch (e) { return false; }
  }

  function closePanel() {
    if (panel) { panel.remove(); panel = null; }
    if (btn) btn.setAttribute('aria-expanded', 'false');
  }

  function openPanel() {
    if (panel) { closePanel(); return; }
    var t = CONFIG.texts;
    panel = document.createElement('div');
    panel.className = 'mo-voice-panel';
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-label', t.header);

    var h = document.createElement('h3');
    h.textContent = t.header;

    var p = document.createElement('p');
    p.textContent = t.consent;

    var link = document.createElement('a');
    link.href = CONFIG.privacyUrl;
    link.target = '_blank';
    link.rel = 'noopener';
    link.textContent = t.privacyLink;

    var actions = document.createElement('div');
    actions.className = 'mo-voice-panel__actions';

    var start = document.createElement('button');
    start.type = 'button';
    start.className = 'mo-voice-start';
    start.textContent = t.start;
    start.addEventListener('click', acceptConsent);

    var later = document.createElement('button');
    later.type = 'button';
    later.className = 'mo-voice-later';
    later.textContent = t.notNow;
    later.addEventListener('click', closePanel);

    actions.appendChild(start);
    actions.appendChild(later);
    panel.appendChild(h);
    panel.appendChild(p);
    panel.appendChild(link);
    panel.appendChild(actions);
    document.body.appendChild(panel);
    btn.setAttribute('aria-expanded', 'true');
    start.focus();
  }

  function renderButton() {
    var t = CONFIG.texts;
    btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'mo-voice-btn';
    btn.setAttribute('aria-haspopup', 'dialog');
    btn.setAttribute('aria-expanded', 'false');

    var badge = document.createElement('span');
    badge.className = 'mo-voice-btn__badge';
    badge.textContent = t.badge;

    var label = document.createElement('span');
    label.textContent = t.button;

    btn.appendChild(badge);
    btn.appendChild(label);
    btn.addEventListener('click', openPanel);
    document.body.appendChild(btn);

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closePanel();
    });
  }

  function init() {
    injectStyles();
    if (hasConsent()) {
      loadWidget();
      return;
    }
    renderButton();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
