import React from "react";
import { connect } from "dva";
import { BaseIndex, RootPage, ConnectAction, StaticIndex } from "ReactCommon";
import { EnvConfig } from "UtilsCommon";
import Components from "Components";

class PlatformServiceRateEdit extends BaseIndex {
    constructor(props) {
        super(props);

        this.Name = "CommonConfig_PlatformServiceRateEdit";
        
        this.InitEventAction();
    }

    render() {
        return <Components.PropertyItem Property={this.PageConfig} EventActions={this.EventActions} />
    }
}

function mapStateToProps(state, ownProps) {
    const props = StaticIndex.MapStateToProps(state, ownProps, {
        EntityData: state.PlatformRateService.EntityData,
        SaveEntityData: state.PlatformRateService.SaveEntityData
    });

    !EnvConfig.IsProd && console.log(props);
    return props;
}

export default connect(mapStateToProps, StaticIndex.MapDispatchToProps)(RootPage(ConnectAction("CommonConfig_PlatformServiceRateEdit", PlatformServiceRateEdit)));