import { toPng } from 'html-to-image';

function safeName(value: string): string {
  return value.trim().replace(/[^a-zA-Z0-9 _-]+/g, '').replace(/\s+/g, '_').slice(0, 80) || 'RBR_WX';
}

export async function exportStage(stage: HTMLElement, sceneName: string): Promise<void> {
  await document.fonts?.ready;
  const dataUrl = await toPng(stage, {
    cacheBust: true,
    pixelRatio: 1,
    backgroundColor: '#0b1017',
  });
  const anchor = document.createElement('a');
  anchor.href = dataUrl;
  anchor.download = `${safeName(sceneName)}_${new Date().toISOString().replace(/[:.]/g, '-')}.png`;
  anchor.click();
}
