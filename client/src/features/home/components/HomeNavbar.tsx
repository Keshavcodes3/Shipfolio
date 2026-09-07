import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router'

const ease = [0.22, 1, 0.36, 1] as const

const navLinks = [
  { label: 'Product', href: '#product' },
  { label: 'Builders', href: '#builders' },
  { label: 'Community', href: '#community' },
]

export default function HomeNavbar() {
  const [scrolled, setScrolled] = useState(false)
  const [hovered, setHovered] = useState<string | null>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.1, ease }}
      className="fixed top-0 left-0 right-0 z-50"
    >
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <motion.nav
          animate={{
            marginTop: scrolled ? 12 : 0,
            borderRadius: scrolled ? 16 : 0,
          }}
          transition={{ duration: 0.4, ease }}
          className={`flex items-center justify-between h-14 px-5 transition-all duration-300 ${
            scrolled
              ? 'bg-[#080A08]/80 backdrop-blur-xl border border-white/[0.06]'
              : 'bg-transparent'
          }`}
        >
          <Link to="/" className="flex items-center gap-2">
            <div className="w-6 h-6 bg-[#B6F34A] rounded-sm flex items-center justify-center">
              <span className="text-[10px] font-black text-[#080A08]">S</span>
            </div>
            <span className="text-[13px] font-bold tracking-[0.15em] text-[#F5F7F2] uppercase">
              Shipfolio
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="relative px-4 py-2 text-[13px] text-[#8A8F89] hover:text-[#F5F7F2] transition-colors duration-200"
                onMouseEnter={() => setHovered(link.label)}
                onMouseLeave={() => setHovered(null)}
              >
                <AnimatePresence>
                  {hovered === link.label && (
                    <motion.span
                      layoutId="nav-hover"
                      className="absolute inset-0 bg-white/[0.04] rounded-md"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.15 }}
                    />
                  )}
                </AnimatePresence>
                <span className="relative z-10">{link.label}</span>
              </a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="text-[13px] text-[#8A8F89] hover:text-[#F5F7F2] transition-colors duration-200 hidden md:block"
            >
              Sign in
            </Link>
            <Link
              to="/register"
              className="px-4 py-2 text-[12px] font-medium bg-[#F5F7F2] text-[#080A08] rounded-md hover:bg-white transition-colors duration-200"
            >
              Get started
            </Link>
          </div>
        </motion.nav>
      </div>
    </motion.header>
  )
}
