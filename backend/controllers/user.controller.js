import User from '../models/user.model.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export const registerUser = async (req, res) => {
	try {
		const { email, password, name, surname } = req.body

		if (!email || !password || !name || !surname) {
			return res.status(400).json({ message: 'All fields are required' })
		}

		const existingUser = await User.findOne({ email })
		if (existingUser) {
			return res.status(409).json({ message: 'Email already exists' })
		}

		const hashedPassword = await bcrypt.hash(password, 10)

		const newUser = await User.create({
			email,
			password: hashedPassword,
			name,
			surname,
		})

		const createdUser = {
			_id: newUser._id,
			email: newUser.email,
			name: newUser.name,
			surname: newUser.surname,
			createdAt: newUser.createdAt,
		}

		return res.status(201).json({
			message: 'User registered successfully',
			user: createdUser,
		})
	} catch (error) {
		console.error('Register error:', error)
		return res.status(500).json({ message: 'Server error' })
	}
}

export const loginUser = async (req, res) => {
	try {
		const { email, password } = req.body

		if (!email || !password) {
			return res.status(400).json({ message: 'Email and password are required' })
		}

		const user = await User.findOne({ email }).select('+password')
		if (!user) {
			return res.status(401).json({ message: 'Invalid email or password' })
		}

		const isMatch = await bcrypt.compare(password, user.password)
    
		if (!isMatch) {
			return res.status(401).json({ message: 'Invalid email or password' })
		}

		const token = jwt.sign(
			{
				id: user._id,
			},
			process.env.JWT_SECRET,
			{ expiresIn: '7d' }
		)

		const userData = {
			_id: user._id,
			email: user.email,
			name: user.name,
			surname: user.surname,
			createdAt: user.createdAt,
		}

		return res.status(200).json({
			message: 'Logged in successfully',
			token,
			user: userData,
		})
	} catch (error) {
		console.error('Login error:', error)
		return res.status(500).json({ message: 'Server error' })
	}
}
