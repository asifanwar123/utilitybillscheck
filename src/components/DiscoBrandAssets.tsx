import React from 'react';
import { DiscoCompany } from '../data/discoBillsData';

export const BijliPkLogo: React.FC<{ variant?: 'dark' | 'light' }> = ({ variant = 'dark' }) => {
  const isLight = variant === 'light';
  return (
    <div className="inline-flex items-center gap-2.5 select-none">
      <div className="relative w-8 h-8 flex items-center justify-center shrink-0">
        <svg viewBox="0 0 36 36" className="w-8 h-8">
          <circle
            cx="18"
            cy="18"
            r="16"
            fill="none"
            stroke={isLight ? '#7DF0B2' : '#066B33'}
            strokeWidth="2.5"
            strokeDasharray="78 18"
          />
          <circle
            cx="18"
            cy="18"
            r="11.5"
            fill="none"
            stroke={isLight ? '#FFFFFF' : '#19C26B'}
            strokeWidth="2"
            strokeDasharray="50 14"
          />
          <path
            d="M19.5 9.5L13 19h5l-1.5 7.5L23 17h-5l1.5-7.5z"
            fill={isLight ? '#4DFFA0' : '#066B33'}
          />
        </svg>
      </div>
      <div className="flex flex-col leading-none">
        <span
          className="font-display font-bold tracking-tight text-[15px]"
          style={{ color: isLight ? '#FFFFFF' : '#0C1F14' }}
        >
          BIJLIPK
        </span>
        <span
          className="text-[7px] font-semibold tracking-wider uppercase mt-0.5"
          style={{ color: isLight ? '#A9C7B5' : '#4B6155' }}
        >
          PAKISTAN BILL CHECKER
        </span>
      </div>
    </div>
  );
};

export const DiscoLogoBadge: React.FC<{
  code: DiscoCompany['code'];
  size?: 'sm' | 'md' | 'lg';
}> = ({ code, size = 'md' }) => {
  const dims = size === 'sm' ? 'w-7 h-7' : size === 'lg' ? 'w-11 h-11' : 'w-9 h-9';

  const config: Record<
    DiscoCompany['code'],
    { ring: string; bg: string; inner: string; label: string }
  > = {
    LESCO: { ring: '#1d4ed8', bg: '#eff6ff', inner: '#2563eb', label: 'LESCO' },
    MEPCO: { ring: '#ea580c', bg: '#fff7ed', inner: '#0284c7', label: 'MEPCO' },
    FESCO: { ring: '#1e3a8a', bg: '#f0f9ff', inner: '#dc2626', label: 'FESCO' },
    IESCO: { ring: '#0284c7', bg: '#f0f9ff', inner: '#16a34a', label: 'IESCO' },
    GEPCO: { ring: '#4338ca', bg: '#eef2ff', inner: '#0891b2', label: 'GEPCO' },
    PESCO: { ring: '#15803d', bg: '#f0fdf4', inner: '#166534', label: 'PESCO' },
    HESCO: { ring: '#dc2626', bg: '#fef2f2', inner: '#ea580c', label: 'HESCO' },
    SEPCO: { ring: '#334155', bg: '#f8fafc', inner: '#0f172a', label: 'SEPCO' },
    QESCO: { ring: '#b45309', bg: '#fffbeb', inner: '#15803d', label: 'QESCO' },
    TESCO: { ring: '#0f766e', bg: '#f0fdfa', inner: '#b91c1c', label: 'TESCO' }
  };

  const c = config[code] || config.MEPCO;

  return (
    <div
      className={`${dims} rounded-full bg-white flex items-center justify-center shrink-0 shadow-xs overflow-hidden`}
      style={{ border: `2px solid ${c.ring}`, backgroundColor: c.bg }}
      aria-hidden="true"
    >
      <svg viewBox="0 0 40 40" className="w-full h-full">
        <circle cx="20" cy="20" r="17" fill={c.bg} stroke={c.ring} strokeWidth="2" />
        <circle
          cx="20"
          cy="20"
          r="13"
          fill="none"
          stroke={c.inner}
          strokeWidth="1.5"
          strokeDasharray="4 2"
        />
        {/* Stylized power tower / lightning / water wave emblem */}
        <path
          d="M21 9L14 20h5.5L18 30l8.5-12H21L21 9z"
          fill={c.ring}
          opacity="0.88"
        />
        <rect x="6" y="25" width="28" height="7" rx="2" fill={c.inner} />
        <text
          x="20"
          y="30.5"
          textAnchor="middle"
          fill="#ffffff"
          fontSize="6.2"
          fontWeight="700"
          fontFamily="Space Grotesk, sans-serif"
        >
          {c.label}
        </text>
      </svg>
    </div>
  );
};

export const RaastQrCode: React.FC<{
  seedText: string;
  size?: number;
  id?: string;
}> = ({ seedText, size = 148, id }) => {
  const gridCount = 25;
  const cells: boolean[][] = [];

  // Deterministic pseudo-random matrix from seedText
  let hash = 2166136261;
  for (let i = 0; i < seedText.length; i++) {
    hash ^= seedText.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }

  const isFinderPattern = (r: number, c: number) => {
    const inTopLeft = r < 7 && c < 7;
    const inTopRight = r < 7 && c >= gridCount - 7;
    const inBottomLeft = r >= gridCount - 7 && c < 7;
    return inTopLeft || inTopRight || inBottomLeft;
  };

  const getFinderFill = (r: number, c: number) => {
    const lr = r >= gridCount - 7 ? r - (gridCount - 7) : r;
    const lc = c >= gridCount - 7 ? c - (gridCount - 7) : c;
    if (lr === 0 || lr === 6 || lc === 0 || lc === 6) return true;
    if (lr >= 2 && lr <= 4 && lc >= 2 && lc <= 4) return true;
    return false;
  };

  for (let r = 0; r < gridCount; r++) {
    const row: boolean[] = [];
    for (let c = 0; c < gridCount; c++) {
      if (isFinderPattern(r, c)) {
        row.push(getFinderFill(r, c));
      } else if (r === 6 || c === 6) {
        row.push((r + c) % 2 === 0);
      } else {
        const v = Math.abs(Math.sin(hash + r * 31 + c * 17) * 10000);
        row.push(v - Math.floor(v) > 0.46);
      }
    }
    cells.push(row);
  }

  return (
    <svg
      id={id}
      width={size}
      height={size}
      viewBox={`0 0 ${gridCount + 2} ${gridCount + 2}`}
      className="bg-white rounded-md"
      role="img"
      aria-label={`Raast QR code for ${seedText}`}
    >
      <rect width={gridCount + 2} height={gridCount + 2} fill="#FFFFFF" />
      {cells.map((row, rIdx) =>
        row.map((filled, cIdx) =>
          filled ? (
            <rect
              key={`${rIdx}-${cIdx}`}
              x={cIdx + 1}
              y={rIdx + 1}
              width={0.95}
              height={0.95}
              fill="#0C1F14"
            />
          ) : null
        )
      )}
    </svg>
  );
};
