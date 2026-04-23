import { API_URL } from "../global"
import { encryptClient, get, post } from "../lib/action"
import { getCookies } from "../lib/server-cookie"

interface CreateBusinessPayload {
    name: string;
    address: string;
    phone: string;
    email: string;
    website?: string;
    description?: string;
}

export async function createBusiness(payload: CreateBusinessPayload) {
    const url = `${API_URL}/bussiness`
    
    // We get the token, we need it to authorize the business creation
    const token = await getCookies('token');

    const data = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
    });
    
    const json = await data.json();
    return json;
}
