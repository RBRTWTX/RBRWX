# RBR WX Architecture

RBR WX is organized into five top-level systems.

1. **General Foundation** — Windows/Tauri application, shared state/events, provider/cache infrastructure, output/export services, and module registration.
2. **Map Engine** — the shared MapLibre map/globe, camera, basemaps, geographic context, common map layers, ordering, interaction, and readiness.
3. **Broadcast Graphics** — independent title bars, color keys, legends, lower thirds, live tickers, valid/run-time labels, and future broadcast overlays.
4. **Broadcast Engine** — the single Scene queue and Show/timeline, selection, ordering, transitions, playback, scene activation, and Present control.
5. **Weather Data / Weather Products** — provider-backed weather modules that register products capable of being placed into the Scene queue.

## Broadcast Graphics contract

Broadcast Graphics is an independent module. Weather products do not own title-bar, color-key, lower-third, ticker, or other broadcast-graphic objects. A weather product declares only the scene/overlay metadata needed by Broadcast Graphics, including its `overlayProfileId`.

The Broadcast Graphics resolver uses that profile ID to decide:

- whether the standard broadcast overlay is shown;
- the title/subtitle/valid-time presentation;
- the default reusable color key;
- the title-bar variant.

Text-forecast products use a suppressed overlay profile.

A fresh application launch starts with the independent blank/default title bar. With Auto Scene Assignment enabled, the active scene can supply the registered title information and default color key. With Auto Scene Assignment disabled, manual title-bar content is preserved.

Text is edited directly on the broadcast graphic itself. The Graphics customization menu is not a text editor.

### Direct manipulation contract

Every Broadcast Graphic added to the Broadcast Graphics package must use the shared direct-manipulation frame contract:

- the graphic is draggable directly on the operator stage;
- the graphic is resizable/scalable directly from its on-graphic resize handle;
- position, width, and height are stored in Broadcast Graphics state;
- sizing and X/Y axis sliders do not belong in the Graphics customization menu;
- direct-manipulation handles are operator controls only and do not appear in Present/output or PNG export;
- the operator stage, Present/output window, and PNG export use the same stored Broadcast Graphics geometry and renderer.

The current direct-manipulation contract applies to the title bar, lower third, and live ticker and is the required interaction model for future Broadcast Graphics.

Adding a new weather product should normally require registering its weather product/provider/renderer and assigning an existing overlay profile (or registering a new profile), without modifying the Broadcast Graphics renderer, Map Engine, or Broadcast Engine.

### Broadcast Assets / icon-library contract

Broadcast Assets are packaged as a removable submodule of Broadcast Graphics. The existing Graphics panel remains the bar-customization panel; it opens a separate Assets toolbox instead of embedding a long icon list inside the Graphics panel.

The Assets toolbox follows the prior NEX GEN workflow: it is an independent operator-only floating window, and the later Hidden Menu entry must open this same toolbox rather than creating a second asset system.

The built-in weather artwork uses established open-source/public-domain sources documented in `docs/THIRD_PARTY_BROADCAST_ASSETS.md`. The previously accepted Alert / Warning / Watch / Advisory boxes are retained.

Every draggable Broadcast Graphic uses the shared direct-manipulation frame. Every such operator-stage frame also exposes an operator-only `×` remove control. The `×` removes the placed overlay instance (or hides the corresponding built-in bar) and never appears in Present/output or PNG export. Removing an uploaded-image instance does not delete that uploaded image from the Assets library.

Uploaded images and built-in assets are placed as independent instances with their own geometry, so the same library asset can be placed more than once without coupling the instances.
