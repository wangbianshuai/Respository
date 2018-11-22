import * as api from '../api/Index'
import * as ActionType from '../configs/ActionType'
import * as actions from '../actions/Index'

export function GetLotteryRecordList(lotteryTypeId, productId) {
    return actions.DispatchAction(() => api.GetLotteryRecordList(lotteryTypeId, productId), ActionType.GetLotteryRecordList)
}

export function SetLotteryStatusInValid(id) {
    return actions.DispatchAction(() => api.SetLotteryStatusInValid(id), ActionType.SetLotteryStatusInValid)
}

export function SaveLotteryRecordList(recordList) {
    return actions.DispatchAction(() => api.SaveLotteryRecordList(recordList), ActionType.SaveLotteryRecordList)
}