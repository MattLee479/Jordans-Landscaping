// Jordan's Tree Care — static site behaviour

(function () {
  'use strict';

  // ---- Year ----
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ---- Mobile menu ----
  var header = document.querySelector('.site-header');
  var headerInner = document.querySelector('.header-inner');
  var menuBtn = document.getElementById('menuToggle');
  var menu = document.getElementById('mobileMenu');

  function syncMobileHeaderOffset() {
    if (!header || !headerInner) return;
    var offset = Math.ceil(headerInner.getBoundingClientRect().height);
    document.documentElement.style.setProperty('--mobile-header-offset', offset + 'px');
  }

  syncMobileHeaderOffset();
  window.addEventListener('resize', syncMobileHeaderOffset);
  window.addEventListener('load', syncMobileHeaderOffset);

  if (menuBtn && menu) {
    menuBtn.addEventListener('click', function () {
      var open = menu.getAttribute('data-open') === 'true';
      menu.setAttribute('data-open', String(!open));
      menu.hidden = open;
      menuBtn.setAttribute('aria-expanded', String(!open));
      syncMobileHeaderOffset();
    });
    // Close after tapping a link
    menu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        menu.setAttribute('data-open', 'false');
        menu.hidden = true;
        menuBtn.setAttribute('aria-expanded', 'false');
        syncMobileHeaderOffset();
      });
    });
  }

  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('is-visible');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  }

  // ---- Quote form -> mailto / phone fallback ----
  var form = document.getElementById('quoteForm');
  var note = document.getElementById('formNote');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = form.name.value.trim();
      var phone = form.phone.value.trim();
      var location = form.location.value.trim();
      var service = form.service.value;
      var message = form.message.value.trim();

      if (!name || !phone || !location || !service) {
        note.textContent = 'Please fill in your name, phone, location and service.';
        note.classList.add('error');
        return;
      }

      note.classList.remove('error');
      note.textContent = 'Thanks ' + name + " — opening your phone to call Jordan directly is fastest. Otherwise, please call 07437 962198.";

      // Build a tel: prompt; honest behaviour — no fake backend submission.
      var lines = [
        'Quote request from website',
        '------------------------------',
        'Name: ' + name,
        'Phone: ' + phone,
        'Location: ' + location,
        'Service: ' + service,
        '',
        'Message:',
        message || '(none)'
      ].join('\n');

      // Copy details to clipboard so the user can paste into a text/WhatsApp
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(lines).then(function () {
          note.textContent = 'Details copied — please call or text Jordan on 07437 962198 and paste them in.';
        }).catch(function () {});
      }

      // Offer to call
      setTimeout(function () {
        window.location.href = 'tel:07437962198';
      }, 600);
    });
  }
})();
