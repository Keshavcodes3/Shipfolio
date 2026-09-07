import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence, useInView, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion'
import { Link } from 'react-router'
import { SignedIn, SignedOut, UserButton, SignInButton } from '@clerk/clerk-react'
import {
  ArrowRight,
  ArrowUpRight,
  Building2,
  Ship,
  Eye,
  RotateCcw,
  GitFork,
  Star,
  Users,
  Zap,
  Code2,
  Sparkles,
  Activity,
  Globe,
  Lock,
  Terminal,
  Boxes,
} from 'lucide-react'
import Logo from '../../../components/Logo'
import SEO from '../../../components/SEO'

const ease = [0.22, 1, 0.36, 1] as const
const spring = { stiffness: 100, damping: 20, mass: 0.8 }

/* ──────────────── NAVBAR ──────────────── */

function Navbar() {
  const [scrolled, setScrolled] = useState(false)

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
      <div className="mx-auto max-w-[1400px] px-5 md:px-8">
        <motion.nav
          animate={{ marginTop: scrolled ? 10 : 0, borderRadius: scrolled ? 14 : 0 }}
          transition={{ duration: 0.4, ease }}
          className={`flex items-center justify-between h-14 px-5 transition-all duration-300 ${
            scrolled ? 'bg-[#080A08]/90 backdrop-blur-xl shadow-[0_4px_24px_rgba(0,0,0,0.4)]' : ''
          }`}
        >
          <Link to="/" className="flex items-center gap-2.5">
            <motion.div
              whileHover={{ rotate: -8, scale: 1.1 }}
              transition={{ type: 'spring', stiffness: 400, damping: 15 }}
              className="w-6 h-6 bg-[#B6F34A] rounded flex items-center justify-center"
            >
              <span className="text-[10px] font-black text-[#080A08]">S</span>
            </motion.div>
            <span className="text-[13px] font-bold tracking-[0.15em] text-[#F5F7F2] uppercase">
              Shipfolio
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            {['Product', 'Builders', 'Community'].map((l) => (
              <motion.a
                key={l}
                href={`#${l.toLowerCase()}`}
                whileHover={{ y: -1 }}
                className="text-[13px] text-[#8A8F89] hover:text-[#F5F7F2] transition-colors duration-200"
              >
                {l}
              </motion.a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <SignedOut>
              <SignInButton mode="modal">
                <button className="text-[13px] text-[#8A8F89] hover:text-[#F5F7F2] transition-colors hidden md:block cursor-pointer">
                  Sign in
                </button>
              </SignInButton>
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Link to="/register" className="px-4 py-2 text-[12px] font-semibold bg-[#F5F7F2] text-[#080A08] rounded-md hover:bg-white transition-colors">
                  Get started
                </Link>
              </motion.div>
            </SignedOut>
            <SignedIn>
              <Link to="/dashboard" className="text-[13px] text-[#8A8F89] hover:text-[#F5F7F2] transition-colors hidden md:block">
                Dashboard
              </Link>
              <UserButton
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    avatarBox: 'w-8 h-8 rounded-md border border-white/[0.08]',
                  },
                }}
              />
            </SignedIn>
          </div>
        </motion.nav>
      </div>
    </motion.header>
  )
}

/* ──────────────── FLOATING PARTICLES ──────────────── */

