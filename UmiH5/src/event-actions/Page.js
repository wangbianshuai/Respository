import BaseIndex from "./BaseIndex";

export default class Page extends BaseIndex {

    ToPage(props, action) {
        const { EventActions } = props;
        EventActions.ToPage(action.PageUrl)
    }

    OpenUrl(props, action) {
        const { EventActions } = props;
        EventActions.OpenPage(action.PageUrl);
    }
}