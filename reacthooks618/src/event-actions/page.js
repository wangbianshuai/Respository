import BaseIndex from "./BaseIndex";
import { Common } from "UtilsCommon";

export default class Page extends BaseIndex {

    ToPage(props, action) {
        const { pageAxis } = props;
        var url = Common.replaceDataContent(pageAxis.pageData, action.pageUrl, true);
        const expandsetPageUrl = pageAxis.getFunction(action.expandsetPageUrl);
        if (expandsetPageUrl) url = expandsetPageUrl(url);
        pageAxis.ToPage(url)
    }

    OpenUrl(props, action) {
        const { pageAxis } = props;
        let url = Common.replaceDataContent(pageAxis.pageData, action.pageUrl, true);
        if (action.isAddBasePath) url = window.routerBase + url;
        pageAxis.OpenPage(url);
    }


    setPropertiesVisible(props, action) {
        if (!action.Parameters) this.InitsetPropertiesVisible(props, action);

        const { properties } = action.Parameters;
        const { property } = props;

        this.setViewPropertiesVisible(properties, property.isexpanded)
    }

    InitsetPropertiesVisible(props, action) {
        const { pageAxis } = props;

        const properties = action.properties.map(m => pageAxis.getView(m));

        action.Parameters = { properties };
    }

    setPropertiesexpandCollapse(props, action) {
        if (!action.Parameters) this.InitsetPropertiesexpandCollapse(props, action);

        const { properties } = action.Parameters;
        const { property } = props;

        this.setViewPropertiesexpanded(properties, property.isexpanded)
    }

    InitsetPropertiesexpandCollapse(props, action) {
        const { pageAxis } = props;

        const properties = action.properties.map(m => pageAxis.getView(m));

        action.Parameters = { properties };
    }
}