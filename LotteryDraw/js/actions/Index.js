export function DispatchAction(apiAction, actionType) {
    return (dispatch) => {
        return apiAction().then(res => {
            dispatch({
                type: actionType,
                data: res
            })
            return Promise.resolve(res)
        }).catch((e) => {
            return Promise.reject(e)
        })
    }
}
