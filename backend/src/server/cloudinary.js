const { v2: cloudinary } = require('cloudinary')
const { CloudinaryStorage } = require('multer-storage-cloudinary')

require('dotenv').config()

const {
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
} = process.env

if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
  console.warn(
    'Cloudinary is not fully configured. Please set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in your backend/.env or Render environment.',
  )
}

cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
  secure: true,
})

const productImageStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'fashion-store/products',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [
      { quality: 'auto', fetch_format: 'auto', crop: 'limit', width: 1400 },
    ],
  },
})

function buildOptimizedCloudinaryUrl(url) {
  if (!url) return url

  try {
    const parsed = new URL(url)
    const match = parsed.pathname.match(/^(\/image\/upload\/)(.*)$/)
    if (!match) return url

    const [, prefix, remainder] = match
    if (/^v\d+\//.test(remainder)) {
      const transformation = 'q_auto:good,f_auto,w_auto,dpr_auto'
      parsed.pathname = `${prefix}${transformation}/${remainder}`
      return parsed.toString()
    }

    return url
  } catch (err) {
    return url
  }
}

module.exports = {
  cloudinary,
  productImageStorage,
  buildOptimizedCloudinaryUrl,
}
