import { useEffect, useCallback } from 'react'

export function useSearchKeyboard(onOpen: () => void) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        onOpen()
      }
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onOpen])
}

export function useSearchNavKeyboard(
  isOpen: boolean,
  resultCount: number,
  selectedIndex: number,
  setSelectedIndex: (i: number) => void,
  onSelect: () => void,
  onClose: () => void
) {
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!isOpen) return

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault()
          setSelectedIndex(Math.min(selectedIndex + 1, resultCount - 1))
          break
        case 'ArrowUp':
          e.preventDefault()
          setSelectedIndex(Math.max(selectedIndex - 1, 0))
          break
        case 'Enter':
          e.preventDefault()
          if (resultCount > 0) onSelect()
          break
        case 'Escape':
          e.preventDefault()
          onClose()
          break
      }
    },
    [isOpen, resultCount, selectedIndex, setSelectedIndex, onSelect, onClose]
  )

  return handleKeyDown
}
