import mongoose from 'mongoose'

const { Schema } = mongoose

const answerSchema = new Schema(
	{
		testId: {
			type: Schema.Types.ObjectId,
			ref: 'Test',
			required: true,
		},
		name: {
			type: String,
			required: true,
			trim: true,
		},
		surname: {
			type: String,
			required: true,
			trim: true,
		},
		classType: {
			type: String,
			required: true,
			trim: true,
		},
		answers: [
			{
				questionId: {
					type: Schema.Types.ObjectId,
					ref: 'Question',
					required: true,
				},
				selectedAnswers: {
					type: [Number], 
					required: true,
					default: [],
				},
			},
		],
		score: {
			type: Number,
			required: true,
			min: 0,
		},
		maxScore: {
			type: Number,
			required: true,
			min: 0,
		},
		submittedAt: {
			type: Date,
			default: Date.now,
		},
	},
	{ timestamps: true }
)

answerSchema.index({ testId: 1, name: 1, surname: 1 })

const Answer = mongoose.model('Answer', answerSchema)

export default Answer