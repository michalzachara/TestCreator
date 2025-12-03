import mongoose from 'mongoose'
import dotenv from 'dotenv'
dotenv.config()

export const connectToDb = async () => {
	try {
		await mongoose.connect(process.env.MONGO_URI)
		console.log('Polaczono z baza')
	} catch (error) {
		console.log('Problem z polaczeniem z baza, ' + error)
	}
}
