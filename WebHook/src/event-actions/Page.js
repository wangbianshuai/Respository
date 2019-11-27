import BaseIndex from "./BaseIndex";
import { Common } from "UtilsCommon";

export default class Page extends BaseIndex {

    ToPage(props, action) {
        const { PageAxis } = props;
        var url = Common.ReplaceDataContent(PageAxis.PageData, action.PageUrl, true);
        const ExpandSetPageUrl = PageAxis.GetFunction(action.ExpandSetPageUrl);
        if (ExpandSetPageUrl) url = ExpandSetPageUrl(url);
        PageAxis.ToPage(url)
    }

    OpenUrl(props, action) {
        const { PageAxis } = props;
        const url = Common.ReplaceDataContent(PageAxis.PageData, action.PageUrl, true);
        PageAxis.OpenPage(url);
    }


    SetPropertiesVisible(props, action) {
        if (!action.Parameters) this.InitSetPropertiesVisible(props, action);

        const { Properties } = action.Parameters;
        const { Property } = props;

        this.SetViewPropertiesVisible(Properties, Property.IsExpanded)
    }

    InitSetPropertiesVisible(props, action) {
        const { PageAxis } = props;

        const Properties = action.Properties.map(m => PageAxis.GetView(m));

        action.Parameters = { Properties };
    }

    SetPropertiesExpandCollapse(props, action) {
        if (!action.Parameters) this.InitSetPropertiesExpandCollapse(props, action);

        const { Properties } = action.Parameters;
        const { Property } = props;

        this.SetViewPropertiesExpanded(Properties, Property.IsExpanded)
    }

    InitSetPropertiesExpandCollapse(props, action) {
        const { PageAxis } = props;

        const Properties = action.Properties.map(m => PageAxis.GetView(m));

        action.Parameters = { Properties };
    }
}