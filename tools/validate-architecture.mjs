import { access, readFile } from 'node:fs/promises';

const root = new URL('../', import.meta.url);
const read = (relative) => readFile(new URL(relative, root), 'utf8');

for (const file of [
  'src/App.tsx',
  'src/catalog/product-library.ts',
  'src/state/workspace-reducer.ts',
  'src/data/preload-registry.ts',
  'src/data/shared-data-cache.ts',
  'src/components/ScenePane.tsx',
  'src/components/ShowPane.tsx',
  'src/components/ProductLibraryDialog.tsx',
  'src/components/BroadcastGraphicsEditor.tsx',
  'src/components/BroadcastGraphicsOverlay.tsx',
  'src/components/BroadcastEditableText.tsx',
  'src/components/BroadcastStage.tsx',
  'src/graphics/types.ts',
  'src/graphics/color-key-catalog.ts',
  'src/graphics/overlay-profiles.ts',
  'src/graphics/resolve-overlay.ts',
  'src/map/CoreGlobe.tsx',
  'src/map/home-camera.ts',
  'src/output/OutputApp.tsx',
]) {
  await access(new URL(file, root));
}

const reducer = await read('src/state/workspace-reducer.ts');
for (const token of [
  'scenes: []',
  "case 'scene/add'",
  'scenes: [...state.scenes, scene]',
  'selectedSceneId: scene.id',
  "case 'scene/move'",
  "case 'scene/remove'",
  "case 'graphics/settings'",
  "case 'graphics/profile'",
  "case 'graphics/reset-all'",
]) {
  if (!reducer.includes(token)) throw new Error(`Workspace contract missing: ${token}`);
}

const app = await read('src/App.tsx');
for (const token of [
  '<ScenePane',
  '<ShowPane',
  '<ProductLibraryDialog',
  'useScenePreloading(state.scenes, dispatch)',
  '<BroadcastStage',
  '<BroadcastGraphicsEditor',
  'graphics={state.graphics}',
  'broadcastProfileIdForScene',
  'onGraphicsProfile=',
  'onGraphicsSettings=',
  'publishOutput',
]) {
  if (!app.includes(token)) throw new Error(`Application composition missing: ${token}`);
}
if (app.includes('previewOverlayProfileId') || app.includes('previewOnStage')) {
  throw new Error('Rejected profile-preview workflow must not remain in the rebuilt Broadcast Graphics system.');
}

const showPane = await read('src/components/ShowPane.tsx');
if (!showPane.includes('scenes.map')) {
  throw new Error('Show timeline must derive from the same single scene array as the left pane.');
}

const library = await read('src/catalog/product-library.ts');
if (!library.includes("availability: 'planned'") || !library.includes("availability: 'available'")) {
  throw new Error('Product library must distinguish operational definitions from port-pending definitions.');
}
if (!library.includes("id: 'clear-globe'")) {
  throw new Error('Clear Globe core scene definition missing.');
}
if (!library.includes("overlayProfileId: 'none'") || !library.includes("'text-forecast'")) {
  throw new Error('Product definitions must declare overlay profiles, including suppressed Text Forecast.');
}
if (library.includes('header:') || library.includes('legend:')) {
  throw new Error('Weather product definitions must not own broadcast title-bar or color-key graphics.');
}

const preloadHook = await read('src/hooks/useScenePreloading.ts');
for (const token of [
  "scene.dataState !== 'queued'",
  "state: 'loading'",
  'preloadScene(scene)',
  "state: 'error'",
]) {
  if (!preloadHook.includes(token)) throw new Error(`Immediate scene preload contract missing: ${token}`);
}

const preloadRegistry = await read('src/data/preload-registry.ts');
if (!preloadRegistry.includes('sharedDataCache.getOrLoad')) {
  throw new Error('Scene preloaders must route through the shared provider cache.');
}

const workspaceTypes = await read('src/types/workspace.ts');
for (const token of [
  'overlayProfileId: string',
  'graphics: BroadcastGraphicsState',
  "'graphics/profile'",
  "'graphics/reset-all'",
  "Partial<Omit<BroadcastGraphicsState, 'overrides'>>",
]) {
  if (!workspaceTypes.includes(token)) throw new Error(`Broadcast graphics workspace contract missing: ${token}`);
}
for (const forbidden of ['HeaderDefinition', 'LegendDefinition', 'header:', 'legend:']) {
  if (workspaceTypes.includes(forbidden)) {
    throw new Error(`Scene instances must not own broadcast graphics: ${forbidden}`);
  }
}

