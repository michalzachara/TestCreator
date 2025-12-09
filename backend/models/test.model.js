import mongoose from 'mongoose'

const { Schema } = mongoose

const testSchema = Schema(
	{
		userId: {
			type: Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		title: {
			type: String,
			required: true,
			trim: true,
		},
		description: {
			type: String,
			required: true,
			trim: true,
		},
		uniqueLink: {
			type: String,
			required: true,
			unique: true,
		},
		singleChoice: {
			type: Boolean,
			default: false,
		},
		isActive: {
			type: Boolean,
			default: false,
		},
		activeFor: {
			type: Date,
			default: null,
		},
		createdAt: {
			type: Date,
			default: Date.now,
		},
	},
	{
		timestamps: true,
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	}
)

testSchema.virtual('questions', {
	ref: 'Question',
	localField: '_id',
	foreignField: 'testId',
	justOne: false,
})

testSchema.virtual('isCurrentlyActive').get(function () {
	if (!this.isActive) return false
	if (!this.activeFor) return true
	return new Date() <= this.activeFor
})

testSchema.index({ isActive: 1, activeFor: 1 })
testSchema.index({ userId: 1, createdAt: -1 })

const Test = mongoose.model('Test', testSchema)

export default Test
