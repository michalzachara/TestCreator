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
		<nav className="bg-green-600 text-white shadow-lg">
			<div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
				<h1 className="text-2xl font-bold cursor-pointer" onClick={() => navigate('/panel')}>
					ZSTiB Testy
				</h1>
				<div className="flex items-center gap-4">
					{hideAuthActions ? (
						<span className="text-sm opacity-80">Tryb publiczny</span>
					) : (
						<>
							<span>
								{user.name}
							</span>
							<button
								onClick={handleLogout}
								className="bg-red-400 hover:bg-red-500 px-4 py-2 rounded-lg transition duration-300">
								Wyloguj
							</button>
						</>
					)}
				</div>
			</div>
		</nav>
	)
}
