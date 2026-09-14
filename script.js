(function () {
  'use strict';

  var scrollArea = document.getElementById('scrollArea');
  var navTitle = document.getElementById('navTitle');
  var tabbar = document.getElementById('tabbar');
  var tabs = document.querySelectorAll('.tab');
  var titles = {
    accueil: 'Wilfrid Boulevard',
    approche: "L'approche",
    wilfrid: 'Wilfrid',
    questions: 'Questions',
    contact: 'Contact'
  };

  function goTab(name) {
    tabs.forEach(function (t) {
      t.classList.toggle('is-active', t.dataset.tab === name);
    });
    tabbar.querySelectorAll('button[data-go]').forEach(function (b) {
      b.classList.toggle('is-active', b.dataset.go === name);
    });
    navTitle.textContent = titles[name] || '';
    scrollArea.scrollTop = 0;
    closeSheet();
  }

  document.querySelectorAll('[data-go]').forEach(function (el) {
    el.addEventListener('click', function () {
      goTab(el.dataset.go);
    });
  });

  // ---- reservation sheet ----
  var sheetOverlay = document.getElementById('sheetOverlay');

  function openSheet() {
    sheetOverlay.hidden = false;
  }
  function closeSheet() {
    sheetOverlay.hidden = true;
  }
  document.querySelectorAll('[data-open-sheet]').forEach(function (el) {
    el.addEventListener('click', openSheet);
  });
  document.querySelectorAll('[data-close-sheet]').forEach(function (el) {
    el.addEventListener('click', closeSheet);
  });

  // ---- FAQ accordion ----
  document.querySelectorAll('.faq-item button').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var item = btn.closest('.faq-item');
      var isOpen = item.classList.contains('is-open');
      document.querySelectorAll('.faq-item.is-open').forEach(function (open) {
        open.classList.remove('is-open');
        open.querySelector('button').setAttribute('aria-expanded', 'false');
      });
      if (!isOpen) {
        item.classList.add('is-open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // ---- carousel dots ----
  var carousel = document.getElementById('carousel');
  var dots = document.querySelectorAll('#carouselDots span');
  if (carousel) {
    var cardWidth = 252 + 14;
    carousel.addEventListener('scroll', function () {
      var i = Math.round(carousel.scrollLeft / cardWidth);
      i = Math.max(0, Math.min(dots.length - 1, i));
      dots.forEach(function (d, idx) {
        d.classList.toggle('active', idx === i);
      });
    });
  }

  // ---- footer year ----
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ---- splash screen ----
  var splash = document.getElementById('splash');
  if (splash) {
    var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var alreadySeen = false;
    try { alreadySeen = sessionStorage.getItem('wb_splash_seen') === '1'; } catch (e) {}

    if (alreadySeen || reduceMotion) {
      splash.remove();
    } else {
      setTimeout(function () {
        splash.classList.add('is-hiding');
        splash.addEventListener('animationend', function () { splash.remove(); }, { once: true });
        try { sessionStorage.setItem('wb_splash_seen', '1'); } catch (e) {}
      }, 1100);
    }
  }
})();
