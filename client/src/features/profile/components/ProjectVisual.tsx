import { type JSX } from 'react'
import { motion } from 'framer-motion'

const ease = [0.22, 1, 0.36, 1] as const

interface ProjectVisualProps {
  name: string
  className?: string
}

export default function ProjectVisual({ name, className = '' }: ProjectVisualProps) {
  const visuals: Record<string, JSX.Element> = {
    Letterly: (
      <svg viewBox="0 0 240 200" className={`w-full h-full ${className}`} fill="none">
        <defs>
          <filter id="letterly-glow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
        {[
          { cx: 120, cy: 25, r: 7 },
          { cx: 45, cy: 75, r: 5 },
          { cx: 195, cy: 75, r: 5 },
          { cx: 75, cy: 135, r: 4 },
          { cx: 165, cy: 135, r: 4 },
          { cx: 120, cy: 180, r: 8 },
        ].map((n, i) => (
          <g key={i}>
            <motion.circle cx={n.cx} cy={n.cy} r={n.r + 6} fill="none" stroke="rgba(182,243,74,0.06)" strokeWidth={1}
              initial={{ scale: 0, opacity: 0 }} animate={{ scale: [1, 1.4, 1], opacity: [0.2, 0, 0.2] }}
              transition={{ delay: 0.6 + i * 0.1, duration: 3, repeat: Infinity }} />
            <motion.circle cx={n.cx} cy={n.cy} r={n.r} fill="#B6F34A" fillOpacity={0.25} stroke="#B6F34A"
              strokeWidth={1.5} strokeOpacity={0.4} filter="url(#letterly-glow)"
              initial={{ scale: 0 }} animate={{ scale: 1 }}
              transition={{ delay: 0.6 + i * 0.1, type: 'spring', stiffness: 300, damping: 15 }} />
          </g>
        ))}
        {[[0,1],[0,2],[1,3],[2,4],[3,5],[4,5],[1,2],[3,4]].map(([a,b], i) => {
          const nodes = [{ cx:120,cy:25 },{ cx:45,cy:75 },{ cx:195,cy:75 },{ cx:75,cy:135 },{ cx:165,cy:135 },{ cx:120,cy:180 }]
          return <motion.line key={i} x1={nodes[a].cx} y1={nodes[a].cy} x2={nodes[b].cx} y2={nodes[b].cy}
            stroke="rgba(182,243,74,0.08)" strokeWidth={1}
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
            transition={{ delay: 0.4 + i * 0.06, duration: 0.6, ease }} />
        })}
        {[0,1,2].map(i => {
          const edges = [[0,1],[0,2],[1,3]]
          const nodes = [{ cx:120,cy:25 },{ cx:45,cy:75 },{ cx:195,cy:75 },{ cx:75,cy:135 },{ cx:165,cy:135 },{ cx:120,cy:180 }]
          return <motion.circle key={`p-${i}`} r={2} fill="#B6F34A" filter="url(#letterly-glow)"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0,1,1,0], cx: [nodes[edges[i][0]].cx, nodes[edges[i][1]].cx], cy: [nodes[edges[i][0]].cy, nodes[edges[i][1]].cy] }}
            transition={{ duration: 2, repeat: Infinity, delay: i * 0.7, ease: 'easeInOut' }} />
        })}
      </svg>
    ),

    Orbit: (
      <svg viewBox="0 0 140 140" className={`w-full h-full ${className}`} fill="none">
        <defs>
          <filter id="orbit-g"><feGaussianBlur stdDeviation="2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        </defs>
        {[45,30,18].map((r,i) => (
          <motion.circle key={i} cx={70} cy={70} r={r} stroke={`rgba(182,243,74,${0.08+i*0.04})`} strokeWidth={1}
            strokeDasharray={i===2?'4 4':'none'} initial={{ pathLength:0 }} animate={{ pathLength:1, rotate: i%2===0?360:-360 }}
            transition={{ pathLength:{duration:1.5,delay:i*0.2,ease}, rotate:{duration:12+i*4,repeat:Infinity,ease:'linear'} }}
            style={{ transformOrigin:'70px 70px' }} />
        ))}
        <motion.circle cx={70} cy={70} r={5} fill="#B6F34A" fillOpacity={0.6} filter="url(#orbit-g)"
          animate={{ scale:[1,1.2,1] }} transition={{ duration:2, repeat:Infinity }} />
        {[0,1,2].map(i => (
          <motion.circle key={`s-${i}`} r={2.5} fill="#B6F34A" fillOpacity={0.7}
            animate={{ cx:[70+45*Math.cos(i*2*Math.PI/3),70+45*Math.cos(i*2*Math.PI/3+2*Math.PI)], cy:[70+45*Math.sin(i*2*Math.PI/3),70+45*Math.sin(i*2*Math.PI/3+2*Math.PI)] }}
            transition={{ duration:8,repeat:Infinity,ease:'linear',delay:i*2.5 }} />
        ))}
      </svg>
    ),

    Relay: (
      <svg viewBox="0 0 140 100" className={`w-full h-full ${className}`} fill="none">
        <defs>
          <filter id="relay-g"><feGaussianBlur stdDeviation="2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        </defs>
        {[0,1,2].map(i => (
          <motion.path key={i} d={`M10 ${50+i*8} Q40 ${20+i*12} 70 ${50+i*8} Q100 ${80-i*12} 130 ${50+i*8}`}
            stroke={`rgba(182,243,74,${0.15-i*0.04})`} strokeWidth={1}
            initial={{ pathLength:0 }} animate={{ pathLength:1 }}
            transition={{ delay:0.2+i*0.15,duration:1.2,ease }} />
        ))}
        <motion.circle r={3} fill="#B6F34A" filter="url(#relay-g)"
          animate={{ cx:[10,40,70,100,130], cy:[50,25,50,75,50] }}
          transition={{ duration:2.5,repeat:Infinity,ease:'easeInOut' }} />
      </svg>
    ),

    Pulse: (
      <svg viewBox="0 0 140 80" className={`w-full h-full ${className}`} fill="none">
        <defs>
          <filter id="pulse-g"><feGaussianBlur stdDeviation="2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        </defs>
        {[0,1].map(i => (
          <motion.path key={i}
            d={`M0 ${40+i*6} L18 ${40+i*6} L28 ${15+i*6} L42 ${65-i*6} L56 ${28+i*6} L70 ${52-i*6} L84 ${40+i*6} L140 ${40+i*6}`}
            stroke={`rgba(182,243,74,${0.25-i*0.1})`} strokeWidth={1.5}
            initial={{ pathLength:0 }} animate={{ pathLength:1 }}
            transition={{ delay:i*0.2,duration:1,ease }} />
        ))}
        <motion.circle cx={56} cy={28} r={3} fill="#B6F34A" filter="url(#pulse-g)"
          animate={{ opacity:[0.3,1,0.3], r:[2,4,2] }} transition={{ duration:1.5,repeat:Infinity }} />
        {[20,35,50,65,80,95,110].map((x,i) => {
          const heights = [14,22,10,24,16,20,12]
          return <motion.rect key={i} x={x} y={40} width={2} fill="rgba(182,243,74,0.15)"
            initial={{ height:0,y:40 }}
            animate={{ height:[4,heights[i],4], y:[40,40-heights[i]/2,40] }}
            transition={{ duration:1.5+i*0.1,repeat:Infinity,delay:i*0.1 }} />
        })}
      </svg>
    ),
  }

  return visuals[name] || visuals.Orbit
}
