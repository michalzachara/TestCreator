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
		<div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
			<div className="w-full max-w-md">
				<div className="bg-white rounded-lg shadow-2xl p-8">
					<h1 className="text-3xl font-bold text-center text-green-600 mb-8">Rejestracja</h1>
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
									className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
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
									className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
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
								className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
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
								className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
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
								className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
								placeholder="••••••••"
							/>
						</div>

						<button
							type="submit"
							disabled={loading}
							className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold py-2 rounded-lg transition duration-200 mt-6">
							{loading ? 'Rejestruję...' : 'Rejestruj'}
						</button>
					</form>
					<p className="text-center text-gray-600 mt-6">
						Masz już konto?{' '}
						<Link to="/login" className="text-green-600 hover:text-green-700 font-semibold">
							Login
						</Link>
					</p>
				</div>
			</div>
		</div>
	)
}
