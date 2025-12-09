import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import Navbar from '../widgets/Navbar'
import PublicTestHeader from '../components/publicTest/PublicTestHeader'
import PublicTestUserForm from '../components/publicTest/PublicTestUserForm'
import PublicTestQuestionCard from '../components/publicTest/PublicTestQuestionCard'
import PublicTestResult from '../components/publicTest/PublicTestResult'
import { usePublicTest } from '../hooks/publicTest/usePublicTest'
import { usePublicTestForm } from '../hooks/publicTest/usePublicTestForm'
import { usePublicTestAnswers } from '../hooks/publicTest/usePublicTestAnswers'
import { usePublicTestValidation } from '../hooks/publicTest/usePublicTestValidation'
import { usePublicTestSubmission } from '../hooks/publicTest/usePublicTestSubmission'

export default function PublicTest({ addToast }) {
	const { link } = useParams()

	const { test, loading } = usePublicTest(link, addToast)
	const { formData, initializeAnswers, updatePersonalData, updateAnswers } = usePublicTestForm()
	const { fieldErrors, questionErrors, clearFieldError, validateForm, setQuestionErrors } = usePublicTestValidation()
	const { submitted, result, alreadySubmitted, submitTest } = usePublicTestSubmission(link, addToast)
	const { handleAnswerChange } = usePublicTestAnswers(test, formData, updateAnswers, setQuestionErrors)

	useEffect(() => {
		if (test?.questions) {
			initializeAnswers(test.questions)
		}
	}, [test, initializeAnswers])

	const handleInputChange = e => {
		const { name, value } = e.target
		updatePersonalData(name, value)
		clearFieldError(name)
	}

	const handleSubmit = async e => {
		e.preventDefault()

		if (!test) return

		const validation = validateForm(formData, test)
		if (validation.hasErrors) {
			addToast('Uzupełnij wymagane pola i odpowiedzi', 'warning')
			return
		}

		await submitTest(formData)
	}

	if (loading) {
		return (
			<div className="min-h-screen bg-white flex items-center justify-center">
				<p className="text-gray-600 text-lg">Loading test...</p>
			</div>
		)
	}

	if (!test) {
		return (
			<div className="min-h-screen bg-white flex items-center justify-center">
				<p className="text-gray-600 text-lg">Test not found</p>
			</div>
		)
	}

	if (alreadySubmitted && !submitted) {
		return (
			<div className="min-h-screen bg-white">
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
		<div className="min-h-screen bg-white">
			<Navbar hideAuthActions />
			<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
				<PublicTestHeader test={test} />

				<PublicTestUserForm formData={formData} fieldErrors={fieldErrors} onChange={handleInputChange} />

				{/* Questions */}
				<form onSubmit={handleSubmit} className="space-y-6">
					{test.questions.map((question, qIdx) => {
						const answerRecord = formData.answers.find(a => a.questionId === question._id)
						return (
							<PublicTestQuestionCard
								key={question._id}
								question={question}
								index={qIdx}
								answerRecord={answerRecord}
								hasError={questionErrors.includes(question._id)}
								onAnswerChange={handleAnswerChange}
								singleChoice={!!test.singleChoice}
							/>
						)
					})}

					{/* Submit Button */}
					<button
						type="submit"
						className="w-full bg-black hover:bg-neutral-800 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 text-lg">
						Wyślij test
					</button>
				</form>
			</div>
		</div>
	)
}
