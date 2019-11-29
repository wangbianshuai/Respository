import { useEffect, useMemo } from "react";
import { PageAxis, RootPage, useConnectAction } from "ReactCommon";
import { Common } from "UtilsCommon";
import Components from "Components";

import TemplateCommon from "./TemplateCommon";

const Name = "EntityEdit";

export default (config) => {
    const pageConfig = TemplateCommon.GetPageConfig(config);
    if (!pageConfig) return null;

    const Init = (pageAxis) => {
        pageAxis.Name = pageConfig.PageName;
        if (pageConfig.ActionOptions) pageAxis.ActionTypes = pageConfig.ActionOptions.ActionTypes;
        if (pageConfig.PageExpand) Common.Inherit(pageAxis, pageConfig.PageExpand);

        if (pageAxis.ExpandInit) pageAxis.ExpandInit();

        return pageAxis
    }

    const EntityEdit = (props) => {
        const [invoke, actionTypes, actionData] = useConnectAction(Name, pageConfig.ActionOptions)
        const pageAxis = useMemo(() => new PageAxis(Name), []);

        pageAxis.InitSet(props, invoke, actionTypes, Init);

        useEffect(() => pageAxis.ReceiveActionData(actionData), [pageAxis, actionData]);

        return <Components.PropertyItem Property={this.PageConfig} PageAxis={this.PageAxis} />
    }

    TemplateCommon.InitModels(pageConfig.ModelsConfig);

    return RootPage(EntityEdit, TemplateCommon.MapStateToProps(pageConfig.ModelsConfig, pageConfig.ActionNames));
}

