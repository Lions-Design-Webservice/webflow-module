/*! Lions-Design Modul: produktwahl | Produkt-Karten, Vorschau und Formular sind miteinander verknüpft
 *  Aktivieren:  data-ld="produktwahl"  (z. B. am Formular-Bereich)
 *               optional data-pw-key="rudel-shirt"  (Speichername, muss auf der Dankesseite gleich sein)
 *  KARTEN       data-pw-card="id"  +  data-pw-name="Anzeigename"      optional data-pw-default (vorausgewählt)
 *    darin      data-pw-select            Auswahl-Button   (optional data-pw-label-selected="Ausgewählt ✓")
 *               data-pw-color="black" + data-pw-color-name="Schwarz"   Farbfeld (optional, beliebig viele)
 *               data-pw-img  (+ data-pw-view="front|back", data-pw-img-color="black")   Produktbilder
 *               data-pw-view-btn="front|back"    Ansicht in der Karte umschalten (optional)
 *  VORSCHAU     data-pw-stage  mit Bildern  data-pw-img + data-pw-product="id" (+ data-pw-view, data-pw-img-color)
 *               data-pw-stage-view="front|back"  Ansicht der Vorschau umschalten (optional)
 *  FORMULAR     <select data-pw-field="product">  wird automatisch mit allen Karten befüllt
 *               <select data-pw-field="color">    wird automatisch mit den Farben des Produkts befüllt
 *               data-pw-size="M"  Größen-Buttons (Pflicht, sobald es welche gibt; abschalten: data-pw-size-required="false" am Formular)
 *               data-pw-summary="product|color|size|view"   Zusammenfassung (Text wird gesetzt)
 *  Beim Absenden: Pflichtfelder werden geprüft (Hilfstext in ".form-error"), versteckte Felder
 *               Produkt-ID, Farbe-ID, Groesse, Ansicht werden ergänzt und alles für die Dankesseite gemerkt.
 *  Zustände:    Karte/Auswahl-Button "is-selected", Größe/Ansicht/Farbfeld "is-active"
 */
