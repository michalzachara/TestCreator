export default function AnswerQuestionCard({ q, index }) {
	if (!q) return null

	const isQuestionCorrect = q.isCorrect

	return (
		<div
			className={`border-2 rounded-xl p-4 sm:p-5 ${
				isQuestionCorrect ? 'border-neutral-900 bg-neutral-50' : 'border-red-200 bg-red-50'
			}`}>
			{/* Nagłówek pytania */}
			<div className="flex items-start gap-3 mb-4">
				<div className={`text-2xl ${isQuestionCorrect ? 'text-neutral-900' : 'text-red-600'}`}>
					{isQuestionCorrect ? '✓' : '✗'}
				</div>

				<div className="flex-1">
					<p className="font-semibold text-gray-800 wrap-break-word">
						Pytanie {index + 1}: {q.title}
					</p>
					<p className="text-xs text-gray-500 mt-1">
						{isQuestionCorrect ? 'Odpowiedź poprawna' : 'Odpowiedź niepoprawna'}
					</p>
				</div>
			</div>

			{/* Opcjonalny obraz do pytania */}
			{q.media &&
				q.media.length > 0 &&
				(() => {
					const img = q.media.find(m => m.type === 'image' && m.url)
					if (!img) return null
					return (
						<div className="mb-4">
							<img
								src={img.url}
								alt={`Obraz do pytania ${index + 1}`}
								className="w-full max-h-64 object-contain rounded border border-gray-200 bg-gray-50"
							/>
						</div>
					)
				})()}

			{/* Odpowiedzi */}
			<div className="space-y-3">
				{q.answers.map((ansOption, aIdx) => {
					const isSelected = q.selectedAnswers.includes(aIdx)
					const isCorrect = q.correctAnswers.includes(aIdx)
					const isImage = ansOption.type === 'image'

					return (
						<div
							key={aIdx}
							className={`flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-3 py-3 rounded-lg border text-sm 
													${isCorrect ? 'border-neutral-900 bg-neutral-50' : 'border-gray-200 bg-gray-50'}`}>
							<div className="flex items-start gap-2 flex-1">
								<span className="font-semibold text-gray-700">{String.fromCharCode(65 + aIdx)}.</span>
								{isImage ? (
									<img
										src={ansOption.content}
										alt={`Odpowiedź ${String.fromCharCode(65 + aIdx)}`}
										className="max-h-40 w-full object-contain rounded border border-gray-200 bg-white"
									/>
								) : (
									<span className="text-gray-800 wrap-break-word">{ansOption.content}</span>
								)}
							</div>

							<div className="flex gap-2 flex-wrap sm:justify-end">
								{isCorrect && <span className="text-xs font-bold text-neutral-900">POPRAWNA</span>}
								{isSelected && <span className="text-xs font-semibold text-neutral-700">ZAZNACZONA</span>}
							</div>
						</div>
					)
				})}
			</div>
		</div>
	)
}
