# RBR WX Architecture

RBR WX is organized into five top-level systems.

1. **General Foundation** — Windows/Tauri application, shared state/events, provider/cache infrastructure, output/export services, and module registration.
2. **Map Engine** — the shared MapLibre map/globe, camera, basemaps, geographic context, common map layers, ordering, interaction, and readiness.
3. **Broadcast Graphics** — independent title bars, color keys, legends, valid/run-time labels, and future broadcast overlays.
4. **Broadcast Engine** — the single Scene queue and Show/timeline, selection, ordering, transitions, playback, scene activation, and Present control.
5. **Weather Data / Weather Products** — provider-backed weather modules that register products capable of being placed into the Scene queue.

## Broadcast Graphics contract

Weather products do not own title-bar or color-key objects. A product declares only an `overlayProfileId`.

The Broadcast Graphics resolver uses that profile ID to decide:

- whether the standard broadcast overlay is shown;
- the title/subtitle/valid-time presentation;
- the default reusable color key;
- the title-bar variant.

Text-forecast products use a suppressed overlay profile.

The operator stage, Present/output window, and PNG export all use the same Broadcast Graphics renderer. The Graphics editor can temporarily preview a selected profile over the neutral Core/Clear Globe without creating a weather scene; real weather scenes always take priority and resolve their own profile automatically. Profile overrides and shared graphics layout settings live in Broadcast Graphics state, separate from weather scene data.

Adding a new weather product should normally require registering its weather product/provider/renderer and assigning an existing overlay profile (or registering a new profile), without modifying the Broadcast Graphics renderer, Map Engine, or Broadcast Engine.
