/*! Lions-Design Modul: multistep | Mehrstufiges Formular (Formly) + Hilfstexte bei Fehleingaben
 *  Formular (das innere Form-Element):  data-ld="multistep"   (setzt data-form="multistep" automatisch)
 *  Schritte:      data-form="step"        auf jedem Abschnitts-Wrapper
 *  Weiter/Zurück: data-form="next-btn" / data-form="back-btn"   (Div oder Link, KEIN Formular-Button)
 *  Absenden:      data-form="submit-btn"  nur auf dem echten Formular-Button
 *  Fortschritt:   <span data-text="current-step"></span> von <span data-text="total-steps"></span>
 *  Optional:      data-enter="true" am Formular = Enter springt zum nächsten Schritt
 *  Hilfstexte:    An Feldern optional data-error-msg="…" (falsches Format) und data-error-msg-required="…" (leer).
 *                 Der Text erscheint in einem Element mit Klasse "form-error" direkt unter dem Feld
 *                 (wird automatisch angelegt, Aussehen über die Klasse "form-error" im Designer).
 *                 Fehlerhafte Felder bekommen die Klasse "is-invalid".
 *  Hinweis:       Formly erlaubt ein Multistep-Formular pro Seite. Die Hilfstexte funktionieren auch
 *                 ohne Schritte: data-ld="formcheck" am Formular nutzt nur die Prüfung.
 */
(function () {
  var LD = (window.LD = window.LD || {});
  if (LD.multistep) return;
  LD.multistep = true;
  var FORMLY = 'https://cdn.jsdelivr.net/gh/videsigns/webflow-tools@latest/multi-step.js';

  function msgFor(el) {
    var v = el.validity;
    if (v.valueMissing) return el.getAttribute('data-error-msg-required') || 'Dieses Feld ist erforderlich.';
    if (v.typeMismatch && el.type === 'email') return el.getAttribute('data-error-msg') || 'Bitte eine gültige E-Mail-Adresse eingeben.';
    if (v.typeMismatch) return el.getAttribute('data-error-msg') || 'Bitte prüfe deine Eingabe.';
    if (v.tooShort) return el.getAttribute('data-error-msg') || 'Bitte mehr Zeichen eingeben.';
    if (v.patternMismatch) return el.getAttribute('data-error-msg') || 'Bitte prüfe das Format.';
    return el.getAttribute('data-error-msg') || 'Bitte prüfe dieses Feld.';
  }
  function errEl(el) {
    var anchor = (el.type === 'checkbox' || el.type === 'radio') && el.closest('label') ? el.closest('label') : el;
    var n = anchor.nextElementSibling;
    if (n && n.classList.contains('form-error')) return n;
    var p = document.createElement('div');
    p.className = 'form-error';
    p.setAttribute('role', 'alert');
    p.style.display = 'none';
    anchor.insertAdjacentElement('afterend', p);
    return p;
  }
  function check(el) {
    var e = errEl(el);
    if (el.checkValidity()) { el.classList.remove('is-invalid'); e.style.display = 'none'; e.textContent = ''; return true; }
    el.classList.add('is-invalid'); e.textContent = msgFor(el); e.style.display = 'block'; return false;
  }
  LD.formCheck = check;

  function wire(form) {
    if (form.__ldCheck) return;
    form.__ldCheck = true;
    var sel = 'input[required], input[type="email"], input[pattern], textarea[required], select[required]';
    form.querySelectorAll(sel).forEach(function (el) {
      el.addEventListener('blur', function () { check(el); });
      el.addEventListener('input', function () { if (el.classList.contains('is-invalid')) check(el); });
      el.addEventListener('change', function () { if (el.tagName === 'SELECT' || el.type === 'checkbox') check(el); });
    });
    // Weiter-Klick: Fehler im aktuellen Schritt sichtbar machen. Formly deaktiviert den Button
    // (pointer-events:none), der Klick landet dann auf dem Element dahinter – deshalb über die Position prüfen.
    form.addEventListener('click', function (e) {
      var nb = e.target.closest('[data-form="next-btn"]');
      if (!nb) {
        form.querySelectorAll('[data-form="next-btn"]').forEach(function (b) {
          if (!b.offsetParent) return;
          var r = b.getBoundingClientRect();
          if (e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom) nb = b;
        });
      }
      if (!nb) return;
      var step = nb.closest('[data-form="step"]');
      if (step) step.querySelectorAll(sel).forEach(check);
    }, true);
  }

  function init() {
    var ms = document.querySelectorAll('form[data-ld~="multistep"], [data-ld~="multistep"] form');
    document.querySelectorAll('form[data-ld~="formcheck"], [data-ld~="formcheck"] form').forEach(wire);
    if (!ms.length) return;
    ms.forEach(function (f) { if (!f.getAttribute('data-form')) f.setAttribute('data-form', 'multistep'); wire(f); });
    if (!LD.formly) {
      LD.formly = true;
      var s = document.createElement('script');
      s.src = FORMLY;
      document.body.appendChild(s);
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
