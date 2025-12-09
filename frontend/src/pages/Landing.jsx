import { useNavigate } from 'react-router-dom'

export default function Landing() {
	const navigate = useNavigate()
	return (
		<div className="min-h-screen flex items-center justify-center bg-white px-4">
			<div className="max-w-xl text-center">
				<p className="text-xl sm:text-5xl font-semibold text-neutral-900 tracking-tight">ZSTiB Testy</p>
				<button
					className="bg-black text-white px-5 py-3 rounded-full mt-10 hover:bg-neutral-800 transition shadow-sm"
					onClick={() => navigate('/login')}>
					Logowanie
				</button>
			</div>
		</div>
	)
}
