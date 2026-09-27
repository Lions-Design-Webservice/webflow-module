# Lions-Design Webflow-Module

Wiederverwendbare Funktionen für Webflow-Seiten. Jede Seite lädt nur die Module, die sie wirklich benutzt.

## Einbindung (einmal pro Website, Footer-Code)

```html
<script src="https://cdn.jsdelivr.net/gh/Lions-Design-Webservice/webflow-module@stable/ld.js" defer></script>
```

Der Lader sucht nach `data-ld="…"` und lädt `modules/<name>.js`.

## Module

| Modul | Aktivierung | Anleitung |
|---|---|---|
| faq | `data-ld="faq"` | Musterseite → /module#faq |

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
