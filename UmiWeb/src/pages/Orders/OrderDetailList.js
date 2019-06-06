import React from "react";
import { connect } from "dva";
import { BaseIndex, RootPage, ConnectAction, StaticIndex } from "ReactCommon";
import { EnvConfig, Common, Md5 } from "UtilsCommon";
import Components from "Components";

class OrderDetailList extends BaseIndex {
    constructor(props) {
        super(props);

        this.Name = "Orders_OrderDetailList";
        this.MenuKey = "OrderDetailList";

        this.InitEventAction();
    }

    SetLookOrderDetailUrl({ data, props, action }) {
        let url = Common.ReplaceDataContent(data, action.PageUrl);
        const id = Common.CreateGuid();
        Common.SetStorage("OrderDetailSubmitId", id);
        url += "&SubmitId=" + Md5(id);
        return url;
    }

    render() {
        return <Components.PropertyItem Property={this.PageConfig} EventActions={this.EventActions} />
    }
}

function mapStateToProps(state, ownProps) {
    const props = StaticIndex.MapStateToProps(state, ownProps, {
        SearchQuery: state.OrderService.QueryOrderDetailList
    });

    !EnvConfig.IsProd && console.log(props);
    return props;
}

export default connect(mapStateToProps, StaticIndex.MapDispatchToProps)(RootPage(ConnectAction("Orders_OrderDetailList", OrderDetailList)));