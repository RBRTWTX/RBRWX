import type { ReactNode } from 'react';
import lightningIcon from '@iconify/icons-wi/lightning';
import thermometerIcon from '@iconify/icons-wi/thermometer';
import strongWindIcon from '@iconify/icons-wi/strong-wind';
import rainIcon from '@iconify/icons-wi/rain';
import hurricaneIcon from '@iconify/icons-wi/hurricane';
import thunderstormIcon from '@iconify/icons-wi/thunderstorm';
import snowIcon from '@iconify/icons-wi/snow';
import daySunnyIcon from '@iconify/icons-wi/day-sunny';
import snowflakeColdIcon from '@iconify/icons-wi/snowflake-cold';
import radarIcon from '@iconify/icons-mdi/radar';
import satelliteIcon from '@iconify/icons-mdi/satellite-variant';
import locationIcon from '@iconify/icons-mdi/map-marker';
import type { BroadcastAssetArtworkKey } from '../graphics/broadcast-asset-catalog';

interface PackedIcon {
  body: string;
  width?: number;
  height?: number;
}

interface BroadcastAssetArtworkProps {
  artworkKey?: BroadcastAssetArtworkKey;
  customDataUrl?: string;
  label: string;
  className?: string;
}

function PackedSvg({ icon, className = '' }: { icon: PackedIcon; className?: string }) {
  const width = icon.width ?? 16;
  const height = icon.height ?? 16;
  return (
    <svg
      className={`broadcast-open-source-icon ${className}`.trim()}
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-hidden="true"
      focusable="false"
      dangerouslySetInnerHTML={{ __html: icon.body }}
    />
  );
}

function AlertBox({ text, color }: { text: string; color: string }) {
  return (
    <svg className="broadcast-alert-box-art" viewBox="0 0 100 100" role="img" aria-hidden="true">
      <rect x="7" y="17" width="86" height="66" rx="8" fill="#101820" stroke={color} strokeWidth="7" />
      <rect x="13" y="23" width="74" height="54" rx="4" fill={color} opacity=".16" />
      <text
        x="50"
        y="56"
        textAnchor="middle"
        dominantBaseline="middle"
        fill="#fff"
        fontFamily="Bahnschrift Condensed, Arial Narrow, Arial, sans-serif"
        fontWeight="900"
        fontSize={text.length > 7 ? 16 : 20}
        letterSpacing=".8"
      >{text}</text>
    </svg>
  );
}

function FrontSymbol({ kind }: { kind: 'cold' | 'warm' | 'stationary' | 'occluded' }) {
  const blue = '#1769c2';
  const red = '#d92f37';
  const purple = '#7e3f98';
  const y = 38;
  const triangles = [30, 60, 90];
  const circles = [22, 52, 82, 112];

  if (kind === 'cold') {
    return (
      <svg className="broadcast-front-symbol" viewBox="0 0 130 70" role="img" aria-hidden="true">
        <path d={`M8 ${y} H122`} stroke={blue} strokeWidth="6" fill="none" />
        {triangles.map((x) => <path key={x} d={`M${x - 9} ${y} L${x} 18 L${x + 9} ${y} Z`} fill={blue} />)}
      </svg>
    );
  }
  if (kind === 'warm') {
    return (
      <svg className="broadcast-front-symbol" viewBox="0 0 130 70" role="img" aria-hidden="true">
        <path d={`M8 ${y} H122`} stroke={red} strokeWidth="6" fill="none" />
        {circles.slice(0, 3).map((x) => <path key={x} d={`M${x - 9} ${y} A9 9 0 0 1 ${x + 9} ${y}`} stroke={red} strokeWidth="6" fill="none" />)}
      </svg>
    );
  }
  if (kind === 'stationary') {
    return (
      <svg className="broadcast-front-symbol" viewBox="0 0 130 70" role="img" aria-hidden="true">
        <path d={`M8 ${y} H122`} stroke="#d7dce2" strokeWidth="3" fill="none" opacity=".55" />
        {[28, 72, 116].map((x) => <path key={`t-${x}`} d={`M${x - 8} ${y} L${x} 18 L${x + 8} ${y} Z`} fill={blue} />)}
        {[50, 94].map((x) => <path key={`c-${x}`} d={`M${x - 9} ${y} A9 9 0 0 0 ${x + 9} ${y}`} stroke={red} strokeWidth="6" fill="none" />)}
      </svg>
    );
  }
  return (
    <svg className="broadcast-front-symbol" viewBox="0 0 130 70" role="img" aria-hidden="true">
      <path d={`M8 ${y} H122`} stroke={purple} strokeWidth="6" fill="none" />
      {[28, 72, 116].map((x) => <path key={`t-${x}`} d={`M${x - 8} ${y} L${x} 18 L${x + 8} ${y} Z`} fill={purple} />)}
      {[50, 94].map((x) => <path key={`c-${x}`} d={`M${x - 9} ${y} A9 9 0 0 1 ${x + 9} ${y}`} stroke={purple} strokeWidth="6" fill="none" />)}
    </svg>
  );
}

export function BroadcastAssetArtwork({ artworkKey, customDataUrl, label, className = '' }: BroadcastAssetArtworkProps) {
  if (customDataUrl) {
    return (
      <span className={`broadcast-asset-artwork ${className}`.trim()} aria-label={label}>
        <img src={customDataUrl} alt="" draggable={false} />
      </span>
    );
  }

  let art: ReactNode = null;
  switch (artworkKey) {
    case 'alert': art = <AlertBox text="ALERT" color="#d62b70" />; break;
    case 'warning': art = <AlertBox text="WARNING" color="#e33a2f" />; break;
    case 'watch': art = <AlertBox text="WATCH" color="#f1b82d" />; break;
    case 'advisory': art = <AlertBox text="ADVISORY" color="#4aa3df" />; break;
    case 'radar': art = <PackedSvg icon={radarIcon} />; break;
    case 'satellite': art = <PackedSvg icon={satelliteIcon} />; break;
    case 'lightning': art = <PackedSvg icon={lightningIcon} />; break;
    case 'temperature': art = <PackedSvg icon={thermometerIcon} />; break;
    case 'wind': art = <PackedSvg icon={strongWindIcon} />; break;
    case 'rain': art = <PackedSvg icon={rainIcon} />; break;
    case 'hurricane': art = <PackedSvg icon={hurricaneIcon} />; break;
    case 'location': art = <PackedSvg icon={locationIcon} />; break;
    case 'cold-front': art = <FrontSymbol kind="cold" />; break;
    case 'warm-front': art = <FrontSymbol kind="warm" />; break;
    case 'stationary-front': art = <FrontSymbol kind="stationary" />; break;
    case 'occluded-front': art = <FrontSymbol kind="occluded" />; break;
    case 'thunderstorm': art = <PackedSvg icon={thunderstormIcon} />; break;
    case 'winter': art = <PackedSvg icon={snowIcon} />; break;
    case 'heat': art = <PackedSvg icon={daySunnyIcon} />; break;
    case 'freeze': art = <PackedSvg icon={snowflakeColdIcon} />; break;
    default: art = null;
  }

  return <span className={`broadcast-asset-artwork ${className}`.trim()} aria-label={label}>{art}</span>;
}
