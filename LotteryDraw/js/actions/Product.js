import * as api from '../api/Index'
import * as ActionType from '../configs/ActionType'
import * as actions from '../actions/Index'

export function GetProductList() {
    return actions.DispatchAction(api.GetProductList, ActionType.GetProductList)
}

export function GetProduct(id) {
    return actions.DispatchAction(() => api.GetProduct(id), ActionType.GetProduct)
}

export function SaveProduct(entityData) {
    return actions.DispatchAction((dispatch) => api.SaveProduct(entityData), ActionType.SaveProduct)
}

export function DeleteProduct(id){
     return actions.DispatchAction(() => api.DeleteProduct(id), ActionType.DeleteProduct)
}
