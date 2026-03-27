import { API_URL } from "../global"
import { encryptClient, post } from "../lib/action"


interface register {
    username: string,
    email: string,
    password: string
}
interface login {

    email: string,
    password: string
}



export async function signIn(payload: login): Promise<any> {
    const url = `${API_URL}/login`
    const data = await post(url, await encryptClient(JSON.stringify(payload)))

    return data
}
export async function register(payload: register): Promise<any> {
    const url = `${API_URL}/register`
    const data = await post(url, await encryptClient(JSON.stringify(payload)))
    return data
}