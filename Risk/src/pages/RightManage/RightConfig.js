import React from "react";
import { connect } from "dva";
import { BaseIndex, RootPage, ConnectAction, StaticIndex } from "ReactCommon";
import { EnvConfig } from "UtilsCommon";
import Components from "Components";

class RightConfig extends BaseIndex {
    constructor(props) {
        super(props);

        this.Name = "RightManage_RightConfig";

        this.InitEventAction();
    }

    render() {
        return <Components.PropertyItem Property={this.PageConfig} EventActions={this.EventActions} />
    }
}

function mapStateToProps(state, ownProps) {
    const props = StaticIndex.MapStateToProps(state, ownProps, {
        GetEntityData: state.RoleService.GetRightConfig,
        SaveEntityData: state.RoleService.UpdateRightConfig
    });

    !EnvConfig.IsProd && console.log(props);
    return props;
}

export default connect(mapStateToProps, StaticIndex.MapDispatchToProps)(RootPage(ConnectAction("RightManage_RightConfig", RightConfig)));