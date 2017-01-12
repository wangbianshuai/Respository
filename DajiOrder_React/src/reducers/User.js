import * as AcitonType from '../configs/ActionType'

const initialState = {
    DataList: null,
    Data: null,
    LoginInfo: null
}

export default function (state = initialState, action) {
    switch (action.type) {
        case AcitonType.UserLogin:
            return {
                ...state,
                LoginInfo: action.data
            }
        default:
            return state
    }
}