import { useDispatch } from "react-redux";
import { setError, setLoading, setUser } from "../state/auth.slice";
import { register, login, getMe } from "../service/auth.api";

export const useAuth = () => {
    const dispatch = useDispatch()

    async function handleRegister({ email, contact, password, fullname , isSeller=false}) {
        dispatch(setLoading(true))
        dispatch(setError(null))

        try {
            const data = await register({ email, contact, password, fullname , isSeller})
            dispatch(setUser(data.user))
        } catch (error) {
            dispatch(setError(error.message))
        } finally {
            dispatch(setLoading(false))
        }
    }

    async function handleLogin({ email, password }) {
        dispatch(setLoading(true))
        dispatch(setError(null))

    
    async function handleGetMe() {
        dispatch(setLoading(true))
        dispatch(setError(null))
        try {
            const data = await getMe()
            dispatch(setUser(data.user))
            return data.user
        } catch (error) {
            dispatch(setError(error.message))
            dispatch(setUser(null))
            return null
        } finally {
            dispatch(setLoading(false))
        }
    }
        try {
            const data = await login({ email, password })
            dispatch(setUser(data.user))
            return { success: true, user: data.user }
        } catch (error) {
            dispatch(setError(error.message))
            return { success: false, error: error.message }
        } finally {
            dispatch(setLoading(false))
        }
    }

    async function handleGetMe() {
    try {
        dispatch(setLoading(true))
      const data = await getMe()
      dispatch(setUser(data.user))
    } catch (error) {
        dispatch(setError(error.message))
    }finally{
        dispatch(setLoading(false))
    }
      
       
    }
    return {handleRegister, handleLogin, handleGetMe}
} 