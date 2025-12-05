import { useQuestionForm } from '../../hooks/question/useQuestionForm'
import { useQuestionAnswers } from '../../hooks/question/useQuestionAnswers'
import { useQuestionMedia } from '../../hooks/question/useQuestionMedia'
import { useQuestionSubmission } from '../../hooks/question/useQuestionSubmission'

export default function QuestionForm({
	isOpen,
	onClose,
	onQuestionAdded,
	onQuestionUpdated,
	testId,
	editingQuestion,
	addToast,
}) {
	const { content, setContent, resetForm } = useQuestionForm(editingQuestion)
	const { answers, handleAnswerChange, addAnswer, removeAnswer, updateAnswer, resetAnswers } = useQuestionAnswers(
		editingQuestion,
		isOpen,
		addToast
	)
	const {
		imageFile,
		imagePreview,
		mediaType,
		youtubeUrl,
		setYoutubeUrl,
		handleMediaTypeChange,
		handleImageFileChange,
		resetMedia,
	} = useQuestionMedia(editingQuestion)
	const { loading, error, submitQuestion, uploadImage } = useQuestionSubmission(
		editingQuestion,
		testId,
		content,
		answers,
		mediaType,
		imageFile,
		imagePreview,
		youtubeUrl,
		addToast,
		onQuestionAdded,
		onQuestionUpdated,
		onClose,
		resetForm,
		resetAnswers,
		resetMedia
	)

	const handleAnswerImageUpload = async (index, file) => {
		if (!file) return
		const uploaded = await uploadImage(file)
		if (uploaded) {
			updateAnswer(index, {
				...answers[index],
				type: 'image',
				text: uploaded.url,
				imagePreview: uploaded.url,
			})
		}
	}

	const handleSubmit = async e => {
		e.preventDefault()
		await submitQuestion()
	}

	if (!isOpen) return null

	return (
		<div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
			<div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full p-4 sm:p-6 lg:p-8 my-8">
				{/* Header */}
				<div className="flex justify-between items-center mb-6">
					<h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
						{editingQuestion ? 'Edytuj pytanie' : '+ Dodaj pytanie'}
					</h2>
					<button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl">
						✕
					</button>
				</div>

				{error && <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm">{error}</div>}

				<form onSubmit={handleSubmit} className="space-y-6">
					{/* Question Content */}
					<div>
						<textarea
							value={content}
							onChange={e => setContent(e.target.value)}
							className="w-full px-4 py-3 text-lg border-b-2 border-gray-300 focus:border-green-500 focus:outline-none bg-gray-50 resize-none"
							placeholder="Wpisz swoje pytanie tutaj"
							rows="2"
							maxLength={500}
						/>
					</div>

					{/* Optional Media */}
					<div className="space-y-3">
						<p className="text-sm font-semibold text-gray-700">Dodatkowe media do pytania (opcjonalnie)</p>

						<div className="flex flex-wrap items-center gap-3 text-sm">
							<span className="text-gray-600">Typ:</span>
							<select
								value={mediaType}
								onChange={e => handleMediaTypeChange(e.target.value)}
								className="border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-green-500">
								<option value="none">Brak</option>
								<option value="image">Obraz</option>
								<option value="youtube">YouTube</option>
							</select>
						</div>

						{mediaType === 'image' && (
							<div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
								<input
									type="file"
									accept="image/*"
									onChange={e => handleImageFileChange(e.target.files?.[0])}
									className="text-sm"
								/>
								{imagePreview && (
									<img
										src={imagePreview}
										alt="Podgląd pytania"
										className="mt-2 sm:mt-0 max-h-32 rounded border border-gray-200 object-contain"
									/>
								)}
							</div>
						)}

						{mediaType === 'youtube' && (
							<div className="space-y-2">
								<input
									type="text"
									value={youtubeUrl}
									onChange={e => setYoutubeUrl(e.target.value)}
									placeholder="Wklej link do YouTube (np. https://www.youtube.com/watch?v=...)"
									className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
								/>
								{youtubeUrl.trim() && (
									<div className="aspect-video w-full rounded border border-gray-200 overflow-hidden bg-black">
										<iframe
											title="Podgląd filmu YouTube"
											src={youtubeUrl}
											className="w-full h-full"
											allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
											allowFullScreen
										/>
									</div>
								)}
							</div>
						)}
					</div>

					{/* Answers Section */}
					<div className="space-y-3">
						<p className="text-sm font-semibold text-gray-700">Odpowiedzi</p>
						{answers.map((answer, index) => (
							<div key={index} className="flex flex-col gap-2 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
								<div className="flex items-start gap-3">
									{/* Checkbox for marking correct answer */}
									<div className="shrink-0 pt-1">
										<input
											type="checkbox"
											checked={answer.isCorrect}
											onChange={e => handleAnswerChange(index, 'isCorrect', e.target.checked)}
											className="w-5 h-5 text-green-600 rounded cursor-pointer"
										/>
									</div>

									<div className="flex-1 space-y-2">
										{/* Typ odpowiedzi */}
										<div className="flex items-center gap-2 text-xs text-gray-600">
											<span>Typ odpowiedzi:</span>
											<select
												value={answer.type || 'text'}
												onChange={e => handleAnswerChange(index, 'type', e.target.value)}
												className="border border-gray-300 rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-green-500">
												<option value="text">Tekst</option>
												<option value="image">Obraz</option>
											</select>
										</div>

										{/* Answer Input or Image */}
										{(answer.type || 'text') === 'text' ? (
											<input
												type="text"
												value={answer.text}
												onChange={e => handleAnswerChange(index, 'text', e.target.value)}
												className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
												placeholder={`Opcja ${String.fromCharCode(65 + index)}`}
												maxLength={200}
											/>
										) : (
											<div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
												<input
													type="file"
													accept="image/*"
													onChange={e => handleAnswerImageUpload(index, e.target.files?.[0])}
													className="text-xs"
												/>
												{answer.imagePreview && (
													<img
														src={answer.imagePreview}
														alt={`Podgląd odpowiedzi ${String.fromCharCode(65 + index)}`}
														className="mt-2 sm:mt-0 max-h-20 rounded border border-gray-200 object-contain bg-white"
													/>
												)}
											</div>
										)}
									</div>

									{/* Delete Button */}
									{answers.length > 2 && (
										<button
											type="button"
											onClick={() => removeAnswer(index)}
											className="shrink-0 p-2 text-red-500 hover:bg-red-50 rounded transition self-start">
											✕
										</button>
									)}
								</div>
							</div>
						))}

						{/* Add Answer Button */}
						<button
							type="button"
							onClick={addAnswer}
							className="w-full py-3 text-green-600 hover:bg-green-50 rounded-lg font-semibold transition border-2 border-dashed border-green-300">
							+ Dodaj odpowiedź
						</button>
					</div>

					{/* Action Buttons */}
					<div className="flex flex-col sm:flex-row gap-3 justify-end pt-6 border-t border-gray-200">
						<button
							type="button"
							onClick={onClose}
							className="px-6 py-2.5 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-lg font-semibold transition">
							Anuluj
						</button>
						<button
							type="submit"
							disabled={loading}
							className="px-6 py-2.5 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold rounded-lg transition">
							{loading ? 'Zapisywanie...' : editingQuestion ? 'Zaktualizuj' : 'Zapisz'}
						</button>
					</div>
				</form>
			</div>
		</div>
	)
}
