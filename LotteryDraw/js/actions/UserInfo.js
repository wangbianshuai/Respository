import * as api from '../api/Index'
import * as ActionType from '../configs/ActionType'
import * as actions from '../actions/Index'

export function GetUserList(lotteryTypeId) {
    return actions.DispatchAction(() => api.GetUserList(lotteryTypeId), ActionType.GetUserList)
}