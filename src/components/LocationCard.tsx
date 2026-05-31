'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { TipALocation } from '@/lib/types'

const CIV: Record<string, { bg: string; accent: string }> = {
  'Bizans & Osmanlı İmparatorluğu': { bg: '#1A0A3A', accent: '#9B6FD4' },
  'Hitit İmparatorluğu':            { bg: '#2A0E08', accent: '#D4805A' },
  'Taş Devri Avcı-Toplayıcıları':   { bg: '#0A1E0A', accent: '#6DB86D' },
  'Antik Roma & Helenistik':         { bg: '#2A0808', accent: '#D45A5A' },
  'Tunç Çağı & Helenistik':          { bg: '#1E160A', accent: '#C8A060' },
  'Kommagene Krallığı':              { bg: '#0A1428', accent: '#5A8AD4' },
  'Neolitik Çağ':                    { bg: '#0E1E0A', accent: '#7DB87D' },
  'Antik Roma':                      { bg: '#2A0A10', accent: '#D45A70' },
  'Ermeni Bagratuni Krallığı':       { bg: '#2A0808', accent: '#C85A5A' },
  'Helenistik & Roma':               { bg: '#141E0A', accent: '#A0C860' },
  'Afrodit Kültü & Roma':            { bg: '#1E0A1A', accent: '#D47AB8' },
}

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09 } },
}
const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' as const } },
}

interface Props { location: TipALocation }

