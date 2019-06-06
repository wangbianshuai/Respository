import BaseIndex from "./BaseIndex";
import { Common } from "UtilsCommon";

export default class Page extends BaseIndex {

    ToPage(props, action) {
        const { EventActions } = props;
        const url = Common.ReplaceDataContent(EventActions.PageData, action.PageUrl);
        EventActions.ToPage(url)
    }

    OpenUrl(props, action) {
        const { EventActions } = props;
        const url = Common.ReplaceDataContent(EventActions.PageData, action.PageUrl);
        EventActions.OpenPage(url);
    }

    ToAttachPage(props, action) {
        const url = "http://stage.xxd.com/digital/digital.html"
        window.open(url)
    }
}