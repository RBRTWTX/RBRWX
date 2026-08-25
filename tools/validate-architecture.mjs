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
  "selectedScene.overlayProfileId === 'none'",
  'publishOutput',
]) {
  if (!app.includes(token)) throw new Error(`Application composition missing: ${token}`);
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
  "profile.policy === 'suppressed'",
  'state.overrides[profileId]',
  'override.colorKeyId !== undefined',
  'colorKeyDefinition(effectiveKeyId)',
]) {
  if (!resolver.includes(token)) throw new Error(`Automatic overlay resolver contract missing: ${token}`);
}

const broadcastStage = await read('src/components/BroadcastStage.tsx');
if (
  !broadcastStage.includes('<BroadcastGraphicsOverlay')
  || !broadcastStage.includes("sceneOverlayProfileId !== 'none'")
  || broadcastStage.includes('BroadcastHeader')
) {
  throw new Error('Broadcast stage must use the shared Broadcast Graphics resolver with scene-first preview fallback.');
}

const graphicsEditor = await read('src/components/BroadcastGraphicsEditor.tsx');
for (const token of [
  'Auto — profile default',
  'COLOR_KEY_CATALOG.map',
  'Reset This Profile',
  'Shared Layout',
  'Preview this profile on map / Present / PNG',
]) {
  if (!graphicsEditor.includes(token)) throw new Error(`Independent Broadcast Graphics editor missing: ${token}`);
}

const outputSync = await read('src/output/output-sync.ts');
if (
  !outputSync.includes('graphics: BroadcastGraphicsState')
  || !outputSync.includes('previewOverlayProfileId: string | null')
  || !outputSync.includes('rbr-wx-output-payload-v2')
) {
  throw new Error('Present/output payload must carry the same Broadcast Graphics state and graphics preview.');
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

console.log('RBR WX architecture validation passed: 0.2.0 independent Broadcast Graphics registry/editor/color keys, automatic scene overlay resolution, shared operator/Present/PNG rendering, fresh Windows-session startup, Texas map foundation, one scene queue, one Show timeline, immediate preload requests, shared cache.');
