import BaseIndex from './baseIndex';
import { Common } from "UtilsCommon";

export default class Page extends BaseIndex {

    toPage(props, action) {
        const { pageAxis } = props;
        var url = Common.replaceDataContent(pageAxis.pageData, action.pageUrl, true);
        const expandSetPageUrl = pageAxis.getFunction(action.expandSetPageUrl);
        if (expandSetPageUrl) url = expandSetPageUrl(url);
        pageAxis.toPage(url)
    }

    openUrl(props, action) {
        const { pageAxis } = props;
        let url = Common.replaceDataContent(pageAxis.pageData, action.pageUrl, true);
        if (action.isAddBasePath) url = window.routerBase + url;
        pageAxis.openPage(url);
    }


    setPropertiesVisible(props, action) {
        if (!action.parameters) this.initSetPropertiesVisible(props, action);

        const { properties } = action.parameters;
        const { property } = props;

        this.setViewPropertiesVisible(properties, property.isExpanded)
    }

    initSetPropertiesVisible(props, action) {
        const { pageAxis } = props;

        const properties = action.properties.map(m => pageAxis.getProperty(m));

        action.parameters = { properties };
    }

    setPropertiesexpandCollapse(props, action) {
        if (!action.parameters) this.initSetPropertiesexpandCollapse(props, action);

        const { properties } = action.parameters;
        const { property } = props;

        this.setViewPropertiesexpanded(properties, property.isExpanded)
    }

    initSetPropertiesexpandCollapse(props, action) {
        const { pageAxis } = props;

        const properties = action.properties.map(m => pageAxis.getProperty(m));

        action.parameters = { properties };
    }

    collect(props, action) {
        const { isCollect, actionType, favoritesStart, pageAxis } = props;

        pageAxis.receives[actionType] = (d) => this.receivecollect(d, props, action);

        const { articleType } = favoritesStart;
        const articleUID = pageAxis.pageData.UID

        const data = { isCollect, articleType, articleUID }

        pageAxis.invokeDataAction(actionType, data);
    }

    receivecollect(data, props, action) {
        const { pageAxis, favoritesStart, isCollect } = props;
        if (this.isSuccessNextsProps(data, pageAxis.alert, null)) {
            favoritesStart.refresh(!isCollect);
            pageAxis.alertSuccess(isCollect ? '取消成功！' : '收藏成功！')
        }

        return false;
    }
}