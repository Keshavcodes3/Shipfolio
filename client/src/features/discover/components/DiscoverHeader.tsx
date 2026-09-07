import { useState } from 'react'
import Logo from '../../../components/Logo'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router'
import { Menu, X } from 'lucide-react'

const ease = [0.22, 1, 0.36, 1] as const

export default function DiscoverHeader() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <motion.nav
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease }}
        className="flex items-center justify-between px-5 py-4 md:px-8 border-b border-white/[0.06] relative z-50"
      >
        <Link to="/" className="flex items-center">
          <Logo size="sm" animate={false} />
        </Link>

        <div className="hidden md:flex items-center gap-6">
          <Link to="/discover" className="text-[11px] uppercase tracking-[0.15em] text-[#B6F34A] transition-colors duration-200">
            DISCOVER
          </Link>
          <Link to="/projects" className="text-[11px] uppercase tracking-[0.15em] text-[#555B55] hover:text-[#F5F7F2] transition-colors duration-200">
            EXPLORE
          </Link>
          <Link to="/profile/keshav" className="text-[11px] uppercase tracking-[0.15em] text-[#555B55] hover:text-[#F5F7F2] transition-colors duration-200">
            @keshav
          </Link>
        </div>

        <button
          onClick={() => setOpen(true)}
          className="md:hidden text-[#8A8F89] hover:text-[#F5F7F2] transition-colors"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>
      </motion.nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[100] bg-[#080A08]/98 flex flex-col"
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
              <Link to="/" className="flex items-center" onClick={() => setOpen(false)}>
                <Logo size="sm" animate={false} />
              </Link>
              <button onClick={() => setOpen(false)} className="text-[#8A8F89] hover:text-[#F5F7F2] transition-colors" aria-label="Close menu">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center gap-8">
              {[
                { to: '/discover', label: 'DISCOVER', accent: true },
                { to: '/projects', label: 'EXPLORE' },
                { to: '/profile/keshav', label: '@KESHAV' },
              ].map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.06, duration: 0.4, ease }}
                >
                  <Link
                    to={item.to}
                    onClick={() => setOpen(false)}
                    className={`text-[14px] uppercase tracking-[0.2em] font-mono ${
                      item.accent ? 'text-[#B6F34A]' : 'text-[#8A8F89] hover:text-[#F5F7F2]'
                    } transition-colors duration-200`}
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
