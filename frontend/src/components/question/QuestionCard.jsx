import { useState } from 'react'

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

export default function QuestionCard({ question, index, onEdit, onDelete, addToast }) {
	const [deleting, setDeleting] = useState(false)
	const [confirming, setConfirming] = useState(false)

	const handleConfirmDelete = async () => {
		setDeleting(true)

		try {
			const token = localStorage.getItem('token')
			const response = await fetch(`/api/question/${question._id}`, {
				method: 'DELETE',
				headers: {
					Authorization: `Bearer ${token}`,
				},
			})

			if (!response.ok) {
				const data = await response.json()
				addToast(data.message || 'Błąd podczas usuwania pytania', 'error')
				return
			}

			onDelete(question._id)
			addToast('Pytanie zostało usunięte', 'success')
		} catch (err) {
			addToast('Błąd sieci. Spróbuj ponownie.', 'error')
			console.error('Error:', err)
		} finally {
			setDeleting(false)
			setConfirming(false)
		}
	}

	return (
		<div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden border-l-4 border-black">
			<div className="p-4 sm:p-6">
				{/* Question Header */}
				<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
					<h3 className="text-lg sm:text-xl font-bold text-gray-800">
						<span className="text-neutral-900">Q{index}.</span> {question.title}
					</h3>
					<div className="flex gap-2 w-full sm:w-auto">
						<button
							onClick={() => onEdit(question)}
							className="flex-1 sm:flex-none px-3 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-900 font-semibold text-sm rounded-lg transition duration-200 border border-neutral-200">
							✏️ Edytuj
						</button>
						<button
							onClick={() => setConfirming(true)}
							disabled={deleting}
							className="flex-1 sm:flex-none px-3 py-2 bg-red-50 hover:bg-red-100 disabled:bg-neutral-100 text-red-700 disabled:text-gray-500 font-semibold text-sm rounded-lg transition duration-200 border border-red-200">
							🗑️ Usuń
						</button>
					</div>
				</div>

				{/* Optional Media */}
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
										alt="Obraz do pytania"
										className="w-full max-h-64 object-contain rounded border border-gray-200 bg-gray-50"
									/>
								</div>
							)
						}

						if (yt) {
							return (
								<div className="mb-4 aspect-video w-full rounded border border-gray-200 overflow-hidden bg-black">
									<iframe
										title={`Wideo do pytania ${index}`}
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

				{confirming && (
					<div className="mb-4 mt-2 p-3 rounded-lg border border-red-200 bg-red-50 flex flex-col sm:flex-row items-start sm:items-center gap-3">
						<div className="text-red-600 font-semibold text-sm flex-1">
							Czy na pewno chcesz usunąć to pytanie? Tej operacji nie można cofnąć.
						</div>
						<div className="flex gap-2 w-full sm:w-auto">
							<button
								type="button"
								onClick={() => setConfirming(false)}
								className="flex-1 sm:flex-none px-3 py-1.5 rounded-lg border border-gray-300 text-gray-700 text-xs font-semibold hover:bg-gray-50 transition">
								Anuluj
							</button>
							<button
								type="button"
								onClick={handleConfirmDelete}
								disabled={deleting}
								className="flex-1 sm:flex-none px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white text-xs font-semibold transition">
								{deleting ? 'Usuwanie...' : 'Usuń'}
							</button>
						</div>
					</div>
				)}

				{/* Answers */}
				<div className="space-y-2">
					<p className="text-sm font-semibold text-gray-700 mb-3">Odpowiedzi:</p>
					{question.answers && question.answers.length > 0 ? (
						<div className="space-y-2">
							{question.answers.map((answer, idx) => {
								const isCorrect = question.correctAnswers && question.correctAnswers.includes(idx)
								const isImage = answer.type === 'image'
								return (
									<div
										key={idx}
									className={`p-3 rounded-lg border-2 text-sm ${
										isCorrect
											? 'bg-neutral-900 border-neutral-900 text-white'
												: 'bg-gray-50 border-gray-300 text-gray-700'
									}`}>
										<div className="flex items-center gap-2">
											{isCorrect && <span className="text-lg">✓</span>}
											{isImage ? (
												<img
													src={answer.content}
													alt={`Odpowiedź ${idx + 1}`}
													className="max-h-40 w-full object-contain rounded border border-gray-200 bg-white"
												/>
											) : (
												<span>{answer.content || answer}</span>
											)}
											{isCorrect && <span className="ml-auto text-xs font-bold text-white">POPRAWNA</span>}
										</div>
									</div>
								)
							})}
						</div>
					) : (
						<p className="text-gray-500 text-sm italic">Brak odpowiedzi</p>
					)}
				</div>
			</div>
		</div>
	)
}
