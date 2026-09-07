import { useAuth } from '../hooks/useAuth'
import { Navigate } from 'react-router'
import LoadingScreen from '../../../components/LoadingScreen'

export default function GuestRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return <LoadingScreen />
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  return <>{children}</>
}
