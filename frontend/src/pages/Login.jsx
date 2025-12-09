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
		<div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 flex items-center justify-center p-4">
			<div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center text-white">
				<div className="space-y-4 hidden lg:block">
					<p className="text-sm uppercase tracking-[0.3em] text-slate-200">ZSTiB Testy</p>
					<h1 className="text-4xl font-bold leading-tight">Witaj ponownie!</h1>
					<p className="text-slate-200/90 text-lg">
						Wejdź do panelu, twórz testy i analizuj wyniki w nowoczesnym interfejsie.
					</p>
				</div>
				<div className="w-full max-w-md mx-auto bg-white text-slate-900 rounded-2xl shadow-2xl border border-slate-200 p-8">
					<h1 className="text-3xl font-bold text-center text-slate-900 mb-8 tracking-tight">Logowanie</h1>

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
								className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-800"
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
								className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-800"
								placeholder="••••••••"
							/>
						</div>

						<button
							type="submit"
							disabled={loading}
							className="w-full bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 text-white font-semibold py-3 rounded-lg transition duration-200">
							{loading ? 'Logowanie...' : 'Logowanie'}
						</button>
					</form>
				</div>
			</div>
		</div>
	)
}
