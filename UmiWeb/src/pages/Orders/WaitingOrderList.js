import React from "react";
import { connect } from "dva";
import { BaseIndex, RootPage, ConnectAction, StaticIndex } from "ReactCommon";
import { EnvConfig, Common } from "UtilsCommon";
import Components from "Components";

class WaitingOrderList extends BaseIndex {
    constructor(props) {
        super(props);

        this.Name = "Orders_WaitingOrderList";

        this.InitEventAction();
    }

    componentDidMount() {
        this.SelectDataToListView = Common.ArrayFirst(this.PageConfig.DialogViews, (f) => f.Name === "SelectDataToListView");
        this.HandlerType = Common.ArrayFirst(this.SelectDataToListView.Properties, (f) => f.Name === "HandlerType");
        this.HandlerType.ValueChange = this.HandlerTypeChange.bind(this);
    }

    HandlerTypeChange(value) {
        this.SelectDataToListView.Properties.forEach(p => {
            if (p.Name !== "HandlerType") p.SetVisible(Common.IsEquals(value, 0))
        });
    }

    HandlerOrder(props, action) {
        //设置审核用户列表
        this.InvokeEventAction("SetApproveUsers", props);
    }

    render() {
        return <Components.View Property={this.PageConfig} EventActions={this.EventActions} />
    }
}

function mapStateToProps(state, ownProps) {
    const props = StaticIndex.MapStateToProps(state, ownProps, {
        DataList: state.ApiService.OrderList,
        UserList: state.ApiService.UserList
    });

    !EnvConfig.IsProd && console.log(props);
    return props;
}

export default connect(mapStateToProps, StaticIndex.MapDispatchToProps)(RootPage(ConnectAction("Orders_WaitingOrderList", WaitingOrderList)));