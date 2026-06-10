import axios from 'axios';
import { API_BASE_URL } from '../../../config/api';

const cartApiInstance = axios.create({
    baseURL: `${API_BASE_URL}/api/cart`,
    withCredentials: true
});


export const addItem = async (productId, variantId)  => {
    const url = variantId ? `/add/${productId}/${variantId}` : `/add/${productId}`
    const response = await cartApiInstance.post(url, {quantity: 1})

    return response.data
}

export const getCart = async () => {
    const response = await cartApiInstance.get('/')
    return response.data
}

export const incrementCartItemApi = async ({productId, variantId}) => {
    const url = variantId ? `/quantity/increment/${productId}/${variantId}` : `/quantity/increment/${productId}`
    const response = await cartApiInstance.patch(url)
    return response.data
}