const overlayProfiles = await read('src/graphics/overlay-profiles.ts');
for (const token of [
  "standard('manual-default', 'Blank / Manual Title Bar', '', '', '', null)",
  "suppressed('text-forecast'",
  "standard('radar-ewx'",
  "standard('observations-temperature'",
  "standard('model-hrrr-temperature'",
]) {
  if (!overlayProfiles.includes(token)) throw new Error(`Overlay profile registry missing: ${token}`);
}

const colorKeys = await read('src/graphics/color-key-catalog.ts');
for (const key of [
  'reflectivity',
  'temperature',
  'dewpoint',
  'humidity',
  'rainfall',
  'spc-categorical',
  'infrared',
  'aqi',
  'smoke',
  'probability',
  'storm-surge',
  'cpc-temperature',
  'cpc-precipitation',
  'tropical-formation',
  'alerts',
]) {
  if (!colorKeys.includes(`id: '${key}'`)) throw new Error(`Broadcast color-key catalog missing: ${key}`);
}

const resolver = await read('src/graphics/resolve-overlay.ts');
for (const token of [
  "MANUAL_OVERLAY_PROFILE_ID = 'manual-default'",
  'titleBarVisible: true',
  'autoAssignment: true',
  "gradientStart: '#032568'",
  "gradientMiddle: '#531e78'",
  "gradientEnd: '#cb1678'",
  'lowerThirdVisible: false',
  'tickerVisible: false',
  "lowerThirdText: ''",
  "tickerText: ''",
  "'title-bar': { x: 1, y: 2.5, width: 98, height: 108 }",
  "'lower-third': { x: 4, y: 78, width: 92, height: 64 }",
  "'live-ticker': { x: 4, y: 87, width: 92, height: 38 }",
  "sceneOverlayProfileId === 'text-forecast'",
  'state.autoAssignment',
  'state.overrides[profileId]',
  'override.colorKeyId !== undefined',
  'colorKeyDefinition(effectiveKeyId)',
]) {
  if (!resolver.includes(token)) throw new Error(`Broadcast Graphics resolver/default contract missing: ${token}`);
}

const editableText = await read('src/components/BroadcastEditableText.tsx');
for (const token of [
  'contentEditable: interactive',
  'onBlur: commit',
  "event.key === 'Enter'",
  "event.key === 'Escape'",
]) {
  if (!editableText.includes(token)) throw new Error(`Direct-on-graphic text editing contract missing: ${token}`);
}

const frame = await read('src/components/BroadcastGraphicFrame.tsx');
for (const token of [
  'BroadcastGraphicGeometry',
  'beginDrag',
  'beginResize',
  'broadcast-graphic-resize-handle',
  'onGeometry(graphicId',
  'data-broadcast-graphic-id',
]) {
  if (!frame.includes(token)) throw new Error(`Direct-manipulation Broadcast Graphic frame missing: ${token}`);
}

const overlay = await read('src/components/BroadcastGraphicsOverlay.tsx');
for (const token of [
  '<BroadcastEditableText',
  '<BroadcastGraphicFrame',
  'graphicId="title-bar"',
  'graphicId="lower-third"',
  'graphicId="live-ticker"',
  'broadcast-title-text',
  'broadcast-valid-label',
  'broadcast-subtitle-text',
  'broadcast-title-color-key',
  'broadcast-lower-third-text',
  'broadcast-ticker-text',
  'changeGeometry',
]) {
  if (!overlay.includes(token)) throw new Error(`Broadcast Graphics renderer missing: ${token}`);
}

const broadcastStage = await read('src/components/BroadcastStage.tsx');
for (const token of [
  'broadcastProfileIdForScene',
  '<BroadcastGraphicsOverlay',
  'interactive={interactive}',
  'onProfile={onGraphicsProfile}',
  'onSettings={onGraphicsSettings}',
]) {
  if (!broadcastStage.includes(token)) throw new Error(`Shared Broadcast Graphics stage contract missing: ${token}`);
}
if (broadcastStage.includes('BroadcastHeader') || broadcastStage.includes('previewOverlayProfileId')) {
  throw new Error('Broadcast stage must use only the rebuilt independent Broadcast Graphics renderer.');
}

