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

	if (loading) {
		return (
			<div className="min-h-screen bg-gray-100 flex items-center justify-center">
				<p className="text-gray-600 text-lg">Wczytywanie testu...</p>
			</div>
		)
	}

	if (!test) {
		return (
			<div className="min-h-screen bg-gray-100 flex items-center justify-center">
				<p className="text-gray-600 text-lg">Test nie znaleziony</p>
			</div>
		)
	}

	return (
		<div className="min-h-screen bg-gray-100">
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

				{/* Add Question Button */}
				<button
					onClick={openForm}
					className="w-full sm:w-auto mb-6 bg-green-600 hover:bg-green-700 text-white font-semibold py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg transition duration-200 shadow-lg">
					+ Dodaj pytanie
				</button>

				{/* Question Form Modal */}
				{showQuestionForm && (
					<QuestionForm
						isOpen={showQuestionForm}
						onClose={closeForm}
						onQuestionAdded={handleQuestionAdded}
						onQuestionUpdated={handleQuestionUpdated}
						testId={testId}
						editingQuestion={editingQuestion}
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
