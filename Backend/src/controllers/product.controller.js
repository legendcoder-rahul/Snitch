import productModel from '../models/product.model.js'
import { uploadFile } from '../services/storage.service.js'

export async function createProduct(req, res) {
    try {
        const { title, description, priceAmount, priceCurrency } = req.body
        const seller = req.user
        const files = Array.isArray(req.files) ? req.files : []

        if (files.length === 0) {
            return res.status(400).json({
                message: 'At least one image is required',
                success: false
            })
        }

        const images = await Promise.all(files.map(async (file)=> {
            return await uploadFile(file.buffer, file.originalname)
        }))

        const product = await productModel.create({
            title,
            description,
            price: {
                amount: priceAmount,
                currency: priceCurrency || 'INR'
            },
            images,
            seller: seller._id
        })

        return res.status(201).json({
            message: 'Product created successfully',
            success: true,
            product
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message || 'Failed to create product',
            success: false
        })
    }
}

export async function getSellerProducts(req, res) {
    const seller = req.user
    const products= await productModel.find({ seller: seller._id })

    res.status(200).json({
        message: 'Products fetched successfully',
        success: true, 
        products 
    })
}
