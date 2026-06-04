import cartModel from "../models/cart.model.js";
import mongoose from "mongoose";

export async function getCartDetails(userId) {
    let cart = (await cartModel.aggregate([
        {
            $match: {
                user: new mongoose.Types.ObjectId(userId)
            }
        },
        { $unwind: { path: '$items' } },
        {
            $lookup: {
                from: 'products',
                localField: 'items.product',
                foreignField: '_id',
                as: 'items.product'
            }
        },
        { $unwind: { path: '$items.product' } },
        {
            // For items WITH a variant, find the matching variant
            // For items WITHOUT a variant, keep the item as-is
            $addFields: {
                'items.matchedVariant': {
                    $cond: {
                        if: { $ifNull: ['$items.variant', false] },
                        then: {
                            $arrayElemAt: [
                                {
                                    $filter: {
                                        input: '$items.product.variants',
                                        as: 'v',
                                        cond: { $eq: ['$$v._id', '$items.variant'] }
                                    }
                                },
                                0
                            ]
                        },
                        else: null
                    }
                }
            }
        },
        {
            $addFields: {
                itemPrice: {
                    price: {
                        $multiply: [
                            '$items.quantity',
                            {
                                $ifNull: [
                                    '$items.matchedVariant.price.amount',
                                    { $ifNull: ['$items.price.amount', '$items.product.price.amount'] }
                                ]
                            }
                        ]
                    },
                    currency: {
                        $ifNull: [
                            '$items.matchedVariant.price.currency',
                            { $ifNull: ['$items.price.currency', '$items.product.price.currency'] }
                        ]
                    }
                }
            }
        },
        {
            $group: {
                _id: '$_id',
                totalPrice: { $sum: '$itemPrice.price' },
                currency: {
                    $first: '$itemPrice.currency'
                },
                items: { $push: '$items' }
            }
        }
    ]))[0]

    return cart
}