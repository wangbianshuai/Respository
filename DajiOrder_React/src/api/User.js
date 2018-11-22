import * as api from '../api/Index'

export function UserLogin(loginName, loginPassword) {
    const data = { loginName, loginPassword }
    const url = "User/Login"
    
    return api.PostFetch(url, data)
}