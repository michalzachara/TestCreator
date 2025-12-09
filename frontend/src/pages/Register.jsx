import { Link } from 'react-router-dom'
import { useRegisterForm } from '../hooks/auth/useRegisterForm'
import { useRegisterSubmission } from '../hooks/auth/useRegisterSubmission'

export default function Register({ addToast }) {
	const { formData, handleChange: updateField, resetForm } = useRegisterForm()
	const { loading, error, submitRegister } = useRegisterSubmission(addToast, resetForm)

	const handleChange = e => {
		const { name, value } = e.target
		updateField(name, value)
	}

	const handleSubmit = async e => {
		e.preventDefault()
		await submitRegister(formData)
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 flex items-center justify-center p-4">
			<div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center text-white">
				<div className="space-y-4 hidden lg:block">
					<p className="text-sm uppercase tracking-[0.3em] text-slate-200">Dołącz</p>
					<h1 className="text-4xl font-bold leading-tight">Załóż konto i zacznij tworzyć testy.</h1>
					<p className="text-slate-200/90 text-lg">Nowy wygląd, prostsza obsługa, pełna kontrola nad wynikami.</p>
				</div>
				<div className="w-full max-w-md mx-auto bg-white text-slate-900 rounded-2xl shadow-2xl border border-slate-200 p-8">
					<h1 className="text-3xl font-bold text-center text-slate-900 mb-8 tracking-tight">Rejestracja</h1>
					{error && <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">{error}</div>}{' '}
					<form onSubmit={handleSubmit} className="space-y-4">
						<div className="grid grid-cols-2 gap-4">
							<div>
								<label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
									Imię
								</label>
								<input
									id="name"
									type="text"
									name="name"
									value={formData.name}
									onChange={handleChange}
									required
									className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-800"
									placeholder="John"
								/>
							</div>

							<div>
								<label htmlFor="surname" className="block text-sm font-medium text-gray-700 mb-2">
									Nazwisko
								</label>
								<input
									id="surname"
									type="text"
									name="surname"
									value={formData.surname}
									onChange={handleChange}
									required
									className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-800"
									placeholder="Doe"
								/>
							</div>
						</div>

						<div>
							<label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
								Email
							</label>
							<input
								id="email"
								type="email"
								name="email"
								value={formData.email}
								onChange={handleChange}
								required
								className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-800"
								placeholder="your@email.com"
							/>
						</div>

						<div>
							<label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
								Hasło
							</label>
							<input
								id="password"
								type="password"
								name="password"
								value={formData.password}
								onChange={handleChange}
								required
								className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-800"
								placeholder="••••••••"
							/>
						</div>

						<div>
							<label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
								Potwierdź hasło
							</label>
							<input
								id="confirmPassword"
								type="password"
								name="confirmPassword"
								value={formData.confirmPassword}
								onChange={handleChange}
								required
								className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-800"
								placeholder="••••••••"
							/>
						</div>

						<button
							type="submit"
							disabled={loading}
							className="w-full bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 text-white font-semibold py-3 rounded-lg transition duration-200 mt-6">
							{loading ? 'Rejestruję...' : 'Rejestruj'}
						</button>
					</form>
					<p className="text-center text-gray-600 mt-6">
						Masz już konto?{' '}
						<Link to="/login" className="text-slate-900 hover:text-slate-700 font-semibold">
							Login
						</Link>
					</p>
				</div>
			</div>
		</div>
	)
}
