import { addItem, getCart, incrementCartItemApi } from '../service/cart.api'
import { useDispatch } from 'react-redux'
import { addItem as addItemToStore, setItems, incrementCartItem } from '../state/cart.slice'

export const useCart = () => {
    const dispatch = useDispatch()

    async function handleAddToCart(productId, variantId) {
        try {
            const data = await addItem(productId, variantId)
            // Optionally update local store (if server returns cart or success)
            // dispatch(addItemToStore({ productId, variantId }))
            return data
        } catch (err) {
            console.error('Add to cart failed', err)
            throw err
        }
    }

    async function handleGetCart() {
        const data = await getCart()
        dispatch(setItems(data.cart.items))
    }

    async function handleIncrementCartItem(productId, variantId) {
        try {
            const data = await incrementCartItemApi({ productId, variantId })
            dispatch(incrementCartItem({ productId, variantId }))
            return data
        } catch (err) {
            console.error('Increment cart item failed', err)
            throw err
        }
    }

    return { handleAddToCart, handleGetCart, handleIncrementCartItem }
}