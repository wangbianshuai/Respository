import { AjaxRequest, EnvConfig, Common } from "UtilsCommon";
import { StaticIndex } from "ReactCommon";
import DvaIndex from "DvaCommon";

export default class TemplateCommon {

    static InitModels(config) {
        if (!config) return;
        const app = window.g_app;
        if (app && app._models.filter(f => f.namespace === config.Name).length === 0) app.model(DvaIndex(config))
    }

    static GetPageConfig(config) {
        var pageConfig = null;
        if (typeof config === "string") {
            pageConfig = TemplateCommon.GetConfig(config);
            if (!pageConfig) return null;

            pageConfig.PageName = config;
        }
        else pageConfig = config;

        return pageConfig;
    }

    static GetConfig(pageName) {
        window.PageConfigs = window.PageConfigs || {};
        if (!window.PageConfigs[pageName]) {
            const name = pageName.replace("_", "/");
            var url = `/configs/${name}.json`
            if (window.location.href.indexOf("localhost") > 0) url = "/configs/getconfig?name=" + pageName;

            url = Common.AddUrlRandom(url)
            AjaxRequest.GetRequest(url, {}, (res) => {
                if (res.IsSuccess === false) alert(res.Message)
                else window.PageConfigs[pageName] = res;
            }, false);
        }
        return window.PageConfigs[pageName];
    }

    static MapStateToProps(config, actionNames, expandMapStateToProps) {
        const getServiceName = (serviceName) => serviceName || config.Name;

        return (state, ownProps) => {
            let props = {};
            config.ActionList.forEach(a => {
                if (a.IsExpand || (actionNames && actionNames.indexOf(a.ActionName) >= 0)) props[a.ActionName] = state[getServiceName(a.ServiceName)][a.StateName]
            });

            if (expandMapStateToProps) props = expandMapStateToProps(state, ownProps, props);

            props = StaticIndex.MapStateToProps(state, ownProps, props);

            !EnvConfig.IsProd && console.log(props);
            return props;
        }
    }
}