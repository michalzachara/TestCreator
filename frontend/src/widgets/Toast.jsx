import { useState, useEffect } from 'react'

export default function Toast({ message, type = 'info', duration = 3000, onClose }) {
	const [isVisible, setIsVisible] = useState(true)

	useEffect(() => {
		const timer = setTimeout(() => {
			setIsVisible(false)
			if (onClose) onClose()
		}, duration)

		return () => clearTimeout(timer)
	}, [duration, onClose])

	if (!isVisible) return null

	const bgColor =
		{
			success: 'bg-green-500',
			error: 'bg-red-500',
			info: 'bg-blue-500',
			warning: 'bg-yellow-500',
		}[type] || 'bg-blue-500'

	return (
		<div
			className={`fixed bottom-4 right-4 max-w-sm w-full mx-4 ${bgColor} text-white p-4 rounded-lg shadow-lg animate-pulse z-50`}>
			<p className="font-semibold text-sm sm:text-base">{message}</p>
		</div>
	)
}
