import { setError, setLoading, setUser } from "../state/auth.slice";
import { register } from "../service/auth.api";

export const useAuth = () => {
    async function handleRegister({ email, contact, password, fullname , isSeller=false}) {

        const data = await register({ email, contact, password, fullname , isSeller})
        dispatch(setUser(data.user))
    }
    return {handleRegister}
} 