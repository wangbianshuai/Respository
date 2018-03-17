import * as Common from "../utils/Common";

export default class ContentEdit {
    constructor(pageConfig, page) {
        this.PageConfig = pageConfig;
        this.Page = page;
        this.InitLoad()
    }

    InitLoad() {
        this.Page.ExpandActions.Publish = (property, params) => this.Publish(property, params);
        this.Page.ExpandActions.Preview = (property, params) => this.Preview(property, params);
    }

    Publish(property, params){

    }

    Preview(property, params){

    }
}