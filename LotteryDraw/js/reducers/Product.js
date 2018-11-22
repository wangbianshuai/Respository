import * as AcitonType from '../configs/ActionType'

const initialState = {
    DataList: null,
    Data: null,
    Opertion: null
}

export default function (state = initialState, action) {
    switch (action.type) {
        case AcitonType.GetProductList:
            return {
                ...state,
                Opertion: null,
                DataList: action.data
            }
        case AcitonType.GetProduct:
            return {
                ...state,
                Opertion: null,
                Data: action.data
            }
        case AcitonType.SaveProduct:
            return {
                ...state,
                DataList: null,
                Opertion: {
                    ...action.data,
                    ActionType: action.type
                }
            }
        case AcitonType.DeleteProduct:
            return {
                ...state,
                Opertion: {
                    ...action.data,
                    ActionType: action.type
                }
            }
        case AcitonType.InitProductState:
            return initialState
        default:
            return state
    }
}