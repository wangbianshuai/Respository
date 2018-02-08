import * as Common from "../utils/Common"
import Index from "./Index"

export default class Query extends Index {
    constructor(options) {
        super(options)
    }

    PropsChanged(props, nextProps) {
        this.SearchData(nextProps)
    }

    SearchData(nextProps) {
        if (this.Page.JudgeChanged(nextProps, "DataList")) {
           
        }
    }
}