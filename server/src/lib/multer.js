import multer from "multer"

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 15 * 1024 * 1024 }, // Limit file size to 15MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/
    const extname = allowedTypes.test(file.mimetype)
    if (extname) {
      return cb(null, true)
    } else {
      cb(new Error("Only images are allowed"))
    }
  },
})

export default upload
