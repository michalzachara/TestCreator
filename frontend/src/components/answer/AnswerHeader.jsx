import { useMemo } from 'react'

export default function AnswerHeader({ data, onBack }) {
	const { percentage, isGood, submitted } = useMemo(() => {
		if (!data) {
			return { percentage: '0.0', isGood: false, submitted: '' }
		}

		const perc = Number(data.percentage || 0)
		const submittedStr = data.submittedAt
			? new Date(data.submittedAt).toLocaleString('pl-PL', {
					year: 'numeric',
					month: '2-digit',
					day: '2-digit',
					hour: '2-digit',
					minute: '2-digit',
			  })
			: ''

		return {
			percentage: perc.toFixed(1),
			isGood: perc >= 50,
			submitted: submittedStr,
		}
	}, [data])

	if (!data) return null

	return (
		<div className="bg-white rounded-xl shadow-md p-5 sm:p-8 mb-6">
			{/* Górna linia: tytuł + przycisk powrotu */}
			<div className="flex items-center justify-between mb-6">
				<h1 className="text-2xl sm:text-3xl font-bold text-gray-800">{data.test?.title || 'Test'}</h1>

				<button
					onClick={onBack}
					className="px-4 py-2 text-sm bg-gray-100 border border-gray-300 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition">
					← Wróć
				</button>
			</div>

			{/* Dane ucznia + wynik */}
			<div className="flex flex-col sm:flex-row justify-between gap-6">
				{/* Dane ucznia */}
				<div className="flex-1">
					<p className="text-gray-800 text-lg sm:text-xl font-semibold mb-1">
						{data.name} {data.surname}
						<span className="ml-2 px-2 py-0.5 text-xs bg-gray-200 rounded-md text-gray-700">{data.classType}</span>
					</p>

					{submitted && <p className="text-xs text-gray-500 mt-1">Wysłano: {submitted}</p>}
				</div>

				{/* Wynik */}
				<div className="flex flex-col items-start sm:items-end gap-3">
					<div
						className={`px-5 py-3 rounded-xl text-center w-full sm:w-auto ${
							isGood ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
						}`}>
						<p className="text-3xl sm:text-4xl font-bold">{percentage}%</p>
						<p className="text-xs font-semibold">
							{data.score} / {data.maxScore} pkt
						</p>
					</div>
				</div>
			</div>
		</div>
	)
}
