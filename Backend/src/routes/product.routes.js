import {Router} from 'express'
import {authenticateSeller} from '../middlewares/auth.middleware.js'
import { createProduct } from '../controllers/product.controller.js'
import multer from 'multer'
import { createProductValidation } from '../validator/product.validator.js'
import { validateProduct } from '../validator/product.validator.js'
import { getSellerProducts } from '../controllers/product.controller.js'

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 } // Limit file size to 5MB
})

const router = Router()

router.post('/', authenticateSeller, upload.array('images', 7), createProductValidation(), validateProduct, createProduct)
router.get('/seller', authenticateSeller, getSellerProducts)


export default router