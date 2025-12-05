import { useParams, useNavigate } from 'react-router-dom'
import AnswerHeader from '../components/answer/AnswerHeader'
import AnswerQuestionCard from '../components/answer/AnswerQuestionCard'
import { useAnswerDetail } from '../hooks/answer/useAnswerDetail'

export default function AnswerDetail({ addToast }) {
	const { answerId } = useParams()
	const navigate = useNavigate()

	const { data, loading } = useAnswerDetail(answerId, addToast)

	if (loading || !data) {
		return (
			<div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
				<p className="text-gray-600 text-lg text-center">Wczytywanie szczegółów odpowiedzi...</p>
			</div>
		)
	}

	return (
		<div className="min-h-screen bg-gray-100">
			<div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
				<AnswerHeader data={data} onBack={() => navigate(-1)} />

				{/* Sekcja pytań */}
				<div className="bg-white rounded-xl shadow-md p-5 sm:p-8">
					<h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6">Szczegóły pytań</h2>

					{(!data.detailedResults || data.detailedResults.length === 0) && (
						<p className="text-gray-500 text-sm italic">Brak szczegółowych danych dla tej odpowiedzi.</p>
					)}

					<div className="space-y-6">
						{data.detailedResults?.map((q, idx) => (
							<AnswerQuestionCard key={q.questionId} q={q} index={idx} />
						))}
					</div>
				</div>
			</div>
		</div>
	)
}
