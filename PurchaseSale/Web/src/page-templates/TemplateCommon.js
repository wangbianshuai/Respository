import { AjaxRequest, EnvConfig } from "UtilsCommon";
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
            var url = `/html/configs/${name}.json`
            if (window.location.href.indexOf("localhost") > 0) url = "/html/configs/getconfig?name=" + pageName;

            AjaxRequest.GetRequest(url, {}, (res) => {
                if (res.IsSuccess === false) alert(res.Message)
                else window.PageConfigs[pageName] = res;
            }, false);
        }
        return window.PageConfigs[pageName];
    }

    static MapStateToProps(config, actionNames) {
        const getServiceName = (serviceName) => serviceName || config.Name;

        return (state, ownProps) => {
            const states = {};
            config.ActionList.forEach(a => {
                if (a.IsExpand || (actionNames && actionNames.indexOf(a.ActionName) >= 0)) states[a.ActionName] = state[getServiceName(a.ServiceName)][a.StateName]
            });

            const props = StaticIndex.MapStateToProps(state, ownProps, states);

            !EnvConfig.IsProd && console.log(props);
            return props;
        }
    }
}