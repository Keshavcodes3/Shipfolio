import { Link } from 'react-router'
import type { Notification } from '../types/notification'

interface NotificationItemProps {
  notification: Notification
  onRead: (id: string) => void
  onClose: () => void
}

export default function NotificationItem({ notification, onRead, onClose }: NotificationItemProps) {
  const handleClick = () => {
    onRead(notification.id)
    onClose()
  }

  return (
    <Link
      to={notification.href}
      onClick={handleClick}
      className={`flex items-start gap-3 px-4 py-3 border-b border-white/[0.04] hover:bg-white/[0.03] transition-colors duration-150 ${
        !notification.isRead ? 'bg-[#B6F34A]/[0.03]' : ''
      }`}
    >
      {!notification.isRead && (
        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#B6F34A] shrink-0" />
      )}
      {notification.isRead && <span className="w-1.5 shrink-0" />}

      <div className="flex-1 min-w-0">
        <p className={`text-[13px] leading-snug ${!notification.isRead ? 'text-[#F5F7F2]' : 'text-[#8A8F89]'}`}>
          {notification.text}
        </p>
        <p className="text-[11px] text-[#303530] font-mono mt-1">
          {notification.timestamp}
        </p>
      </div>
    </Link>
  )
}
