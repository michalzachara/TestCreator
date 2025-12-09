import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function TestCard({ test, onEdit, onDelete, addToast, onDuplicate }) {
	const navigate = useNavigate()
	const [deleting, setDeleting] = useState(false)
	const [duplicating, setDuplicating] = useState(false)
	const [confirming, setConfirming] = useState(false)
	const [error, setError] = useState('')

	const handleDuplicateTest = async e => {
		e.stopPropagation()
		setDuplicating(true)
		setError('')

		try {
			const token = localStorage.getItem('token')

			console.log('Duplicating test:', test._id)

			const response = await fetch(`/api/test/${test._id}/duplicate`, {
				method: 'POST',
				headers: {
					Authorization: `Bearer ${token}`,
				},
			})

			if (!response.ok) {
				const errorData = await response.json()
				const msg = errorData.message || 'Błąd podczas duplikowania testu'
				setError(msg)
				addToast(msg, 'error')
				console.error('Duplicate test error:', errorData)
				return
			}

			const newTest = await response.json()
			console.log('Duplicated test:', newTest)
			addToast(`Test "${newTest.title}" został skopiowany`, 'success')
			onDuplicate(newTest)
		} catch (err) {
			const errorMsg = `Błąd sieci: ${err.message}`
			setError(errorMsg)
			addToast(errorMsg, 'error')
			console.error('Error:', err)
		} finally {
			setDuplicating(false)
		}
	}

	const handleConfirmDelete = async () => {
		setDeleting(true)
		setError('')

		try {
			const token = localStorage.getItem('token')
			const response = await fetch(`/api/test/${test._id}`, {
				method: 'DELETE',
				headers: {
					Authorization: `Bearer ${token}`,
				},
			})

			if (!response.ok) {
				const data = await response.json()
				const msg = data.message || 'Błąd podczas usuwania testu'
				setError(msg)
				addToast(msg, 'error')
				return
			}

			const data = await response.json()
			addToast(data.message || 'Test został usunięty', 'success')
			onDelete(test._id)
		} catch (err) {
			const errorMsg = 'Błąd sieci. Spróbuj ponownie.'
			setError(errorMsg)
			addToast(errorMsg, 'error')
			console.error('Error:', err)
		} finally {
			setDeleting(false)
			setConfirming(false)
		}
	}

	const createdDate = new Date(test.createdAt).toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'short',
		day: 'numeric',
	})

	const isCurrentlyActive = () => {
		if (!test.isActive) return false

		if (!test.activeFor) return true

		const now = new Date()
		const activeUntil = new Date(test.activeFor)
		return now <= activeUntil
	}

	const testIsActive = isCurrentlyActive()

	const copyLinkToClipboard = e => {
		e.stopPropagation()
		const testLink = `${window.location.origin}/test-link/${test.uniqueLink}`
		navigator.clipboard.writeText(testLink)
		addToast('Link copied to clipboard!', 'success')
	}

	return (
		<div
			onClick={() => navigate(`/test/${test._id}`)}
			className="h-full flex flex-col bg-white rounded-lg sm:rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group border-l-4 border-green-500 cursor-pointer">
			{/* Header Section */}
			<div className="p-4 sm:p-5 lg:p-6">
				<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4">
					<div className="flex-1 min-w-0">
						<h2 className="text-lg sm:text-xl font-bold text-gray-800 transition-colors wrap-break-word group-hover:text-green-600">
							{test.title}
						</h2>
						<div className="flex flex-col gap-1 mt-1">
							<p className="text-gray-400 text-xs sm:text-sm">Utworzono: {createdDate}</p>
							{test.activeFor && (
								<p className={`text-xs sm:text-sm ${testIsActive ? 'text-green-600' : 'text-red-600'}`}>
									{testIsActive ? 'Aktywny do:' : 'Wygasł:'}{' '}
									{new Date(test.activeFor).toLocaleDateString('pl-PL', {
										year: 'numeric',
										month: 'short',
										day: 'numeric',
										hour: '2-digit',
										minute: '2-digit',
									})}
								</p>
							)}
						</div>
					</div>
					<div
						className={`px-2.5 sm:px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
							testIsActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
						}`}>
						{testIsActive ? '● Aktywny' : '● Nieaktywny'}
					</div>
				</div>

				{test.description && <p className="text-gray-600 text-xs sm:text-sm mt-3 line-clamp-2">{test.description}</p>}
			</div>

			{error && (
				<div className="mx-4 sm:mx-5 lg:mx-6 mb-4 sm:mb-5 lg:mb-6 p-2 bg-red-50 border border-red-200 text-red-600 rounded text-xs">
					{error}
				</div>
			)}

			{/* Share Link Section */}
			<div className="mx-4 sm:mx-5 lg:mx-6 mb-4 sm:mb-5 lg:mb-6 flex flex-col gap-2" onClick={e => e.stopPropagation()}>
				{test.uniqueLink && (
					<button
						onClick={copyLinkToClipboard}
						className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm sm:text-base rounded-lg transition duration-200 shadow-sm">
						<span role="img" aria-hidden="true">
							📋
						</span>
						<span>Kopiuj link</span>
					</button>
				)}
				{test.singleChoice && (
					<div className="flex items-center gap-2 text-xs font-semibold text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
						<span role="img" aria-hidden="true">
							✅
						</span>
						<span>Jednokrotny wybór</span>
					</div>
				)}
				<button
					onClick={handleDuplicateTest}
					disabled={duplicating}
					className="flex items-center justify-center gap-2 px-4 py-3 bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-400 text-white font-semibold text-sm sm:text-base rounded-lg transition duration-200 shadow-sm">
					<span role="img" aria-hidden="true">
						{duplicating ? '⏳' : '📄'}
					</span>
					<span>{duplicating ? 'Kopiowanie' : 'Kopiuj test'}</span>
				</button>
			</div>

			<div className="mt-auto px-4 sm:px-5 lg:px-6 py-4 sm:py-5 lg:py-6" onClick={e => e.stopPropagation()}>
				<div className="min-h-14 flex items-center">
					{confirming ? (
						<div className="w-full p-2 rounded-lg border border-red-200 bg-red-50 flex flex-col sm:flex-row items-start sm:items-center gap-2">
							<div className="text-red-600 font-semibold text-xs sm:text-sm flex-1">
								Czy na pewno chcesz usunąć ten test?
							</div>
							<div className="flex gap-2 w-full sm:w-auto">
								<button
									type="button"
									onClick={() => setConfirming(false)}
									className="flex-1 sm:flex-none px-3 py-1.5 rounded-lg border border-gray-300 text-gray-700 text-xs font-semibold hover:bg-gray-50 transition">
									Anuluj
								</button>
								<button
									type="button"
									onClick={handleConfirmDelete}
									disabled={deleting}
									className="flex-1 sm:flex-none px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white text-xs font-semibold transition">
									{deleting ? 'Usuwanie...' : 'Usuń'}
								</button>
							</div>
						</div>
					) : (
						<div className="flex gap-2 flex-col sm:flex-row w-full">
							<button
								onClick={() => onEdit(test)}
								className="flex-1 bg-green-50 hover:bg-green-100 text-green-700 hover:text-green-800 font-semibold py-2 sm:py-2.5 text-sm sm:text-base rounded-lg transition duration-200 border border-green-200 hover:border-green-300">
								✏️ Edytuj
							</button>
							<button
								onClick={() => setConfirming(true)}
								disabled={deleting}
								className="flex-1 bg-red-50 hover:bg-red-100 disabled:bg-gray-100 text-red-700 hover:text-red-800 disabled:text-gray-500 font-semibold py-2 sm:py-2.5 text-sm sm:text-base rounded-lg transition duration-200 border border-red-200 hover:border-red-300 disabled:border-gray-200">
								{deleting ? '⏳' : '🗑️'} <span className="hidden sm:inline">{deleting ? 'Usuwanie' : 'Usuń'}</span>
							</button>
						</div>
					)}
				</div>
			</div>
		</div>
	)
}
