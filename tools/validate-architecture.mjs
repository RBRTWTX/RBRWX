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

console.log('RBR WX architecture validation passed: fresh Windows-session startup, Texas startup/reset, empty startup workspace, one left scene pane, one mirrored show timeline, library-driven scene creation, immediate preload requests, shared cache, shared globe, export/output hooks.');
