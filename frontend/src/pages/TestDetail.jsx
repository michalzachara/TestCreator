import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import QuestionForm from '../components/question/QuestionForm'
import CreateTestModal from '../components/testComponent/CreateTestModal'
import TestDetailHeader from '../components/testComponent/TestDetailHeader'
import TestQuestionList from '../components/testComponent/TestQuestionList'
import TestAnswersSummary from '../components/testComponent/TestAnswersSummary'
import { useTestDetail } from '../hooks/useTestDetail'
import { useTestAnswers } from '../hooks/useTestAnswers'
import { useQuestions } from '../hooks/useQuestions'
import { useQuestionForm } from '../hooks/useQuestionForm'
import { useTestModal } from '../hooks/useTestModal'
import { useAnswersFilters } from '../hooks/useAnswersFilters'

export default function TestDetail({ addToast }) {
	const { testId } = useParams()
	const navigate = useNavigate()

	const { test, loading, updateTest } = useTestDetail(testId, addToast)
	const { answers, loadingAnswers } = useTestAnswers(testId, addToast)
	const {
		questions,
		handleQuestionAdded: onQuestionAdded,
		handleQuestionUpdated: onQuestionUpdated,
		handleQuestionDeleted,
		setQuestionsFromTest,
	} = useQuestions([], addToast)
	const { showQuestionForm, editingQuestion, openForm, openFormForEdit, closeForm, handleQuestionSubmit } =
		useQuestionForm()
	const { showTestModal, openModal, closeModal, handleTestUpdated: modalHandleUpdated } = useTestModal(addToast)
	const { answersSortBy, setAnswersSortBy, answersSearch, setAnswersSearch, answersPage, setAnswersPage } =
		useAnswersFilters()

	useEffect(() => {
		if (test?.questions) {
			setQuestionsFromTest(test.questions)
		}
	}, [test, setQuestionsFromTest])

	const handleQuestionAdded = newQuestion => {
		onQuestionAdded(newQuestion)
		handleQuestionSubmit()
	}

	const handleQuestionUpdated = updatedQuestion => {
		onQuestionUpdated(updatedQuestion)
		handleQuestionSubmit()
	}

	const handleTestUpdated = updatedTest => {
		updateTest(updatedTest)
		modalHandleUpdated(updatedTest)
	}

	const copyLinkToClipboard = () => {
		if (!test?.uniqueLink) return
		const testLink = `${window.location.origin}/test-link/${test.uniqueLink}`
		navigator.clipboard.writeText(testLink)
		addToast('Link testu skopiowany do schowka!', 'success')
	}

	const goToResults = () => {
		navigate(`/test/${testId}/results`)
	}

	const resolveUrl = url => {
		if (!url) return ''
		if (/^https?:\/\//i.test(url)) return url
		return `${window.location.origin}${url.startsWith('/') ? url : `/${url}`}`
	}

	const generatePdf = (mode = 'key') => {
		if (!test) return

		const printable = window.open('', '_blank')
		if (!printable) {
			addToast('Nie udało się otworzyć okna do wydruku.', 'error')
			return
		}

		const showKey = mode === 'key'

		const questionHtml = (questions || [])
			.sort((a, b) => (a.order || 0) - (b.order || 0))
			.map((q, qIdx) => {
				const mediaImg = q.media?.find(m => m.type === 'image' && m.url)
				const mediaYt = q.media?.find(m => m.type === 'youtube' && m.url)
				const answersHtml = (q.answers || [])
					.map((ans, aIdx) => {
						const label = String.fromCharCode(65 + aIdx)
						const isCorrect = showKey && q.correctAnswers?.includes(aIdx)
						const content =
							ans.type === 'image'
								? `<div class="answer-img"><img src="${resolveUrl(ans.content)}" alt="Odpowiedź ${label}" /></div>`
								: `<span>${ans.content || ''}</span>`
						const mark = showKey
							? isCorrect
								? '<span class="tag">POPRAWNA</span>'
								: ''
							: '<span class="checkbox"></span>'
						return `<div class="answer ${isCorrect ? 'correct' : ''}">
							<span class="badge">${label}</span>
							${content}
							${mark}
						</div>`
					})
					.join('')

				const mediaHtml = mediaImg
					? `<div class="media"><img src="${resolveUrl(mediaImg.url)}" alt="Obraz do pytania" /></div>`
					: mediaYt
					? `<div class="media"><a href="${mediaYt.url}" target="_blank" rel="noreferrer">Link do wideo</a></div>`
					: ''

				return `<div class="question">
					<h3>Pytanie ${qIdx + 1}. ${q.title || ''}</h3>
					${mediaHtml}
					<div class="answers">${answersHtml}</div>
				</div>`
			})
			.join('')

		printable.document.write(`
			<!DOCTYPE html>
			<html lang="pl">
			<head>
				<meta charset="UTF-8" />
				<title>${test.title || 'Test'}${showKey ? '' : ' - do wypełnienia'}</title>
				<style>
					* { box-sizing: border-box; }
					body { font-family: "Segoe UI", Arial, sans-serif; margin: 0; padding: 24px; color: #111827; }
					h1 { margin: 0 0 8px; font-size: 26px; }
					h2 { margin: 12px 0 8px; font-size: 18px; color: #1f2937; }
					h3 { margin: 12px 0 10px; font-size: 16px; color: #111827; }
					.header { margin-bottom: 16px; }
					.meta { color: #4b5563; font-size: 14px; }
					.question { border: 1px solid #e5e7eb; border-radius: 10px; padding: 14px; margin-bottom: 14px; background: #f9fafb; }
					.media { margin: 10px 0; }
					.media img { max-width: 100%; max-height: 320px; object-fit: contain; border: 1px solid #e5e7eb; border-radius: 8px; }
					.answers { display: flex; flex-direction: column; gap: 8px; margin-top: 8px; }
					.answer { display: flex; align-items: center; gap: 10px; padding: 8px 10px; border: 1px solid #e5e7eb; border-radius: 8px; background: #fff; min-height: 38px; }
					.answer.correct { border-color: #16a34a; background: #ecfdf3; }
					.badge { display: inline-flex; align-items: center; justify-content: center; width: 22px; height: 22px; border-radius: 9999px; background: #10b981; color: #fff; font-weight: 700; font-size: 12px; }
					.tag { margin-left: auto; font-size: 11px; font-weight: 700; color: #0f5132; background: #d1fae5; padding: 4px 8px; border-radius: 9999px; }
					.checkbox { margin-left: auto; width: 16px; height: 16px; border: 1px solid #9ca3af; border-radius: 3px; display: inline-flex; }
					.answer-img img { max-height: 180px; max-width: 100%; object-fit: contain; border-radius: 6px; border: 1px solid #e5e7eb; }
					.info { color: #4b5563; font-size: 13px; margin-top: 4px; }
				</style>
			</head>
			<body>
				<div class="header">
					<h1>${test.title || ''}${showKey ? '' : ' — wersja do wypełnienia'}</h1>
					${test.description ? `<div class="meta">${test.description}</div>` : ''}
					${showKey ? '' : `<div class="info">Wersja do wydruku dla ucznia – bez oznaczonych poprawnych odpowiedzi.</div>`}
				</div>
				${questionHtml}
			</body>
			</html>
		`)

		printable.document.close()
		printable.focus()
		setTimeout(() => {
			printable.print()
		}, 300)
	}

	if (loading) {
		return (
			<div className="min-h-screen bg-white flex items-center justify-center">
				<p className="text-gray-600 text-lg">Wczytywanie testu...</p>
			</div>
		)
	}

	if (!test) {
		return (
			<div className="min-h-screen bg-white flex items-center justify-center">
				<p className="text-gray-600 text-lg">Test nie znaleziony</p>
			</div>
		)
	}

	return (
		<div className="min-h-screen bg-white">
			<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
				{showTestModal && (
					<CreateTestModal
						isOpen={showTestModal}
						onClose={closeModal}
						onTestCreated={() => {}}
						onTestUpdated={handleTestUpdated}
						editingTest={test}
						addToast={addToast}
					/>
				)}

				{/* Header */}
				<TestDetailHeader
					test={test}
					questionsCount={questions.length}
					onEditTest={openModal}
					onBack={() => navigate('/panel')}
					onCopyLink={copyLinkToClipboard}
				/>

				{/* Actions */}
				<div className="bg-white rounded-xl shadow-md p-4 sm:p-5 mb-6 border border-gray-100">
					<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
						<div className="space-y-1">
							<p className="text-xs uppercase tracking-wide text-gray-500 font-semibold">Akcje</p>
							<p className="text-sm text-gray-600">Zarządzaj pytaniami i pobierz wersje testu.</p>
						</div>
						<div className="flex flex-wrap gap-2">
							<button
								onClick={openForm}
								className="inline-flex items-center gap-2 px-3 py-2.5 bg-black hover:bg-neutral-800 text-white font-semibold rounded-lg shadow transition">
								<span>＋</span> Dodaj pytanie
							</button>
							<button
								onClick={() => generatePdf('key')}
								className="inline-flex items-center gap-2 px-3 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white font-semibold rounded-lg shadow transition">
								📄 PDF z kluczem
							</button>
							<button
								onClick={() => generatePdf('blank')}
								className="inline-flex items-center gap-2 px-3 py-2.5 bg-neutral-700 hover:bg-neutral-800 text-white font-semibold rounded-lg shadow transition">
								📝 PDF do wypełnienia
							</button>
						</div>
					</div>
				</div>

				{/* Question Form Modal */}
				{showQuestionForm && (
					<QuestionForm
						isOpen={showQuestionForm}
						onClose={closeForm}
						onQuestionAdded={handleQuestionAdded}
						onQuestionUpdated={handleQuestionUpdated}
						testId={testId}
						editingQuestion={editingQuestion}
						isSingleChoice={!!test.singleChoice}
						addToast={addToast}
					/>
				)}

				{/* Questions List */}
				<TestQuestionList
					questions={questions}
					onEditQuestion={openFormForEdit}
					onDeleteQuestion={handleQuestionDeleted}
					addToast={addToast}
				/>

				<div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mt-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 border-l-4 border-black">
					<div className="flex-1">
						<p className="text-sm text-gray-600 uppercase tracking-wide font-semibold">Analiza wyników</p>
						<h3 className="text-lg sm:text-xl font-bold text-gray-800 mt-1">Zobacz podsumowanie testu</h3>
						<p className="text-sm text-gray-600 mt-1">
							Przejdź do strony z wykresami i statystykami, aby przeanalizować wyniki uczniów.
						</p>
					</div>
					<button
						onClick={goToResults}
						className="w-full sm:w-auto px-4 py-2.5 bg-black hover:bg-neutral-800 text-white font-semibold rounded-lg shadow transition">
						Wyniki ogólne
					</button>
				</div>

				{/* Answers Summary */}
				<TestAnswersSummary
					answers={answers}
					loadingAnswers={loadingAnswers}
					answersSortBy={answersSortBy}
					setAnswersSortBy={setAnswersSortBy}
					answersSearch={answersSearch}
					setAnswersSearch={setAnswersSearch}
					answersPage={answersPage}
					setAnswersPage={setAnswersPage}
					onRowClick={id => navigate(`/answer/${id}`)}
				/>
			</div>
		</div>
	)
}
