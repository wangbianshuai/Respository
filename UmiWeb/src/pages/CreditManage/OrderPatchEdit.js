import React from "react";
import { connect } from "dva";
import { BaseIndex, RootPage, ConnectAction, StaticIndex } from "ReactCommon";
import { EnvConfig } from "UtilsCommon";
import Components from "Components";
import { Spin } from "antd";

class OrderPatchEdit extends BaseIndex {
    constructor(props) {
        super(props);

        this.Name = "CreditManage_OrderPatchEdit";
        this.MenuKey = "OrderPatchEdit";

        this.InitEventAction();

        this.GetOrderStatus();

        this.state = { IsOrderStatus: this.IsGetOrderStatus };
    }

    GetOrderStatus() {
        this.IsGetOrderStatus = true;
        this.props.Invoke(this.ActionTypes.GetOrderStatus, { OrderCode: this.PageData.OrderCode });
    }

    ReceiveGetOrderStatus(data) {
        this.IsGetOrderStatus = false;
        if (!this.IsSuccessNextsProps(data) || data.OrderStatus !== "补件中") this.RightConfig.RightPropertyNames = [];

        this.setState({ IsOrderStatus: false }, () => this.InitLoad());
    }

    InitLoad() {
        this.PatchInfo = this.GetView("PatchInfo");
        this.InfoTip = this.GetControl("InfoTip");
        this.PatchInfo.ExpandEntityDataLoad = this.PatchInfoLoad.bind(this);
    }

    PatchInfoLoad() {
        const { EntityData } = this.PatchInfo;
        this.InfoTip && this.InfoTip.SetValue(EntityData.MainTip);
    }

    render() {
        if (this.state.IsOrderStatus) return <div className="SpinDiv2"><Spin tip="加载中……" /></div>

        return <Components.PropertyItem Property={this.PageConfig} EventActions={this.EventActions} />
    }
}

function mapStateToProps(state, ownProps) {
    const props = StaticIndex.MapStateToProps(state, ownProps, {
        GetOrderInfoEntityData: state.OrderService.GetOrderDetailEntityData,
        GetPatchInfoEntityData: state.OrderService.PatchInfo,
        SavePatchInfoEntityData: state.OrderService.SavePatchInfo,
        GetOrderStatus: state.OrderService.GetOrderStatus
    });

    !EnvConfig.IsProd && console.log(props);
    return props;
}

export default connect(mapStateToProps, StaticIndex.MapDispatchToProps)(RootPage(ConnectAction("CreditManage_OrderPatchEdit", OrderPatchEdit)));