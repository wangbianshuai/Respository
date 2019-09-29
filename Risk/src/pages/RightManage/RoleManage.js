import React from "react";
import { connect } from "dva";
import { BaseIndex, RootPage, ConnectAction, StaticIndex } from "ReactCommon";
import { EnvConfig, Common } from "UtilsCommon";
import Components from "Components";

class RoleManage extends BaseIndex {
    constructor(props) {
        super(props);

        this.Name = "RightManage_RoleManage";
        this.MenuKey = "RoleManage";

        this.InitEventAction();
    }

    SetEditRolePageUrl({ data, props, action }) {
        if (data.deleteState === "01") {
            const { AlertMessage } = action.Parameters;
            AlertMessage.SetValue("该角色已删除！")
            return false;
        }
        return Common.ReplaceDataContent(data, action.PageUrl);
    }

    render() {
        return <Components.PropertyItem Property={this.PageConfig} EventActions={this.EventActions} />
    }
}

function mapStateToProps(state, ownProps) {
    const props = StaticIndex.MapStateToProps(state, ownProps, {
        SearchQuery: state.RoleService.DataList,
        DeleteEntityData: state.RoleService.DeleteEntityData
    });

    !EnvConfig.IsProd && console.log(props);
    return props;
}

export default connect(mapStateToProps, StaticIndex.MapDispatchToProps)(RootPage(ConnectAction("RightManage_RoleManage", RoleManage)));