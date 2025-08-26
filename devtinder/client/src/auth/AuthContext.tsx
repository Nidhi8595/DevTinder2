import { createContext, useContext, useEffect, useState } from 'react'
import axios from 'axios'

export interface AuthUser { id: string; name: string; email: string }

interface AuthContextValue {
	user: AuthUser | null
	loading: boolean
	refresh: () => Promise<void>
	logout: () => void
	apiBase: string
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const apiBase = (import.meta.env.VITE_API_URL as string) || 'http://localhost:5000'
	const [user, setUser] = useState<AuthUser | null>(null)
	const [loading, setLoading] = useState(true)

	async function refresh() {
		setLoading(true)
		try {
			const res = await axios.get(`${apiBase}/users/me`, { withCredentials: true })
			setUser({ id: res.data._id || res.data.id, name: res.data.name, email: res.data.email })
			localStorage.setItem('devtinder_user_id', res.data._id || res.data.id)
		} catch {
			setUser(null)
			localStorage.removeItem('devtinder_user_id')
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => { refresh() }, [])

	function logout() {
		setUser(null)
		localStorage.removeItem('devtinder_user_id')
	}

	return (
		<AuthContext.Provider value={{ user, loading, refresh, logout, apiBase }}>
			{children}
		</AuthContext.Provider>
	)
}

export function useAuth() {
	const ctx = useContext(AuthContext)
	if (!ctx) throw new Error('useAuth must be used within AuthProvider')
	return ctx
}