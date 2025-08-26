import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function Landing() {
	return (
		<div className="relative overflow-hidden">
			<div className="pointer-events-none absolute inset-0 -z-10">
				<div className="absolute -top-32 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-primary-600/20 blur-3xl" />
				<div className="absolute -bottom-32 right-1/4 h-96 w-96 rounded-full bg-fuchsia-600/20 blur-3xl" />
			</div>
			<section className="text-center py-24">
				<motion.h1 initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:0.6}} className="text-5xl md:text-6xl font-black tracking-tight">
					Find your next coding buddy 🚀
				</motion.h1>
				<motion.p initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.1,duration:0.6}} className="mt-4 text-lg text-slate-300">
					Great code is born from great connections.
				</motion.p>
				<motion.p initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.2,duration:0.6}} className="text-slate-400">
					Swipe right on your next coding buddy.
				</motion.p>
				<div className="mt-10 flex items-center justify-center gap-3">
					<Link to="/signup" className="btn btn-primary">Get Started</Link>
					<Link to="/login" className="btn border border-white/10 hover:border-white/20">I already have an account</Link>
				</div>
			</section>
		</div>
	)
}