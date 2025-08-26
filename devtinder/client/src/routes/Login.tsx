import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../auth/AuthContext'

export default function Login() {
	const navigate = useNavigate()
	const { apiBase, refresh } = useAuth()
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string|undefined>()

	async function onSubmit(e: React.FormEvent) {
		e.preventDefault()
		setLoading(true); setError(undefined)
		try {
			const res = await axios.post(`${apiBase}/auth/login`, { email, password }, { withCredentials: true })
			localStorage.setItem('devtinder_user_id', res.data.id)
			await refresh()
			navigate('/feed')
		} catch (err: any) {
			setError(err?.response?.data?.message || 'Login failed')
		} finally {
			setLoading(false)
		}
	}

	return (
		<div className="max-w-md mx-auto">
			<h2 className="text-3xl font-bold mb-6">Welcome back</h2>
			<form onSubmit={onSubmit} className="card p-6 space-y-4">
				{error && <div className="text-red-400">{error}</div>}
				<input className="w-full rounded-lg bg-slate-800/80 border border-white/10 px-4 py-2" placeholder="Email" type="email" value={email} onChange={e=>setEmail(e.target.value)} />
				<input className="w-full rounded-lg bg-slate-800/80 border border-white/10 px-4 py-2" placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
				<button className="btn btn-primary w-full" disabled={loading}>{loading? 'Signing in...' : 'Sign in'}</button>
			</form>
			<p className="mt-4 text-sm text-slate-400">No account? <Link to="/signup" className="text-primary-400">Create one</Link></p>
		</div>
	)
}