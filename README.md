# Lions-Design Webflow-Module

Wiederverwendbare Funktionen für Webflow-Seiten. Jede Seite lädt nur die Module, die sie wirklich benutzt.

## Einbindung (einmal pro Website, Footer-Code)

```html
<script src="https://cdn.jsdelivr.net/gh/Lions-Design-Webservice/webflow-module@1/ld.js" defer></script>
```

Der Lader sucht nach `data-ld="…"` und lädt `modules/<name>.js`.

## Module

| Modul | Aktivierung | Anleitung |
|---|---|---|
| faq | `data-ld="faq"` | Musterseite → /module#faq |

## Versionen

- Kundenseiten binden `@1` ein → bekommen alle kompatiblen 1.x-Updates.
- Änderungen, die bestehende Seiten brechen würden → neue Hauptversion (`v2.0.0`).
- Nach jedem Release: Git-Tag setzen (`v1.0.1` …) und jsDelivr-Cache leeren:
  `https://purge.jsdelivr.net/gh/Lions-Design-Webservice/webflow-module@1/<datei>`

## Regeln für neue Module

- Funktion nur über `data-*`-Attribute, nie über Klassennamen.
- Mehrfach geladen oder mehrfach auf der Seite → nur einmal initialisieren.
- Ohne JavaScript muss der Inhalt sichtbar und bedienbar bleiben.
