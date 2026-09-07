import { motion, useInView } from 'framer-motion'
import { useRef, useEffect, useState } from 'react'

const ease = [0.22, 1, 0.36, 1] as const

interface ProfileStatsProps {
  stats: {
    projects: number
    shipped: number
    building: number
    followers: number
  }
}

function AnimatedCounter({ value, delay }: { value: number; delay: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!inView) return
    const timer = setTimeout(() => {
      let start = 0
      const duration = 800
      const step = (timestamp: number) => {
        if (!start) start = timestamp
        const progress = Math.min((timestamp - start) / duration, 1)
        setCount(Math.floor(progress * value))
        if (progress < 1) requestAnimationFrame(step)
      }
      requestAnimationFrame(step)
    }, delay * 1000)
    return () => clearTimeout(timer)
  }, [inView, value, delay])

  return <span ref={ref}>{count}</span>
}

export default function ProfileStats({ stats }: ProfileStatsProps) {
  const items = [
    { value: stats.projects, label: 'PROJECTS', color: '#F5F7F2' },
    { value: stats.shipped, label: 'SHIPPED', color: '#8A8F89' },
    { value: stats.building, label: 'BUILDING', color: '#B6F34A' },
    { value: stats.followers, label: 'FOLLOWERS', color: '#555B55' },
  ]

  return (
    <div className="flex items-center gap-5 flex-wrap">
      {items.map((item, i) => (
        <div key={item.label} className="flex items-baseline gap-1.5">
          <span className="text-[13px] font-bold tracking-[-0.02em] font-mono" style={{ color: item.color }}>
            <AnimatedCounter value={item.value} delay={0.6 + i * 0.08} />
          </span>
          <span className="text-[9px] uppercase tracking-[0.14em] text-[#303530] font-mono">
            {item.label}
          </span>
          {i < items.length - 1 && (
            <span className="text-[#1a1c1c] ml-3">·</span>
          )}
        </div>
      ))}
    </div>
  )
}
