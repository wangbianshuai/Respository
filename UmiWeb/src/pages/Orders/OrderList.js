import React from "react";
import { connect } from "dva";
import { BaseIndex, RootPage, ConnectAction, StaticIndex } from "ReactCommon";
import { EnvConfig, Common } from "UtilsCommon";
import Components from "Components";

class OrderList extends BaseIndex {
    constructor(props) {
        super(props);

        this.Name = "Orders_OrderList";
        this.MenuKey = "OrderList";

        this.InitEventAction();
    }

    componentDidMount() {
        this.DialogView = Common.ArrayFirst(this.PageConfig.DialogViews, (f) => f.Name === "SelectDataToListView");
        this.DialogView.ExpandDataLoad = this.DialogViewDataLoad.bind(this);
        this.OrderStatus = this.GetControl("OrderStatus");
    }

    DialogViewDataLoad(props, action) {
        const UserList = this.DialogView.Properties[0];
        const orderStatus = this.OrderStatus.GetValue();

        if (UserList.OrderStatus !== orderStatus) {
            UserList.OrderStatus = orderStatus;
            UserList.DataSource = null;
            this.SetActionState("ApiService", "GetUserList");
            UserList.ServiceDataSource = {
                ValueName: "UserId",
                TextName: "UserName",
                StateName: "UserList",
                ServiceName: "UserService",
                ActionName: "GetUserList",
                Payload: { OrderStatus: orderStatus }
            };

            UserList.GetDataSource && UserList.GetDataSource();
        }
    }

    render() {
        return <Components.PropertyItem Property={this.PageConfig} EventActions={this.EventActions} key={this.Name}/>
    }
}

function mapStateToProps(state, ownProps) {
    const props = StaticIndex.MapStateToProps(state, ownProps, {
        SearchQuery: state.OrderService.QueryPoolOrder,
        UserList: state.ApiService.UserList,
        DispatchOrder: state.OrderService.DispatchOrder,
        GrabOrder: state.OrderService.GrabOrder
    });

    !EnvConfig.IsProd && console.log(props);
    return props;
}

export default connect(mapStateToProps, StaticIndex.MapDispatchToProps)(RootPage(ConnectAction("Orders_OrderList", OrderList)));