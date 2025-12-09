export default function TestDetailHeader({ test, questionsCount, onEditTest, onBack, onCopyLink }) {
	if (!test) return null

	const isCurrentlyActive = () => {
		if (!test.isActive) return false

		if (!test.activeFor) return true

		const now = new Date()
		const activeUntil = new Date(test.activeFor)
		return now <= activeUntil
	}

	const testIsActive = isCurrentlyActive()

	return (
		<div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-6 border border-neutral-200">
			<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
				<div className="flex-1">
					<h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800">{test.title}</h1>
					<p className="text-gray-600 text-sm mt-2">{test.description}</p>
					{test.activeFor && (
						<p className={`text-xs sm:text-sm mt-2 ${testIsActive ? 'text-neutral-800' : 'text-red-600'}`}>
							{testIsActive ? 'Aktywny do:' : 'Wygasł:'}{' '}
							{new Date(test.activeFor).toLocaleDateString('pl-PL', {
								year: 'numeric',
								month: 'short',
								day: 'numeric',
								hour: '2-digit',
								minute: '2-digit',
							})}
						</p>
					)}
				</div>
				<div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
					<button
						onClick={onEditTest}
						className="flex-1 sm:flex-none px-4 py-2 bg-black hover:bg-neutral-800 text-white font-semibold rounded-lg transition duration-200">
						✏️ Edytuj test
					</button>
					<button
						onClick={onBack}
						className="flex-1 sm:flex-none px-4 py-2 bg-white border border-neutral-300 hover:border-neutral-500 text-neutral-800 font-semibold rounded-lg transition duration-200">
						← Powrót
					</button>
				</div>
			</div>

			<div className="flex flex-wrap gap-4 text-sm items-center">
				<span
					className={`px-3 py-1 rounded-full font-semibold ${
						testIsActive ? 'bg-black text-white' : 'bg-neutral-200 text-neutral-700'
					}`}>
					{testIsActive ? '● Aktywny' : '● Nieaktywny'}
				</span>
				<span className="px-3 py-1 rounded-full bg-neutral-100 text-neutral-900 font-semibold border border-neutral-200">
					{questionsCount} Pytania
				</span>
				{test.singleChoice && (
					<span className="px-3 py-1 rounded-full bg-neutral-900 text-white font-semibold">Jednokrotny wybór</span>
				)}
				{testIsActive && test.uniqueLink && (
					<button
						type="button"
						onClick={onCopyLink}
						className="ml-auto px-4 py-2 bg-black hover:bg-neutral-800 text-white font-semibold rounded-lg text-xs sm:text-sm transition duration-200">
						📋 Kopiuj link do testu
					</button>
				)}
			</div>
		</div>
	)
}
