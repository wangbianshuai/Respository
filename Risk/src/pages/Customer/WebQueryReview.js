import React from "react";
import { connect } from "dva";
import { BaseIndex, RootPage, ConnectAction, StaticIndex } from "ReactCommon";
import { EnvConfig } from "UtilsCommon";
import Components from "Components";

class WebQueryReview extends BaseIndex {
    constructor(props) {
        super(props);

        this.Name = "Customer_WebQueryReview";
        this.MenuKey = "WebQueryReview";

        this.InitEventAction();
    }

    render() {
        return <Components.PropertyItem Property={this.PageConfig} EventActions={this.EventActions} />
    }
}

function mapStateToProps(state, ownProps) {
    const props = StaticIndex.MapStateToProps(state, ownProps, {
        SearchQuery: state.CreditService.GetNetCheckList,
        Review: state.CreditService.NetCheckReview
    });

    !EnvConfig.IsProd && console.log(props);
    return props;
}

export default connect(mapStateToProps, StaticIndex.MapDispatchToProps)(RootPage(ConnectAction("Customer_WebQueryReview", WebQueryReview)));