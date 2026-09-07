import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import SidebarLogo from './SidebarLogo'
import SidebarNavigation from './SidebarNavigation'
import SidebarUser from './SidebarUser'

const ease = [0.22, 1, 0.36, 1] as const

export default function MobileDashboardHeader() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <header className="flex items-center justify-between border-b border-white/[0.08] bg-[#080A08] px-5 h-16 lg:hidden">
        <div className="flex items-center gap-2">
          <span className="text-[12px] font-bold tracking-[0.25em] uppercase text-[#F5F7F2]">
            Shipfolio
          </span>
          <span className="h-1.5 w-1.5 rounded-full bg-[#B6F34A]" />
        </div>

        <button
          onClick={() => setOpen(true)}
          className="flex h-10 w-10 items-center justify-center text-[#8A8F89] hover:text-[#F5F7F2] transition-colors"
          aria-label="Open navigation"
          aria-expanded={open}
        >
          <Menu className="h-5 w-5" />
        </button>
      </header>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-50 bg-[#080A08]/95 lg:hidden"
              onClick={() => setOpen(false)}
            />

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25, ease }}
              className="fixed inset-0 z-50 flex flex-col bg-[#080A08] lg:hidden overflow-y-auto"
            >
              <div
                className="pointer-events-none absolute inset-0 opacity-[0.015]"
                style={{
                  backgroundImage:
                    'linear-gradient(rgba(245,247,242,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(245,247,242,0.5) 1px, transparent 1px)',
                  backgroundSize: '48px 48px',
                }}
                aria-hidden="true"
              />

              <div className="relative flex items-center justify-between px-5 h-16 border-b border-white/[0.08]">
                <SidebarLogo />
                <button
                  onClick={() => setOpen(false)}
                  className="flex h-10 w-10 items-center justify-center text-[#8A8F89] hover:text-[#F5F7F2] transition-colors"
                  aria-label="Close navigation"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="relative flex-1 px-2 py-6">
                <SidebarNavigation onNavigate={() => setOpen(false)} />
              </div>

              <div className="relative border-t border-white/[0.06] px-2">
                <SidebarUser />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
