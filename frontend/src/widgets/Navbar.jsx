import { useNavigate } from 'react-router-dom'

export default function Navbar({ hideAuthActions = false }) {
	const navigate = useNavigate()
	const user = JSON.parse(localStorage.getItem('user') || '{}')

	const handleLogout = () => {
		localStorage.removeItem('token')
		localStorage.removeItem('user')
		navigate('/')
	}

	return (
		<nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200/80 shadow-md">
			<div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
				<h1
					className="text-2xl font-bold cursor-pointer tracking-tight text-slate-900 hover:text-slate-700 transition"
					onClick={() => navigate('/panel')}>
					ZSTiB Testy
				</h1>
				<div className="flex items-center gap-3 sm:gap-4">
					{hideAuthActions ? (
						<span className="text-sm text-slate-500">Tryb publiczny</span>
					) : (
						<>
							<span className="text-sm sm:text-base font-semibold text-slate-700 bg-slate-100 border border-slate-200 px-3 py-1 rounded-full">
								{user.name}
							</span>
							<button
								onClick={handleLogout}
								className="bg-slate-900 text-white hover:bg-slate-800 px-4 py-2 rounded-full transition duration-200 shadow-sm">
								Wyloguj
							</button>
						</>
					)}
				</div>
			</div>
		</nav>
	)
}
