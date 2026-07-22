import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import LoadingSpinner from './LoadingSpinner.jsx'

export default function AdminRoute({ children }) {
  const { isAdmin, loading } = useAuth()

  if (loading) return <LoadingSpinner />
  if (!isAdmin) return <Navigate to="/" replace />
  return children
}
