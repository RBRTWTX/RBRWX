export type BasemapId = 'standard' | 'dark' | 'satellite';
export type SceneDataState = 'queued' | 'loading' | 'ready' | 'updating' | 'degraded' | 'error';
export type ProductAvailability = 'available' | 'planned';

export interface CameraState {
  center: [number, number];
  zoom: number;
  bearing: number;
  pitch: number;
}

export interface MapContextState {
  cities: boolean;
  roads: boolean;
  boundaries: boolean;
}

export interface HeaderDefinition {
  title: string;
  subtitle: string;
  validLabel: string;
}

export interface LegendDefinition {
  kind: 'none' | 'reflectivity' | 'temperature' | 'dewpoint' | 'spc' | 'rainfall' | 'infrared' | 'custom';
  label?: string;
}

export interface ProductDefinition {
  id: string;
  name: string;
  group: string;
  providerFamily: string;
  availability: ProductAvailability;
  preloaderId: string;
  refreshIntervalMs: number | null;
  defaultBasemap: BasemapId;
  defaultCamera: CameraState;
  defaultContext: MapContextState;
  header: HeaderDefinition | null;
  legend: LegendDefinition;
}

export interface SceneInstance {
  id: string;
  definitionId: string;
  name: string;
  group: string;
  providerFamily: string;
  preloaderId: string;
  refreshIntervalMs: number | null;
  dataState: SceneDataState;
  dataMessage: string;
  addedAt: string;
  updatedAt: string;
  basemap: BasemapId;
  camera: CameraState;
  context: MapContextState;
  header: HeaderDefinition | null;
  legend: LegendDefinition;
}

export interface CoreViewState {
  basemap: BasemapId;
  camera: CameraState;
  context: MapContextState;
}

export interface WorkspaceState {
  scenes: SceneInstance[];
  selectedSceneId: string | null;
  showCollapsed: boolean;
  libraryOpen: boolean;
  hiddenMenuOpen: boolean;
  coreView: CoreViewState;
}

export type WorkspaceAction =
  | { type: 'scene/add'; definition: ProductDefinition }
  | { type: 'scene/select'; sceneId: string }
  | { type: 'scene/remove'; sceneId: string }
  | { type: 'scene/move'; sceneId: string; direction: -1 | 1 }
  | { type: 'scene/data'; sceneId: string; state: SceneDataState; message: string }
  | { type: 'scene/camera'; sceneId: string; camera: CameraState }
  | { type: 'scene/basemap'; sceneId: string; basemap: BasemapId }
  | { type: 'scene/context'; sceneId: string; key: keyof MapContextState; value: boolean }
  | { type: 'core/basemap'; basemap: BasemapId }
  | { type: 'core/context'; key: keyof MapContextState; value: boolean }
  | { type: 'map/reset-home' }
  | { type: 'ui/library'; open: boolean }
  | { type: 'ui/menu'; open: boolean }
  | { type: 'ui/show-collapsed'; value: boolean }
  | { type: 'workspace/reset' };
