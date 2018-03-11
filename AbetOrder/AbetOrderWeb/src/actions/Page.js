import * as Common from "../utils/Common"
import Index from "./Index"

export default class Page extends Index {
    constructor(options) {
        super(options)
    }

    Alert(action) {
        let message = Common.CreateGuid().substr(0, 8) + action.Message
        this.Page.Dispatch(action, message)
    }

    PropsChanged(props, nextProps) {
        this.SetAlert(nextProps)
    }

    SetAlert(nextProps) {
        if (this.Page.JudgeChanged(nextProps, "AlertMessage")) {
            let message = nextProps.AlertMessage
            if (Common.IsNullOrEmpty(message)) return

            message = message.substring(8)
            //Toast.info(message)
        }
    }
}