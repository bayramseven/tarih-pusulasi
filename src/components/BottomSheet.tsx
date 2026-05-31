'use client'

import { useRef } from 'react'
import { motion, AnimatePresence, useDragControls } from 'framer-motion'
import { TipALocation, CityFeature } from '@/lib/types'
import LocationCard from './LocationCard'

interface Props {
  tipALocation: TipALocation | null
  cityLocation: CityFeature | null
  onClose: () => void
}

function CloseBtn({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="absolute top-3 right-4 z-10 w-7 h-7 flex items-center justify-center rounded-full transition-opacity hover:opacity-70"
      style={{ background: 'rgba(44,24,16,0.08)' }}
    >
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
        stroke="var(--ink-mid)" strokeWidth="2.5" strokeLinecap="round">
        <path d="M18 6 6 18M6 6l12 12" />
      </svg>
    </button>
  )
}

export default function BottomSheet({ tipALocation, cityLocation, onClose }: Props) {
  const isOpen = tipALocation !== null || cityLocation !== null
  const dragControls = useDragControls()
  const sheetRef = useRef<HTMLDivElement>(null)

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            className="fixed inset-0 z-30"
            style={{ background: 'rgba(28,15,8,0.55)', backdropFilter: 'blur(4px)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Sheet */}
          <motion.div
            key="sheet"
            ref={sheetRef}
            className="fixed bottom-0 left-0 right-0 z-40 rounded-t-3xl overflow-hidden"
            style={{
              background: 'var(--parchment)',
              maxHeight: '92vh',
              boxShadow: '0 -12px 60px rgba(28,15,8,0.4), 0 -1px 0 rgba(200,150,12,0.4)',
              border: '1px solid rgba(200,150,12,0.2)',
              borderBottom: 'none',
            }}
            drag="y"
            dragControls={dragControls}
            dragListener={false}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.35 }}
            onDragEnd={(_, info) => { if (info.offset.y > 100) onClose() }}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
          >
            {/* Drag handle row */}
            <div
              className="relative pt-4 pb-2 cursor-grab active:cursor-grabbing"
              onPointerDown={(e) => dragControls.start(e)}
            >
              <div className="drag-handle" />
              <CloseBtn onClick={onClose} />
            </div>

            {/* Scrollable content */}
            <div className="overflow-y-auto" style={{ maxHeight: 'calc(88vh - 44px)' }}>
              {tipALocation ? (
                <LocationCard location={tipALocation} />
              ) : cityLocation ? (
                <div className="px-5 pb-8">
                  {/* City simple card */}
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs tracking-widest uppercase font-semibold"
                      style={{ color: 'var(--gold)' }}>İl</span>
                    <div className="h-px flex-1 opacity-30" style={{ background: 'var(--gold)' }} />
                  </div>
                  <h2 className="text-3xl font-bold mb-4"
                    style={{ fontFamily: "'Playfair Display', serif", color: 'var(--ink)' }}>
                    {cityLocation.properties.name}
                  </h2>
                  <div className="ornament-divider">✦</div>
                  <p className="text-sm leading-[1.85]" style={{ color: 'var(--ink-mid)' }}>
                    {cityLocation.properties.summary}
                  </p>
                </div>
              ) : null}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
