import { useNavigate } from 'react-router-dom'

export default function Landing() {
	const navigate = useNavigate()
	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
			<div className="max-w-xl text-center">
				<p className="text-xl sm:text-5xl font-semibold text-green-700">ZSTiB Testy</p>
				<button className="bg-green-700 text-white px-4 py-2 rounded-md mt-10" onClick={() => navigate('/login')}>
					Logowanie
				</button>
			</div>
		</div>
	)
}
