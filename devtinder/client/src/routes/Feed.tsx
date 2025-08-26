import { useEffect, useState } from 'react'
import { motion, useMotionValue, useTransform, AnimatePresence } from 'framer-motion'
import axios from 'axios'

interface UserCard {
	_id: string
	name: string
	bio?: string
	skills: string[]
	interests: string[]
	profilePic?: string
}

export default function Feed() {
	const [cards, setCards] = useState<UserCard[]>([])
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		(async () => {
			try {
				const res = await axios.get<UserCard[]>(`/users/devs`, { baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000', withCredentials: true })
				setCards(res.data)
			} catch {}
			setLoading(false)
		})()
	}, [])

	return (
		<div className="grid place-items-center">
			<div className="relative h-[520px] w-[360px]">
				{loading && <div className="card absolute inset-0 grid place-items-center">Loading...</div>}
				<AnimatePresence>
					{cards.map((c, i) => (
						<SwipeCard key={c._id} user={c} onSwipe={(dir)=>{
							setCards(prev => prev.filter(x => x._id !== c._id))
							// TODO: integrate like/dislike endpoints if needed. For now, friend request on right swipe
							if (dir==='right') axios.post(`/users/${c._id}/friend-request`, {}, { baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000', withCredentials: true }).catch(()=>{})
						}} index={i} />
					))}
				</AnimatePresence>
			</div>
		</div>
	)
}

function SwipeCard({ user, onSwipe, index }:{ user: UserCard; onSwipe:(d:'left'|'right')=>void; index:number }) {
	const x = useMotionValue(0)
	const rotate = useTransform(x, [-200, 0, 200], [-15, 0, 15])
	const opacity = useTransform(x, [-200, 0, 200], [0, 1, 0])
	return (
		<motion.div
			className="absolute inset-0 card overflow-hidden"
			style={{ x, rotate, opacity, zIndex: index+1 }}
			drag="x"
			dragConstraints={{ left: 0, right: 0 }}
			onDragEnd={(_, info)=>{
				if (info.offset.x > 120) onSwipe('right')
				else if (info.offset.x < -120) onSwipe('left')
			}}
			initial={{ scale: 0.95, y: 20, opacity: 0 }}
			animate={{ scale: 1, y: 0, opacity: 1 }}
			exit={{ opacity: 0, scale: 0.9 }}
			transition={{ type: 'spring', stiffness: 200, damping: 20 }}
		>
			<div className="h-48 bg-gradient-to-br from-slate-800 to-slate-700" />
			<div className="p-4 space-y-2">
				<div className="text-xl font-bold">{user.name}</div>
				{user.bio && <div className="text-slate-300 text-sm line-clamp-3">{user.bio}</div>}
				<div className="flex flex-wrap gap-2">
					{user.skills?.slice(0,5).map(s => <span key={s} className="px-2 py-1 rounded-full bg-white/10 text-xs">{s}</span>)}
				</div>
			</div>
		</motion.div>
	)
}