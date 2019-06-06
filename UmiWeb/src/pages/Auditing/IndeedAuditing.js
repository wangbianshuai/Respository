import React from "react";
import { connect } from "dva";
import { BaseIndex, RootPage, ConnectAction, StaticIndex } from "ReactCommon";
import { EnvConfig } from "UtilsCommon";
import Components from "Components";

class IndeedAuditing extends BaseIndex {
    constructor(props) {
        super(props);

        this.Name = "Auditing_IndeedAuditing";
        this.MenuKey = "IndeedAuditing";

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
        if (!this.IsSuccessNextsProps(data) || data.OrderStatus !== "实地审核中") this.RightConfig.RightPropertyNames = [];

        this.setState({ IsOrderStatus: false });
    }

    render() {
        return <Components.PropertyItem Property={this.PageConfig} EventActions={this.EventActions} />
    }
}

function mapStateToProps(state, ownProps) {
    const props = StaticIndex.MapStateToProps(state, ownProps, {
        GetOrderInfoEntityData: state.OrderService.GetOrderDetailEntityData,
        GetExitOrderInfo: state.OrderService.GetExitOrderInfo,
        GetOrderStatus: state.OrderService.GetOrderStatus,
        GetApprovalOpinion: state.ApprovalService.GetIndeedApprovalOpinion,
        SaveApprovalOpinion: state.ApprovalService.SaveIndeedApprovalOpinion,
    });

    !EnvConfig.IsProd && console.log(props);
    return props;
}

export default connect(mapStateToProps, StaticIndex.MapDispatchToProps)(RootPage(ConnectAction("Auditing_IndeedAuditing", IndeedAuditing)));