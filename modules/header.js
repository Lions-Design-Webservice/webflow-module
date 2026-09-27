/*! Lions-Design Modul: header | Header-Zustand beim Scrollen + Mobilmenü
 *  Header:     data-ld="header"
 *              optional: data-header-offset="24"  ab wie vielen Pixeln "is-scrolled" gesetzt wird
 *                        data-header-spy="true"   Anker-Links (#id) bekommen "is-active", wenn der Abschnitt sichtbar ist
 *                        data-header-lock="true"  Seite scrollt nicht, solange das Mobilmenü offen ist
 *  Menü-Button: data-header-burger   Mobilmenü: data-header-menu
 *  Zustände (als Combo-Klasse stylen):
 *              Header: is-scrolled, is-menu-open   Menü: is-open   Burger: is-open   Link: is-active
 */
(function () {
  var LD = (window.LD = window.LD || {});
  if (LD.header) return;
  LD.header = true;

  var st = document.createElement('style');
  st.textContent = 'html.ld-js [data-header-menu]:not(.is-open){display:none}[data-header-burger]{cursor:pointer}';
  document.head.appendChild(st);
  document.documentElement.classList.add('ld-js');

  function init() {
    document.querySelectorAll('[data-ld~="header"]').forEach(function (h) {
      if (h.__ldHeader) return;
      h.__ldHeader = true;
      var off = parseInt(h.getAttribute('data-header-offset') || '24', 10);
      var lock = h.getAttribute('data-header-lock') === 'true';
      var burger = h.querySelector('[data-header-burger]');
      var menu = h.querySelector('[data-header-menu]') || document.querySelector('[data-header-menu]');

      function onScroll() { h.classList.toggle('is-scrolled', window.scrollY > off); }
      onScroll();
      window.addEventListener('scroll', onScroll, { passive: true });

      function setMenu(open) {
        if (!menu) return;
        menu.classList.toggle('is-open', open);
        h.classList.toggle('is-menu-open', open);
        if (burger) {
          burger.classList.toggle('is-open', open);
          burger.setAttribute('aria-expanded', open ? 'true' : 'false');
          burger.setAttribute('aria-label', open ? 'Menü schließen' : 'Menü öffnen');
        }
        if (lock) document.body.style.overflow = open ? 'hidden' : '';
      }
      if (burger) {
        burger.setAttribute('role', 'button');
        burger.setAttribute('tabindex', '0');
        setMenu(false);
        var tg = function (e) { e.preventDefault(); setMenu(!menu.classList.contains('is-open')); };
        burger.addEventListener('click', tg);
        burger.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') tg(e); });
      }
      if (menu) menu.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
      document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });
      window.addEventListener('resize', function () { if (burger && getComputedStyle(burger).display === 'none') setMenu(false); });

      if (h.getAttribute('data-header-spy') === 'true' && 'IntersectionObserver' in window) {
        var links = Array.prototype.slice.call(document.querySelectorAll('a[href^="#"]')).filter(function (a) {
          return a.getAttribute('href').length > 1 && (h.contains(a) || (menu && menu.contains(a)));
        });
        var io = new IntersectionObserver(function (es) {
          es.forEach(function (e) {
            if (!e.isIntersecting) return;
            links.forEach(function (a) { a.classList.toggle('is-active', a.getAttribute('href') === '#' + e.target.id); });
          });
        }, { rootMargin: '-45% 0px -50% 0px' });
        links.forEach(function (a) {
          var t = document.getElementById(a.getAttribute('href').slice(1));
          if (t) io.observe(t);
        });
      }
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
