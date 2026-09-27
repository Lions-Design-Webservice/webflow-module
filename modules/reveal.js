/*! Lions-Design Modul: reveal | Einblenden beim Scrollen
 *  Element:    data-reveal            (oder data-ld="reveal") – blendet sich beim Hineinscrollen ein
 *              Wert optional: up (Standard) | down | left | right | fade | zoom
 *              data-reveal-delay="200"      Verzögerung in ms
 *              data-reveal-duration="800"   Dauer in ms
 *  Gruppe:     data-reveal-stagger="90"     statt des Elements selbst werden seine direkten Kinder
 *                                           nacheinander eingeblendet (Abstand in ms)
 *  Elemente, die beim Laden schon sichtbar sind, bleiben ohne Animation stehen (kein Flackern).
 *  Wer auch den ersten Bildschirm animieren will: Anleitung auf der Musterseite (Kopf-Snippet).
 */
(function () {
  var LD = (window.LD = window.LD || {});
  if (LD.reveal) return;
  LD.reveal = true;

  var st = document.createElement('style');
  st.textContent =
    '.ld-rv{opacity:0;transition-property:opacity,transform;transition-timing-function:cubic-bezier(.22,.61,.36,1)}' +
    '.ld-rv-up{transform:translateY(28px)}.ld-rv-down{transform:translateY(-28px)}' +
    '.ld-rv-left{transform:translateX(-40px)}.ld-rv-right{transform:translateX(40px)}.ld-rv-zoom{transform:scale(.95)}' +
    '.ld-rv.ld-rv-in{opacity:1;transform:none}' +
    '@media (prefers-reduced-motion:reduce){.ld-rv{opacity:1!important;transform:none!important;transition:none!important}}';
  document.head.appendChild(st);

  function targets() {
    var out = [];
    document.querySelectorAll('[data-reveal],[data-ld~="reveal"],[data-reveal-stagger]').forEach(function (el) {
      if (el.__ldRv) return;
      el.__ldRv = true;
      var stagger = el.getAttribute('data-reveal-stagger');
      var kind = el.getAttribute('data-reveal') || 'up';
      var dur = el.getAttribute('data-reveal-duration') || '800';
      var base = parseInt(el.getAttribute('data-reveal-delay') || '0', 10);
      if (stagger !== null) {
        Array.prototype.forEach.call(el.children, function (c, i) {
          out.push({ el: c, kind: kind, dur: dur, delay: base + i * parseInt(stagger || '90', 10) });
        });
      } else out.push({ el: el, kind: kind, dur: dur, delay: base });
    });
    return out;
  }

  function init() {
    var list = targets();
    var vh = window.innerHeight || 800;
    var io = 'IntersectionObserver' in window ? new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        // Über das Element hinweggesprungen (Anker-Link): sofort zeigen, damit nichts unsichtbar bleibt
        if (!e.isIntersecting && e.boundingClientRect.bottom < 0) e.target.style.transitionDelay = '0ms';
        else if (!e.isIntersecting) return;
        io.unobserve(e.target);
        var el = e.target;
        requestAnimationFrame(function () { el.classList.add('ld-rv-in'); });
        setTimeout(function () {
          el.classList.remove('ld-rv', 'ld-rv-in', 'ld-rv-' + el.__ldKind);
          el.style.transitionDuration = el.style.transitionDelay = '';
        }, (el.__ldTotal || 1000) + 100);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }) : null;

    list.forEach(function (t) {
      var r = t.el.getBoundingClientRect();
      if (!io || (r.top < vh && r.bottom > 0)) return; // schon sichtbar -> nichts tun
      t.el.__ldKind = t.kind;
      t.el.__ldTotal = parseInt(t.dur, 10) + t.delay;
      t.el.style.transitionDuration = t.dur + 'ms';
      t.el.style.transitionDelay = t.delay + 'ms';
      t.el.classList.add('ld-rv');
      if (t.kind !== 'fade') t.el.classList.add('ld-rv-' + t.kind);
      io.observe(t.el);
    });
    document.documentElement.classList.add('ld-ready');
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
