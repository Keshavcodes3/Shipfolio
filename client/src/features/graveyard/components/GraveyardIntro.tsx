import { motion } from 'framer-motion'

const ease = [0.22, 1, 0.36, 1] as const

export default function GraveyardIntro() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.6, ease }}
      className="py-12 border-t border-white/[0.06]"
    >
      <div className="flex flex-col lg:flex-row items-start gap-12 lg:gap-20">
        {/* Left text */}
        <div className="flex-1 max-w-[400px]">
          <p className="text-[13px] text-[#8A8F89] leading-relaxed">
            Every project here taught someone something. Some taught patience.
            Others taught when to quit. All of them are worth remembering.
          </p>
        </div>

        {/* Right: Abstract flow visual */}
        <div className="shrink-0 w-full lg:w-auto overflow-x-auto scrollbar-none">
          <svg
            width="360"
            height="80"
            viewBox="0 0 360 80"
            fill="none"
            className="min-w-[360px]"
          >
            {/* Flow: IDEA → BUILD → STOP → LESSON → ARCHIVE */}
            {[
              { x: 30, label: 'IDEA', color: '#B6F34A', opacity: 0.6 },
              { x: 110, label: 'BUILD', color: '#B6F34A', opacity: 0.4 },
              { x: 190, label: 'STOP', color: '#8A8F89', opacity: 0.3 },
              { x: 270, label: 'LESSON', color: '#B6F34A', opacity: 0.8 },
              { x: 340, label: 'ARCHIVE', color: '#303530', opacity: 0.2 },
            ].map((node, i) => (
              <g key={i}>
                {/* Node */}
                <motion.circle
                  cx={node.x}
                  cy={40}
                  r={6}
                  fill={node.color}
                  fillOpacity={node.opacity}
                  animate={i === 3 ? {
                    fillOpacity: [node.opacity, 0.4, node.opacity],
                    r: [6, 8, 6],
                  } : {}}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                />

                {/* Label */}
                <text
                  x={node.x}
                  y={65}
                  textAnchor="middle"
                  className="fill-[#555B55] text-[8px] font-mono uppercase tracking-widest"
                >
                  {node.label}
                </text>

                {/* Arrow to next */}
                {i < 4 && (
                  <line
                    x1={node.x + 12}
                    y1={40}
                    x2={i < 3 ? node.x + 68 : node.x + 58}
                    y2={40}
                    stroke="#1a1d1a"
                    strokeWidth="1"
                    strokeDasharray={i === 2 ? '3 3' : 'none'}
                  />
                )}
              </g>
            ))}

            {/* Faded archived points in background */}
            {[
              { cx: 55, cy: 25, r: 2 },
              { cx: 145, cy: 55, r: 1.5 },
              { cx: 235, cy: 20, r: 2.5 },
              { cx: 310, cy: 55, r: 1.5 },
              { cx: 85, cy: 60, r: 1 },
              { cx: 200, cy: 15, r: 1.5 },
            ].map((dot, i) => (
              <circle
                key={i}
                cx={dot.cx}
                cy={dot.cy}
                r={dot.r}
                fill="#303530"
                fillOpacity={0.3}
              />
            ))}
          </svg>
        </div>
      </div>
    </motion.div>
  )
}
