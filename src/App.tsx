import { useEffect, useMemo, useReducer, useRef } from 'react';
import { Window } from '@tauri-apps/api/window';
import { BroadcastStage } from './components/BroadcastStage';
import { BroadcastGraphicsEditor } from './components/BroadcastGraphicsEditor';
import { BroadcastAssetsWindow } from './components/BroadcastAssetsWindow';
import { HiddenMenu } from './components/HiddenMenu';
import { ProductLibraryDialog } from './components/ProductLibraryDialog';
import { ScenePane } from './components/ScenePane';
import { ShowPane } from './components/ShowPane';
import { TopBar } from './components/TopBar';
import { broadcastProfileIdForScene } from './graphics/resolve-overlay';
import { useScenePreloading } from './hooks/useScenePreloading';
import { exportStage } from './output/export-stage';
import { publishOutput } from './output/output-sync';
import { EMPTY_WORKSPACE, workspaceReducer } from './state/workspace-reducer';

export function App() {
  const [state, dispatch] = useReducer(workspaceReducer, undefined, () => structuredClone(EMPTY_WORKSPACE));
  const stageRef = useRef<HTMLDivElement | null>(null);

  const selectedScene = useMemo(
    () => state.scenes.find((scene) => scene.id === state.selectedSceneId) ?? null,
    [state.scenes, state.selectedSceneId],
  );

  useScenePreloading(state.scenes, dispatch);

  const activeBasemap = selectedScene?.basemap ?? state.coreView.basemap;
  const activeContext = selectedScene?.context ?? state.coreView.context;
  const activeGraphicsProfileId = broadcastProfileIdForScene(selectedScene?.overlayProfileId, state.graphics);

  useEffect(() => {
    publishOutput({
      scene: selectedScene ? structuredClone(selectedScene) : null,
      coreView: structuredClone(state.coreView),
      graphics: structuredClone(state.graphics),
      publishedAt: new Date().toISOString(),
    });
  }, [selectedScene, state.coreView, state.graphics]);

  async function present(): Promise<void> {
    publishOutput({
      scene: selectedScene ? structuredClone(selectedScene) : null,
      coreView: structuredClone(state.coreView),
      graphics: structuredClone(state.graphics),
      publishedAt: new Date().toISOString(),
    });
    try {
      const output = await Window.getByLabel('output');
      if (!output) throw new Error('Output window unavailable');
      await output.show();
      await output.setFocus();
    } catch {
      window.open(`${window.location.origin}${window.location.pathname}?window=output`, '_blank', 'popup,width=1280,height=720');
    }
  }

  async function exportPng(): Promise<void> {
    if (!stageRef.current) return;
    await exportStage(stageRef.current, selectedScene?.name ?? 'Clear Globe');
  }

  return (
    <main className={`app-shell ${state.showCollapsed ? 'show-collapsed' : ''}`}>
      <TopBar
        sceneName={selectedScene?.name ?? 'Core Globe'}
        onLibrary={() => dispatch({ type: 'ui/library', open: true })}
        onGraphics={() => dispatch({ type: 'ui/graphics', open: !state.graphicsOpen })}
        onPresent={() => void present()}
        onExport={() => void exportPng()}
        onMenu={() => dispatch({ type: 'ui/menu', open: !state.hiddenMenuOpen })}
      />

      <ScenePane
        scenes={state.scenes}
        selectedSceneId={state.selectedSceneId}
        onOpenLibrary={() => dispatch({ type: 'ui/library', open: true })}
        onSelect={(sceneId) => dispatch({ type: 'scene/select', sceneId })}
        onRemove={(sceneId) => dispatch({ type: 'scene/remove', sceneId })}
        onMove={(sceneId, direction) => dispatch({ type: 'scene/move', sceneId, direction })}
      />

      <section className="stage-wrap">
        <BroadcastStage
          ref={stageRef}
          scene={selectedScene}
          coreView={state.coreView}
          graphics={state.graphics}
          interactive
          onSceneCameraChange={(sceneId, camera) => dispatch({ type: 'scene/camera', sceneId, camera })}
          onGraphicsProfile={(profileId, patch) => dispatch({ type: 'graphics/profile', profileId, patch })}
          onGraphicsSettings={(patch) => dispatch({ type: 'graphics/settings', patch })}
        />
      </section>

      <ShowPane
        scenes={state.scenes}
        selectedSceneId={state.selectedSceneId}
        collapsed={state.showCollapsed}
        onToggleCollapsed={() => dispatch({ type: 'ui/show-collapsed', value: !state.showCollapsed })}
        onSelect={(sceneId) => dispatch({ type: 'scene/select', sceneId })}
      />

      <BroadcastGraphicsEditor
        open={state.graphicsOpen}
        graphics={state.graphics}
        activeProfileId={activeGraphicsProfileId}
        onClose={() => dispatch({ type: 'ui/graphics', open: false })}
        onSettings={(patch) => dispatch({ type: 'graphics/settings', patch })}
        onProfile={(profileId, patch) => dispatch({ type: 'graphics/profile', profileId, patch })}
        onResetAll={() => dispatch({ type: 'graphics/reset-all' })}
        onAssets={() => dispatch({ type: 'ui/assets', open: true })}
      />

      <BroadcastAssetsWindow
        open={state.assetsOpen}
        graphics={state.graphics}
        onClose={() => dispatch({ type: 'ui/assets', open: false })}
        onSettings={(patch) => dispatch({ type: 'graphics/settings', patch })}
      />

      <ProductLibraryDialog
        open={state.libraryOpen}
        onClose={() => dispatch({ type: 'ui/library', open: false })}
        onAdd={(definition) => dispatch({ type: 'scene/add', definition })}
      />

      <HiddenMenu
        open={state.hiddenMenuOpen}
        basemap={activeBasemap}
        context={activeContext}
        onClose={() => dispatch({ type: 'ui/menu', open: false })}
        onBasemap={(basemap) => selectedScene
          ? dispatch({ type: 'scene/basemap', sceneId: selectedScene.id, basemap })
          : dispatch({ type: 'core/basemap', basemap })}
        onContext={(key, value) => selectedScene
          ? dispatch({ type: 'scene/context', sceneId: selectedScene.id, key, value })
          : dispatch({ type: 'core/context', key, value })}
        onResetGlobe={() => dispatch({ type: 'map/reset-home' })}
        onResetWorkspace={() => dispatch({ type: 'workspace/reset' })}
      />
    </main>
  );
}
