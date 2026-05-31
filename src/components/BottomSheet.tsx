'use client'

import { useRef, useEffect } from 'react'
import { motion, AnimatePresence, useDragControls } from 'framer-motion'
import { TipALocation } from '@/lib/types'
import LocationCard from './LocationCard'

interface Props {
  location: TipALocation | null
  onClose: () => void
}

export default function BottomSheet({ location, onClose }: Props) {
  const dragControls = useDragControls()
  const sheetRef = useRef<HTMLDivElement>(null)

  /* ESC ile kapat */
  useEffect(() => {
    if (!location) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [location, onClose])

  /* Panel açıkken harita scroll/touch engeli */
  useEffect(() => {
    if (location) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [location])

  /* Responsive yükseklik: masaüstü %40, mobil %75 */
  const maxH = typeof window !== 'undefined' && window.innerWidth >= 768
    ? '42vh'
    : '78vh'

  return (
    <AnimatePresence>
      {location && (
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
            key={location.id}
            ref={sheetRef}
            className="fixed bottom-0 left-0 right-0 z-40 rounded-t-3xl overflow-hidden"
            style={{
              background: 'var(--parchment)',
              maxHeight: maxH,
              boxShadow: '0 -12px 60px rgba(28,15,8,0.4), 0 -1px 0 rgba(200,150,12,0.4)',
              border: '1px solid rgba(200,150,12,0.2)',
              borderBottom: 'none',
            }}
            drag="y"
            dragControls={dragControls}
            dragListener={false}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.35 }}
            onDragEnd={(_, info) => { if (info.offset.y > 90) onClose() }}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
          >
            {/* Drag handle + X */}
            <div
              className="relative pt-4 pb-2 flex-shrink-0 cursor-grab active:cursor-grabbing"
              onPointerDown={(e) => dragControls.start(e)}
            >
              <div className="drag-handle" />
              <button
                onClick={onClose}
                className="absolute top-3 right-4 w-7 h-7 flex items-center justify-center rounded-full transition-opacity hover:opacity-70"
                style={{ background: 'rgba(44,24,16,0.08)' }}
                aria-label="Kapat (ESC)"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                  stroke="var(--ink-mid)" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Scroll alanı */}
            <div
              className="overflow-y-auto"
              style={{ maxHeight: `calc(${maxH} - 52px)` }}
              onTouchMove={(e) => e.stopPropagation()}
            >
              <LocationCard location={location} />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
