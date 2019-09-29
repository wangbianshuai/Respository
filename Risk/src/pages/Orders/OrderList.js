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
        this.UserList = this.DialogView.Properties[0];

        const loanApplyId = this.DialogView.SelectRowKeys[0];
        this.DispatchAction("UserService", "GetUserList", { loanApplyId }).then(res => this.ReceiveSetUserDataList(res))
    }

    ReceiveSetUserDataList(res) {
        var userList = [];
        if (res.userList) userList = res.userList;

        userList.forEach(d => {
            d.UserId = d.userId;
            d.UserName = d.name + (d.employeeId ? "（" + d.employeeId + "）" : "");
        });
        this.SetSelectDataSource(this.UserList, userList);
    }

    SetSelectDataSource(p, dataList) {
        if (p.SetDataSource) p.SetDataSource(dataList)
        else p.DataSource = dataList;
    }

    ExpandSearchQueryLoad({ data, props }) {
        if (data.StatusList && data.StatusList.length > 0) {
            this.OrderStatus.SetDataSource(data.StatusList);
            this.OrderStatus.SetValue(data.StatusList[0].Value)
            this.OrderStatus.SetVisible(true)
        }
    }

    render() {
        return <Components.PropertyItem Property={this.PageConfig} EventActions={this.EventActions} />
    }
}

function mapStateToProps(state, ownProps) {
    const props = StaticIndex.MapStateToProps(state, ownProps, {
        SearchQuery: state.OrderService.QueryPoolOrder,
        UserList: state.UserService.UserList,
        DispatchOrder: state.OrderService.DispatchOrder,
        GrabOrder: state.OrderService.GrabOrder
    });

    !EnvConfig.IsProd && console.log(props);
    return props;
}

export default connect(mapStateToProps, StaticIndex.MapDispatchToProps)(RootPage(ConnectAction("Orders_OrderList", OrderList)));