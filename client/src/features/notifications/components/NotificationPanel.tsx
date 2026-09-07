import { useState } from 'react'
import { motion } from 'framer-motion'
import { notifications as initialNotifications } from '../data/notificationData'
import NotificationItem from './NotificationItem'
import NotificationEmptyState from './NotificationEmptyState'

const ease = [0.22, 1, 0.36, 1] as const

interface NotificationPanelProps {
  onClose: () => void
}

export default function NotificationPanel({ onClose }: NotificationPanelProps) {
  const [items, setItems] = useState(initialNotifications)

  const markRead = (id: string) => {
    setItems((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -8, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.98 }}
      transition={{ duration: 0.2, ease }}
      className="absolute right-0 top-full mt-2 z-50 w-[min(340px,calc(100vw-2rem))] bg-[#0D0F0D] border border-white/[0.08] shadow-2xl"
    >
      <div className="px-4 py-3 border-b border-white/[0.06]">
        <p className="text-[11px] uppercase tracking-[0.16em] text-[#555B55] font-mono">
          NOTIFICATIONS
        </p>
      </div>

      {items.length === 0 ? (
        <NotificationEmptyState />
      ) : (
        <div className="max-h-[360px] overflow-y-auto">
          {items.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onRead={markRead}
              onClose={onClose}
            />
          ))}
        </div>
      )}
    </motion.div>
  )
}
