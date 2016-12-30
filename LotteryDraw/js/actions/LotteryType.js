import * as api from '../api/Index'
import * as ActionType from '../configs/ActionType'
import * as actions from '../actions/Index'

export function GetLotteryTypeList() {
    return actions.DispatchAction(api.GetLotteryTypeList, ActionType.GetLotteryTypeList)
}

export function GetLotteryType(id) {
    return actions.DispatchAction(() => api.GetLotteryType(id), ActionType.GetLotteryType)
}

export function SaveLotteryType(entityData) {
    return actions.DispatchAction((dispatch) => api.SaveLotteryType(entityData), ActionType.SaveLotteryType)
}

export function DeleteLotteryType(id){
     return actions.DispatchAction(() => api.DeleteLotteryType(id), ActionType.DeleteLotteryType)
}
