import multer from 'multer'
import path from 'path'
import fs from 'fs'

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		if (!req.user || !req.user.id) {
			return cb(new Error('Unauthorized: User not authenticated'), false)
		}

		const userId = req.user.id
		const uploadPath = path.join('uploads', userId)

		try {
			fs.mkdirSync(uploadPath, { recursive: true })
		} catch (err) {
			return cb(err)
		}

		cb(null, uploadPath)
	},
	filename: (req, file, cb) => {
		const ext = path.extname(file.originalname)
		const base = path.basename(file.originalname, ext).replace(/\s+/g, '_')
		cb(null, `${Date.now()}_${base}${ext}`)
	},
})

const imageFileFilter = (req, file, cb) => {
	if (!file.mimetype.startsWith('image/')) {
		return cb(new Error('Only image files are allowed'), false)
	}
	cb(null, true)
}

export const upload = multer({
	storage,
	fileFilter: imageFileFilter,
	limits: {
		fileSize: 5 * 1024 * 1024, 
	},
})


