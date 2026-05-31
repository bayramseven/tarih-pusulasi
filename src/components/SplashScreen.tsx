'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Props {
  onEnter: () => void
}

function CompassRoseSVG() {
  return (
    <svg width="160" height="160" viewBox="0 0 160 160" fill="none">
      <defs>
        <radialGradient id="cg" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#E8B84B" />
          <stop offset="100%" stopColor="#A07008" />
        </radialGradient>
      </defs>

      {/* Outer dashed ring */}
      <circle cx="80" cy="80" r="74" stroke="#C8960C" strokeWidth="1"
        strokeDasharray="4 6" className="draw-line" opacity="0.6" />

      {/* Cardinal spokes */}
      {[0, 90, 180, 270].map((deg) => (
        <line key={deg}
          x1="80" y1="80"
          x2={80 + 64 * Math.sin((deg * Math.PI) / 180)}
          y2={80 - 64 * Math.cos((deg * Math.PI) / 180)}
          stroke="#C8960C" strokeWidth="1.5" opacity="0.5"
          className="draw-line"
        />
      ))}

      {/* Inter-cardinal spokes */}
      {[45, 135, 225, 315].map((deg) => (
        <line key={deg}
          x1="80" y1="80"
          x2={80 + 46 * Math.sin((deg * Math.PI) / 180)}
          y2={80 - 46 * Math.cos((deg * Math.PI) / 180)}
          stroke="#C8960C" strokeWidth="1" opacity="0.35"
          className="draw-line"
        />
      ))}

      {/* N arrow (large) */}
      <path d="M80 16 L87 44 L80 38 L73 44 Z" fill="url(#cg)" />

      {/* S arrow */}
      <path d="M80 144 L87 116 L80 122 L73 116 Z" fill="#C8960C" opacity="0.7" />

      {/* E arrow */}
      <path d="M144 80 L116 73 L122 80 L116 87 Z" fill="#C8960C" opacity="0.7" />

      {/* W arrow */}
      <path d="M16 80 L44 73 L38 80 L44 87 Z" fill="#C8960C" opacity="0.7" />

      {/* Outer ring slow spin */}
      <circle cx="80" cy="80" r="54" stroke="#C8960C" strokeWidth="0.8"
        strokeDasharray="2 8" opacity="0.4" className="compass-spin" />

      {/* Inner circle */}
      <circle cx="80" cy="80" r="22" stroke="#C8960C" strokeWidth="1.5"
        fill="rgba(245,239,215,0.5)" />

      {/* Center jewel */}
      <circle cx="80" cy="80" r="7" fill="url(#cg)" />
      <circle cx="80" cy="80" r="3" fill="#fff" opacity="0.8" />

      {/* N text */}
      <text x="80" y="11" textAnchor="middle"
        style={{ fontFamily: "'Playfair Display', serif", fontSize: '11px', fill: '#C8960C', fontWeight: 700 }}>
        K
      </text>
    </svg>
  )
}

export default function SplashScreen({ onEnter }: Props) {
  const [showTitle, setShowTitle] = useState(false)
  const [showButton, setShowButton] = useState(false)

  useEffect(() => {
    const t1 = setTimeout(() => setShowTitle(true), 1000)
    const t2 = setTimeout(() => setShowButton(true), 2000)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center select-none overflow-hidden paper-texture relative"
      style={{ background: 'var(--parchment)' }}
    >
      {/* Corner ornaments */}
      {[
        'top-4 left-4',
        'top-4 right-4 scale-x-[-1]',
        'bottom-4 left-4 scale-y-[-1]',
        'bottom-4 right-4 scale-[-1]',
      ].map((pos, i) => (
        <svg key={i} className={`absolute ${pos} opacity-25`} width="60" height="60" viewBox="0 0 60 60" fill="none">
          <path d="M2 58 L2 2 L58 2" stroke="#C8960C" strokeWidth="2" fill="none" />
          <path d="M2 2 L12 12" stroke="#C8960C" strokeWidth="1" />
          <circle cx="8" cy="8" r="3" fill="none" stroke="#C8960C" strokeWidth="1" />
        </svg>
      ))}

      {/* Horizontal decorative rules */}
      <div className="absolute left-8 right-8 top-16 h-px opacity-20"
        style={{ background: 'linear-gradient(to right, transparent, var(--gold), transparent)' }} />
      <div className="absolute left-8 right-8 bottom-16 h-px opacity-20"
        style={{ background: 'linear-gradient(to right, transparent, var(--gold), transparent)' }} />

      {/* Compass */}
      <motion.div
        initial={{ opacity: 0, scale: 0.7, rotate: -15 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      >
        <CompassRoseSVG />
      </motion.div>

      {/* Title block */}
      <AnimatePresence>
        {showTitle && (
          <motion.div
            className="mt-8 text-center px-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: 'easeOut' }}
          >
            {/* Decorative rule above */}
            <div className="flex items-center gap-3 mb-4 justify-center">
              <div className="h-px w-14 opacity-40" style={{ background: 'var(--gold)' }} />
              <span style={{ color: 'var(--gold)', fontSize: '16px' }}>✦</span>
              <div className="h-px w-14 opacity-40" style={{ background: 'var(--gold)' }} />
            </div>

            <p className="text-xs tracking-[0.35em] uppercase mb-2"
              style={{ color: 'var(--gold)', fontFamily: "'Source Serif 4', serif" }}>
              Türkiye Tarihi Coğrafyası
            </p>

            <h1 className="text-5xl font-bold leading-tight mb-3"
              style={{ fontFamily: "'Playfair Display', serif", color: 'var(--ink)' }}>
              Tarih<br />
              <em className="not-italic" style={{ color: 'var(--gold)' }}>Pusulası</em>
            </h1>

            <p className="text-sm leading-relaxed max-w-xs mx-auto"
              style={{ color: 'var(--ink-light)', fontFamily: "'Source Serif 4', serif" }}>
              Tarihi alanlara yaklaş,<br />medeniyetleri keşfet
            </p>

            {/* Decorative rule below */}
            <div className="flex items-center gap-3 mt-4 justify-center">
              <div className="h-px w-14 opacity-40" style={{ background: 'var(--gold)' }} />
              <span style={{ color: 'var(--gold)', fontSize: '16px' }}>✦</span>
              <div className="h-px w-14 opacity-40" style={{ background: 'var(--gold)' }} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Enter button */}
      <AnimatePresence>
        {showButton && (
          <motion.button
            onClick={onEnter}
            className="mt-10 px-8 py-3.5 rounded-full text-sm font-semibold tracking-widest uppercase transition-all"
            style={{
              fontFamily: "'Source Serif 4', serif",
              background: 'var(--gold)',
              color: 'var(--parchment)',
              letterSpacing: '0.15em',
              boxShadow: '0 4px 24px rgba(200,150,12,0.4)',
            }}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.04, boxShadow: '0 6px 32px rgba(200,150,12,0.6)' }}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.5 }}
          >
            Keşfet →
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  )
}
