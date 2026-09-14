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
      var on = b.dataset.go === name;
      b.classList.toggle('is-active', on);
      b.setAttribute('aria-selected', on ? 'true' : 'false');
    });
    navTitle.textContent = titles[name] || '';
    // instant, not smooth: a tab switch should land at the top immediately
    scrollArea.scrollTo({ top: 0, behavior: 'instant' });
    updateNavTitle();
    closeSheet();
  }

  // iOS large-title: show the bar title only once the page heading is behind the bar
  var topbar = document.querySelector('.topbar');
  function updateNavTitle() {
    var active = document.querySelector('.tab.is-active');
    var heading = active && active.querySelector('h1');
    if (!heading) {
      navTitle.classList.add('is-visible');
      return;
    }
    var passed = heading.getBoundingClientRect().bottom <
                 scrollArea.getBoundingClientRect().top + topbar.offsetHeight;
    navTitle.classList.toggle('is-visible', passed);
  }
  scrollArea.addEventListener('scroll', updateNavTitle, { passive: true });

  document.querySelectorAll('[data-go]').forEach(function (el) {
    el.addEventListener('click', function () {
      goTab(el.dataset.go);
    });
  });

  // ---- reservation sheet ----
  var sheetOverlay = document.getElementById('sheetOverlay');
  var sumupLink = document.getElementById('sumupLink');
  var lastFocused = null;

  function openSheet() {
    lastFocused = document.activeElement;
    sheetOverlay.hidden = false;
    sumupLink.focus();
  }
  function closeSheet() {
    if (sheetOverlay.hidden) return;
    sheetOverlay.hidden = true;
    if (lastFocused && lastFocused.focus) lastFocused.focus();
    lastFocused = null;
  }
  document.querySelectorAll('[data-open-sheet]').forEach(function (el) {
    el.addEventListener('click', openSheet);
  });
  document.querySelectorAll('[data-close-sheet]').forEach(function (el) {
    el.addEventListener('click', closeSheet);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeSheet();
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
  var dots = document.querySelectorAll('#carouselDots button');
  if (carousel) {
    var cards = carousel.querySelectorAll('article');
    carousel.addEventListener('scroll', function () {
      var center = carousel.scrollLeft + carousel.clientWidth / 2;
      var best = 0;
      var bestDist = Infinity;
      cards.forEach(function (card, idx) {
        var mid = card.offsetLeft + card.offsetWidth / 2;
        var dist = Math.abs(mid - center);
        if (dist < bestDist) { bestDist = dist; best = idx; }
      });
      dots.forEach(function (d, idx) {
        d.classList.toggle('active', idx === best);
      });
    });
    dots.forEach(function (dot, idx) {
      dot.addEventListener('click', function () {
        if (cards[idx]) cards[idx].scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      });
    });
  }

  // ---- footer year ----
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  updateNavTitle();

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
