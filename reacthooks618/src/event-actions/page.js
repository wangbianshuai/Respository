import BaseIndex from "./BaseIndex";
import { Common } from "UtilsCommon";

export default class Page extends BaseIndex {

    ToPage(props, action) {
        const { pageAxis } = props;
        var url = Common.replaceDataContent(pageAxis.PageData, action.PageUrl, true);
        const expandsetPageUrl = pageAxis.getFunction(action.expandsetPageUrl);
        if (expandsetPageUrl) url = expandsetPageUrl(url);
        pageAxis.ToPage(url)
    }

    OpenUrl(props, action) {
        const { pageAxis } = props;
        let url = Common.replaceDataContent(pageAxis.PageData, action.PageUrl, true);
        if (action.isAddBasePath) url = window.routerBase + url;
        pageAxis.OpenPage(url);
    }


    setPropertiesVisible(props, action) {
        if (!action.Parameters) this.InitsetPropertiesVisible(props, action);

        const { Properties } = action.Parameters;
        const { property } = props;

        this.setViewPropertiesVisible(Properties, property.isexpanded)
    }

    InitsetPropertiesVisible(props, action) {
        const { pageAxis } = props;

        const Properties = action.Properties.map(m => pageAxis.getView(m));

        action.Parameters = { Properties };
    }

    setPropertiesexpandCollapse(props, action) {
        if (!action.Parameters) this.InitsetPropertiesexpandCollapse(props, action);

        const { Properties } = action.Parameters;
        const { property } = props;

        this.setViewPropertiesexpanded(Properties, property.isexpanded)
    }

    InitsetPropertiesexpandCollapse(props, action) {
        const { pageAxis } = props;

        const Properties = action.Properties.map(m => pageAxis.getView(m));

        action.Parameters = { Properties };
    }
}