export default function LocationCard({ location }: Props) {
  const civ = CIV[location.civilization] ?? { bg: '#1A100A', accent: '#C8960C' }
  const [imgLoaded, setImgLoaded] = useState(false)
  const [imgError, setImgError] = useState(false)
  const hasImage = !!location.imageUrl && !imgError

  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      animate="show"
      style={{ fontFamily: "'Source Serif 4', serif", color: 'var(--ink)' }}
    >
      {/* ══ HERO ══ */}
      <motion.div variants={fadeUp} className="relative overflow-hidden" style={{ height: 280 }}>

        {/* Shimmer placeholder — görsel yüklenene kadar */}
        {!imgLoaded && !imgError && location.imageUrl && (
          <div className="absolute inset-0 img-shimmer" />
        )}

        {/* Gradient placeholder (görsel yoksa veya hata varsa) */}
        {(!location.imageUrl || imgError) && (
          <div className="absolute inset-0 flex items-center justify-center"
            style={{ background: `linear-gradient(145deg, ${civ.bg} 0%, ${civ.bg}cc 60%, #1A100A 100%)` }}>
            <div className="absolute inset-0 opacity-[0.07]"
              style={{ backgroundImage: 'repeating-linear-gradient(60deg,transparent,transparent 30px,rgba(255,255,255,0.5) 30px,rgba(255,255,255,0.5) 31px)' }} />
            <svg width="72" height="72" viewBox="0 0 24 24" fill="none"
              stroke={civ.accent} strokeWidth="0.8" opacity="0.5">
              <circle cx="12" cy="12" r="10" />
              <circle cx="12" cy="12" r="3" fill={civ.accent} fillOpacity="0.3" />
              <path d="M12 2v4M12 18v4M2 12h4M18 12h4" />
              <path d="M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M16.24 7.76l2.83-2.83M4.93 19.07l2.83-2.83" />
            </svg>
          </div>
        )}

        {/* Gerçek görsel */}
        {location.imageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={location.imageUrl}
            alt={location.name}
            className="absolute inset-0 w-full h-full object-cover"
            style={{ opacity: imgLoaded ? 1 : 0, transition: 'opacity 0.6s ease' }}
            onLoad={() => setImgLoaded(true)}
            onError={() => setImgError(true)}
          />
        )}

        {/* Gradient katmanları */}
        <div className="absolute inset-0"
          style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.35) 50%, rgba(0,0,0,0.1) 100%)' }} />
        <div className="absolute inset-0"
          style={{ background: `linear-gradient(to right, ${civ.bg}55, transparent 70%)` }} />

        {/* Başlık içeriği */}
        <div className="absolute bottom-0 left-0 right-0 px-5 pb-5">
          {/* Uygarlık chip */}
          <div className="inline-flex items-center gap-1.5 mb-2 px-3 py-1 rounded-full"
            style={{ background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(8px)', border: `1px solid ${civ.accent}55` }}>
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: civ.accent }} />
            <span className="text-xs font-semibold tracking-[0.15em] uppercase"
              style={{ color: civ.accent, letterSpacing: '0.12em' }}>
              {location.civilization}
            </span>
          </div>

          {/* Konum adı */}
          <h2 className="font-black leading-none mb-1"
            style={{ fontFamily: "'Playfair Display', serif", color: '#fff', fontSize: 'clamp(28px, 7vw, 38px)', textShadow: '0 2px 12px rgba(0,0,0,0.5)' }}>
            {location.name}
          </h2>

          {/* Dönem */}
          <p className="text-xs font-medium tracking-wider" style={{ color: 'rgba(255,255,255,0.6)' }}>
            {location.period}
          </p>
        </div>
      </motion.div>

      {/* ══ İÇERİK ══ */}
      <div className="px-5 pt-6 pb-10 space-y-6">

        {/* Pull-quote */}
        <motion.div variants={fadeUp} className="pull-quote">
          <p className="text-sm font-semibold leading-[1.8]" style={{ color: 'var(--ink-mid)', fontStyle: 'italic' }}>
            {location.whyImportant}
          </p>
        </motion.div>

        {/* Ornament */}
        <motion.div variants={fadeUp} className="ornament-divider">✦</motion.div>

        {/* Ana metin */}
        <motion.div variants={fadeUp} className="space-y-4">
          {location.mainText.split('\n\n').map((para, i) => (
            <p key={i} style={{ fontSize: '14.5px', lineHeight: '1.9', color: 'var(--ink-mid)' }}>
              {para}
            </p>
          ))}
        </motion.div>

        <motion.div variants={fadeUp} className="ornament-divider">✦</motion.div>

        {/* Zaman Tüneli */}
        <motion.div variants={fadeUp}>
          <h3 className="text-lg font-bold mb-5 tracking-wide"
            style={{ fontFamily: "'Playfair Display', serif", color: 'var(--ink)', letterSpacing: '0.02em' }}>
            Zaman Tüneli
          </h3>
          <div>
            {location.timeline.map((item, i) => (
              <motion.div
                key={i}
                className="flex gap-4"
                variants={fadeUp}
              >
                {/* connector */}
                <div className="flex flex-col items-center flex-shrink-0" style={{ width: 22 }}>
                  <div className="w-3 h-3 rounded-full border-2 mt-1 flex-shrink-0 transition-colors"
                    style={{
                      borderColor: 'var(--gold)',
                      background: i === 0 ? 'var(--gold)' : 'var(--parchment)',
                      boxShadow: i === 0 ? '0 0 8px rgba(200,150,12,0.5)' : 'none',
                    }} />
                  {i < location.timeline.length - 1 && (
                    <div className="w-px flex-1 my-1" style={{ background: 'var(--gold)', opacity: 0.2 }} />
                  )}
                </div>
                {/* text */}
                <div className="pb-4">
                  <span className="text-xs font-bold tracking-wider uppercase"
                    style={{ color: 'var(--gold)', letterSpacing: '0.08em' }}>
                    {item.year}
                  </span>
                  <p className="mt-0.5" style={{ fontSize: '14px', lineHeight: '1.7', color: 'var(--ink-mid)' }}>
                    {item.event}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div variants={fadeUp} className="ornament-divider">✦</motion.div>

        {/* CTA */}
        <motion.a
          variants={fadeUp}
          href={location.readMoreUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2.5 py-3.5 rounded-2xl text-sm font-bold tracking-wide transition-all"
          style={{
            background: `linear-gradient(135deg, ${civ.accent}33, rgba(200,150,12,0.15))`,
            color: 'var(--gold)',
            border: '1px solid rgba(200,150,12,0.3)',
            letterSpacing: '0.06em',
          }}
          whileHover={{ scale: 1.02, boxShadow: '0 4px 20px rgba(200,150,12,0.25)' }}
          whileTap={{ scale: 0.98 }}
        >
          Kültür Portali&apos;nde İncele
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
          </svg>
        </motion.a>
      </div>
    </motion.div>
  )
}
