import * as Common from "../utils/Common"

export default class Index {
    constructor(options) {

        this.Id = options.Id || Common.CreateGuid()
        this.Page = options.Page
    }

    PropsChanged(props, nextProps) { }

}