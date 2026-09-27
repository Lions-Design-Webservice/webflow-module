/*! Lions-Design Modul: prozess | Fortschrittslinie läuft beim Scrollen mit
 *  Bereich:    data-ld="prozess"
 *  Linie:      data-prozess-bar="x"  (waagerecht wachsen)  oder  data-prozess-bar="y" (senkrecht)
 *              beliebig viele, z. B. eine für Desktop (x) und eine für Mobil (y)
 *  Schritte:   data-prozess-step  – bekommen nacheinander die Klasse "is-active"
 *  optional am Bereich: data-prozess-start="0.9"  (Startpunkt, Anteil der Fensterhöhe)
 */
(function () {
  var LD = (window.LD = window.LD || {});
  if (LD.prozess) return;
  LD.prozess = true;

  var st = document.createElement('style');
  st.textContent =
    '[data-prozess-bar="x"]{transform-origin:0 50%;transition:transform .3s ease-out}' +
    '[data-prozess-bar="y"]{transform-origin:50% 0;transition:transform .3s ease-out}';
  document.head.appendChild(st);

  function init() {
    var areas = Array.prototype.slice.call(document.querySelectorAll('[data-ld~="prozess"]'));
    if (!areas.length) return;
    var ticking = false;
    function update() {
      ticking = false;
      var vh = window.innerHeight;
      areas.forEach(function (a) {
        var r = a.getBoundingClientRect();
        var start = parseFloat(a.getAttribute('data-prozess-start') || '0.9');
        var p = (start * vh - r.top) / (r.height + 0.4 * vh);
        p = Math.max(0, Math.min(1, p));
        a.querySelectorAll('[data-prozess-bar]').forEach(function (b) {
          b.style.transform = b.getAttribute('data-prozess-bar') === 'y' ? 'scaleY(' + p + ')' : 'scaleX(' + p + ')';
        });
        var steps = a.querySelectorAll('[data-prozess-step]');
        steps.forEach(function (s, i) { s.classList.toggle('is-active', p > (i + 0.3) / steps.length); });
      });
    }
    function req() { if (!ticking) { ticking = true; requestAnimationFrame(update); } }
    window.addEventListener('scroll', req, { passive: true });
    window.addEventListener('resize', req);
    update();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
