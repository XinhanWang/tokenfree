/* ==========================================================================
   TokenFree · main.js
   主题切换 / 导航 / 目录高亮 / 筛选 / 复制 / 灯箱 / Utterances / 不蒜子兜底
   ========================================================================== */
(function () {
  'use strict';

  var html = document.documentElement;
  var UTTERANCES_REPO = 'XinhanWang/tokenfree';
  var UTTERANCES_ORIGIN = 'https://utteranc.es';

  /* ---------------- 主题 ---------------- */
  var SUN = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>';
  var MOON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z"/></svg>';

  function storedTheme() {
    try { return localStorage.getItem('tf-theme'); } catch (e) { return null; }
  }

  function applyTheme(theme) {
    html.setAttribute('data-theme', theme);
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', theme === 'dark' ? '#1b1b19' : '#f5f4ee');
    var btn = document.getElementById('themeBtn');
    if (btn) {
      btn.innerHTML = theme === 'dark' ? SUN : MOON;
      btn.title = theme === 'dark' ? '切换到浅色模式' : '切换到深色模式';
    }
    setUtterancesTheme(theme);
  }

  var initial = storedTheme();
  if (!initial) {
    initial = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }
  applyTheme(initial);

  var themeBtn = document.getElementById('themeBtn');
  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      var next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      try { localStorage.setItem('tf-theme', next); } catch (e) {}
      applyTheme(next);
    });
  }
  /* ---------------- Utterances 评论（主题跟随） ---------------- */
  function utterancesFrame() {
    return document.querySelector('iframe.utterances-frame');
  }

  function setUtterancesTheme(theme) {
    var frame = utterancesFrame();
    if (!frame || !frame.contentWindow) return;
    frame.contentWindow.postMessage(
      { type: 'set-theme', theme: theme === 'dark' ? 'github-dark' : 'github-light' },
      UTTERANCES_ORIGIN
    );
  }

  function loadUtterances() {
    var box = document.getElementById('utterances');
    if (!box || box.dataset.loaded) return;
    box.dataset.loaded = '1';
    var s = document.createElement('script');
    s.src = UTTERANCES_ORIGIN + '/client.js';
    s.async = true;
    s.crossOrigin = 'anonymous';
    s.setAttribute('repo', UTTERANCES_REPO);
    s.setAttribute('issue-term', 'pathname');
    s.setAttribute('label', '💬 评论');
    s.setAttribute('theme', html.getAttribute('data-theme') === 'dark' ? 'github-dark' : 'github-light');
    box.appendChild(s);
  }

  // 滚动到评论区附近再加载，首屏更快
  var cbox = document.getElementById('utterances');
  if (cbox && 'IntersectionObserver' in window) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { loadUtterances(); cio.disconnect(); }
      });
    }, { rootMargin: '400px 0px' });
    cio.observe(cbox);
  } else {
    loadUtterances();
  }
  /* ---------------- 移动端菜单 ---------------- */
  var nav = document.getElementById('nav');
  var navToggle = document.getElementById('navToggle');
  if (nav && navToggle) {
    navToggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a.nav-link')) {
        nav.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ---------------- 滚动进度 / 吸顶 / 回到顶部 ---------------- */
  var progress = document.getElementById('progress');
  var topbar = document.getElementById('topbar');
  var toTop = document.getElementById('toTop');
  var ticking = false;

  function onScroll() {
    var y = window.scrollY || document.documentElement.scrollTop;
    var h = document.documentElement.scrollHeight - window.innerHeight;
    if (progress) progress.style.width = (h > 0 ? (y / h) * 100 : 0) + '%';
    if (topbar) topbar.classList.toggle('is-stuck', y > 8);
    if (toTop) toTop.classList.toggle('show', y > 600);
    ticking = false;
  }

  window.addEventListener('scroll', function () {
    if (!ticking) { ticking = true; window.requestAnimationFrame(onScroll); }
  }, { passive: true });
  onScroll();

  if (toTop) {
    toTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
  /* ---------------- 目录 / 导航高亮（scroll spy） ---------------- */
  var sections = [].slice.call(document.querySelectorAll('main section[id]'));
  var spyLinks = [].slice.call(document.querySelectorAll('.toc a, .nav a.nav-link'));

  if (sections.length && 'IntersectionObserver' in window) {
    var visible = {};
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        visible[en.target.id] = en.isIntersecting ? en.intersectionRatio : 0;
      });
      var best = null, bestRatio = 0;
      Object.keys(visible).forEach(function (id) {
        if (visible[id] > bestRatio) { bestRatio = visible[id]; best = id; }
      });
      if (!best) return;
      spyLinks.forEach(function (a) {
        a.classList.toggle('active', a.getAttribute('href') === '#' + best);
      });
    }, {
      rootMargin: '-72px 0px -55% 0px',
      threshold: [0, 0.1, 0.25, 0.5, 0.75, 1]
    });
    sections.forEach(function (s) { spy.observe(s); });
  }

  /* ---------------- 入场动画 ---------------- */
  var reveals = [].slice.call(document.querySelectorAll('.reveal'));
  if ('IntersectionObserver' in window) {
    var rio = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); obs.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -60px 0px', threshold: 0.04 });
    reveals.forEach(function (el) { rio.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('in'); });
  }
  /* ---------------- Toast ---------------- */
  var toastEl = document.getElementById('toast');
  var toastTimer;
  function toast(msg) {
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.classList.remove('show'); }, 1900);
  }

  /* ---------------- 一键复制 ---------------- */
  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text);
    }
    return new Promise(function (resolve, reject) {
      var ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      var ok = false;
      try { ok = document.execCommand('copy'); } catch (e) {}
      document.body.removeChild(ta);
      ok ? resolve() : reject();
    });
  }

  document.addEventListener('click', function (e) {
    var btn = e.target.closest('.copy-btn');
    if (!btn) return;
    var row = btn.closest('.copyrow');
    var code = row && row.querySelector('code');
    if (!code) return;
    var text = code.textContent.trim();
    copyText(text).then(function () {
      btn.textContent = '已复制';
      btn.classList.add('done');
      toast('已复制：' + text);
      setTimeout(function () { btn.textContent = '复制'; btn.classList.remove('done'); }, 1800);
    }).catch(function () { toast('复制失败，请手动选中复制'); });
  });
  /* ---------------- 图片灯箱 ---------------- */
  var lightbox = document.getElementById('lightbox');
  var lightboxImg = lightbox && lightbox.querySelector('img');

  function openLightbox(src, alt) {
    if (!lightbox) return;
    lightboxImg.src = src;
    lightboxImg.alt = alt || '';
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
    setTimeout(function () { if (!lightbox.classList.contains('open')) lightboxImg.src = ''; }, 220);
  }

  document.addEventListener('click', function (e) {
    var img = e.target.closest('figure.shot img');
    if (img) { openLightbox(img.currentSrc || img.src, img.alt); return; }
    if (lightbox && lightbox.classList.contains('open')) {
      if (e.target === lightbox || e.target.closest('#lightboxClose')) closeLightbox();
    }
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      closeLightbox();
      if (nav) nav.classList.remove('open');
    }
  });
  /* ---------------- 渠道筛选 ---------------- */
  var filterBar = document.getElementById('filters');
  var emptyHint = document.getElementById('filterEmpty');
  var state = { type: 'all', stab: 'all' };

  function applyFilter() {
    var cards = [].slice.call(document.querySelectorAll('.card[data-type]'));
    var shown = 0;

    cards.forEach(function (card) {
      var okType = state.type === 'all' || card.dataset.type === state.type;
      var okStab = state.stab === 'all' || card.dataset.stab === state.stab;
      var show = okType && okStab;
      card.hidden = !show;
      if (show) shown++;
    });

    // 卡片全被过滤掉的板块整体隐藏（保留没有卡片的说明性板块）
    [].slice.call(document.querySelectorAll('main section[id]')).forEach(function (sec) {
      var owned = sec.querySelectorAll('.card[data-type]');
      if (!owned.length) return;
      var anyVisible = [].slice.call(owned).some(function (c) { return !c.hidden; });
      sec.style.display = anyVisible ? '' : 'none';
    });

    if (emptyHint) emptyHint.classList.toggle('show', shown === 0);
  }

  if (filterBar) {
    filterBar.addEventListener('click', function (e) {
      var chip = e.target.closest('.chip');
      if (!chip) return;
      var group = chip.dataset.filter;
      state[group] = chip.dataset.value;
      filterBar.querySelectorAll('.chip[data-filter="' + group + '"]').forEach(function (c) {
        c.classList.toggle('active', c === chip);
      });
      applyFilter();
    });
  }
  /* ---------------- 不蒜子访客统计：主站点挂了自动换镜像 ---------------- */
  var BSZ_MIRRORS = [
    'https://busuanzi.9420.ltd/js',
    'https://bsz.saodiyang.com/bsz.pure.mini.js'
  ];
  var bszIndex = 0;

  function bszLoaded() {
    var el = document.getElementById('busuanzi_value_site_pv');
    return !!(el && el.textContent && el.textContent.trim() !== '···' && el.textContent.trim() !== '');
  }

  function tryNextMirror() {
    if (bszLoaded() || bszIndex >= BSZ_MIRRORS.length) return;
    var s = document.createElement('script');
    s.async = true;
    s.src = BSZ_MIRRORS[bszIndex++];
    s.onerror = function () { setTimeout(tryNextMirror, 200); };
    document.body.appendChild(s);
    setTimeout(tryNextMirror, 4000);
  }

  window.addEventListener('load', function () {
    setTimeout(tryNextMirror, 3500);
  });

})();
