/**
 * 共用左側選單 (drawer) — QR / 方印工房 適配版
 * 支援 data-theme、body.dark-theme，並配合頁面 data-i18n
 */
(function () {
  'use strict';

  function openDrawer() {
    document.getElementById('drawer')?.classList.add('open');
    document.getElementById('drawer-overlay')?.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    document.getElementById('drawer')?.classList.remove('open');
    document.getElementById('drawer-overlay')?.classList.remove('open');
    document.body.style.overflow = '';
  }

  window.openDrawer = openDrawer;
  window.closeDrawer = closeDrawer;

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeDrawer();
  });

  var THEME_KEY_QR = 'qr-theme';
  var THEME_KEY_POKE = 'pokemon-calc-theme';

  function getCurrentTheme() {
    var dt = document.documentElement.getAttribute('data-theme');
    if (dt === 'dark' || dt === 'light') return dt;
    if (document.body.classList.contains('dark-theme')) return 'dark';
    return 'light';
  }

  function themeLabel(dark) {
    var map = {
      dark: { zh: '淺色模式', en: 'Light mode', ja: 'ライトモード' },
      light: { zh: '深色模式', en: 'Dark mode', ja: 'ダークモード' }
    };
    var lang = 'zh';
    try { lang = localStorage.getItem('qr-lang') || 'zh'; } catch (e) {}
    var key = dark ? 'dark' : 'light';
    return (map[key] && map[key][lang]) || (dark ? '淺色模式' : '深色模式');
  }

  function applyTheme(theme) {
    var dark = theme === 'dark';
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
    document.body.classList.toggle('dark-theme', dark);
    try {
      localStorage.setItem(THEME_KEY_QR, dark ? 'dark' : 'light');
      localStorage.setItem(THEME_KEY_POKE, dark ? 'dark' : 'light');
    } catch (e) {}

    var btn = document.getElementById('theme-toggle-drawer');
    if (btn) {
      var icon = btn.querySelector('.theme-toggle-icon');
      var text = btn.querySelector('.theme-toggle-text');
      if (icon) icon.textContent = dark ? '☀️' : '🌛';
      if (text) {
        text.textContent = themeLabel(dark);
        text.setAttribute('data-i18n', dark ? 'menu-theme-light' : 'menu-theme-dark');
      }
      btn.setAttribute('aria-label', themeLabel(dark));
      btn.title = themeLabel(dark);
    }
    var topBtn = document.querySelector('.theme-btn');
    if (topBtn) topBtn.textContent = dark ? '☀️' : '🌛';
  }

  var saved = null;
  try {
    saved = localStorage.getItem(THEME_KEY_QR) || localStorage.getItem(THEME_KEY_POKE);
  } catch (e) {}
  if (saved === 'dark' || saved === 'light') {
    applyTheme(saved);
  } else {
    applyTheme(getCurrentTheme());
  }

  function toggleTheme() {
    applyTheme(getCurrentTheme() === 'dark' ? 'light' : 'dark');
  }
  var drawerThemeBtn = document.getElementById('theme-toggle-drawer');
  if (drawerThemeBtn) {
    drawerThemeBtn.addEventListener('click', toggleTheme);
  }
  document.querySelectorAll('.theme-btn').forEach(function (btn) {
    btn.addEventListener('click', toggleTheme);
  });

  var path = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  document.querySelectorAll('.drawer-nav a').forEach(function (a) {
    var href = (a.getAttribute('href') || '').toLowerCase();
    if (!href || href.startsWith('http')) return;
    if (href === path || (path === '' && href.indexOf('index') !== -1)) {
      a.classList.add('active');
    }
  });
})();