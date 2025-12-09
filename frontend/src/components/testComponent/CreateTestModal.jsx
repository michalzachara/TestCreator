import { useTestForm } from '../../hooks/testComponent/useTestForm'
import { useTestFormSubmission } from '../../hooks/testComponent/useTestFormSubmission'

export default function CreateTestModal({ isOpen, onClose, onTestCreated, onTestUpdated, editingTest, addToast }) {
	const {
		title,
		setTitle,
		description,
		setDescription,
		isActive,
		setIsActive,
		activeFor,
		setActiveFor,
		singleChoice,
		setSingleChoice,
		resetForm,
	} = useTestForm(editingTest, isOpen)
	const { loading, error, submitTest } = useTestFormSubmission(
		editingTest,
		addToast,
		onTestCreated,
		onTestUpdated,
		resetForm
	)

	const handleSubmit = async e => {
		e.preventDefault()
		await submitTest({
			title,
			description,
			isActive,
			activeFor,
			singleChoice,
		})
	}

	if (!isOpen) return null

	return (
		<div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4 py-6 overflow-hidden">
			<div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-4 sm:p-6 lg:p-8 max-h-[90vh] overflow-y-auto">
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
							className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-800 text-sm sm:text-base"
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
							className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-800 resize-none text-sm sm:text-base"
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
								className="w-5 h-5 text-neutral-900 border-gray-300 rounded focus:ring-2 focus:ring-neutral-800 cursor-pointer"
							/>
							<label htmlFor="isActive" className="text-sm text-gray-700 cursor-pointer">
								Test aktywny
							</label>
						</div>
					</div>

					<div>
						<label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Tryb odpowiedzi</label>
						<div className="flex items-start gap-3">
							<input
								id="singleChoice"
								type="checkbox"
								checked={singleChoice}
								onChange={e => setSingleChoice(e.target.checked)}
								className="w-5 h-5 mt-0.5 text-neutral-900 border-gray-300 rounded focus:ring-2 focus:ring-neutral-800 cursor-pointer"
							/>
							<div>
								<label htmlFor="singleChoice" className="text-sm text-gray-700 cursor-pointer font-semibold block">
									Jednokrotny wybór
								</label>
								<p className="text-xs text-gray-500">
									W tym teście każde pytanie może mieć zaznaczoną tylko jedną poprawną odpowiedź i uczestnik może
									wybrać tylko jedną opcję.
								</p>
							</div>
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
							className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-800 text-sm sm:text-base"
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
							className="flex-1 bg-white border border-neutral-300 hover:border-neutral-500 text-neutral-800 font-semibold py-2 sm:py-2.5 text-sm sm:text-base rounded-lg transition duration-200">
							Anuluj
						</button>
						<button
							type="submit"
							disabled={loading}
							className="flex-1 bg-black hover:bg-neutral-800 disabled:bg-neutral-300 text-white font-semibold py-2 sm:py-2.5 text-sm sm:text-base rounded-lg transition duration-200">
							{loading ? 'Zapisywanie...' : editingTest ? 'Zaktualizuj test' : 'Utwórz test'}
						</button>
					</div>
				</form>
			</div>
		</div>
	)
}
