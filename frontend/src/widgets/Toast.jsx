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
			success: 'bg-neutral-900 text-white border border-neutral-800',
			error: 'bg-red-600 text-white border border-red-700',
			info: 'bg-neutral-900 text-white border border-neutral-800',
			warning: 'bg-amber-500 text-black border border-amber-600',
		}[type] || 'bg-neutral-900 text-white border border-neutral-800'

	return (
		<div
			className={`fixed bottom-4 right-4 max-w-sm w-full mx-4 ${bgColor} p-4 rounded-xl shadow-lg shadow-neutral-300/70 animate-pulse z-50`}>
			<p className="font-semibold text-sm sm:text-base">{message}</p>
		</div>
	)
}
