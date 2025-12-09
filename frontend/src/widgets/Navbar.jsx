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
		<nav className="bg-white/95 backdrop-blur border-b border-neutral-200 text-neutral-900 shadow-sm">
			<div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
				<h1
					className="text-2xl font-bold cursor-pointer tracking-tight hover:text-neutral-600 transition"
					onClick={() => navigate('/panel')}>
					ZSTiB Testy
				</h1>
				<div className="flex items-center gap-4">
					{hideAuthActions ? (
						<span className="text-sm text-neutral-500">Tryb publiczny</span>
					) : (
						<>
							<span className="text-sm sm:text-base font-medium text-neutral-700">{user.name}</span>
							<button
								onClick={handleLogout}
								className="bg-black text-white hover:bg-neutral-800 px-4 py-2 rounded-full transition duration-200 shadow-sm">
								Wyloguj
							</button>
						</>
					)}
				</div>
			</div>
		</nav>
	)
}
