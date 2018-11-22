import * as AcitonType from '../configs/ActionType'

const initialState = {
    DataList: null,
    Opertion: null
}

export default function (state = initialState, action) {
    switch (action.type) {
        case AcitonType.GetLotteryRecordList:
            return {
                ...state,
                Opertion: null,
                DataList: action.data
            }
        case AcitonType.SetLotteryStatusInValid:
            return {
                ...state,
                DataList: null,
                Opertion: {
                    ...action.data,
                    ActionType: action.type
                }
            }
        case AcitonType.SaveLotteryRecordList:
            return {
                ...state,
                Opertion: {
                    ...action.data,
                    ActionType: action.type
                }
            }
        case AcitonType.InitLotteryRecordState:
            return initialState
        default:
            return state
    }
}