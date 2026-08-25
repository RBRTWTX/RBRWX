import type {
  ProductDefinition,
  SceneInstance,
  WorkspaceAction,
  WorkspaceState,
} from '../types/workspace';
import { texasHomeCamera } from '../map/home-camera';

export const EMPTY_WORKSPACE: WorkspaceState = {
  scenes: [],
  selectedSceneId: null,
  showCollapsed: false,
  libraryOpen: false,
  hiddenMenuOpen: false,
  coreView: {
    basemap: 'standard',
    camera: texasHomeCamera(),
    context: { cities: true, roads: true, boundaries: true },
  },
};

function sceneFromDefinition(definition: ProductDefinition): SceneInstance {
  const now = new Date().toISOString();
  return {
    id: `${definition.id}-${crypto.randomUUID()}`,
    definitionId: definition.id,
    name: definition.name,
    group: definition.group,
    providerFamily: definition.providerFamily,
    preloaderId: definition.preloaderId,
    refreshIntervalMs: definition.refreshIntervalMs,
    dataState: 'queued',
    dataMessage: 'Queued for preload',
    addedAt: now,
    updatedAt: now,
    basemap: definition.defaultBasemap,
    camera: structuredClone(definition.defaultCamera),
    context: structuredClone(definition.defaultContext),
    header: definition.header ? structuredClone(definition.header) : null,
    legend: structuredClone(definition.legend),
  };
}

export function workspaceReducer(state: WorkspaceState, action: WorkspaceAction): WorkspaceState {
  switch (action.type) {
    case 'scene/add': {
      if (action.definition.availability !== 'available') return state;
      const scene = sceneFromDefinition(action.definition);
      return {
        ...state,
        scenes: [...state.scenes, scene],
        selectedSceneId: scene.id,
        libraryOpen: false,
      };
    }
    case 'scene/select':
      return state.scenes.some((scene) => scene.id === action.sceneId)
        ? { ...state, selectedSceneId: action.sceneId }
        : state;
    case 'scene/remove': {
      const index = state.scenes.findIndex((scene) => scene.id === action.sceneId);
      if (index < 0) return state;
      const scenes = state.scenes.filter((scene) => scene.id !== action.sceneId);
      const selectedSceneId = state.selectedSceneId === action.sceneId
        ? (scenes[Math.min(index, Math.max(0, scenes.length - 1))]?.id ?? null)
        : state.selectedSceneId;
      return { ...state, scenes, selectedSceneId };
    }
    case 'scene/move': {
      const index = state.scenes.findIndex((scene) => scene.id === action.sceneId);
      const next = index + action.direction;
      if (index < 0 || next < 0 || next >= state.scenes.length) return state;
      const scenes = [...state.scenes];
      [scenes[index], scenes[next]] = [scenes[next], scenes[index]];
      return { ...state, scenes };
    }
    case 'scene/data':
      return {
        ...state,
        scenes: state.scenes.map((scene) => scene.id === action.sceneId ? {
          ...scene,
          dataState: action.state,
          dataMessage: action.message,
          updatedAt: new Date().toISOString(),
        } : scene),
      };
    case 'scene/camera':
      return {
        ...state,
        scenes: state.scenes.map((scene) => scene.id === action.sceneId ? { ...scene, camera: action.camera } : scene),
      };
    case 'scene/basemap':
      return {
        ...state,
        scenes: state.scenes.map((scene) => scene.id === action.sceneId ? { ...scene, basemap: action.basemap } : scene),
      };
    case 'scene/context':
      return {
        ...state,
        scenes: state.scenes.map((scene) => scene.id === action.sceneId ? {
          ...scene,
          context: { ...scene.context, [action.key]: action.value },
        } : scene),
      };
    case 'core/basemap':
      return { ...state, coreView: { ...state.coreView, basemap: action.basemap } };
    case 'core/context':
      return {
        ...state,
        coreView: { ...state.coreView, context: { ...state.coreView.context, [action.key]: action.value } },
      };
    case 'map/reset-home':
      if (state.selectedSceneId) {
        return {
          ...state,
          scenes: state.scenes.map((scene) => scene.id === state.selectedSceneId
            ? { ...scene, camera: texasHomeCamera() }
            : scene),
        };
      }
      return {
        ...state,
        coreView: { ...state.coreView, camera: texasHomeCamera() },
      };
    case 'ui/library':
      return { ...state, libraryOpen: action.open };
    case 'ui/menu':
      return { ...state, hiddenMenuOpen: action.open };
    case 'ui/show-collapsed':
      return { ...state, showCollapsed: action.value };
    case 'workspace/reset':
      return structuredClone(EMPTY_WORKSPACE);
    default:
      return state;
  }
}
