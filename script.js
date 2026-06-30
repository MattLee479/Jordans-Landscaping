// Jordan's Tree Care - static site behaviour

(function () {
  'use strict';

  // ---- Year ----
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ---- Mobile menu ----
  var header = document.querySelector('.site-header');
  var headerInner = document.querySelector('.header-inner');
  var logoLink = document.querySelector('.site-header .logo');
  var menuBtn = document.getElementById('menuToggle');
  var menu = document.getElementById('mobileMenu');

  function syncHeaderOffset() {
    if (!header || !headerInner) return;
    var offset = Math.ceil(headerInner.getBoundingClientRect().height);
    document.documentElement.style.setProperty('--mobile-header-offset', offset + 'px');
  }

  syncHeaderOffset();
  window.addEventListener('resize', syncHeaderOffset);
  window.addEventListener('load', syncHeaderOffset);

  if (menuBtn && menu) {
    menuBtn.addEventListener('click', function () {
      var open = menu.getAttribute('data-open') === 'true';
      menu.setAttribute('data-open', String(!open));
      menu.hidden = open;
      menuBtn.setAttribute('aria-expanded', String(!open));
      syncHeaderOffset();
    });

    menu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        menu.setAttribute('data-open', 'false');
        menu.hidden = true;
        menuBtn.setAttribute('aria-expanded', 'false');
        syncHeaderOffset();
      });
    });
  }

  if (logoLink) {
    logoLink.addEventListener('click', function (e) {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });

      if (menuBtn && menu) {
        menu.setAttribute('data-open', 'false');
        menu.hidden = true;
        menuBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // ---- Scroll reveal ----
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  }

})();
