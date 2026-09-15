(function () {
  'use strict';

  // ---- mobile menu ----
  var toggle = document.querySelector('.menu-toggle');
  var menu = document.getElementById('mobileMenu');
  var page = document.querySelector('main');
  var footer = document.querySelector('.site-footer');
  var header = document.querySelector('.site-header');
  function setPageInert(value) {
    if (page) page.inert = value;
    if (footer) footer.inert = value;
  }
  function closeMenu(restoreFocus) {
    if (!menu || menu.hidden) return;
    menu.hidden = true;
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Ouvrir le menu');
    setPageInert(false);
    document.body.style.overflow = '';
    if (restoreFocus) toggle.focus();
  }
  if (toggle && menu) {
    toggle.addEventListener('click', function () {
      if (!menu.hidden) return closeMenu(true);
      menu.hidden = false;
      toggle.setAttribute('aria-expanded', 'true');
      toggle.setAttribute('aria-label', 'Fermer le menu');
      setPageInert(true);
      document.body.style.overflow = 'hidden';
      menu.querySelector('a').focus();
    });
    menu.addEventListener('click', function (e) {
      if (e.target.closest('a')) closeMenu(false);
    });
    window.matchMedia('(min-width: 1101px)').addEventListener('change', function (e) {
      if (e.matches) closeMenu(false);
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
  // Outside main's stacking context so the dialog covers the fixed header.
  if (modal) document.body.appendChild(modal);

  function openModal() {
    if (!modal) return;
    lastFocused = document.activeElement;
    modal.hidden = false;
    setPageInert(true);
    if (header) header.inert = true;
    document.body.style.overflow = 'hidden';
    var link = modal.querySelector('.btn-primary');
    if (link) link.focus();
  }
  function closeModal() {
    if (!modal || modal.hidden) return;
    modal.hidden = true;
    setPageInert(false);
    if (header) header.inert = false;
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
    if (e.key === 'Escape') {
      closeModal();
      closeMenu(true);
    }
    if (e.key !== 'Tab') return;
    var controls;
    if (modal && !modal.hidden) {
      controls = Array.from(modal.querySelectorAll('a[href], button'));
    } else if (menu && !menu.hidden) {
      controls = [toggle].concat(Array.from(menu.querySelectorAll('a[href]')));
    } else return;
    var first = controls[0];
    var last = controls[controls.length - 1];
    if (e.shiftKey && (document.activeElement === first || !controls.includes(document.activeElement))) {
      e.preventDefault(); last.focus();
    } else if (!e.shiftKey && (document.activeElement === last || !controls.includes(document.activeElement))) {
      e.preventDefault(); first.focus();
    }
  });

  // ---- footer year ----
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
})();
