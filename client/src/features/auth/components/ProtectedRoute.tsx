import { useAuth } from '../hooks/useAuth'
import { Navigate } from 'react-router'
import LoadingScreen from '../../../components/LoadingScreen'

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return <LoadingScreen />
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}
