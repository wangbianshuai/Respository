import BaseIndex from "./BaseIndex";
import { Common } from "UtilsCommon";

export default class Page extends BaseIndex {

    ToPage(props, action) {
        const { EventActions } = props;
        var url = Common.ReplaceDataContent(EventActions.PageData, action.PageUrl, true);
        const ExpandSetPageUrl = EventActions.GetFunction(action.ExpandSetPageUrl);
        if (ExpandSetPageUrl) url = ExpandSetPageUrl(url);
        EventActions.ToPage(url)
    }

    OpenUrl(props, action) {
        const { EventActions } = props;
        let url = Common.ReplaceDataContent(EventActions.PageData, action.PageUrl, true);
        if (action.IsAddBasePath) url = window.routerBase + url;
        EventActions.OpenPage(url);
    }


    SetPropertiesVisible(props, action) {
        if (!action.Parameters) this.InitSetPropertiesVisible(props, action);

        const { Properties } = action.Parameters;
        const { Property } = props;

        this.SetViewPropertiesVisible(Properties, Property.IsExpanded)
    }

    InitSetPropertiesVisible(props, action) {
        const { EventActions } = props;

        const Properties = action.Properties.map(m => EventActions.GetView(m));

        action.Parameters = { Properties };
    }

    SetPropertiesExpandCollapse(props, action) {
        if (!action.Parameters) this.InitSetPropertiesExpandCollapse(props, action);

        const { Properties } = action.Parameters;
        const { Property } = props;

        this.SetViewPropertiesExpanded(Properties, Property.IsExpanded)
    }

    InitSetPropertiesExpandCollapse(props, action) {
        const { EventActions } = props;

        const Properties = action.Properties.map(m => EventActions.GetView(m));

        action.Parameters = { Properties };
    }
}