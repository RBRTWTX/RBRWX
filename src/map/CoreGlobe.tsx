import { useEffect, useRef } from 'react';
import { Map as MapLibreMap } from 'maplibre-gl';
import type { BasemapId, CameraState, MapContextState } from '../types/workspace';
import { basemapStyle } from './basemaps';

interface CoreGlobeProps {
  basemap: BasemapId;
  camera: CameraState;
  context: MapContextState;
  interactive: boolean;
  onCameraChange?: (camera: CameraState) => void;
}

function classifyLayer(id: string): 'cities' | 'roads' | 'boundaries' | null {
  const value = id.toLowerCase();
  if (/place|city|town|village|settlement/.test(value)) return 'cities';
  if (/road|street|highway|motorway|transport/.test(value)) return 'roads';
  if (/boundary|admin/.test(value)) return 'boundaries';
  return null;
}

function applyContext(map: MapLibreMap, context: MapContextState): void {
  const style = map.getStyle();
  if (!style?.layers) return;

  for (const layer of style.layers) {
    const kind = classifyLayer(layer.id);
    if (!kind) continue;
    const visible = context[kind];
    try {
      map.setLayoutProperty(layer.id, 'visibility', visible ? 'visible' : 'none');
    } catch {
      // Style may be changing; next styledata pass reapplies context.
    }
  }
}

export function CoreGlobe({
  basemap,
  camera,
  context,
  interactive,
  onCameraChange,
}: CoreGlobeProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const basemapRef = useRef<BasemapId>(basemap);
  const contextRef = useRef(context);
  const onCameraChangeRef = useRef(onCameraChange);

  contextRef.current = context;
  onCameraChangeRef.current = onCameraChange;

  useEffect(() => {
    if (!containerRef.current) return undefined;

    const map = new MapLibreMap({
      container: containerRef.current,
      style: basemapStyle(basemap),
      center: camera.center,
      zoom: camera.zoom,
      bearing: camera.bearing,
      pitch: camera.pitch,
      interactive,
      attributionControl: interactive ? { compact: true } : false,
      canvasContextAttributes: {
        preserveDrawingBuffer: true,
      },
    });
    mapRef.current = map;
    basemapRef.current = basemap;

    map.on('style.load', () => {
      try {
        map.setProjection({ type: 'globe' });
      } catch {
        // Globe projection is best-effort for styles that support it.
      }
      applyContext(map, contextRef.current);
    });
    map.on('styledata', () => applyContext(map, contextRef.current));
    map.on('moveend', () => {
      if (!interactive) return;
      const center = map.getCenter();
      onCameraChangeRef.current?.({
        center: [center.lng, center.lat],
        zoom: map.getZoom(),
        bearing: map.getBearing(),
        pitch: map.getPitch(),
      });
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [interactive]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || basemapRef.current === basemap) return;
    basemapRef.current = basemap;
    map.setStyle(basemapStyle(basemap));
  }, [basemap]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    contextRef.current = context;
    applyContext(map, context);
  }, [context]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const center = map.getCenter();
    const changed = Math.abs(center.lng - camera.center[0]) > 0.0001
      || Math.abs(center.lat - camera.center[1]) > 0.0001
      || Math.abs(map.getZoom() - camera.zoom) > 0.001
      || Math.abs(map.getBearing() - camera.bearing) > 0.001
      || Math.abs(map.getPitch() - camera.pitch) > 0.001;
    if (!changed) return;
    map.easeTo({
      center: camera.center,
      zoom: camera.zoom,
      bearing: camera.bearing,
      pitch: camera.pitch,
      duration: interactive ? 450 : 0,
    });
  }, [camera, interactive]);

  return <div className="core-globe" ref={containerRef} aria-label="RBR WX shared map" />;
}
