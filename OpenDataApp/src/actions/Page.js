import * as Common from "../utils/Common"
import Index from "./Index"

export default class Page extends Index {
    constructor(options) {
        super(options)
    }

    Alert(action) {
        this.Page.Dispatch(action, { AlertMessage: action.Message })
    }
}