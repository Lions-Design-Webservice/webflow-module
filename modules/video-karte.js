/*! Lions-Design Modul: video-karte | Video startet per Klick direkt in der Karte
 *  Karte:      data-ld="video-karte"  +  data-video-vimeo="1228388306"  oder  data-video-youtube="dQw4w9WgXcQ"
 *  Vorschau:   Vorschaubild, Play-Symbol usw. liegen einfach in der Karte.
 *  Ziel:       data-video-frame (optional) – dieses Element wird durch das Video ersetzt.
 *              Ohne data-video-frame ersetzt das Video den Inhalt der Karte.
 *              Das Ziel braucht eine feste Größe/Seitenverhältnis (z. B. aspect-ratio 4/3) und position:relative.
 *  Datenschutz: Vimeo/YouTube werden erst nach dem Klick geladen (Vimeo mit dnt=1, YouTube über youtube-nocookie.com).
 *  Zustand:    Karte bekommt "is-playing".
 */
(function () {
  var LD = (window.LD = window.LD || {});
  if (LD.videoKarte) return;
  LD.videoKarte = true;

  var st = document.createElement('style');
  st.textContent = '[data-ld~="video-karte"]:not(.is-playing){cursor:pointer}.ld-vid{position:absolute;top:0;left:0;width:100%;height:100%;border:0}';
  document.head.appendChild(st);

  function src(el) {
    var v = el.getAttribute('data-video-vimeo'), y = el.getAttribute('data-video-youtube');
    if (v) return 'https://player.vimeo.com/video/' + encodeURIComponent(v) + '?autoplay=1&title=0&byline=0&portrait=0&dnt=1';
    if (y) return 'https://www.youtube-nocookie.com/embed/' + encodeURIComponent(y) + '?autoplay=1&rel=0&modestbranding=1';
    return '';
  }
  function play(card) {
    if (card.classList.contains('is-playing')) return;
    var s = src(card);
    if (!s) return;
    var target = card.querySelector('[data-video-frame]') || card;
    if (getComputedStyle(target).position === 'static') target.style.position = 'relative';
    target.innerHTML = '<iframe class="ld-vid" src="' + s + '" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen title="Video"></iframe>';
    card.classList.add('is-playing');
  }
  function init() {
    document.querySelectorAll('[data-ld~="video-karte"]').forEach(function (c) {
      if (c.__ldVid) return;
      c.__ldVid = true;
      c.setAttribute('role', 'button');
      c.setAttribute('tabindex', '0');
      c.setAttribute('aria-label', c.getAttribute('aria-label') || 'Video abspielen');
      c.addEventListener('click', function (e) { if (!c.classList.contains('is-playing')) { e.preventDefault(); play(c); } });
      c.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); play(c); } });
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
