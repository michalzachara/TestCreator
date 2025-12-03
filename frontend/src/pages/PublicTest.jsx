import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Navbar from '../widgets/Navbar'
import PublicTestHeader from '../components/publicTest/PublicTestHeader'
import PublicTestUserForm from '../components/publicTest/PublicTestUserForm'
import PublicTestQuestionCard from '../components/publicTest/PublicTestQuestionCard'
import PublicTestResult from '../components/publicTest/PublicTestResult'

export default function PublicTest({ addToast }) {
	const { link } = useParams()
	const navigate = useNavigate()
	const [test, setTest] = useState(null)
	const [loading, setLoading] = useState(true)
	const [submitted, setSubmitted] = useState(false)
	const [result, setResult] = useState(null)
	const [formData, setFormData] = useState({
		name: '',
		surname: '',
		classType: '',
		answers: [],
	})
	const [fieldErrors, setFieldErrors] = useState({
		name: false,
		surname: false,
		classType: false,
	})
	const [questionErrors, setQuestionErrors] = useState([])
	const [alreadySubmitted, setAlreadySubmitted] = useState(false)

	const storageKey = `public_test_${link}_submitted`

	const fetchTest = useCallback(async () => {
		setLoading(true)
		try {
			const response = await fetch(`/api/public/${link}?t=${Date.now()}`)
			if (!response.ok) {
				const data = await response.json()
				console.log(data)

				addToast(data.message || 'Test not found or inactive', 'error')
				navigate('/')
				return
			}

			const data = await response.json()
			if (data.ok) {
				setTest(data.test)
				const initialAnswers = data.test.questions.map(q => ({
					questionId: q._id,
					selectedAnswers: [],
				}))
				setFormData(prev => ({ ...prev, answers: initialAnswers }))
			} else {
				addToast(data.message || 'Failed to load test', 'error')
				navigate('/')
			}
		} catch (err) {
			addToast('Network error. Please try again.', 'error')
			console.error('Error fetching test:', err)
			navigate('/')
		} finally {
			setLoading(false)
		}
	}, [link, addToast, navigate])

	useEffect(() => {
		try {
			const stored = localStorage.getItem(storageKey)
			if (stored) {
				setAlreadySubmitted(true)
			}
		} catch {
			// ignorujemy problemy z localStorage
		}

		fetchTest()
	}, [fetchTest, storageKey])

	const handleInputChange = e => {
		const { name, value } = e.target
		setFormData(prev => ({ ...prev, [name]: value }))
		setFieldErrors(prev => ({ ...prev, [name]: false }))
	}

	const handleAnswerChange = (questionIndex, answerIndex, isChecked) => {
		if (!test) return

		setFormData(prev => {
			const newAnswers = [...prev.answers]
			const question = test.questions[questionIndex]
			const answerIndexInArray = newAnswers.findIndex(a => a.questionId === question._id)

			if (answerIndexInArray !== -1) {
				let selectedAnswers = [...newAnswers[answerIndexInArray].selectedAnswers]

				if (isChecked) {
					if (!selectedAnswers.includes(answerIndex)) {
						selectedAnswers.push(answerIndex)
					}
				} else {
					selectedAnswers = selectedAnswers.filter(idx => idx !== answerIndex)
				}

				newAnswers[answerIndexInArray].selectedAnswers = selectedAnswers.sort((a, b) => a - b)
			}

			return { ...prev, answers: newAnswers }
		})

		setQuestionErrors(prev => prev.filter(id => id !== test.questions[questionIndex]._id))
	}

	const handleSubmit = async e => {
		e.preventDefault()

		if (alreadySubmitted) {
			addToast('Ten test został już wysłany z tego urządzenia.', 'warning')
			return
		}

		const personalErrors = {
			name: !formData.name.trim(),
			surname: !formData.surname.trim(),
			classType: !formData.classType.trim(),
		}
		setFieldErrors(personalErrors)

		const hasPersonalErrors = Object.values(personalErrors).some(Boolean)

		const unanswered = test.questions
			.filter(q => {
				const record = formData.answers.find(a => a.questionId === q._id)
				return !record || record.selectedAnswers.length === 0
			})
			.map(q => q._id)
		setQuestionErrors(unanswered)

		if (hasPersonalErrors || unanswered.length > 0) {
			addToast('Uzupełnij wymagane pola i odpowiedzi', 'warning')
			return
		}

		try {
			const response = await fetch('/api/public/result', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					uniqueLink: link,
					name: formData.name,
					surname: formData.surname,
					classType: formData.classType,
					answers: formData.answers,
				}),
			})

			if (!response.ok) {
				const data = await response.json()
				addToast(data.message || 'Failed to submit test', 'error')
				return
			}

			const data = await response.json()
			if (data.ok) {
				setResult(data.result)
				setSubmitted(true)
				try {
					localStorage.setItem(storageKey, '1')
					setAlreadySubmitted(true)
				} catch {
					// jeśli localStorage nie działa, po prostu pomijamy blokadę
				}
				addToast('Test submitted successfully!', 'success')
			} else {
				addToast(data.message || 'Failed to submit test', 'error')
			}
		} catch (err) {
			addToast('Network error. Please try again.', 'error')
			console.error('Error submitting test:', err)
		}
	}

	if (loading) {
		return (
			<div className="min-h-screen bg-gray-100 flex items-center justify-center">
				<p className="text-gray-600 text-lg">Loading test...</p>
			</div>
		)
	}

	if (!test) {
		return (
			<div className="min-h-screen bg-gray-100 flex items-center justify-center">
				<p className="text-gray-600 text-lg">Test not found</p>
			</div>
		)
	}

	if (alreadySubmitted && !submitted) {
		return (
			<div className="min-h-screen bg-gray-100">
				<Navbar hideAuthActions />
				<div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
					<div className="bg-white rounded-lg shadow-md p-6 sm:p-8 text-center">
						<h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">Ten test został już wypełniony</h1>
						<p className="text-gray-600 mb-4">
							Z tego urządzenia test został już wysłany. Jeśli uważasz, że to błąd, skontaktuj się z nauczycielem.
						</p>
					</div>
				</div>
			</div>
		)
	}

	if (submitted && result) {
		return <PublicTestResult result={result} />
	}

	return (
		<div className="min-h-screen bg-gray-100">
			<Navbar hideAuthActions />
			<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
				<PublicTestHeader test={test} />

				<PublicTestUserForm formData={formData} fieldErrors={fieldErrors} onChange={handleInputChange} />

				{/* Questions */}
				<form onSubmit={handleSubmit} className="space-y-6">
					{test.questions.map((question, qIdx) => {
						const answerRecord = formData.answers[qIdx]
						return (
							<PublicTestQuestionCard
								key={question._id}
								question={question}
								index={qIdx}
								answerRecord={answerRecord}
								hasError={questionErrors.includes(question._id)}
								onAnswerChange={handleAnswerChange}
							/>
						)
					})}

					{/* Submit Button */}
					<button
						type="submit"
						className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 text-lg">
						Wyślij test
					</button>
				</form>
			</div>
		</div>
	)
}
