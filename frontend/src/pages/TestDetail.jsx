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
		body { font-family: "Inter", "Segoe UI", Arial, sans-serif; margin: 0; padding: 32px 28px; color: #0f172a; background: #ffffff; }
		.page { max-width: 960px; margin: 0 auto; }
		h1 { margin: 0 0 6px; font-size: 28px; letter-spacing: -0.01em; }
		h3 { margin: 0 0 10px; font-size: 17px; color: #0f172a; }
		.meta { color: #475569; font-size: 14px; line-height: 1.5; margin-bottom: 12px; }
		.badge { display: inline-flex; align-items: center; justify-content: center; width: 26px; height: 26px; border-radius: 8px; background: #0ea5e9; color: #fff; font-weight: 700; font-size: 13px; }
		.tag { margin-left: auto; font-size: 11px; font-weight: 700; color: #0f5132; background: #d1fae5; padding: 4px 8px; border-radius: 9999px; border: 1px solid #bbf7d0; }
		.checkbox { margin-left: auto; width: 16px; height: 16px; border: 1px solid #cbd5e1; border-radius: 4px; display: inline-flex; }
		.header { padding: 18px 20px; border: 1px solid #e2e8f0; border-radius: 16px; margin-bottom: 18px; background: linear-gradient(135deg, #f8fafc 0%, #ffffff 60%); }
		.question { border: 1px solid #e2e8f0; border-radius: 14px; padding: 16px; margin-bottom: 14px; background: #f8fafc; page-break-inside: avoid; }
		.question + .question { margin-top: 16px; }
		.question-header { display: flex; align-items: center; gap: 10px; margin-bottom: 12px; }
		.answers { display: flex; flex-direction: column; gap: 8px; }
		.answer { display: flex; align-items: center; gap: 10px; padding: 10px 12px; border: 1px solid #e2e8f0; border-radius: 10px; background: #ffffff; min-height: 40px; }
		.answer.correct { border-color: #16a34a; background: #ecfdf3; }
		.answer-img img { max-height: 160px; max-width: 100%; object-fit: contain; border-radius: 8px; border: 1px solid #e2e8f0; }
		.media { margin: 10px 0 6px; }
		.media img { max-width: 100%; max-height: 320px; object-fit: contain; border: 1px solid #e5e7eb; border-radius: 12px; }
		.info { color: #475569; font-size: 13px; margin-top: 6px; }
		.footer { margin-top: 18px; font-size: 12px; color: #94a3b8; text-align: right; }
		@media print {
			body { padding: 24px; background: #fff; }
			.header { box-shadow: none; }
			.answer, .question, .header { break-inside: avoid; }
		}
	</style>
</head>
<body>
	<div class="page">
		<div class="header">
			<h1>${test.title || ''}${showKey ? '' : ' — wersja do wypełnienia'}</h1>
			${test.description ? `<div class="meta">${test.description}</div>` : ''}
			${showKey ? '' : `<div class="info">Wersja do wydruku dla ucznia – bez oznaczonych poprawnych odpowiedzi.</div>`}
		</div>
		${questionHtml}
		<div class="footer">Wygenerowano z ZSTiB Testy</div>
	</div>
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
		<div className="min-h-screen bg-linear-to-b from-slate-50 via-white to-white">
			<div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
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
				<div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
					<div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-4">
						<p className="text-xs uppercase tracking-wide text-slate-500 font-semibold">Pytania</p>
						<p className="text-3xl font-bold text-slate-900 mt-1">{questions.length}</p>
						<p className="text-sm text-slate-500 mt-1">Przygotowane w tym teście</p>
					</div>
					<div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-4">
						<p className="text-xs uppercase tracking-wide text-slate-500 font-semibold">Odpowiedzi</p>
						<p className="text-3xl font-bold text-slate-900 mt-1">{answers.length}</p>
						<p className="text-sm text-slate-500 mt-1">Zebrane od uczestników</p>
					</div>
					<div className="rounded-2xl bg-linear-to-br from-slate-900 to-slate-700 text-white shadow-lg p-4">
						<p className="text-xs uppercase tracking-wide font-semibold text-slate-200">Tryb</p>
						<p className="text-2xl font-bold mt-1">{test.singleChoice ? 'Jednokrotny wybór' : 'Wielokrotny wybór'}</p>
					</div>
				</div>

				<div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 mb-6 border border-slate-200">
					<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
						<div className="space-y-1">
							<p className="text-xs uppercase tracking-wide text-slate-500 font-semibold">Akcje</p>
							<p className="text-sm text-slate-600">Zarządzaj pytaniami, udostępnij test lub pobierz wersję PDF.</p>
						</div>
						<div className="flex flex-wrap gap-2">
							<button
								onClick={openForm}
								className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-lg shadow-sm transition">
								<span>＋</span> Dodaj pytanie
							</button>
							<button
								onClick={() => generatePdf('key')}
								className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 hover:border-slate-400 text-slate-900 font-semibold rounded-lg shadow-sm transition">
								📄 PDF z kluczem
							</button>
							<button
								onClick={() => generatePdf('blank')}
								className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-900 font-semibold rounded-lg shadow-sm transition">
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

				<div className="bg-white rounded-2xl shadow-lg p-5 sm:p-7 mt-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 border border-slate-200">
					<div className="flex-1">
						<p className="text-sm text-slate-600 uppercase tracking-wide font-semibold">Analiza wyników</p>
						<h3 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">Zobacz podsumowanie testu</h3>
						<p className="text-sm text-slate-600 mt-1">
							Przejdź do panelu z wykresami i statystykami, aby przeanalizować wyniki uczestników.
						</p>
					</div>
					<button
						onClick={goToResults}
						className="w-full sm:w-auto px-5 py-3 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-lg shadow-sm transition">
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
