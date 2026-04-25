import axios from "axios"

const api = axios.create({
    baseURL: "/api/auth",
    withCredentials: true
})

export async function register({ email, contact, password, fullname, isSeller }) {
    try {
        const response = await api.post("/register", {
            email,
            contact,
            password,
            fullname,
            isSeller
        })
        return response.data
    } catch (error) {
        const message = error.response?.data?.message || error.response?.data?.errors?.[0]?.msg || error.message
        throw new Error(message)
    }
}

export async function login({ email, password }) {
    try {
        const response = await api.post("/login", {
            email, password
        })
        return response.data
    } catch (error) {
        const message = error.response?.data?.message || error.message
        throw new Error(message)
    }
}