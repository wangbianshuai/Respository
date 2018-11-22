import * as api from '../api/User'
import * as ActionType from '../configs/ActionType'
import * as actions from '../actions/Index'

export function UserLogin(loginName, loginPassword) {
    return actions.DispatchAction(() => api.UserLogin(loginName, loginPassword), ActionType.UserLogin)
}