const graphicsEditor = await read('src/components/BroadcastGraphicsEditor.tsx');
for (const token of [
  'Bar Customization',
  'Move and resize graphics directly on the broadcast stage. Click text to edit it.',
  'Auto assign title / key from scene',
  'Auto — scene default',
  'COLOR_KEY_CATALOG.map',
  'Show lower third',
  'Show live ticker',
  'type="color"',
]) {
  if (!graphicsEditor.includes(token)) throw new Error(`Broadcast Graphics customization menu missing: ${token}`);
}
for (const forbidden of [
  'override.title ??',
  'override.subtitle ??',
  'override.validLabel ??',
  'Edit / preview profile',
  'graphics-editor-preview',
  'Preview this profile',
  'Top position',
  'Side inset',
  'Bar height',
  'X position',
  'Y position',
  'Width <output>',
  'Lower-third height',
  'Ticker height',
]) {
  if (graphicsEditor.includes(forbidden)) {
    throw new Error(`Text/preview editing must not live in the Broadcast Graphics customization menu: ${forbidden}`);
  }
}


if (graphicsEditor.includes('Ticker speed') || graphicsEditor.includes('tickerSpeed')) {
  throw new Error('Ticker speed control was not requested and must not be added to the customization menu.');
}

const styles = await read('src/styles.css');
for (const token of [
  '"Bahnschrift Condensed"',
  'repeating-linear-gradient(135deg',
  'linear-gradient(90deg, var(--rbr-gradient-start), var(--rbr-gradient-middle), var(--rbr-gradient-end))',
  '.broadcast-title-cap',
  '.broadcast-title-color-key',
  '.broadcast-graphic-frame',
  '.broadcast-graphic-resize-handle',
  'cursor: nwse-resize',
  '.broadcast-lower-third-main',
  '.broadcast-ticker-row::after',
  '@keyframes rbr-ticker-scroll',
  'animation: rbr-ticker-scroll 18s linear infinite',
  '.broadcast-lower-third-transition',
  '@keyframes rbr-lower-third-in',
]) {
  if (!styles.includes(token)) throw new Error(`Broadcast television graphics style contract missing: ${token}`);
}

const outputSync = await read('src/output/output-sync.ts');
if (
  !outputSync.includes('graphics: BroadcastGraphicsState')
  || !outputSync.includes('rbr-wx-output-payload-v3')
  || outputSync.includes('previewOverlayProfileId')
) {
  throw new Error('Present/output payload must carry the rebuilt Broadcast Graphics state without rejected preview state.');
}

const map = await read('src/map/CoreGlobe.tsx');
for (const token of [
  'new MapLibreMap',
  "map.setProjection({ type: 'globe' })",
  'canvasContextAttributes',
  'preserveDrawingBuffer: true',
  'applyContext',
]) {
  if (!map.includes(token)) throw new Error(`Core globe contract missing: ${token}`);
}

const homeCamera = await read('src/map/home-camera.ts');
for (const token of [
  'TEXAS_HOME_CAMERA',
  'center: [-99.35, 31.15]',
  'zoom: 5.0',
  'texasHomeCamera',
]) {
  if (!homeCamera.includes(token)) throw new Error(`Texas home camera contract missing: ${token}`);
}

if (!reducer.includes("case 'map/reset-home'") || !reducer.includes('camera: texasHomeCamera()')) {
  throw new Error('Reset Globe must restore the authoritative Texas home camera.');
}

const hiddenMenu = await read('src/components/HiddenMenu.tsx');
if (!hiddenMenu.includes('Reset Globe to Texas') || !hiddenMenu.includes('onResetGlobe')) {
  throw new Error('Hidden Menu Texas Reset Globe control missing.');
}

const appSource = await read('src/App.tsx');
for (const forbidden of [
  'rbr-wx-workspace-v1',
  'localStorage.getItem(STORAGE_KEY)',
  'localStorage.setItem(STORAGE_KEY',
]) {
  if (appSource.includes(forbidden)) {
    throw new Error(`Active operator workspace must not persist across application launches: ${forbidden}`);
  }
}
if (!appSource.includes('() => structuredClone(EMPTY_WORKSPACE)')) {
  throw new Error('Application must create a fresh EMPTY_WORKSPACE on every launch.');
}
for (const token of [
  "scenes: []",
  "selectedSceneId: null",
  "basemap: 'standard'",
  "camera: texasHomeCamera()",
  "context: { cities: true, roads: true, boundaries: true }",
]) {
  if (!reducer.includes(token)) throw new Error(`Fresh-launch workspace contract missing: ${token}`);
}

console.log('RBR WX architecture validation passed: independent Broadcast Graphics module with NEX GEN-style broadcast television geometry, RBR WX gradient accents, direct-on-graphic text editing, direct drag/resize manipulation for every broadcast graphic, scene auto-assignment, automatic/manual color keys, lower third/live ticker, shared operator/Present/PNG rendering, fresh Texas startup, one scene queue, one Show timeline.');
