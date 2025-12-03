import { useState, useEffect } from 'react'

export default function CreateTestModal({ isOpen, onClose, onTestCreated, onTestUpdated, editingTest, addToast }) {
	const [title, setTitle] = useState('')
	const [description, setDescription] = useState('')
	const [isActive, setIsActive] = useState(false)
	const [activeFor, setActiveFor] = useState('')
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState('')

	useEffect(() => {
		if (editingTest) {
			setTitle(editingTest.title)
			setDescription(editingTest.description)
			setIsActive(editingTest.isActive || false)
			if (editingTest.activeFor) {
				const raw = String(editingTest.activeFor)
				const value = raw.includes('T') ? raw.slice(0, 16) : `${raw}T00:00`
				setActiveFor(value)
			} else {
				setActiveFor('')
			}
		} else {
			setTitle('')
			setDescription('')
			setIsActive(false)
			setActiveFor('')
		}
		setError('')
	}, [editingTest, isOpen])

	const handleSubmit = async e => {
		e.preventDefault()
		setError('')

		if (!title.trim()) {
			const msg = 'Tytuł jest wymagany'
			setError(msg)
			addToast(msg, 'warning')
			return
		}

		setLoading(true)

		try {
			const token = localStorage.getItem('token')
			const method = editingTest ? 'PUT' : 'POST'
			const url = editingTest
				? `/api/test/${editingTest._id}`
				: '/api/test/new'

			const response = await fetch(url, {
				method,
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({
					title,
					description,
					isActive,
					date: activeFor,
				}),
			})

			if (!response.ok) {
				const data = await response.json()
				setError(data.message || 'Błąd podczas zapisywania testu')
				addToast(data.message || 'Błąd podczas zapisywania testu', 'error')
				return
			}

			const data = await response.json()

			if (editingTest) {
				addToast(data.message || 'Test zaktualizowany!', 'success')
				onTestUpdated(data)
			} else {
				addToast(data.message || 'Test utworzony!', 'success')
				onTestCreated(data)
			}

			setTitle('')
			setDescription('')
			setIsActive(false)
			setActiveFor('')
		} catch (err) {
			const errorMsg = 'Błąd sieci. Spróbuj ponownie.'
			setError(errorMsg)
			addToast(errorMsg, 'error')
			console.error('Error:', err)
		} finally {
			setLoading(false)
		}
	}

	if (!isOpen) return null

	return (
		<div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
			<div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-4 sm:p-6 lg:p-8 max-h-screen overflow-y-auto">
				<h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">
					{editingTest ? 'Edytuj test' : 'Utwórz nowy test'}
				</h2>

				{error && <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm">{error}</div>}

				<form onSubmit={handleSubmit} className="space-y-4">
					<div>
						<label htmlFor="title" className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
							Tytuł testu
						</label>
						<input
							id="title"
							type="text"
							value={title}
							onChange={e => setTitle(e.target.value)}
							className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm sm:text-base"
							placeholder="Wpisz tytuł testu"
							maxLength={100}
						/>
					</div>

					<div>
						<label htmlFor="description" className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
							Opis (opcjonalnie)
						</label>
						<textarea
							id="description"
							value={description}
							onChange={e => setDescription(e.target.value)}
							className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 resize-none text-sm sm:text-base"
							placeholder="Wpisz opis testu"
							rows="4"
							maxLength={500}
						/>
					</div>

					<div>
						<label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Status</label>
						<div className="flex items-center gap-3">
							<input
								id="isActive"
								type="checkbox"
								checked={isActive}
								onChange={e => setIsActive(e.target.checked)}
								className="w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-2 focus:ring-green-500 cursor-pointer"
							/>
							<label htmlFor="isActive" className="text-sm text-gray-700 cursor-pointer">
								Test aktywny
							</label>
						</div>
					</div>

					<div>
						<label htmlFor="activeFor" className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
							Data i godzina wygaśnięcia (opcjonalnie)
						</label>
						<input
							id="activeFor"
							type="datetime-local"
							value={activeFor}
							onChange={e => setActiveFor(e.target.value)}
							className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm sm:text-base"
						/>
						<p className="text-xs text-gray-500 mt-1">
							Wybierz datę i godzinę, do której test będzie dostępny. Pozostaw puste, aby link był ważny cały czas.
						</p>
						{activeFor && (
							<button
								type="button"
								onClick={() => setActiveFor('')}
								className="mt-2 text-xs text-red-600 underline hover:text-red-700">
								Usuń datę (test bez ograniczenia czasowego)
							</button>
						)}
					</div>

					<div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-6">
						<button
							type="button"
							onClick={onClose}
							className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 sm:py-2.5 text-sm sm:text-base rounded-lg transition duration-200">
							Anuluj
						</button>
						<button
							type="submit"
							disabled={loading}
							className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold py-2 sm:py-2.5 text-sm sm:text-base rounded-lg transition duration-200">
							{loading ? 'Zapisywanie...' : editingTest ? 'Zaktualizuj test' : 'Utwórz test'}
						</button>
					</div>
				</form>
			</div>
		</div>
	)
}
