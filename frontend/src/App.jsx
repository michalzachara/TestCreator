import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useState, useCallback } from 'react'
import Login from './pages/Login'
import Register from './pages/Register'
import Home from './pages/Home'
import TestDetail from './pages/TestDetail'
import TestResults from './pages/TestResults'
import AnswerDetail from './pages/AnswerDetail'
import PublicTest from './pages/PublicTest'
import Landing from './pages/Landing'
import ProtectedRoute from './components/ProtectedRoute'
import PublicRoute from './components/PublicRoute'
import Navbar from './widgets/Navbar'
import Toast from './widgets/Toast'

function App() {
	const [toasts, setToasts] = useState([])

	const addToast = useCallback((message, type = 'info', duration = 3000) => {
		const id = Date.now()
		setToasts(prev => [...prev, { id, message, type, duration }])
	}, [])

	const removeToast = useCallback(id => {
		setToasts(prev => prev.filter(toast => toast.id !== id))
	}, [])

	return (
		<>
			<BrowserRouter>
				<Routes>
					<Route
						path="/login"
						element={
							<PublicRoute>
								<Login addToast={addToast} />
							</PublicRoute>
						}
					/>
					<Route
						path="/login/register"
						element={
							<PublicRoute>
								<Register addToast={addToast} />
							</PublicRoute>
						}
					/>
					<Route path="/" element={<Landing />} />
					<Route
						path="/panel"
						element={
							<ProtectedRoute>
								<Navbar />
								<Home addToast={addToast} />
							</ProtectedRoute>
						}
					/>
					<Route
						path="/test/:testId"
						element={
							<ProtectedRoute>
								<Navbar />
								<TestDetail addToast={addToast} />
							</ProtectedRoute>
						}
					/>
					<Route
						path="/test/:testId/results"
						element={
							<ProtectedRoute>
								<Navbar />
								<TestResults addToast={addToast} />
							</ProtectedRoute>
						}
					/>
					<Route
						path="/answer/:answerId"
						element={
							<ProtectedRoute>
								<Navbar />
								<AnswerDetail addToast={addToast} />
							</ProtectedRoute>
						}
					/>
					<Route path="/test-link/:link" element={<PublicTest addToast={addToast} />} />
					<Route path="*" element={<Navigate to="/" replace />} />
				</Routes>
			</BrowserRouter>

			{/* Toast Container */}
			<div className="fixed bottom-4 right-4 z-50 space-y-3">
				{toasts.map(toast => (
					<Toast
						key={toast.id}
						message={toast.message}
						type={toast.type}
						duration={toast.duration}
						onClose={() => removeToast(toast.id)}
					/>
				))}
			</div>
		</>
	)
}

export default App
