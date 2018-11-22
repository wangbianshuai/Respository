import * as AcitonType from '../configs/ActionType'

const initialState = {
    DataList: null
}

export default function (state = initialState, action) {
    switch (action.type) {
        case AcitonType.GetUserList:
            return {
                ...state,
                DataList: action.data
            }
        case AcitonType.InitUserInfoState:
            return initialState
        default:
            return state
    }
}