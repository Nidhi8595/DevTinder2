import { Link, useLocation } from 'react-router-dom'

export default function App({ children }: { children?: React.ReactNode }) {
	const location = useLocation()
	const tabs = [
		{ to: '/feed', label: 'Feed' },
		{ to: '/chat', label: 'Chat' },
		{ to: '/profile', label: 'Profile' },
	]
	return (
		<div className="min-h-screen">
			<nav className="sticky top-0 z-50 backdrop-blur bg-slate-900/60 border-b border-white/10">
				<div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
					<Link to="/" className="font-black text-xl">DevTinder</Link>
					<div className="flex items-center gap-2">
						{tabs.map(t => {
							const active = location.pathname===t.to
							return (
								<Link key={t.to} to={t.to} className={`btn ${active? 'btn-primary' : 'border border-white/10 hover:border-white/20'}`}>
									{t.label}
								</Link>
							)
						})}
					</div>
				</div>
			</nav>
			<main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
		</div>
	)
}
