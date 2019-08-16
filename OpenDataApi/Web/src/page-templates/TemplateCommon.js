import { AjaxRequest, EnvConfig } from "UtilsCommon";
import DvaIndex from "DvaCommon";

export default class TemplateCommon {

    static InitModels(config) {
        if (!config) return;
        const app = window.g_app;
        if (app && app._models.filter(f => f.namespace === config.Name).length === 0) app.model(DvaIndex(config))
    }

    static GetConfig(pageName) {
        window.PageConfigs = window.PageConfigs || {};
        if (!window.PageConfigs[pageName]) {
            const name = pageName.replace("_", "/");
            var url = `/html/configs/${name}.json`
            if (EnvConfig.Env === "local") url = "/html/configs/getconfig?name=" + pageName;

            AjaxRequest.GetRequest(url, {}, (res) => {
                if (res.IsSuccess === false) alert(res.Message)
                else window.PageConfigs[pageName] = res;
            }, false);
        }
        return window.PageConfigs[name];
    }

    static MapStateToProps(config) {
        const getServiceName = (serviceName) => serviceName || config.Name;

        return (state, ownProps) => {
            const states = {};
            config.ActionList.forEach(a => states[a.ActionName] = state[getServiceName(a.ServiceName)][a.StateName])

            const props = StaticIndex.MapStateToProps(state, ownProps, states);

            !EnvConfig.IsProd && console.log(props);
            return props;
        }
    }
}