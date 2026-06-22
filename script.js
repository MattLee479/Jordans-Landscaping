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

  // ---- Quote form -> Web3Forms ----
  var form = document.getElementById('quoteForm');
  var note = document.getElementById('formNote');

  if (form && note) {
    var submitBtn = form.querySelector('button[type="submit"]');
    var defaultBtnHtml = submitBtn ? submitBtn.innerHTML : '';

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var name = form.name.value.trim();
      var phone = form.phone.value.trim();
      var email = form.email.value.trim();
      var location = form.location.value.trim();
      var service = form.service.value.trim();
      var message = form.message.value.trim();
      var accessKeyField = form.querySelector('input[name="access_key"]');
      var accessKey = accessKeyField ? accessKeyField.value.trim() : '';

      if (!name || !phone || !email || !location || !service) {
        note.textContent = 'Please fill in your name, phone, email, location and service.';
        note.classList.add('error');
        return;
      }

      if (!accessKey || accessKey === 'PASTE_WEB3FORMS_ACCESS_KEY_HERE') {
        note.textContent = 'Add your Web3Forms access key first so the form can send.';
        note.classList.add('error');
        return;
      }

      note.classList.remove('error');
      note.textContent = 'Sending your quote request...';

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';
      }

      var formData = new FormData(form);
      formData.set('name', name);
      formData.set('phone', phone);
      formData.set('email', email);
      formData.set('location', location);
      formData.set('service', service);
      formData.set('message', message);

      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          Accept: 'application/json'
        },
        body: formData
      }).then(function (response) {
        return response.json();
      }).then(function (result) {
        if (result && result.success) {
          note.classList.remove('error');
          note.textContent = 'Thanks ' + name + '. Your quote request has been sent and Jordan will get back to you soon.';
          form.reset();
        } else {
          note.classList.add('error');
          note.textContent = result && result.message
            ? result.message
            : 'Something went wrong sending your request. Please try again.';
        }
      }).catch(function () {
        note.classList.add('error');
        note.textContent = 'Could not send right now. Please try again in a moment or call 07437 962198.';
      }).finally(function () {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = defaultBtnHtml;
        }
      });
    });
  }
})();
