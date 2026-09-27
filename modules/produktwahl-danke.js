/*! Lions-Design Modul: produktwahl-danke | Zeigt auf der Dankesseite, was bestellt/angefragt wurde
 *  Aktivieren:  data-ld="produktwahl-danke"   optional data-pw-key="…" (gleich wie auf der Auswahlseite)
 *  Anzeigen:    data-pwd-show="data"     nur sichtbar, wenn Daten da sind
 *               data-pwd-show="nodata"   nur sichtbar, wenn keine Daten da sind (z. B. Seite direkt aufgerufen)
 *  Texte:       data-pwd-text="{Vorname} {Nachname}"   Platzhalter = Feldnamen aus dem Formular
 *               + {product} {color} {size} {view} {product-id}
 *  Bilder:      data-pw-img + data-pw-product="id" (+ data-pw-view, data-pw-img-color) – nur das passende wird gezeigt
 *  Sortieren:   data-pwd-sort am Container; Kinder mit data-pw-family="id1, id2" rücken nach vorne,
 *               wenn das gewählte Produkt dabei ist
 *  Die Daten liegen nur im Browser-Tab des Besuchers (sessionStorage), nichts steht in der URL.
 */
(function () {
  var LD = (window.LD = window.LD || {});
  if (LD.produktwahlDanke) return;
  LD.produktwahlDanke = true;

  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function init() {
    var root = document.querySelector('[data-ld~="produktwahl-danke"]');
    if (!root) return;
    var KEY = 'ld-pw:' + (root.getAttribute('data-pw-key') || 'standard');
    var d = null;
    try { d = JSON.parse(sessionStorage.getItem(KEY) || 'null'); } catch (e) { d = null; }
    var ok = !!(d && d.product);
    $$('[data-pwd-show]').forEach(function (el) { el.style.display = (el.getAttribute('data-pwd-show') === 'data') === ok ? '' : 'none'; });
    if (!ok) return;
    var vals = {};
    for (var k in (d.fields || {})) vals[k] = d.fields[k];
    vals.product = d.productName; vals['product-id'] = d.product; vals.color = d.colorName;
    vals.size = d.size; vals.view = d.view === 'back' ? 'Rückseite' : 'Vorderseite';
    $$('[data-pwd-text]').forEach(function (el) {
      el.textContent = el.getAttribute('data-pwd-text').replace(/\{([^}]+)\}/g, function (_, n) { return vals[n.trim()] != null ? vals[n.trim()] : ''; }).replace(/\s+/g, ' ').trim() || '–';
    });
    $$('[data-pw-img][data-pw-product]').forEach(function (img) {
      var v = img.getAttribute('data-pw-view'), ic = img.getAttribute('data-pw-img-color');
      var on = img.getAttribute('data-pw-product') === d.product && (!v || v === d.view) && (!ic || ic === d.color);
      img.style.display = on ? 'block' : 'none';
    });
    $$('[data-pwd-sort]').forEach(function (box) {
      var kids = Array.prototype.slice.call(box.children);
      kids.map(function (c, i) {
        var fam = (c.getAttribute('data-pw-family') || '').split(',').map(function (s) { return s.trim(); });
        return { c: c, i: i, m: fam.indexOf(d.product) >= 0 ? 1 : 0 };
      }).sort(function (a, b) { return (b.m - a.m) || (a.i - b.i); }).forEach(function (x) { box.appendChild(x.c); });
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
