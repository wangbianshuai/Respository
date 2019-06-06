import React from "react";
import { connect } from "dva";
import { BaseIndex, RootPage, ConnectAction, StaticIndex } from "ReactCommon";
import { EnvConfig } from "UtilsCommon";
import Components from "Components";

class BackMethodEdit extends BaseIndex {
    constructor(props) {
        super(props);

        this.Name = "CommonConfig_BackMethodEdit";
        
        this.InitEventAction();
    }

    render() {
        return <Components.PropertyItem Property={this.PageConfig} EventActions={this.EventActions} />
    }
}

function mapStateToProps(state, ownProps) {
    const props = StaticIndex.MapStateToProps(state, ownProps, {
        EntityData: state.BackMethodService.EntityData,
        SaveEntityData: state.BackMethodService.SaveEntityData
    });

    !EnvConfig.IsProd && console.log(props);
    return props;
}

export default connect(mapStateToProps, StaticIndex.MapDispatchToProps)(RootPage(ConnectAction("CommonConfig_BackMethodEdit", BackMethodEdit)));