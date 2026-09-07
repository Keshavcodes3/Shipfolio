import { useState } from 'react'
import { Bell } from 'lucide-react'
import NotificationPanel from './NotificationPanel'
import { notifications } from '../data/notificationData'

export default function NotificationButton() {
  const [open, setOpen] = useState(false)
  const unreadCount = notifications.filter((n) => !n.isRead).length

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative flex h-8 w-8 items-center justify-center text-[#555B55] hover:text-[#8A8F89] transition-colors"
        aria-label="Notifications"
        aria-expanded={open}
      >
        <Bell className="h-4 w-4" />
        {unreadCount > 0 && (
          <span className="absolute right-1.5 top-1.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#B6F34A] text-[8px] font-bold text-[#080A08]">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
          />
          <NotificationPanel onClose={() => setOpen(false)} />
        </>
      )}
    </div>
  )
}
