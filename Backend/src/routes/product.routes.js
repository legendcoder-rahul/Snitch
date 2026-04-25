import {Router} from 'express'
import {authenticateSeller} from '../middlewares/auth.middleware.js'
import { createProduct } from '../controllers/product.controller.js'
import multer from 'multer'
import { createProductValidation } from '../validator/product.validator.js'

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 } // Limit file size to 5MB
})

const router = Router()

router.post('/', authenticateSeller, createProductValidation(), upload.array('image', 7), createProduct)

export default router