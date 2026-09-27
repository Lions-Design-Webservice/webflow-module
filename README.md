# Lions-Design Webflow-Module

Wiederverwendbare Funktionen für Webflow-Seiten. Jede Seite lädt nur die Module, die sie wirklich benutzt.

## Einbindung (einmal pro Website, Footer-Code)

```html
<script src="https://cdn.jsdelivr.net/gh/Lions-Design-Webservice/webflow-module@stable/ld.js" defer></script>
```

Der Lader sucht nach `data-ld="…"` und lädt `modules/<name>.js`.

## Module

| Modul | Aktivierung | Zweck |
|---|---|---|
| faq | `data-ld="faq"` | Akkordeon mit Animation |
| produktwahl | `data-ld="produktwahl"` | Produkt-Karten ↔ Vorschau ↔ Formular, Prüfung, Übergabe an Dankesseite |
| produktwahl-danke | `data-ld="produktwahl-danke"` | Auswahl und Formulardaten auf der Dankesseite anzeigen |
| multistep | `data-ld="multistep"` am Formular | Formly-Schritte + Hilfstexte bei Fehleingaben |
| formcheck | `data-ld="formcheck"` am Formular | nur Hilfstexte, ohne Schritte |
| galerie | `data-ld="galerie"` | Filter + Lightbox |
| video-karte | `data-ld="video-karte"` | Vimeo/YouTube startet per Klick in der Karte |
| reveal | `data-reveal` (lädt sich selbst) | Einblenden beim Scrollen |
| header | `data-ld="header"` | Scroll-Zustand, Mobilmenü, aktiver Menüpunkt |
| prozess | `data-ld="prozess"` | Fortschrittslinie beim Scrollen |

Ausführliche Anleitung mit Beispielen: Musterseite → /module

## Versionen

- `main` = Arbeitsstand. Hier wird entwickelt und getestet (`…/webflow-module@main/ld.js` auf der Musterseite).
- `stable` = das, was Kundenseiten laden. Erst nach dem Test wird `main` nach `stable` übernommen.
- jsDelivr hält Branch-Dateien bis zu 12 Stunden im Zwischenspeicher. Nach einem Update sofort leeren:
  `https://purge.jsdelivr.net/gh/Lions-Design-Webservice/webflow-module@stable/<datei>`
- Änderungen, die bestehende Seiten brechen würden, bekommen einen neuen Modulnamen (z. B. `faq2`) statt das alte Modul zu ändern.

## Regeln für neue Module

- Funktion nur über `data-*`-Attribute, nie über Klassennamen.
- Mehrfach geladen oder mehrfach auf der Seite → nur einmal initialisieren.
- Ohne JavaScript muss der Inhalt sichtbar und bedienbar bleiben.
