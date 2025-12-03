import mongoose from 'mongoose'

const { Schema } = mongoose

const questionSchema = new Schema(
	{
		testId: {
			type: Schema.Types.ObjectId,
			ref: 'Test',
			required: true,
		},

		title: {
			type: String,
			required: true,
			trim: true,
		},

		media: [
			{
				type: {
					type: String,
					enum: ['text', 'image', 'youtube'],
					required: true,
				},
				url: {
					type: String,
					default: null,
				},
				content: {
					type: String,
					default: null,
				},
			},
		],

		answers: [
			{
				type: {
					type: String,
					enum: ['text', 'image'],
					required: true,
				},
				content: {
					type: String,
					required: true,
				},
			},
		],

		correctAnswers: {
			type: [Number],
			required: true,
			validate: v => Array.isArray(v) && v.length > 0,
		},

		order: {
			type: Number,
			default: 0,
		},
	},
	{ timestamps: true }
)

const Question = mongoose.model('Question', questionSchema)

export default Question