import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'

export default function RequireAuth({ children }: { children: React.ReactNode }) {
	const { user, loading } = useAuth()
	const location = useLocation()
	if (loading) return <div className="card p-6">Loading...</div>
	if (!user) return <Navigate to="/login" replace state={{ from: location }} />
	return <>{children}</>
}