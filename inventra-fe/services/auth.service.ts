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
    const data = await post('/login', await encryptClient(JSON.stringify(payload)))

    return data
}
export async function register(payload: register): Promise<any> {
    const data = await post('/register', await encryptClient(JSON.stringify(payload)))
    return data
}

export async function verifyRoles(){
    const data = await get('/profile')
    return data.data
}


export async function logout() {
    const token = await getCookies('token')
    const data = await post('/logout', "", token)
    return data
}