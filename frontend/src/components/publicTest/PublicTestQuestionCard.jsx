const getYouTubeEmbedUrl = url => {
	if (!url) return ''
	try {
		const u = new URL(url)
		let videoId = ''

		if (u.hostname.includes('youtu.be')) {
			videoId = u.pathname.slice(1)
		} else if (u.searchParams.get('v')) {
			videoId = u.searchParams.get('v')
		}

		if (!videoId) return url

		return `https://www.youtube.com/embed/${videoId}`
	} catch {
		return url
	}
}

export default function PublicTestQuestionCard({
	question,
	index,
	answerRecord,
	hasError,
	onAnswerChange,
	singleChoice = false,
}) {
	if (!question) return null

	return (
		<div
			className={`bg-white rounded-lg shadow-md p-6 sm:p-8 border-b-2 ${
				hasError ? 'border-b-4 border-red-500' : 'border-transparent'
			}`}>
			<h3 className="text-lg sm:text-xl font-bold mb-3 text-gray-800">
				Q{index + 1}. {question.title}
			</h3>

			{question.media &&
				question.media.length > 0 &&
				(() => {
					const img = question.media.find(m => m.type === 'image' && m.url)
					const yt = question.media.find(m => m.type === 'youtube' && m.url)

					if (img) {
						return (
							<div className="mb-4">
								<img
									src={img.url}
									alt={`Obraz do pytania ${index + 1}`}
									className="w-full max-h-112 object-contain rounded border border-gray-200 bg-gray-50"
								/>
							</div>
						)
					}

					if (yt) {
						return (
							<div className="mb-4 aspect-video w-full rounded border border-gray-200 overflow-hidden bg-black">
								<iframe
									title={`Wideo do pytania ${index + 1}`}
									src={getYouTubeEmbedUrl(yt.url)}
									className="w-full h-full"
									allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
									allowFullScreen
								/>
							</div>
						)
					}

					return null
				})()}

			<div className="space-y-3">
				{singleChoice && <p className="text-xs text-green-700 font-semibold">Wybierz jedną odpowiedź</p>}
				{question.answers.map((answer, aIdx) => {
					const isSelected = answerRecord?.selectedAnswers.includes(aIdx) || false
					const isImage = answer.type === 'image'
					return (
						<div key={aIdx}>
							<button
								type="button"
								onClick={() => onAnswerChange(index, aIdx, !isSelected)}
								className={`w-full text-left px-4 py-3 rounded-lg border transition cursor-pointer ${
									isSelected
										? 'border-2 border-green-500 bg-white shadow-sm'
										: 'border border-gray-300 bg-gray-50 hover:bg-gray-100 hover:border-gray-400'
								}`}>
								<span className="font-semibold text-green-600">{String.fromCharCode(65 + aIdx)}.</span>
								{isImage ? (
									<img
										src={answer.content}
										alt={`Odpowiedź ${String.fromCharCode(65 + aIdx)}`}
										className="mt-2 max-h-96 w-full object-contain rounded border border-gray-200 bg-white"
									/>
								) : (
									<span className="ml-2 text-gray-800">{answer.content}</span>
								)}
							</button>
						</div>
					)
				})}
			</div>
		</div>
	)
}
