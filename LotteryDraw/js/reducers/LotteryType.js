import * as AcitonType from '../configs/ActionType'

const initialState = {
    DataList: null,
    Data: null,
    Opertion: null
}

export default function (state = initialState, action) {
    switch (action.type) {
        case AcitonType.GetLotteryTypeList:
            return {
                ...state,
                Opertion: null,
                DataList: action.data
            }
        case AcitonType.GetLotteryType:
            return {
                ...state,
                Opertion: null,
                Data: action.data
            }
        case AcitonType.SaveLotteryType:
            return {
                ...state,
                DataList: null,
                Opertion: {
                    ...action.data,
                    ActionType: action.type
                }
            }
        case AcitonType.DeleteLotteryType:
            return {
                ...state,
                Opertion: {
                    ...action.data,
                    ActionType: action.type
                }
            }
        case AcitonType.InitLotteryTypeState:
            return initialState
        default:
            return state
    }
}