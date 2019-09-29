import React from "react";
import { connect } from "dva";
import { BaseIndex, RootPage, ConnectAction, StaticIndex } from "ReactCommon";
import { EnvConfig } from "UtilsCommon";
import Components from "Components";

class ApproveResultConfirm extends BaseIndex {
    constructor(props) {
        super(props);

        this.Name = "CreditManage_ApproveResultConfirm";
        this.MenuKey = "ApproveResultConfirm";

        this.InitEventAction();

        //14	信贷员确认中
        if (this.OrderStatus !== "14") this.RightConfig.RightPropertyNames = [];
    }

    componentDidMount(){
        this.InfoServiceRateView2 = this.GetViewProperty(this.PageConfig, "InfoServiceRateView2");
    }
    
    GetFinalCreditApprovalResultDataLoad({ data, props, action }) {
        if (data.ServiceCollectionMethod2) {
            this.InfoServiceRateView2.SetVisible(true);
        }
    }

    render() {
        return <Components.PropertyItem Property={this.PageConfig} EventActions={this.EventActions} />
    }
}

function mapStateToProps(state, ownProps) {
    const props = StaticIndex.MapStateToProps(state, ownProps, {
        GetOrderInfoEntityData: state.OrderService.GetOrderDetailEntityData,
        GetFinalApprovalResult: state.ApprovalService.GetFinalApprovalResult,
        SaveApprovalOpinion: state.ApprovalService.SaveApprovalOpinion,
        GetApprovalOpinion: state.ApprovalService.GetApprovalOpinion
    });

    !EnvConfig.IsProd && console.log(props);
    return props;
}

export default connect(mapStateToProps, StaticIndex.MapDispatchToProps)(RootPage(ConnectAction("CreditManage_ApproveResultConfirm", ApproveResultConfirm)));