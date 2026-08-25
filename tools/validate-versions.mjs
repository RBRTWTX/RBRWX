import { readFile } from 'node:fs/promises';

const packageJson = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'));
const packageLock = JSON.parse(await readFile(new URL('../package-lock.json', import.meta.url), 'utf8'));
const cargo = await readFile(new URL('../src-tauri/Cargo.toml', import.meta.url), 'utf8');
const cargoLock = await readFile(new URL('../src-tauri/Cargo.lock', import.meta.url), 'utf8');
const tauriConfig = JSON.parse(await readFile(new URL('../src-tauri/tauri.conf.json', import.meta.url), 'utf8'));
const icon = await readFile(new URL('../src-tauri/icons/icon.ico', import.meta.url));

if (packageJson.name !== 'rbr-wx' || packageJson.version !== '0.2.0') {
  throw new Error('RBR WX package identity/version mismatch.');
}
if (packageLock.version !== '0.2.0' || packageLock.packages?.['']?.version !== '0.2.0') {
  throw new Error('RBR WX npm lockfile version mismatch.');
}
if (packageJson.dependencies['@tauri-apps/api'] !== '2.11.1') {
  throw new Error('RBR WX Tauri JS API version mismatch.');
}
if (!cargo.includes('version = "0.2.0"')) {
  throw new Error('RBR WX Rust package version mismatch.');
}
if (!cargoLock.includes('name = "rbr-wx"\nversion = "0.2.0"')) {
  throw new Error('RBR WX Cargo lockfile package version mismatch.');
}
if (!cargo.includes('tauri = { version = "=2.11.5"')) {
  throw new Error('RBR WX Rust Tauri version mismatch.');
}
if (tauriConfig.productName !== 'RBR WX' || tauriConfig.version !== '0.2.0') {
  throw new Error('RBR WX Tauri product identity/version mismatch.');
}
if (!Array.isArray(tauriConfig.bundle?.icon) || tauriConfig.bundle.icon.length !== 1 || tauriConfig.bundle.icon[0] !== 'icons/icon.ico') {
  throw new Error('RBR WX Windows development icon configuration mismatch.');
}
if (icon.length !== 37710 || icon[0] !== 0x00 || icon[1] !== 0x00 || icon[2] !== 0x01 || icon[3] !== 0x00) {
  throw new Error(`RBR WX Windows development icon is missing or invalid (${icon.length} bytes).`);
}
console.log('RBR WX version validation passed.');
