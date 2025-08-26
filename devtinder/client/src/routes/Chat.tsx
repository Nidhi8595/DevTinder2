import { useEffect, useRef, useState } from 'react'
import io, { Socket } from 'socket.io-client'
import axios from 'axios'

interface Message { _id?: string; senderId: string; receiverId: string; text: string; timestamp?: string }

export default function Chat() {
	const [connectionId, setConnectionId] = useState('')
	const [messages, setMessages] = useState<Message[]>([])
	const [text, setText] = useState('')
	const [typing, setTyping] = useState(false)
	const [presence, setPresence] = useState<Record<string, boolean>>({})
	const socketRef = useRef<Socket | null>(null)
	const myIdRef = useRef<string>(localStorage.getItem('devtinder_user_id') || 'me')

	useEffect(() => {
		const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000'
		const s = io(baseURL, { withCredentials: true, auth: { userId: myIdRef.current } })
		s.on('message', (m: Message) => {
			setMessages(prev => [...prev, m])
		})
		s.on('typing', ({ from, typing }: { from: string; typing: boolean }) => {
			if (from) setTyping(typing)
		})
		s.on('presence', ({ userId, online }: { userId: string; online: boolean }) => {
			setPresence(p => ({ ...p, [userId]: online }))
		})
		socketRef.current = s
		return () => { s.disconnect() }
	}, [])

	async function loadHistory() {
		if (!connectionId) return
		const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000'
		const res = await axios.get<Message[]>(`/chat/${connectionId}`, { baseURL, withCredentials: true })
		setMessages(res.data)
	}

	useEffect(() => { loadHistory() }, [connectionId])

	function send() {
		if (!text.trim() || !connectionId) return
		const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000'
		axios.post<Message>(`/chat/send`, { receiverId: connectionId, text }, { baseURL, withCredentials: true })
		setMessages(prev => [...prev, { senderId: myIdRef.current, receiverId: connectionId, text }])
		setText('')
	}

	return (
		<div className="grid grid-rows-[auto_1fr_auto] h-[70vh] card">
			<div className="p-4 border-b border-white/10 flex items-center gap-2">
				<input value={connectionId} onChange={e=>setConnectionId(e.target.value)} placeholder="Enter friend id" className="rounded bg-slate-800/80 border border-white/10 px-3 py-2" />
				<div className="text-sm text-slate-400">{presence[connectionId] ? 'Online' : 'Offline'}</div>
			</div>
			<div className="p-4 overflow-y-auto space-y-2">
				{messages.map((m, idx) => (
					<div key={idx} className={`max-w-[70%] ${m.senderId===myIdRef.current?'ml-auto text-right':''}`}>
						<div className={`inline-block rounded-2xl px-3 py-2 ${m.senderId===myIdRef.current?'bg-primary-600/80':'bg-white/10'}`}>{m.text}</div>
					</div>
				))}
				{typing && <div className="text-xs text-slate-400">typing...</div>}
			</div>
			<div className="p-4 border-t border-white/10 flex gap-2">
				<input value={text} onChange={e=>{setText(e.target.value); socketRef.current?.emit('typing',{to:connectionId, typing:true});}} onBlur={()=>socketRef.current?.emit('typing',{to:connectionId, typing:false})} placeholder="Type a message" className="flex-1 rounded bg-slate-800/80 border border-white/10 px-3 py-2" />
				<button className="btn btn-primary" onClick={send}>Send</button>
			</div>
		</div>
	)
}