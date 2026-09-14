(function () {
  'use strict';

  // ---- mobile menu ----
  var toggle = document.querySelector('.menu-toggle');
  var menu = document.getElementById('mobileMenu');
  if (toggle && menu) {
    toggle.addEventListener('click', function () {
      var open = menu.hidden;
      menu.hidden = !open;
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      document.body.style.overflow = open ? 'hidden' : '';
    });
    menu.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        menu.hidden = true;
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });
  }

  // ---- FAQ accordion ----
  document.querySelectorAll('.faq-item > button').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var item = btn.parentElement;
      var wasOpen = item.classList.contains('is-open');
      document.querySelectorAll('.faq-item.is-open').forEach(function (open) {
        open.classList.remove('is-open');
        open.querySelector('button').setAttribute('aria-expanded', 'false');
      });
      if (!wasOpen) {
        item.classList.add('is-open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // ---- booking modal ----
  var modal = document.getElementById('bookingModal');
  var lastFocused = null;

  function openModal() {
    if (!modal) return;
    lastFocused = document.activeElement;
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
    var link = modal.querySelector('.btn-primary');
    if (link) link.focus();
  }
  function closeModal() {
    if (!modal || modal.hidden) return;
    modal.hidden = true;
    document.body.style.overflow = '';
    if (lastFocused && lastFocused.focus) lastFocused.focus();
    lastFocused = null;
  }
  document.querySelectorAll('[data-open-booking]').forEach(function (el) {
    el.addEventListener('click', openModal);
  });
  document.querySelectorAll('[data-close-booking]').forEach(function (el) {
    el.addEventListener('click', closeModal);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    closeModal();
    if (menu && !menu.hidden) {
      menu.hidden = true;
      if (toggle) toggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  });

  // ---- footer year ----
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
})();