function FloatingParticles({ count = 20 }: { count?: number }) {
  const particles = useRef(
    Array.from({ length: count }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 1,
      duration: Math.random() * 20 + 15,
      delay: Math.random() * 10,
      opacity: Math.random() * 0.15 + 0.03,
    }))
  ).current

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
      {particles.map((p, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-[#B6F34A]"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
          }}
          animate={{
            y: [0, -40, 20, -30, 0],
            x: [0, 15, -10, 25, 0],
            opacity: [p.opacity, p.opacity * 2, p.opacity * 0.5, p.opacity * 1.5, p.opacity],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  )
}

/* ──────────────── HERO ──────────────── */

function Hero() {
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const { scrollY } = useScroll()
  const heroOpacity = useTransform(scrollY, [0, 600], [1, 0])
  const heroScale = useTransform(scrollY, [0, 600], [1, 0.95])

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    mouseX.set(x * 30)
    mouseY.set(y * 30)
  }, [mouseX, mouseY])

  return (
    <motion.section
      style={{ opacity: heroOpacity, scale: heroScale }}
      onMouseMove={handleMouseMove}
      className="relative min-h-screen flex items-center overflow-hidden bg-[#080A08]"
    >
      {/* Grid pattern */}

      <SEO
        title={null}
        description="Ship, showcase, and track what you build. ShipFolio is a living portfolio for indie hackers, developers, and creators who ship real projects."
        url="/"
      />
      <div className="absolute inset-0 pointer-events-none opacity-[0.015]">
        <div className="w-full h-full" style={{
          backgroundImage: 'linear-gradient(rgba(245,247,242,1) 1px, transparent 1px), linear-gradient(90deg, rgba(245,247,242,1) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }} />
      </div>

      {/* Floating particles */}
      <FloatingParticles count={15} />

      {/* Mouse-tracking glow */}
      <motion.div
        style={{ x: mouseX, y: mouseY }}
        className="absolute inset-0 pointer-events-none"
      >
        <motion.div
          animate={{ x: [0, 80, -40, 0], y: [0, -60, 40, 0], scale: [1, 1.15, 0.95, 1] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/3 right-1/4 w-[500px] h-[500px] rounded-full bg-[#B6F34A]/[0.04] blur-[180px]"
        />
      </motion.div>

      {/* Secondary glow */}
      <motion.div
        animate={{ x: [0, -60, 30, 0], y: [0, 40, -50, 0] }}
        transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] rounded-full bg-[#B6F34A]/[0.02] blur-[150px] pointer-events-none"
      />

      <div className="relative z-10 mx-auto w-full max-w-[1400px] px-5 md:px-8 py-32">
        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-12 lg:gap-8 items-center">
          {/* Left side - text */}
          <div>
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 12, filter: 'blur(8px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 0.7, delay: 0.3, ease }}
              className="mb-8"
            >
              <div className="inline-flex items-center gap-2 border border-white/[0.06] rounded-full px-4 py-1.5 bg-white/[0.02]">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#B6F34A]/40" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#B6F34A]" />
                </span>
                <span className="text-[11px] font-mono tracking-[0.2em] text-[#8A8F89]">FOR BUILDERS WHO SHIP</span>
              </div>
            </motion.div>

            {/* Headline - word by word reveal */}
            <div className="mb-8">
              {['STOP HIDING', 'BEHIND', 'YOUR COMMITS.'].map((line, i) => (
                <motion.div
                  key={line}
                  className="overflow-hidden"
                >
                  <motion.h1
                    initial={{ y: 120, opacity: 0, filter: 'blur(12px)' }}
                    animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
                    transition={{ delay: 0.4 + i * 0.15, duration: 1, ease: [0.16, 1, 0.3, 1] }}
                    className={`leading-[0.88] tracking-[-0.04em] ${
                      i === 1
                        ? 'text-[clamp(2rem,5vw,4rem)] font-light text-[#555B55]'
                        : 'text-[clamp(3rem,8vw,7.5rem)] font-bold text-[#F5F7F2]'
                    }`}
                  >
                    {line.split(' ').map((word, j) => (
                      <motion.span
                        key={j}
                        initial={{ y: 120, opacity: 0, filter: 'blur(12px)' }}
                        animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
                        transition={{
                          delay: 0.5 + i * 0.15 + j * 0.08,
                          duration: 1,
                          ease: [0.16, 1, 0.3, 1],
                        }}
                        className="inline-block mr-[0.25em]"
                      >
                        {word}
                      </motion.span>
                    ))}
                  </motion.h1>
                </motion.div>
              ))}
            </div>

            {/* Sub */}
            <motion.p
              initial={{ opacity: 0, y: 15, filter: 'blur(6px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 0.7, delay: 0.9, ease }}
              className="text-[clamp(1rem,1.8vw,1.2rem)] text-[#8A8F89] leading-relaxed mb-12 max-w-[480px]"
            >
              Your code is not your story. Your portfolio should show the craft,
              the decisions, and the things you are proud of.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.1, ease }}
              className="flex flex-wrap items-center gap-4 mb-16"
            >
              <motion.div whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.97 }}>
                <Link to="/register" className="group inline-flex items-center gap-2 bg-[#B6F34A] text-[#080A08] px-7 py-3.5 text-[13px] font-semibold rounded-md hover:bg-[#B6F34A]/90 transition-all duration-200 shadow-[0_0_30px_rgba(182,243,74,0.15)]">
                  Start building
                  <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.97 }}>
                <Link to="/register" className="group inline-flex items-center gap-2 border border-white/[0.08] text-[#8A8F89] px-7 py-3.5 text-[13px] rounded-md hover:border-white/[0.15] hover:text-[#F5F7F2] transition-all duration-200">
                  Explore builders
                  <ArrowUpRight size={15} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              </motion.div>
            </motion.div>

            {/* Stage */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 1.4 }}
              className="flex items-center gap-6"
            >
              {[
                { icon: Building2, label: 'BUILD', active: true },
                { icon: Ship, label: 'SHIP', active: false },
                { icon: Eye, label: 'SHOW', active: false },
                { icon: RotateCcw, label: 'REPEAT', active: false },
              ].map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.5 + i * 0.1, duration: 0.4 }}
                  className="flex items-center gap-2"
                >
                  <s.icon size={14} className={s.active ? 'text-[#B6F34A]' : 'text-[#303530]'} />
                  <span className={`text-[10px] font-mono tracking-[0.2em] ${s.active ? 'text-[#B6F34A]' : 'text-[#303530]'}`}>
                    {s.label}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Right side - visual */}
          <motion.div
            initial={{ opacity: 0, x: 40, filter: 'blur(10px)' }}
            animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
            transition={{ duration: 1, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="hidden lg:block"
          >
            <HeroVisual />
          </motion.div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#080A08] to-transparent" />
    </motion.section>
  )
}

/* ──────────────── HERO VISUAL ──────────────── */

