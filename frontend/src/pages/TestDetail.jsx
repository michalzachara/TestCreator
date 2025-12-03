import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import QuestionForm from '../components/question/QuestionForm'
import CreateTestModal from '../components/testComponent/CreateTestModal'
import TestDetailHeader from '../components/testComponent/TestDetailHeader'
import TestQuestionList from '../components/testComponent/TestQuestionList'
import TestAnswersSummary from '../components/testComponent/TestAnswersSummary'

export default function TestDetail({ addToast }) {
	const { testId } = useParams()
	const navigate = useNavigate()
	const [test, setTest] = useState(null)
	const [questions, setQuestions] = useState([])
	const [loading, setLoading] = useState(true)
	const [answers, setAnswers] = useState([])
	const [answersSortBy, setAnswersSortBy] = useState('submitted_desc')
	const [answersSearch, setAnswersSearch] = useState('')
	const [answersPage, setAnswersPage] = useState(1)
	const [loadingAnswers, setLoadingAnswers] = useState(false)
	const [showQuestionForm, setShowQuestionForm] = useState(false)
	const [editingQuestion, setEditingQuestion] = useState(null)
	const [showTestModal, setShowTestModal] = useState(false)

	const fetchTestDetail = useCallback(async () => {
		setLoading(true)
		try {
			const token = localStorage.getItem('token')
			const response = await fetch(`/api/test/${testId}`, {
				method: 'GET',
				headers: {
					Authorization: `Bearer ${token}`,
				},
			})

			if (!response.ok) {
				const data = await response.json()
				addToast(data.message || 'Błąd podczas wczytywania testu', 'error')
				navigate('/panel')
				return
			}

			const data = await response.json()
			setTest(data)
			setQuestions(data.questions || [])
		} catch (error) {
			addToast('Błąd sieci. Spróbuj ponownie.', 'error')
			console.error('Błąd podczas wczytywania testu:', error)
			navigate('/panel')
		} finally {
			setLoading(false)
		}
	}, [testId, addToast, navigate])

	const fetchAnswers = useCallback(async () => {
		setLoadingAnswers(true)
		try {
			const token = localStorage.getItem('token')
			const response = await fetch(`/api/test/${testId}/answers`, {
				method: 'GET',
				headers: {
					Authorization: `Bearer ${token}`,
				},
			})

			if (!response.ok) {
				const data = await response.json()
				addToast(data.message || 'Błąd podczas wczytywania odpowiedzi', 'error')
				return
			}

			const data = await response.json()
			setAnswers(Array.isArray(data) ? data : [])
		} catch (error) {
			addToast('Błąd sieci przy wczytywaniu odpowiedzi. Spróbuj ponownie.', 'error')
			console.error('Błąd podczas wczytywania odpowiedzi:', error)
		} finally {
			setLoadingAnswers(false)
		}
	}, [testId, addToast])

	useEffect(() => {
		fetchTestDetail()
		fetchAnswers()
	}, [fetchTestDetail, fetchAnswers])

	const handleQuestionAdded = newQuestion => {
		setQuestions([...questions, newQuestion])
		setShowQuestionForm(false)
		setEditingQuestion(null)
		addToast('Pytanie zostało dodane', 'success')
	}

	const handleQuestionUpdated = updatedQuestion => {
		setQuestions(questions.map(q => (q._id === updatedQuestion._id ? updatedQuestion : q)))
		setShowQuestionForm(false)
		setEditingQuestion(null)
		addToast('Pytanie zostało zaktualizowane', 'success')
	}

	const handleQuestionDeleted = questionId => {
		setQuestions(questions.filter(q => q._id !== questionId))
		addToast('Pytanie zostało usunięte', 'success')
	}

	const handleEditQuestion = question => {
		setEditingQuestion(question)
		setShowQuestionForm(true)
	}

	const handleTestUpdated = updatedTest => {
		setTest(updatedTest)
		addToast('Test został zaktualizowany', 'success')
		setShowTestModal(false)
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
						onClose={() => setShowTestModal(false)}
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
					onEditTest={() => setShowTestModal(true)}
					onBack={() => navigate('/panel')}
					onCopyLink={copyLinkToClipboard}
				/>

				{/* Add Question Button */}
				<button
					onClick={() => {
						setEditingQuestion(null)
						setShowQuestionForm(true)
					}}
					className="w-full sm:w-auto mb-6 bg-green-600 hover:bg-green-700 text-white font-semibold py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg transition duration-200 shadow-lg">
					+ Dodaj pytanie
				</button>

				{/* Question Form Modal */}
				{showQuestionForm && (
					<QuestionForm
						isOpen={showQuestionForm}
						onClose={() => {
							setShowQuestionForm(false)
							setEditingQuestion(null)
						}}
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
					onEditQuestion={handleEditQuestion}
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
