import { API_URL } from "../global"
import { encryptClient, get, post } from "../lib/action"
import { getCookies } from "../lib/server-cookie"


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

export async function verifyRoles(){
    const url = `${API_URL}/profile`
    const data = await get(url)
    return data.data
}


export async function logout() {
    const url = `${API_URL}/logout`
    const data = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${await getCookies('token')}`
        }
    })
    return data
}