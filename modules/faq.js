/*! Lions-Design Modul: faq | Akkordeon
 *  Container:  data-ld="faq"   optional: data-faq-open="1" (Nummer, 0 = keiner)  data-faq-multiple="true"
 *  Eintrag:    data-faq-item
 *  Frage:      data-faq-trigger   (Link- oder Div-Element)
 *  Antwort:    data-faq-panel
 *  Symbol:     data-faq-icon      (optional, dreht sich 45° beim Öffnen)
 *  Zustand:    Klasse "is-open" am Eintrag – im Designer als Combo-Klasse stylbar
 */
(function () {
  var LD = (window.LD = window.LD || {});
  if (LD.faq) return;
  LD.faq = true;

  var css =
    'html.ld-js [data-faq-item]:not(.is-open) [data-faq-panel]{display:none}' +
    '[data-faq-trigger]{cursor:pointer}' +
    '[data-faq-icon]{transition:transform .3s ease}' +
    '[data-faq-item].is-open [data-faq-icon]{transform:rotate(45deg)}';
  var st = document.createElement('style');
  st.textContent = css;
  document.head.appendChild(st);
  document.documentElement.classList.add('ld-js');

  function init() {
    var lists = document.querySelectorAll('[data-ld~="faq"]');
    Array.prototype.forEach.call(lists, function (list) {
      if (list.__ldFaq) return;
      list.__ldFaq = true;
      var multi = list.getAttribute('data-faq-multiple') === 'true';
      var openIdx = parseInt(list.getAttribute('data-faq-open') || '0', 10);
      var items = Array.prototype.slice.call(list.querySelectorAll('[data-faq-item]'));

      function set(item, open) {
        item.classList.toggle('is-open', open);
        var t = item.querySelector('[data-faq-trigger]');
        if (t) t.setAttribute('aria-expanded', open ? 'true' : 'false');
      }

      items.forEach(function (item, i) {
        var t = item.querySelector('[data-faq-trigger]');
        if (!t) return;
        t.setAttribute('role', 'button');
        t.setAttribute('tabindex', '0');
        set(item, openIdx > 0 && i === openIdx - 1);
        function toggle(e) {
          e.preventDefault();
          var open = !item.classList.contains('is-open');
          if (!multi) items.forEach(function (o) { if (o !== item) set(o, false); });
          set(item, open);
        }
        t.addEventListener('click', toggle);
        t.addEventListener('keydown', function (e) {
          if (e.key === 'Enter' || e.key === ' ') toggle(e);
        });
      });
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
