/*! Lions-Design Modul-Lader | lädt nur die Module, die auf der Seite per data-ld markiert sind */
(function () {
  if (window.LD && window.LD.loader) return;
  var LD = (window.LD = window.LD || {});
  LD.loader = true;
  LD.loaded = LD.loaded || {};
  var me = document.currentScript && document.currentScript.src;
  var base = me ? me.replace(/ld(\.min)?\.js(\?.*)?$/, 'modules/') : '';

  LD.load = function (name) {
    name = String(name || '').trim().toLowerCase();
    if (!/^[a-z0-9-]+$/.test(name) || LD.loaded[name]) return;
    LD.loaded[name] = true;
    var s = document.createElement('script');
    s.src = base + name + '.js';
    s.async = false;
    document.head.appendChild(s);
  };

  // Module, die sich auch ohne data-ld über ihr eigenes Attribut aktivieren
  var AUTO = { '[data-reveal],[data-reveal-stagger]': 'reveal' };

  function scan() {
    for (var sel in AUTO) if (document.querySelector(sel)) LD.load(AUTO[sel]);
    var els = document.querySelectorAll('[data-ld]');
    for (var i = 0; i < els.length; i++) {
      els[i].getAttribute('data-ld').split(/[\s,]+/).forEach(LD.load);
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', scan);
  else scan();
})();