function HeroVisual() {
  const [active, setActive] = useState(0)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [8, -8]), spring)
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-8, 8]), spring)

  useEffect(() => {
    const t = setInterval(() => setActive((p) => (p + 1) % 3), 3500)
    return () => clearInterval(t)
  }, [])

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    mouseX.set(x)
    mouseY.set(y)
  }, [mouseX, mouseY])

  const cards = [
    {
      type: 'project',
      name: 'Letterly',
      status: 'BUILDING',
      desc: 'Async communication between strangers.',
      tech: ['React', 'PostgreSQL', 'Redis'],
      color: '#B6F34A',
    },
    {
      type: 'profile',
      name: '@keshav',
      role: 'Software Builder',
      projects: 8,
      shipped: 4,
    },
    {
      type: 'activity',
      events: [
        { text: 'shipped Orbit v1.0', time: '2h ago' },
        { text: 'started a new project', time: '5h ago' },
        { text: 'connected GitHub', time: '1d ago' },
      ],
    },
  ]

  return (
    <div
      className="relative w-full max-w-[480px] mx-auto"
      style={{ perspective: 1000 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => {
        mouseX.set(0)
        mouseY.set(0)
      }}
    >
      {/* Ambient ring */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
        className="absolute inset-0 m-auto w-[320px] h-[320px] rounded-full border border-white/[0.03]"
      />
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 45, repeat: Infinity, ease: 'linear' }}
        className="absolute inset-0 m-auto w-[420px] h-[420px] rounded-full border border-white/[0.02]"
      />

      {/* Floating dots on rings */}
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          animate={{ rotate: 360 }}
          transition={{ duration: 20 + i * 5, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-0 m-auto w-[320px] h-[320px]"
          style={{ rotate: i * 120 }}
        >
          <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#B6F34A]/30" />
        </motion.div>
      ))}

      {/* Center pulse */}
      <div className="absolute inset-0 m-auto w-3 h-3 rounded-full bg-[#B6F34A]/30">
        <motion.div
          animate={{ scale: [1, 2.5, 1], opacity: [0.5, 0, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 rounded-full bg-[#B6F34A]/20"
        />
      </div>

      {/* Main card with 3D tilt */}
      <motion.div
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
        className="relative"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 20, scale: 0.95, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -20, scale: 0.95, filter: 'blur(8px)' }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="relative bg-[#0C0F0C] border border-white/[0.08] rounded-2xl p-6 shadow-2xl"
          >
            {/* Browser chrome */}
            <div className="flex items-center gap-2 mb-5 pb-4 border-b border-white/[0.06]">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-white/[0.06]" />
                <div className="w-2.5 h-2.5 rounded-full bg-white/[0.06]" />
                <div className="w-2.5 h-2.5 rounded-full bg-white/[0.06]" />
              </div>
              <div className="flex-1 mx-4">
                <motion.div
                  key={active}
                  initial={{ opacity: 0, x: -5 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white/[0.04] rounded-md px-3 py-1"
                >
                  <span className="text-[10px] font-mono text-[#555B55]">shipfolio.dev/{cards[active].type === 'project' ? 'letterly' : cards[active].type === 'profile' ? '@keshav' : 'activity'}</span>
                </motion.div>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-[#B6F34A]" />
                <span className="text-[9px] font-mono text-[#B6F34A]">LIVE</span>
              </div>
            </div>

            {/* Content */}
            {cards[active].type === 'project' && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.4 }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 rounded-full bg-[#B6F34A] animate-pulse" />
                  <span className="text-[10px] font-mono text-[#B6F34A] tracking-[0.15em]">BUILDING</span>
                </div>
                <h3 className="text-2xl font-bold text-[#F5F7F2] mb-2">{cards[active].name}</h3>
                <p className="text-[13px] text-[#8A8F89] mb-4">{cards[active].desc}</p>
                <div className="flex gap-1.5">
                  {cards[active].tech?.map((t, j) => (
                    <motion.span
                      key={t}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.2 + j * 0.05 }}
                      className="px-2 py-0.5 text-[10px] font-mono text-[#555B55] border border-white/[0.06] rounded"
                    >
                      {t}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            )}

            {cards[active].type === 'profile' && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.4 }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 15, delay: 0.2 }}
                    className="w-12 h-12 rounded-full bg-[#1A1D1A] border border-white/[0.08] flex items-center justify-center text-[16px] font-bold text-[#B6F34A]"
                  >
                    K
                  </motion.div>
                  <div>
                    <p className="text-[15px] font-bold text-[#F5F7F2]">{cards[active].name}</p>
                    <p className="text-[12px] text-[#555B55]">{cards[active].role}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.25, type: 'spring' }}
                    className="bg-white/[0.02] border border-white/[0.04] rounded-lg p-3 text-center"
                  >
                    <p className="text-xl font-bold text-[#F5F7F2]">{cards[active].projects}</p>
                    <p className="text-[9px] font-mono text-[#555B55] mt-1">PROJECTS</p>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3, type: 'spring' }}
                    className="bg-white/[0.02] border border-white/[0.04] rounded-lg p-3 text-center"
                  >
                    <p className="text-xl font-bold text-[#B6F34A]">{cards[active].shipped}</p>
                    <p className="text-[9px] font-mono text-[#555B55] mt-1">SHIPPED</p>
                  </motion.div>
                </div>
              </motion.div>
            )}

            {cards[active].type === 'activity' && (
              <div>
                <p className="text-[10px] font-mono text-[#555B55] tracking-[0.15em] mb-4">RECENT ACTIVITY</p>
                <div className="space-y-3">
                  {cards[active].events?.map((e, i) => (
                    <motion.div
                      key={e.text}
                      initial={{ opacity: 0, x: -15, filter: 'blur(4px)' }}
                      animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                      transition={{ delay: 0.15 + i * 0.12, duration: 0.5 }}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.2 + i * 0.12, type: 'spring', stiffness: 400 }}
                          className="w-1.5 h-1.5 rounded-full bg-[#B6F34A]/60"
                        />
                        <span className="text-[12px] text-[#C5C8C5]">{e.text}</span>
                      </div>
                      <span className="text-[10px] font-mono text-[#303530]">{e.time}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* Dots */}
      <div className="flex items-center justify-center gap-2 mt-6">
        {cards.map((_, i) => (
          <motion.button
            key={i}
            onClick={() => setActive(i)}
            whileHover={{ scale: 1.3 }}
            whileTap={{ scale: 0.9 }}
            className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${i === active ? 'bg-[#B6F34A] w-6' : 'bg-[#303530] w-1.5'}`}
          />
        ))}
      </div>
    </div>
  )
}

/* ──────────────── BENTO GRID ──────────────── */

function BentoGrid() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-10%' })

  return (
    <section ref={ref} className="relative py-20 md:py-32 bg-[#080A08]" id="product">
      <div className="mx-auto max-w-[1400px] px-5 md:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
          animate={isInView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
          transition={{ duration: 0.7, ease }}
          className="mb-12"
        >
          <motion.div
            initial={{ width: 0 }}
            animate={isInView ? { width: 32 } : {}}
            transition={{ duration: 0.6, delay: 0.2, ease }}
            className="h-[1px] bg-[#B6F34A]/40 mb-4"
          />
          <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#B6F34A]/70">WHY SHIPFOLIO</span>
          <h2 className="text-[clamp(2rem,4vw,3.5rem)] font-bold text-[#F5F7F2] tracking-tight leading-[1.05] mt-3">
            Everything you need.
            <br />
            <span className="text-[#555B55]">Nothing you don&apos;t.</span>
          </h2>
        </motion.div>

        {/* Bento Grid */}
        <div className="grid grid-cols-12 gap-3 md:gap-4">
          <BentoCard className="col-span-12 md:col-span-8 row-span-2" delay={0}>
            <ProjectVisualCard />
          </BentoCard>

          <BentoCard className="col-span-12 md:col-span-4" delay={0.1}>
            <StatsCard />
          </BentoCard>

          <BentoCard className="col-span-12 md:col-span-4" delay={0.15}>
            <CommunityCard />
          </BentoCard>

          <BentoCard className="col-span-12 md:col-span-4" delay={0.2}>
            <FeatureCard icon={Code2} title="Rich Project Pages" description="Not just code. Stories, decisions, and the things that matter." />
          </BentoCard>

          <BentoCard className="col-span-12 md:col-span-4" delay={0.25}>
            <FeatureCard icon={Activity} title="Live Activity" description="See what builders you follow are shipping in real-time." />
          </BentoCard>

          <BentoCard className="col-span-12 md:col-span-4" delay={0.3}>
            <FeatureCard icon={Globe} title="Public Profiles" description="Your builder identity. One link. Everything you ship." />
          </BentoCard>

          <BentoCard className="col-span-12 md:col-span-6" delay={0.35}>
            <GithubCard />
          </BentoCard>

          <BentoCard className="col-span-12 md:col-span-6" delay={0.4}>
            <GraveyardCard />
          </BentoCard>

          <BentoCard className="col-span-12 md:col-span-3" delay={0.45}>
            <MiniFeatureCard icon={Lock} title="Privacy First" />
          </BentoCard>

          <BentoCard className="col-span-12 md:col-span-3" delay={0.5}>
            <MiniFeatureCard icon={Zap} title="Fast & Clean" />
          </BentoCard>

          <BentoCard className="col-span-12 md:col-span-3" delay={0.55}>
            <MiniFeatureCard icon={Sparkles} title="AI Ready" />
          </BentoCard>

          <BentoCard className="col-span-12 md:col-span-3" delay={0.6}>
            <MiniFeatureCard icon={Users} title="Builder Community" />
          </BentoCard>
        </div>
      </div>
    </section>
  )
}

/* ──────────────── BENTO CARD WRAPPER ──────────────── */

function BentoCard({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-5%' })
  const [hovered, setHovered] = useState(false)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const glowX = useSpring(useTransform(mouseX, [0, 1], [-20, 20]), { stiffness: 150, damping: 20 })
  const glowY = useSpring(useTransform(mouseY, [0, 1], [-20, 20]), { stiffness: 150, damping: 20 })

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect()
    mouseX.set((e.clientX - rect.left) / rect.width)
    mouseY.set((e.clientY - rect.top) / rect.height)
  }, [mouseX, mouseY])

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30, filter: 'blur(6px)' }}
      animate={isInView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); mouseX.set(0.5); mouseY.set(0.5) }}
      onMouseMove={handleMouseMove}
      className={`relative border border-white/[0.06] rounded-xl overflow-hidden bg-white/[0.015] transition-colors duration-300 hover:border-[#B6F34A]/15 group ${className}`}
    >
      {/* Mouse-tracking glow */}
      <motion.div
        style={{ x: glowX, y: glowY }}
        animate={hovered ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="absolute inset-0 pointer-events-none"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-[#B6F34A]/[0.04] to-transparent" />
      </motion.div>
      <div className="relative z-10 h-full">{children}</div>
    </motion.div>
  )
}

/* ──────────────── BENTO CARD CONTENTS ──────────────── */

function ProjectVisualCard() {
  const [active, setActive] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setActive((p) => (p + 1) % 4), 3000)
    return () => clearInterval(t)
  }, [])

  const projects = [
    { name: 'Letterly', status: 'BUILDING', desc: 'Async communication between strangers.', tech: ['React', 'PostgreSQL', 'Redis'], color: '#B6F34A' },
    { name: 'Orbit', status: 'SHIPPED', desc: 'A visual workspace for exploring ideas.', tech: ['TypeScript', 'WebGL', 'React'], color: '#F5F7F2' },
    { name: 'Pulse', status: 'BUILDING', desc: 'Observability without dashboard overload.', tech: ['Go', 'ClickHouse', 'React'], color: '#B6F34A' },
    { name: 'Canvas', status: 'MAINTAINING', desc: 'Turn rough ideas into structured notes.', tech: ['React', 'TypeScript', 'WebGL'], color: '#8A8F89' },
  ]

  return (
    <div className="p-6 md:p-8 h-full flex flex-col justify-between min-h-[280px]">
      <div className="flex items-center justify-between mb-6">
        <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#555B55]">LIVE PREVIEW</span>
        <div className="flex gap-1.5">
          {projects.map((_, i) => (
            <motion.button
              key={i}
              onClick={() => setActive(i)}
              whileHover={{ scale: 1.4 }}
              whileTap={{ scale: 0.8 }}
              className={`w-1.5 h-1.5 rounded-full transition-colors duration-200 cursor-pointer ${i === active ? 'bg-[#B6F34A]' : 'bg-[#303530]'}`}
            />
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          initial={{ opacity: 0, y: 12, filter: 'blur(6px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          exit={{ opacity: 0, y: -12, filter: 'blur(6px)' }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="flex-1 flex flex-col justify-center"
        >
          <div className="flex items-center gap-2 mb-3">
            <motion.div
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: projects[active].color }}
            />
            <span className="text-[11px] font-mono tracking-[0.15em]" style={{ color: projects[active].color }}>
              {projects[active].status}
            </span>
          </div>
          <h3 className="text-[clamp(1.5rem,3vw,2.2rem)] font-bold text-[#F5F7F2] mb-2">{projects[active].name}</h3>
          <p className="text-[14px] text-[#8A8F89] mb-4 max-w-[300px]">{projects[active].desc}</p>
          <div className="flex gap-1.5">
            {projects[active].tech.map((t, j) => (
              <motion.span
                key={t}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: j * 0.05 }}
                className="px-2 py-0.5 text-[10px] font-mono text-[#555B55] border border-white/[0.06] rounded"
              >
                {t}
              </motion.span>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

function StatsCard() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true })
  const stats = [
    { value: 2847, label: 'Builders' },
    { value: 12491, label: 'Projects' },
    { value: 847, label: 'Shipped Today' },
  ]

  return (
    <div ref={ref} className="p-6 md:p-8 h-full flex flex-col justify-center">
      <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#555B55] mb-6">BY THE NUMBERS</span>
      <div className="space-y-5">
        {stats.map((s, i) => (
          <div key={s.label} className="flex items-baseline justify-between">
            <p className="text-[clamp(1.5rem,3vw,2rem)] font-bold text-[#F5F7F2]">
              <AnimatedNumber value={s.value} isInView={isInView} delay={i * 0.15} />
            </p>
            <p className="text-[11px] font-mono uppercase tracking-[0.15em] text-[#555B55]">{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function AnimatedNumber({ value, isInView, delay = 0 }: { value: number; isInView: boolean; delay?: number }) {
  const [display, setDisplay] = useState('0')

  useEffect(() => {
    if (!isInView) return
    const timeout = setTimeout(() => {
      const duration = 1500
      const start = Date.now()
      const tick = () => {
        const elapsed = Date.now() - start
        const progress = Math.min(elapsed / duration, 1)
        const eased = 1 - Math.pow(1 - progress, 3)
        const current = Math.round(eased * value)
        setDisplay(current.toLocaleString())
        if (progress < 1) requestAnimationFrame(tick)
      }
      tick()
    }, delay * 1000)
    return () => clearTimeout(timeout)
  }, [isInView, value, delay])

  return <>{display}</>
}

function CommunityCard() {
  return (
    <div className="p-6 md:p-8 h-full flex flex-col justify-between min-h-[180px]">
      <div>
        <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#555B55] mb-4 block">COMMUNITY</span>
        <h3 className="text-[clamp(1.2rem,2vw,1.5rem)] font-bold text-[#F5F7F2] mb-2">Where builders help builders.</h3>
        <p className="text-[13px] text-[#8A8F89] leading-relaxed">Ask for feedback. Share what you shipped. Start conversations.</p>
      </div>
      <motion.div whileHover={{ x: 4 }} transition={{ type: 'spring', stiffness: 400 }}>
        <Link to="/register" className="inline-flex items-center gap-2 text-[12px] font-mono text-[#B6F34A] hover:text-[#B6F34A]/80 transition-colors mt-4">
          Join community <ArrowUpRight size={12} />
        </Link>
      </motion.div>
    </div>
  )
}

function FeatureCard({ icon: Icon, title, description }: { icon: React.ComponentType<{ size?: number; className?: string }>; title: string; description: string }) {
  return (
    <div className="p-6 md:p-8 h-full flex flex-col justify-between min-h-[180px]">
      <div>
        <motion.div
          whileHover={{ rotate: -8, scale: 1.1 }}
          transition={{ type: 'spring', stiffness: 400, damping: 15 }}
          className="w-10 h-10 rounded-lg bg-[#B6F34A]/[0.08] border border-[#B6F34A]/10 flex items-center justify-center mb-4"
        >
          <Icon size={18} className="text-[#B6F34A]" />
        </motion.div>
        <h3 className="text-[15px] font-bold text-[#F5F7F2] mb-2">{title}</h3>
        <p className="text-[13px] text-[#8A8F89] leading-relaxed">{description}</p>
      </div>
    </div>
  )
}

function GithubCard() {
  return (
    <div className="p-6 md:p-8 h-full flex flex-col justify-between min-h-[180px]">
      <div className="flex items-start justify-between">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#555B55] mb-4 block">INTEGRATION</span>
          <h3 className="text-[15px] font-bold text-[#F5F7F2] mb-2">Connect your GitHub.</h3>
          <p className="text-[13px] text-[#8A8F89] leading-relaxed max-w-[280px]">Import repos, sync activity, and show your real contribution history.</p>
        </div>
        <motion.div
          whileHover={{ rotate: 15 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          <GitFork size={20} className="text-[#555B55] shrink-0" />
        </motion.div>
      </div>
      <div className="flex gap-2 mt-4">
        {['Repos', 'Activity', 'Contributions'].map((f) => (
          <span key={f} className="px-2 py-0.5 text-[10px] font-mono text-[#555B55] border border-white/[0.06] rounded">
            {f}
          </span>
        ))}
      </div>
    </div>
  )
}

function GraveyardCard() {
  return (
    <div className="p-6 md:p-8 h-full flex flex-col justify-between min-h-[180px]">
      <div className="flex items-start justify-between">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#555B55] mb-4 block">LEARN</span>
          <h3 className="text-[15px] font-bold text-[#F5F7F2] mb-2">The Graveyard.</h3>
          <p className="text-[13px] text-[#8A8F89] leading-relaxed max-w-[280px]">Every abandoned project has a lesson. Read what builders learned.</p>
        </div>
        <motion.div
          whileHover={{ scale: 1.2, rotate: 10 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          <Star size={20} className="text-[#555B55] shrink-0" />
        </motion.div>
      </div>
      <motion.div whileHover={{ x: 4 }} transition={{ type: 'spring', stiffness: 400 }}>
        <Link to="/register" className="inline-flex items-center gap-2 text-[12px] font-mono text-[#B6F34A] hover:text-[#B6F34A]/80 transition-colors mt-4">
          Explore graveyard <ArrowUpRight size={12} />
        </Link>
      </motion.div>
    </div>
  )
}

function MiniFeatureCard({ icon: Icon, title }: { icon: React.ComponentType<{ size?: number; className?: string }>; title: string }) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
      className="p-5 h-full flex flex-col items-center justify-center text-center min-h-[120px]"
    >
      <Icon size={20} className="text-[#B6F34A] mb-3" />
      <p className="text-[13px] font-medium text-[#F5F7F2]">{title}</p>
    </motion.div>
  )
}

/* ──────────────── HOW IT WORKS (ANIMATED SECTION) ──────────────── */

function HowItWorks() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-10%' })
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  const lineWidth = useTransform(scrollYProgress, [0.2, 0.8], ['0%', '100%'])

  const steps = [
    {
      num: '01',
      icon: Terminal,
      title: 'Connect your tools',
      desc: 'Link your GitHub, deploy logs, and any service you use. Shipfolio syncs everything automatically.',
      visual: 'terminal',
    },
    {
      num: '02',
      icon: Boxes,
      title: 'Curate your projects',
      desc: 'Not every repo is a story. Pick the work you are proud of and add the context that matters.',
      visual: 'grid',
    },
    {
      num: '03',
      icon: Users,
      title: 'Share your ship',
      desc: 'Get a public profile that shows the craft behind your code. One link, everything you build.',
      visual: 'profile',
    },
  ]

  return (
    <section ref={ref} className="relative py-24 md:py-40 bg-[#080A08] overflow-hidden" id="builders">
      <div className="absolute top-0 left-0 right-0 h-px bg-white/[0.06]" />

      {/* Animated progress line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-white/[0.03]">
        <motion.div
          style={{ width: lineWidth }}
          className="h-full bg-gradient-to-r from-transparent via-[#B6F34A]/40 to-transparent"
        />
      </div>

      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          animate={{ x: [0, -60, 40, 0], y: [0, 40, -30, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/2 left-1/3 w-[400px] h-[400px] rounded-full bg-[#B6F34A]/[0.02] blur-[150px]"
        />
      </div>

      <div className="mx-auto max-w-[1400px] px-5 md:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
          animate={isInView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
          transition={{ duration: 0.7, ease }}
          className="mb-16 md:mb-24"
        >
          <div className="flex items-center gap-3 mb-4">
            <motion.div
              initial={{ width: 0 }}
              animate={isInView ? { width: 32 } : {}}
              transition={{ duration: 0.6, delay: 0.2, ease }}
              className="h-[1px] bg-[#B6F34A]/40"
            />
            <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#B6F34A]/70">HOW IT WORKS</span>
          </div>
          <h2 className="text-[clamp(2rem,4vw,3.5rem)] font-bold text-[#F5F7F2] tracking-tight leading-[1.05]">
            Three steps.
            <br />
            <span className="text-[#555B55]">No complexity.</span>
          </h2>
        </motion.div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
          {steps.map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 50, filter: 'blur(6px)' }}
              animate={isInView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
              transition={{ duration: 0.8, delay: 0.2 + i * 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="relative group"
            >
              {/* Connector line */}
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-12 left-full w-full h-px bg-white/[0.06] z-0">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={isInView ? { width: '100%' } : {}}
                    transition={{ duration: 1, delay: 0.5 + i * 0.3 }}
                    className="h-full bg-gradient-to-r from-[#B6F34A]/20 to-transparent"
                  />
                </div>
              )}

              <motion.div
                whileHover={{ y: -4, borderColor: 'rgba(182,243,74,0.15)' }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="relative bg-white/[0.015] border border-white/[0.06] rounded-xl p-6 md:p-8 transition-colors duration-300 h-full"
              >
                {/* Step visual */}
                <div className="mb-6">
                  <StepVisual type={step.visual} isInView={isInView} index={i} />
                </div>

                {/* Step number */}
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.4 + i * 0.15, duration: 0.5 }}
                  className="text-[10px] font-mono text-[#B6F34A]/60 tracking-[0.2em] mb-3 block"
                >
                  STEP {step.num}
                </motion.span>

                {/* Title */}
                <h3 className="text-[18px] font-bold text-[#F5F7F2] mb-3">{step.title}</h3>

                {/* Description */}
                <p className="text-[13px] text-[#8A8F89] leading-relaxed">{step.desc}</p>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

function StepVisual({ type, isInView, index }: { type: string; isInView: boolean; index: number }) {
  if (type === 'terminal') {
    return (
      <div className="bg-[#0C0F0C] border border-white/[0.06] rounded-lg p-4 font-mono">
        <div className="flex items-center gap-1.5 mb-3">
          <div className="w-2 h-2 rounded-full bg-white/[0.06]" />
          <div className="w-2 h-2 rounded-full bg-white/[0.06]" />
          <div className="w-2 h-2 rounded-full bg-white/[0.06]" />
        </div>
        <div className="space-y-1.5">
          <motion.div
            initial={{ width: 0 }}
            animate={isInView ? { width: '75%' } : {}}
            transition={{ duration: 1.2, delay: 0.5 + index * 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="h-2 bg-[#B6F34A]/20 rounded"
          />
          <motion.div
            initial={{ width: 0 }}
            animate={isInView ? { width: '50%' } : {}}
            transition={{ duration: 1, delay: 0.8 + index * 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="h-2 bg-white/[0.04] rounded"
          />
          <motion.div
            initial={{ width: 0 }}
            animate={isInView ? { width: '65%' } : {}}
            transition={{ duration: 1.1, delay: 1.1 + index * 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="h-2 bg-[#B6F34A]/10 rounded"
          />
        </div>
        {/* Blinking cursor */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: [0, 1, 0] } : {}}
          transition={{ duration: 1, delay: 1.5, repeat: Infinity }}
          className="w-2 h-4 bg-[#B6F34A]/40 mt-2"
        />
      </div>
    )
  }

  if (type === 'grid') {
    return (
      <div className="grid grid-cols-3 gap-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{
              duration: 0.5,
              delay: 0.3 + i * 0.08,
              type: 'spring',
              stiffness: 300,
              damping: 15,
            }}
            className={`h-12 rounded-lg border border-white/[0.06] ${
              i === 0 ? 'bg-[#B6F34A]/[0.08] border-[#B6F34A]/20' : 'bg-white/[0.02]'
            }`}
          />
        ))}
      </div>
    )
  }

  return (
    <div className="bg-[#0C0F0C] border border-white/[0.06] rounded-lg p-4">
      <div className="flex items-center gap-3 mb-3">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.4, type: 'spring', stiffness: 400 }}
          className="w-8 h-8 rounded-full bg-[#B6F34A]/[0.08] border border-[#B6F34A]/20"
        />
        <div className="flex-1">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: '50%' }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="h-2 bg-white/[0.06] rounded mb-1.5"
          />
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: '30%' }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="h-1.5 bg-white/[0.03] rounded"
          />
        </div>
      </div>
      <div className="flex gap-2">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.7, type: 'spring' }}
          className="h-6 flex-1 bg-[#B6F34A]/[0.05] rounded"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8, type: 'spring' }}
          className="h-6 flex-1 bg-white/[0.03] rounded"
        />
      </div>
    </div>
  )
}

/* ──────────────── CTA ──────────────── */

function CTA() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-15%' })
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  const bgScale = useTransform(scrollYProgress, [0.2, 0.8], [0.8, 1.1])
  const bgOpacity = useTransform(scrollYProgress, [0.2, 0.5], [0, 1])

  return (
    <section ref={ref} className="relative py-40 md:py-56 overflow-hidden" id="community">
      <div className="absolute top-0 left-0 right-0 h-px bg-white/[0.06]" />

      {/* Animated background wordmark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none" aria-hidden="true">
        <motion.span
          style={{ scale: bgScale, opacity: bgOpacity }}
          className="text-[clamp(5rem,16vw,16rem)] font-bold text-white/[0.015] tracking-[0.15em] leading-none whitespace-nowrap"
        >
          <Logo size="sm" animate={false} />
        </motion.span>
      </div>

      {/* Floating particles in CTA */}
      <FloatingParticles count={10} />

      <div className="relative z-10 mx-auto max-w-[1400px] px-5 md:px-8 text-center">
        <div className="mb-10">
          {['BUILD.', 'SHIP.', 'BE SEEN.'].map((word, i) => (
            <div key={word} className="overflow-hidden">
              <motion.span
                initial={{ y: 120, opacity: 0, filter: 'blur(12px)' }}
                animate={isInView ? { y: 0, opacity: 1, filter: 'blur(0px)' } : {}}
                transition={{
                  duration: 1,
                  delay: 0.1 + i * 0.15,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className={`block text-[clamp(3rem,9vw,7.5rem)] font-bold leading-[0.95] tracking-tight ${
                  i === 2 ? 'text-[#B6F34A]' : 'text-[#F5F7F2]'
                }`}
              >
                {word.split('').map((char, j) => (
                  <motion.span
                    key={j}
                    initial={{ y: 80, opacity: 0, rotateX: -90 }}
                    animate={isInView ? { y: 0, opacity: 1, rotateX: 0 } : {}}
                    transition={{
                      delay: 0.3 + i * 0.15 + j * 0.03,
                      duration: 0.8,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className="inline-block"
                    style={{ transformOrigin: 'bottom' }}
                  >
                    {char === ' ' ? '\u00A0' : char}
                  </motion.span>
                ))}
              </motion.span>
            </div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0, y: 15, filter: 'blur(6px)' }}
          animate={isInView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
          transition={{ duration: 0.7, delay: 0.8, ease }}
          className="text-[clamp(1rem,2vw,1.2rem)] text-[#8A8F89] mb-14 max-w-lg mx-auto leading-relaxed"
        >
          Give the things you build somewhere to live.
          <br />
          Stop hiding behind your commits.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 1.0 }}
          className="flex flex-wrap items-center justify-center gap-4"
        >
          <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }}>
            <Link to="/register" className="group inline-flex items-center gap-2 px-8 py-4 bg-[#B6F34A] text-[#080A08] text-[13px] font-semibold rounded-md hover:bg-[#B6F34A]/90 transition-all duration-200 shadow-[0_0_40px_rgba(182,243,74,0.2)]">
              Create your Shipfolio
              <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
            </Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }}>
            <Link to="/register" className="group inline-flex items-center gap-2 px-8 py-4 text-[13px] text-[#8A8F89] hover:text-[#F5F7F2] border border-white/[0.08] rounded-md hover:border-white/[0.15] transition-all duration-200">
              Explore builders
              <ArrowUpRight size={15} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 1.3 }}
          className="mt-20 flex items-center justify-center gap-6 md:gap-8 flex-wrap"
        >
          {['No credit card required', 'Free for open source', 'Ship in minutes'].map((t, i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 8 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 1.4 + i * 0.1, duration: 0.4 }}
              className="flex items-center gap-2"
            >
              <motion.div
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 2, delay: i * 0.3, repeat: Infinity }}
                className="w-1 h-1 rounded-full bg-[#B6F34A]/40"
              />
              <span className="text-[11px] text-[#555B55]">{t}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

/* ──────────────── FOOTER ──────────────── */

function Footer() {
  return (
    <footer className="border-t border-white/[0.06]">
      <div className="mx-auto max-w-[1400px] px-5 md:px-8 py-12 md:py-16">
        <div className="flex flex-col md:flex-row justify-between gap-10">
          <div>
            <Link to="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-6 h-6 bg-[#B6F34A] rounded flex items-center justify-center">
                <span className="text-[10px] font-black text-[#080A08]">S</span>
              </div>
              <span className="text-[13px] font-bold tracking-[0.15em] text-[#F5F7F2] uppercase">Shipfolio</span>
            </Link>
            <p className="text-[13px] text-[#555B55] max-w-xs leading-relaxed">
              A living portfolio for things you actually build.
            </p>
          </div>
          <div className="flex gap-8">
            {['Product', 'Builders', 'Community', 'GitHub'].map((l) => (
              <a key={l} href="#" className="text-[13px] text-[#8A8F89] hover:text-[#F5F7F2] transition-colors duration-200">
                {l}
              </a>
            ))}
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-white/[0.04] flex flex-col md:flex-row justify-between gap-4">
          <p className="text-[11px] text-[#303530] font-mono">&copy; {new Date().getFullYear()} Shipfolio</p>
          <p className="text-[11px] text-[#303530] font-mono">Built with intention.</p>
        </div>
      </div>
    </footer>
  )
}

/* ──────────────── PAGE ──────────────── */

export default function HomePage() {
  return (
    <div className="bg-[#080A08] min-h-screen text-[#F5F7F2]">
      <Navbar />
      <main>
        <Hero />
        <BentoGrid />
        <HowItWorks />
        <CTA />
      </main>
      <Footer />
    </div>
  )
}
