import { useEffect, useState } from 'react'
import axios from 'axios'

interface ProfileData { id: string; name: string; bio?: string; skills: string[]; interests: string[]; profilePic?: string }

export default function Profile() {
	const [data, setData] = useState<ProfileData | null>(null)
	const [saving, setSaving] = useState(false)

	useEffect(() => {
		(async () => {
			try {
				const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000'
				const res = await axios.get(`/users/me`, { baseURL, withCredentials: true })
				setData(res.data)
			} catch {}
		})()
	}, [])

	async function save() {
		if (!data) return
		setSaving(true)
		try {
			const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000'
			await axios.put(`/users/${data.id}`, { name: data.name, bio: data.bio, skills: data.skills, interests: data.interests, profilePic: data.profilePic }, { baseURL, withCredentials: true })
		} finally { setSaving(false) }
	}

	if (!data) return <div className="card p-6">Loading profile...</div>
	return (
		<div className="card p-6 space-y-4">
			<div className="flex gap-4 items-center">
				<div className="h-16 w-16 rounded-full bg-white/10" />
				<input className="text-2xl font-bold bg-transparent" value={data.name} onChange={e=>setData({...data, name:e.target.value})} />
			</div>
			<textarea className="w-full rounded bg-slate-800/80 border border-white/10 p-3" placeholder="Bio" value={data.bio||''} onChange={e=>setData({...data, bio:e.target.value})} />
			<div>
				<label className="text-sm text-slate-400">Skills (comma separated)</label>
				<input className="w-full rounded bg-slate-800/80 border border-white/10 p-2" value={data.skills.join(', ')} onChange={e=>setData({...data, skills:e.target.value.split(',').map(s=>s.trim()).filter(Boolean)})} />
			</div>
			<div>
				<label className="text-sm text-slate-400">Interests (comma separated)</label>
				<input className="w-full rounded bg-slate-800/80 border border-white/10 p-2" value={data.interests.join(', ')} onChange={e=>setData({...data, interests:e.target.value.split(',').map(s=>s.trim()).filter(Boolean)})} />
			</div>
			<button className="btn btn-primary" onClick={save} disabled={saving}>{saving?'Saving...':'Save changes'}</button>
		</div>
	)
}