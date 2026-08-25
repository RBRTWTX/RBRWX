import React from 'react';
import ReactDOM from 'react-dom/client';
import 'maplibre-gl/dist/maplibre-gl.css';
import './styles.css';
import { App } from './App';
import { OutputApp } from './output/OutputApp';

const outputWindow = new URLSearchParams(window.location.search).get('window') === 'output';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {outputWindow ? <OutputApp /> : <App />}
  </React.StrictMode>,
);
