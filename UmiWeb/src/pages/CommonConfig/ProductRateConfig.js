import React from "react";
import { connect } from "dva";
import { BaseIndex, RootPage, ConnectAction, StaticIndex } from "ReactCommon";
import { EnvConfig } from "UtilsCommon";
import Components from "Components";

class ProductRateConfig extends BaseIndex {
    constructor(props) {
        super(props);

        this.Name = "CommonConfig_ProductRateConfig";

        this.InitEventAction();
    }

    render() {
        return <Components.View Property={this.PageConfig} EventActions={this.EventActions} />
    }
}

function mapStateToProps(state, ownProps) {
    const props = StaticIndex.MapStateToProps(state, ownProps, {
        DataList: state.ProductRateService.DataList,
        DeleteEntityData: state.ProductRateService.DeleteEntityData
    });

    !EnvConfig.IsProd && console.log(props);
    return props;
}

export default connect(mapStateToProps, StaticIndex.MapDispatchToProps)(RootPage(ConnectAction("CommonConfig_ProductRateConfig", ProductRateConfig)));