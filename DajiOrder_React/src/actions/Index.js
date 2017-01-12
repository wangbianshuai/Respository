import * as Common from "../utils/Common"

export function DispatchAction(apiAction, actionType) {
    return (dispatch) => {
        return apiAction().then(res => {
            dispatch({
                type: actionType,
                data: res
            })
            return Promise.resolve(res)
        }).catch((e) => {
            dispatch({
                type: actionType,
                data: { Ack: { IsSuccess: false, Id: Common.CreateGuid(), Message: e.message } }
            })
            return Promise.reject(e)
        })
    }
}