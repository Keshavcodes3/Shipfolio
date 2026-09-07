import { motion } from 'framer-motion'

interface GraveyardProjectVisualProps {
  type: string
  isHovered?: boolean
}

export default function GraveyardProjectVisual({ type, isHovered = false }: GraveyardProjectVisualProps) {
  if (type === 'letters') {
    return (
      <svg viewBox="0 0 200 120" className="w-full h-full" fill="none">
        {/* Fading network of letters */}
        {[
          { x: 40, y: 40, letter: 'L', opacity: 0.4 },
          { x: 80, y: 30, letter: 'E', opacity: 0.3 },
          { x: 120, y: 50, letter: 'T', opacity: 0.2 },
          { x: 160, y: 35, letter: 'T', opacity: 0.15 },
          { x: 60, y: 80, letter: 'E', opacity: 0.25 },
          { x: 100, y: 90, letter: 'R', opacity: 0.1 },
          { x: 140, y: 75, letter: 'L', opacity: 0.08 },
          { x: 180, y: 85, letter: 'Y', opacity: 0.05 },
        ].map((item, i) => (
          <g key={i}>
            <motion.text
              x={item.x}
              y={item.y}
              className="fill-[#B6F34A] text-[14px] font-mono"
              fillOpacity={isHovered ? item.opacity + 0.1 : item.opacity}
              animate={isHovered ? { y: [item.y, item.y - 3, item.y] } : {}}
              transition={{ duration: 2, delay: i * 0.1, repeat: Infinity }}
            >
              {item.letter}
            </motion.text>
          </g>
        ))}
        {/* Connection lines */}
        <line x1="45" y1="40" x2="75" y2="30" stroke="#303530" strokeWidth="0.5" strokeDasharray="2 2" />
        <line x1="85" y1="30" x2="115" y2="50" stroke="#303530" strokeWidth="0.5" strokeDasharray="2 2" />
        <line x1="125" y1="50" x2="155" y2="35" stroke="#303530" strokeWidth="0.5" strokeDasharray="2 2" opacity="0.3" />
        <line x1="45" y1="42" x2="55" y2="78" stroke="#303530" strokeWidth="0.5" strokeDasharray="2 2" opacity="0.2" />
      </svg>
    )
  }

  if (type === 'orbital') {
    return (
      <svg viewBox="0 0 160 160" className="w-full h-full" fill="none">
        {/* Orbital paths */}
        {[50, 38, 26].map((r, i) => (
          <motion.circle
            key={i}
            cx="80"
            cy="80"
            r={r}
            stroke="#303530"
            strokeWidth="0.5"
            strokeDasharray={i === 0 ? 'none' : '3 3'}
            animate={isHovered ? { rotate: i % 2 === 0 ? 360 : -360 } : {}}
            transition={{ duration: 20 + i * 5, repeat: Infinity, ease: 'linear' }}
            style={{ transformOrigin: '80px 80px' }}
          />
        ))}
        {/* Center */}
        <circle cx="80" cy="80" r="4" fill="#B6F34A" fillOpacity="0.4" />
        {/* Disconnected node */}
        <circle cx="130" cy="80" r="3" fill="#8A8F89" fillOpacity="0.2" />
        <line x1="84" y1="80" x2="127" y2="80" stroke="#303530" strokeWidth="0.5" strokeDasharray="2 2" opacity="0.3" />
      </svg>
    )
  }

  if (type === 'nodes') {
    return (
      <svg viewBox="0 0 160 100" className="w-full h-full" fill="none">
        {/* Connected nodes with broken connection */}
        {[
          { cx: 30, cy: 50, r: 4 },
          { cx: 70, cy: 30, r: 4 },
          { cx: 110, cy: 50, r: 4 },
          { cx: 140, cy: 80, r: 3 },
        ].map((node, i) => (
          <circle key={i} cx={node.cx} cy={node.cy} r={node.r} fill="#8A8F89" fillOpacity={0.3 - i * 0.05} />
        ))}
        {/* Connections */}
        <line x1="34" y1="50" x2="66" y2="30" stroke="#303530" strokeWidth="0.5" />
        <line x1="74" y1="30" x2="106" y2="50" stroke="#303530" strokeWidth="0.5" />
        {/* Broken connection */}
        <line x1="114" y1="50" x2="137" y2="78" stroke="#303530" strokeWidth="0.5" strokeDasharray="2 2" opacity="0.3" />
        <circle cx="125" cy="65" r="2" fill="#B6F34A" fillOpacity="0.2" />
      </svg>
    )
  }

  if (type === 'grid') {
    return (
      <svg viewBox="0 0 160 100" className="w-full h-full" fill="none">
        {/* Grid with unfinished blocks */}
        {Array.from({ length: 4 }).map((_, row) =>
          Array.from({ length: 6 }).map((_, col) => {
            const filled = (row * 6 + col) < 14
            return (
              <rect
                key={`${row}-${col}`}
                x={10 + col * 24}
                y={10 + row * 22}
                width={20}
                height={18}
                fill={filled ? '#303530' : 'none'}
                stroke="#1a1d1a"
                strokeWidth="0.5"
              />
            )
          })
        )}
        {/* Highlighted unfinished block */}
        <rect x={10 + 4 * 24} y={10 + 2 * 22} width={20} height={18} fill="#B6F34A" fillOpacity="0.1" stroke="#B6F34A" strokeWidth="0.5" strokeDasharray="2 2" />
      </svg>
    )
  }

  if (type === 'waveform') {
    return (
      <svg viewBox="0 0 200 80" className="w-full h-full" fill="none">
        {/* Waveform that disappears */}
        {Array.from({ length: 20 }).map((_, i) => {
          const height = Math.sin(i * 0.5) * 20 + 25
          const opacity = Math.max(0, 1 - i * 0.08)
          return (
            <rect
              key={i}
              x={5 + i * 10}
              y={40 - height / 2}
              width={3}
              height={height}
              fill="#8A8F89"
              fillOpacity={opacity * 0.4}
              rx="1"
            />
          )
        })}
        {/* Green accent at start */}
        <rect x={5} y={40 - 12} width={3} height={24} fill="#B6F34A" fillOpacity="0.4" rx="1" />
      </svg>
    )
  }

  if (type === 'stack') {
    return (
      <svg viewBox="0 0 160 100" className="w-full h-full" fill="none">
        {/* Stacked document lines */}
        {[0, 1, 2, 3, 4].map((i) => (
          <g key={i}>
            <rect
              x={30}
              y={10 + i * 16}
              width={100}
              height={10}
              fill={i < 3 ? '#303530' : 'none'}
              stroke="#1a1d1a"
              strokeWidth="0.5"
              rx="1"
            />
            {i < 3 && (
              <rect
                x={35}
                y={13 + i * 16}
                width={40 + i * 10}
                height={4}
                fill="#8A8F89"
                fillOpacity="0.2"
                rx="1"
              />
            )}
          </g>
        ))}
        {/* Faded section */}
        <rect x={30} y={74} width={100} height={10} fill="none" stroke="#B6F34A" strokeWidth="0.5" strokeDasharray="2 2" opacity="0.3" />
      </svg>
    )
  }

  if (type === 'lines') {
    return (
      <svg viewBox="0 0 160 100" className="w-full h-full" fill="none">
        {/* Terminal-like lines */}
        {[
          { x: 20, y: 20, width: 80, opacity: 0.3 },
          { x: 20, y: 35, width: 60, opacity: 0.25 },
          { x: 20, y: 50, width: 90, opacity: 0.2 },
          { x: 20, y: 65, width: 40, opacity: 0.15 },
          { x: 20, y: 80, width: 70, opacity: 0.1 },
        ].map((line, i) => (
          <rect key={i} x={line.x} y={line.y} width={line.width} height={3} fill="#8A8F89" fillOpacity={line.opacity} rx="1" />
        ))}
        {/* Cursor */}
        <rect x={20} y={80} width={8} height={3} fill="#B6F34A" fillOpacity="0.4" rx="1">
          <animate attributeName="opacity" values="0.4;0.1;0.4" dur="1.5s" repeatCount="indefinite" />
        </rect>
      </svg>
    )
  }

  if (type === 'dots') {
    return (
      <svg viewBox="0 0 160 100" className="w-full h-full" fill="none">
        {/* Scattered dots */}
        {Array.from({ length: 15 }).map((_, i) => (
          <circle
            key={i}
            cx={20 + (i * 11) % 120}
            cy={15 + (i * 17) % 70}
            r={2 + (i % 3)}
            fill="#8A8F89"
            fillOpacity={0.3 - i * 0.015}
          />
        ))}
        {/* One green dot */}
        <circle cx="80" cy="50" r="3" fill="#B6F34A" fillOpacity="0.4">
          <animate attributeName="r" values="2;4;2" dur="3s" repeatCount="indefinite" />
        </circle>
      </svg>
    )
  }

  // Default fallback
  return (
    <svg viewBox="0 0 160 100" className="w-full h-full" fill="none">
      <circle cx="80" cy="50" r="20" stroke="#303530" strokeWidth="0.5" />
      <circle cx="80" cy="50" r="4" fill="#8A8F89" fillOpacity="0.2" />
    </svg>
  )
}
