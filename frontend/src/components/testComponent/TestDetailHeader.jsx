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
		<div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-6">
			<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
				<div className="flex-1">
					<h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800">{test.title}</h1>
					<p className="text-gray-600 text-sm mt-2">{test.description}</p>
					{test.activeFor && (
						<p className={`text-xs sm:text-sm mt-2 ${testIsActive ? 'text-green-600' : 'text-red-600'}`}>
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
						className="flex-1 sm:flex-none px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition duration-200">
						✏️ Edytuj test
					</button>
					<button
						onClick={onBack}
						className="flex-1 sm:flex-none px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold rounded-lg transition duration-200">
						← Powrót
					</button>
				</div>
			</div>

			<div className="flex flex-wrap gap-4 text-sm items-center">
				<span
					className={`px-3 py-1 rounded-full font-semibold ${
						testIsActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
					}`}>
					{testIsActive ? '● Aktywny' : '● Nieaktywny'}
				</span>
				<span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 font-semibold">{questionsCount} Pytania</span>
				{test.singleChoice && (
					<span className="px-3 py-1 rounded-full bg-green-100 text-green-700 font-semibold">Jednokrotny wybór</span>
				)}
				{testIsActive && test.uniqueLink && (
					<button
						type="button"
						onClick={onCopyLink}
						className="ml-auto px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-xs sm:text-sm transition duration-200">
						📋 Kopiuj link do testu
					</button>
				)}
			</div>
		</div>
	)
}
