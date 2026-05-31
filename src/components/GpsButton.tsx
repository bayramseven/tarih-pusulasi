'use client'

import { GpsStatus } from '@/lib/types'

interface Props {
  status: GpsStatus
  onStart: () => void
  onStop: () => void
}

export default function GpsButton({ status, onStart, onStop }: Props) {
  const isWatching = status === 'watching'

  return (
    <button
      onClick={isWatching ? onStop : onStart}
      className="absolute bottom-8 right-4 z-20 flex items-center gap-2.5 transition-all duration-300 select-none"
      style={{
        padding: '11px 20px',
        borderRadius: '100px',
        border: `1.5px solid ${isWatching ? 'var(--gold)' : 'rgba(200,150,12,0.45)'}`,
        background: isWatching
          ? 'linear-gradient(135deg, #E8B84B, #C8960C)'
          : 'rgba(245,239,215,0.95)',
        color: isWatching ? '#fff' : 'var(--ink)',
        fontFamily: "'Source Serif 4', serif",
        fontSize: '13px',
        fontWeight: 600,
        letterSpacing: '0.02em',
        boxShadow: isWatching
          ? '0 4px 20px rgba(200,150,12,0.45)'
          : '0 2px 16px rgba(44,24,16,0.18)',
        backdropFilter: 'blur(8px)',
      }}
    >
      {isWatching ? (
        <>
          <span className="relative flex h-2.5 w-2.5 flex-shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-80" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white" />
          </span>
          Konumlanıyor
        </>
      ) : (
        <>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke="var(--gold)" strokeWidth="2" strokeLinecap="round">
            <circle cx="12" cy="12" r="3" fill="var(--gold)" fillOpacity="0.3" />
            <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
            <circle cx="12" cy="12" r="8.5" strokeDasharray="3 5" opacity="0.5" />
          </svg>
          <span style={{ color: 'var(--ink)' }}>Konumumu Bul</span>
        </>
      )}
    </button>
  )
}
