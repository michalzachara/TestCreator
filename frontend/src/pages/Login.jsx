import { useLoginForm } from '../hooks/auth/useLoginForm'
import { useLoginSubmission } from '../hooks/auth/useLoginSubmission'

export default function Login({ addToast }) {
	const { email, setEmail, password, setPassword, resetForm } = useLoginForm()
	const { loading, error, submitLogin } = useLoginSubmission(addToast, resetForm)

	const handleSubmit = async e => {
		e.preventDefault()
		await submitLogin(email, password)
	}

	return (
		<div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
			<div className="w-full max-w-md">
				<div className="bg-white rounded-lg shadow-2xl p-8">
					<h1 className="text-3xl font-bold text-center text-green-600 mb-8">Logowanie</h1>

					{error && <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">{error}</div>}

					<form onSubmit={handleSubmit} className="space-y-6">
						<div>
							<label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
								Email
							</label>
							<input
								id="email"
								type="email"
								value={email}
								onChange={e => setEmail(e.target.value)}
								required
								className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
								placeholder="twoj@email.com"
							/>
						</div>

						<div>
							<label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
								Hasło
							</label>
							<input
								id="password"
								type="password"
								value={password}
								onChange={e => setPassword(e.target.value)}
								required
								className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
								placeholder="••••••••"
							/>
						</div>

						<button
							type="submit"
							disabled={loading}
							className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold py-2 rounded-lg transition duration-200">
							{loading ? 'Logowanie...' : 'Logowanie'}
						</button>
					</form>
				</div>
			</div>
		</div>
	)
}
