import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from './AuthContext'

export default function RequireRole({ role, children }: { role: string; children: ReactNode }) {
  const { loading, role: userRole } = useAuth()

  if (loading) return null
  if (userRole !== role) return <Navigate to="/" replace />

  return <>{children}</>
}
