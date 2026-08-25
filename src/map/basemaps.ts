import type { StyleSpecification } from 'maplibre-gl';
import type { BasemapId } from '../types/workspace';

const SATELLITE_STYLE: StyleSpecification = {
  version: 8,
  sources: {
    satellite: {
      type: 'raster',
      tiles: [
        'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      ],
      tileSize: 256,
      attribution: 'Esri',
    },
  },
  layers: [
    { id: 'satellite', type: 'raster', source: 'satellite' },
  ],
};

export function basemapStyle(id: BasemapId): string | StyleSpecification {
  switch (id) {
    case 'dark':
      return 'https://tiles.openfreemap.org/styles/dark';
    case 'satellite':
      return SATELLITE_STYLE;
    case 'standard':
    default:
      return 'https://tiles.openfreemap.org/styles/liberty';
  }
}
