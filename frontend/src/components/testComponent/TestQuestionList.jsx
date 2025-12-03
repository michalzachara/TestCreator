import QuestionCard from '../question/QuestionCard'

export default function TestQuestionList({ questions, onEditQuestion, onDeleteQuestion, addToast }) {
	if (!questions || questions.length === 0) {
		return (
			<div className="bg-white rounded-lg shadow-md p-8 text-center mb-8">
				<p className="text-gray-600 text-lg mb-4">Brak pytań. Dodaj swoje pierwsze pytanie!</p>
			</div>
		)
	}

	return (
		<div className="space-y-4 mb-8">
			{questions.map((question, index) => (
				<QuestionCard
					key={question._id}
					question={question}
					index={index + 1}
					onEdit={onEditQuestion}
					onDelete={onDeleteQuestion}
					addToast={addToast}
				/>
			))}
		</div>
	)
}
