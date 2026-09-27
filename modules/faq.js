/*! Lions-Design Modul: faq | Akkordeon mit Auf-/Zuklapp-Animation
 *  Container:  data-ld="faq"
 *              optional: data-faq-open="1"      (welcher Eintrag beim Laden offen ist, 0 = keiner)
 *                        data-faq-multiple="true" (mehrere gleichzeitig offen)
 *                        data-faq-duration="250"  (Animationsdauer in ms)
 *  Eintrag:    data-faq-item      Frage: data-faq-trigger      Antwort: data-faq-panel
 *  Symbol:     data-faq-icon (optional, dreht sich 45° beim Öffnen)
 *  Zustand:    Klasse "is-open" am Eintrag
 */
(function () {
  var LD = (window.LD = window.LD || {});
  if (LD.faq) return;
  LD.faq = true;

  var st = document.createElement('style');
  st.textContent =
    'html.ld-js [data-faq-item]:not(.is-open) [data-faq-panel]{display:none}' +
    '[data-faq-trigger]{cursor:pointer}' +
    '[data-faq-icon]{transition:transform .25s ease}' +
    '[data-faq-item].is-open [data-faq-icon]{transform:rotate(45deg)}';
  document.head.appendChild(st);
  document.documentElement.classList.add('ld-js');

  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function animate(panel, open, ms) {
    if (panel.__ldEnd) panel.__ldEnd();
    if (reduce || !ms) { panel.style.display = ''; return; }
    var cs = getComputedStyle(panel);
    var pt = cs.paddingTop, pb = cs.paddingBottom;
    var s = panel.style;
    s.display = 'block';
    s.overflow = 'hidden';
    var full = panel.scrollHeight;
    s.transition = 'none';
    if (open) { s.height = '0px'; s.paddingTop = '0px'; s.paddingBottom = '0px'; }
    else { s.height = full + 'px'; }
    panel.offsetHeight; // Reflow
    s.transition = 'height ' + ms + 'ms ease, padding ' + ms + 'ms ease';
    if (open) { s.height = full + 'px'; s.paddingTop = pt; s.paddingBottom = pb; }
    else { s.height = '0px'; s.paddingTop = '0px'; s.paddingBottom = '0px'; }
    var t = setTimeout(done, ms + 30);
    function done() {
      clearTimeout(t);
      panel.__ldEnd = null;
      s.transition = s.height = s.overflow = s.paddingTop = s.paddingBottom = s.display = '';
    }
    panel.__ldEnd = done;
  }

  function init() {
    document.querySelectorAll('[data-ld~="faq"]').forEach(function (list) {
      if (list.__ldFaq) return;
      list.__ldFaq = true;
      var multi = list.getAttribute('data-faq-multiple') === 'true';
      var openIdx = parseInt(list.getAttribute('data-faq-open') || '0', 10);
      var dur = parseInt(list.getAttribute('data-faq-duration') || '250', 10);
      var items = Array.prototype.slice.call(list.querySelectorAll('[data-faq-item]'));

      function set(item, open, anim) {
        if (item.classList.contains('is-open') === open) return;
        var p = item.querySelector('[data-faq-panel]');
        item.classList.toggle('is-open', open);
        var t = item.querySelector('[data-faq-trigger]');
        if (t) t.setAttribute('aria-expanded', open ? 'true' : 'false');
        if (p && anim) animate(p, open, dur);
      }

      items.forEach(function (item, i) {
        var t = item.querySelector('[data-faq-trigger]');
        if (!t) return;
        t.setAttribute('role', 'button');
        t.setAttribute('tabindex', '0');
        t.setAttribute('aria-expanded', 'false');
        if (openIdx > 0 && i === openIdx - 1) set(item, true, false);
        function toggle(e) {
          e.preventDefault();
          var open = !item.classList.contains('is-open');
          if (!multi) items.forEach(function (o) { if (o !== item) set(o, false, true); });
          set(item, open, true);
        }
        t.addEventListener('click', toggle);
        t.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') toggle(e); });
      });
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
