import React from "react";
import { connect } from "dva";
import { BaseIndex, RootPage, ConnectAction, StaticIndex } from "ReactCommon";
import { EnvConfig, Common, Md5, } from "UtilsCommon";
import Components from "Components";

class QueryOrderList extends BaseIndex {
    constructor(props) {
        super(props);

        this.Name = "Orders_QueryOrderList";
        this.MenuKey = "QueryOrderList";

        this.InitEventAction();
    }

    SetEditOrderPageUrl({ data, props, action }) {
        let url = Common.ReplaceDataContent(data, action.PageUrl);
        const editId = Common.CreateGuid();
        Common.SetStorage("OrderDetailEditId", editId);
        url += "&EditId=" + Md5(editId);
        return url;
    }

    render() {
        return <Components.PropertyItem Property={this.PageConfig} EventActions={this.EventActions} />
    }
}

function mapStateToProps(state, ownProps) {
    const props = StaticIndex.MapStateToProps(state, ownProps, {
        SearchQuery: state.OrderService.QueryOrderList,
        UserList: state.ApiService.UserList,
        CancelOrder: state.OrderService.CancelOrder,
        ChangeUser: state.OrderService.ChangeUser
    });

    !EnvConfig.IsProd && console.log(props);
    return props;
}

export default connect(mapStateToProps, StaticIndex.MapDispatchToProps)(RootPage(ConnectAction("Orders_QueryOrderList", QueryOrderList)));