(function () {
  var LD = (window.LD = window.LD || {});
  if (LD.produktwahl) return;
  LD.produktwahl = true;

  var st = document.createElement('style');
  st.textContent = '[data-pw-select],[data-pw-color],[data-pw-size],[data-pw-view-btn],[data-pw-stage-view]{cursor:pointer}' +
    '.ld-pw-in{animation:ldPwIn .42s ease-out both}@keyframes ldPwIn{from{opacity:0;transform:scale(.985)}to{opacity:1;transform:none}}';
  document.head.appendChild(st);

  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function clickable(el, fn) {
    if (!/^(A|BUTTON)$/.test(el.tagName)) { el.setAttribute('role', 'button'); el.setAttribute('tabindex', '0'); }
    el.addEventListener('click', function (e) {
      var h = el.getAttribute('href');
      if (!(el.tagName === 'A' && h && h.charAt(0) === '#' && h.length > 1)) e.preventDefault();
      fn(e);
    });
    el.addEventListener('keydown', function (e) { if ((e.key === 'Enter' && el.tagName !== 'A') || e.key === ' ') { e.preventDefault(); fn(e); } });
  }
  function showImg(img, on) {
    if (on) { if (img.style.display !== 'block') { img.style.display = 'block'; img.classList.remove('ld-pw-in'); img.offsetWidth; img.classList.add('ld-pw-in'); } }
    else img.style.display = 'none';
  }
  function errEl(anchor) {
    var n = anchor.nextElementSibling;
    if (n && n.classList.contains('form-error')) return n;
    var p = document.createElement('div');
    p.className = 'form-error'; p.setAttribute('role', 'alert'); p.style.display = 'none';
    anchor.insertAdjacentElement('afterend', p);
    return p;
  }
  function setErr(anchor, msg) {
    var e = errEl(anchor);
    e.textContent = msg || ''; e.style.display = msg ? 'block' : 'none';
    if (anchor.classList) anchor.classList.toggle('is-invalid', !!msg);
  }
  function fieldMsg(el) {
    if (el.validity.valueMissing) return el.getAttribute('data-error-msg-required') || 'Dieses Feld ist erforderlich.';
    if (el.type === 'email') return el.getAttribute('data-error-msg') || 'Bitte eine gültige E-Mail-Adresse eingeben.';
    return el.getAttribute('data-error-msg') || 'Bitte prüfe dieses Feld.';
  }

  function init() {
    var root = document.querySelector('[data-ld~="produktwahl"]');
    if (!root) return;
    var KEY = 'ld-pw:' + (root.getAttribute('data-pw-key') || 'standard');
    var cards = $$('[data-pw-card]');
    var P = {};
    cards.forEach(function (c) {
      var id = c.getAttribute('data-pw-card');
      P[id] = {
        id: id, card: c,
        name: c.getAttribute('data-pw-name') || id,
        colors: $$('[data-pw-color]', c).map(function (s) {
          return { id: s.getAttribute('data-pw-color'), name: s.getAttribute('data-pw-color-name') || s.getAttribute('data-pw-color') };
        })
      };
    });
    var ids = Object.keys(P);
    var def = cards.filter(function (c) { return c.hasAttribute('data-pw-default'); })[0];
    var S = { product: def ? def.getAttribute('data-pw-card') : ids[0] || '', color: '', size: '', view: 'front' };
    function colorsOf(id) { return P[id] ? P[id].colors : []; }
    function colorName(id, cid) { var c = colorsOf(id).filter(function (x) { return x.id === cid; })[0]; return c ? c.name : ''; }
    function fixColor() { var cs = colorsOf(S.product); if (!cs.some(function (c) { return c.id === S.color; })) S.color = cs[0] ? cs[0].id : ''; }
    fixColor();

    var selP = document.querySelector('select[data-pw-field="product"]');
    var selC = document.querySelector('select[data-pw-field="color"]');
    var sizes = $$('[data-pw-size]');
    var stage = document.querySelector('[data-pw-stage]');
    var form = root.tagName === 'FORM' ? root : root.querySelector('form') || (selP && selP.closest('form'));

    if (selP) {
      selP.innerHTML = '';
      ids.forEach(function (id) { var o = document.createElement('option'); o.value = P[id].name; o.textContent = P[id].name; selP.appendChild(o); });
      selP.addEventListener('change', function () { ids.forEach(function (id) { if (P[id].name === selP.value) S.product = id; }); fixColor(); render(); });
    }
    if (selC) selC.addEventListener('change', function () { colorsOf(S.product).forEach(function (c) { if (c.name === selC.value) S.color = c.id; }); render(); });

    // Karten
    cards.forEach(function (c) {
      var id = c.getAttribute('data-pw-card');
      var local = { view: 'front', color: colorsOf(id)[0] ? colorsOf(id)[0].id : '' };
      c.__pw = local;
      function paintCard() {
        var col = id === S.product ? S.color : local.color;
        $$('[data-pw-img]', c).forEach(function (img) {
          var v = img.getAttribute('data-pw-view'), ic = img.getAttribute('data-pw-img-color');
          showImg(img, (!v || v === local.view) && (!ic || ic === col));
        });
        $$('[data-pw-view-btn]', c).forEach(function (b) { b.classList.toggle('is-active', b.getAttribute('data-pw-view-btn') === local.view); });
        $$('[data-pw-color]', c).forEach(function (b) { b.classList.toggle('is-active', b.getAttribute('data-pw-color') === col); });
      }
      c.__paint = paintCard;
      $$('[data-pw-view-btn]', c).forEach(function (b) { clickable(b, function () { local.view = b.getAttribute('data-pw-view-btn'); paintCard(); }); });
      $$('[data-pw-color]', c).forEach(function (b) {
        clickable(b, function () { local.color = b.getAttribute('data-pw-color'); if (id === S.product) { S.color = local.color; render(); } else paintCard(); });
      });
      $$('[data-pw-select]', c).forEach(function (b) {
        b.__label = b.textContent;
        clickable(b, function () { S.product = id; S.color = local.color; fixColor(); render(); });
      });
    });
    $$('[data-pw-stage-view]').forEach(function (b) { clickable(b, function () { S.view = b.getAttribute('data-pw-stage-view'); render(); }); });
    sizes.forEach(function (b) { clickable(b, function () { S.size = b.getAttribute('data-pw-size'); if (sizes[0]) setErr(sizes[0].parentNode, ''); render(); }); });

    function render() {
      cards.forEach(function (c) {
        var on = c.getAttribute('data-pw-card') === S.product;
        c.classList.toggle('is-selected', on);
        if (on) c.__pw.color = S.color;
        $$('[data-pw-select]', c).forEach(function (b) {
          b.classList.toggle('is-selected', on);
          b.setAttribute('aria-pressed', on ? 'true' : 'false');
          b.textContent = on ? (b.getAttribute('data-pw-label-selected') || 'Ausgewählt ✓') : b.__label;
        });
        c.__paint();
      });
      if (stage) $$('[data-pw-img]', stage).forEach(function (img) {
        var v = img.getAttribute('data-pw-view'), ic = img.getAttribute('data-pw-img-color');
        showImg(img, img.getAttribute('data-pw-product') === S.product && (!v || v === S.view) && (!ic || ic === S.color));
      });
      $$('[data-pw-stage-view]').forEach(function (b) { b.classList.toggle('is-active', b.getAttribute('data-pw-stage-view') === S.view); });
      sizes.forEach(function (b) { var on = b.getAttribute('data-pw-size') === S.size; b.classList.toggle('is-active', on); b.setAttribute('aria-pressed', on ? 'true' : 'false'); });
      if (selP && P[S.product]) selP.value = P[S.product].name;
      if (selC) {
        selC.innerHTML = '';
        colorsOf(S.product).forEach(function (c) { var o = document.createElement('option'); o.value = c.name; o.textContent = c.name; selC.appendChild(o); });
        selC.value = colorName(S.product, S.color);
        selC.disabled = !colorsOf(S.product).length;
      }
      var sum = { product: P[S.product] ? P[S.product].name : '', color: colorName(S.product, S.color), size: S.size, view: S.view === 'back' ? 'Rückseite' : 'Vorderseite' };
      $$('[data-pw-summary]').forEach(function (el) { el.textContent = sum[el.getAttribute('data-pw-summary')] || '–'; });
    }

    function hidden(name, value) {
      var f = form.querySelector('input[type="hidden"][name="' + name + '"]');
      if (!f) { f = document.createElement('input'); f.type = 'hidden'; f.name = name; form.appendChild(f); }
      f.value = value;
    }
    if (form) {
      $$('input[required], input[type="email"], textarea[required], select[required]', form).forEach(function (el) {
        el.addEventListener('blur', function () { setErr(el, el.checkValidity() ? '' : fieldMsg(el)); });
        el.addEventListener('input', function () { if (el.classList.contains('is-invalid')) setErr(el, el.checkValidity() ? '' : fieldMsg(el)); });
      });
      form.setAttribute('novalidate', '');
      document.addEventListener('submit', function (e) {
        if (e.target !== form) return;
        var bad = [];
        $$('input[required], input[type="email"], textarea[required], select[required]', form).forEach(function (el) {
          var ok = el.checkValidity(); setErr(el, ok ? '' : fieldMsg(el)); if (!ok) bad.push(el);
        });
        if (sizes.length && form.getAttribute('data-pw-size-required') !== 'false' && !S.size) {
          setErr(sizes[0].parentNode, form.getAttribute('data-pw-size-msg') || 'Bitte Größe auswählen.');
          bad.push(sizes[0]);
        }
        if (bad.length) {
          e.preventDefault(); e.stopImmediatePropagation();
          bad[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
          if (bad[0].focus && bad[0].tagName !== 'DIV') bad[0].focus({ preventScroll: true });
          return;
        }
        hidden('Produkt-ID', S.product);
        hidden('Farbe-ID', S.color);
        hidden('Groesse', S.size);
        hidden('Ansicht', S.view === 'back' ? 'Rückseite' : 'Vorderseite');
        var fields = {};
        $$('input, select, textarea', form).forEach(function (el) {
          if (!el.name || el.type === 'submit' || ((el.type === 'checkbox' || el.type === 'radio') && !el.checked)) return;
          fields[el.name] = el.value;
        });
        var data = {
          product: S.product, productName: P[S.product] ? P[S.product].name : '',
          color: S.color, colorName: colorName(S.product, S.color),
          size: S.size, view: S.view, fields: fields, time: Date.now()
        };
        try { sessionStorage.setItem(KEY, JSON.stringify(data)); } catch (err) {}
      }, true);
    }
    render();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
