/*! Lions-Design Modul: galerie | Filter nach Kategorie + Lightbox
 *  Bereich:    data-ld="galerie"
 *  Filter:     data-gal-filter="Trauung"   (Wert "Alle" oder "*" zeigt alles; aktiver Filter bekommt "is-active")
 *  Bild-Kachel: data-gal-item  + optional data-gal-category="Trauung"  (mehrere mit Komma: "Trauung, Feier")
 *              In der Kachel muss ein <img> liegen. Ausgeblendete Kacheln bekommen "is-hidden".
 *  Optionen am Bereich:
 *              data-gal-lightbox="false"   Lightbox abschalten
 *              data-gal-start="Feier"      Filter, der beim Laden aktiv ist (Standard: erster Filter)
 *  Die Lightbox baut das Modul selbst (Pfeile, Wischen, Esc, Pfeiltasten) – im Designer muss nichts angelegt werden.
 */
(function () {
  var LD = (window.LD = window.LD || {});
  if (LD.galerie) return;
  LD.galerie = true;

  var st = document.createElement('style');
  st.textContent =
    '[data-gal-item].is-hidden{display:none!important}[data-gal-filter]{cursor:pointer}' +
    '[data-gal-item]{cursor:zoom-in}[data-ld~="galerie"][data-gal-lightbox="false"] [data-gal-item]{cursor:default}' +
    '.ld-lb{position:fixed;inset:0;z-index:9999;display:none;align-items:center;justify-content:center;background:rgba(10,10,10,.92);padding:4rem 4.5rem}' +
    '.ld-lb.is-open{display:flex}.ld-lb img{max-width:100%;max-height:100%;object-fit:contain;box-shadow:0 20px 60px rgba(0,0,0,.5)}' +
    '.ld-lb button{position:absolute;display:flex;align-items:center;justify-content:center;width:3rem;height:3rem;border:0;border-radius:999px;background:rgba(255,255,255,.12);color:#fff;font-size:1.5rem;line-height:1;cursor:pointer}' +
    '.ld-lb button:hover{background:rgba(255,255,255,.25)}.ld-lb-x{top:1rem;right:1rem}.ld-lb-p{left:1rem;top:50%;transform:translateY(-50%)}.ld-lb-n{right:1rem;top:50%;transform:translateY(-50%)}' +
    '.ld-lb-c{position:absolute;bottom:1rem;left:0;right:0;text-align:center;color:rgba(255,255,255,.8);font:500 .85rem/1.4 system-ui,sans-serif}' +
    '@media (max-width:767px){.ld-lb{padding:3.5rem .75rem}.ld-lb-p,.ld-lb-n{top:auto;bottom:.75rem;transform:none}}';
  document.head.appendChild(st);

  var lb, lbImg, lbCap, list = [], idx = 0;
  function buildLb() {
    if (lb) return;
    lb = document.createElement('div');
    lb.className = 'ld-lb';
    lb.setAttribute('role', 'dialog');
    lb.setAttribute('aria-modal', 'true');
    lb.innerHTML = '<img alt=""><button class="ld-lb-x" aria-label="Schließen">×</button><button class="ld-lb-p" aria-label="Vorheriges Bild">‹</button><button class="ld-lb-n" aria-label="Nächstes Bild">›</button><div class="ld-lb-c"></div>';
    document.body.appendChild(lb);
    lbImg = lb.querySelector('img');
    lbCap = lb.querySelector('.ld-lb-c');
    lb.querySelector('.ld-lb-x').onclick = close;
    lb.querySelector('.ld-lb-p').onclick = function (e) { e.stopPropagation(); show(idx - 1); };
    lb.querySelector('.ld-lb-n').onclick = function (e) { e.stopPropagation(); show(idx + 1); };
    lb.addEventListener('click', function (e) { if (e.target === lb) close(); });
    var x0 = null;
    lb.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; }, { passive: true });
    lb.addEventListener('touchend', function (e) {
      if (x0 === null) return;
      var dx = e.changedTouches[0].clientX - x0;
      if (Math.abs(dx) > 40) show(idx + (dx < 0 ? 1 : -1));
      x0 = null;
    });
    document.addEventListener('keydown', function (e) {
      if (!lb.classList.contains('is-open')) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') show(idx + 1);
      if (e.key === 'ArrowLeft') show(idx - 1);
    });
  }
  function show(i) {
    if (!list.length) return;
    idx = (i + list.length) % list.length;
    var img = list[idx].querySelector('img');
    lbImg.src = img.currentSrc || img.src;
    lbImg.alt = img.alt || '';
    lbCap.textContent = (img.alt ? img.alt + ' · ' : '') + (idx + 1) + ' / ' + list.length;
  }
  function open(items, i) {
    buildLb();
    list = items;
    show(i);
    lb.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }
  function close() {
    lb.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  function init() {
    document.querySelectorAll('[data-ld~="galerie"]').forEach(function (g) {
      if (g.__ldGal) return;
      g.__ldGal = true;
      var items = Array.prototype.slice.call(g.querySelectorAll('[data-gal-item]'));
      var filters = Array.prototype.slice.call(g.querySelectorAll('[data-gal-filter]'));
      function apply(f) {
        var all = !f || f === 'Alle' || f === '*';
        filters.forEach(function (b) {
          var on = b.getAttribute('data-gal-filter') === f;
          b.classList.toggle('is-active', on);
          b.setAttribute('aria-pressed', on ? 'true' : 'false');
        });
        items.forEach(function (it) {
          var cats = (it.getAttribute('data-gal-category') || '').split(',').map(function (c) { return c.trim(); });
          it.classList.toggle('is-hidden', !all && cats.indexOf(f) < 0);
        });
      }
      filters.forEach(function (b) {
        b.setAttribute('role', 'button');
        b.setAttribute('tabindex', '0');
        var go = function (e) { e.preventDefault(); apply(b.getAttribute('data-gal-filter')); };
        b.addEventListener('click', go);
        b.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') go(e); });
      });
      if (filters.length) apply(g.getAttribute('data-gal-start') || filters[0].getAttribute('data-gal-filter'));

      if (g.getAttribute('data-gal-lightbox') === 'false') return;
      items.forEach(function (it) {
        if (!it.querySelector('img')) return;
        it.setAttribute('tabindex', '0');
        var go = function (e) {
          e.preventDefault();
          var vis = items.filter(function (x) { return !x.classList.contains('is-hidden') && x.querySelector('img'); });
          open(vis, vis.indexOf(it));
        };
        it.addEventListener('click', go);
        it.addEventListener('keydown', function (e) { if (e.key === 'Enter') go(e); });
      });
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
