import React from "react";
import { connect } from "dva";
import { BaseIndex, RootPage, ConnectAction, StaticIndex } from "ReactCommon";
import Components from "Components";

import TemplateCommon from "./TemplateCommon";

export default (pageName) => {
    const pageConfig = TemplateCommon.GetConfig(pageName);
    if (!pageConfig) return null;

    class EntityEdit extends BaseIndex {
        constructor(props) {
            super(props);

            this.Name = pageConfig.PageName;

            this.InitEventAction();
        }

        render() {
            return <Components.PropertyItem Property={this.PageConfig} EventActions={this.EventActions} />
        }
    }

    TemplateCommon.InitModels(pageConfig.ModelsConfig);

    return connect(TemplateCommon.MapStateToProps(pageConfig.ModelsConfig), StaticIndex.MapDispatchToProps)(RootPage(ConnectAction("EntityEdit", EntityEdit, pageConfig.ActionOptions)));
}