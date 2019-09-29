import React from "react";
import { connect } from "dva";
import { BaseIndex, RootPage, ConnectAction, StaticIndex } from "ReactCommon";
import { EnvConfig } from "UtilsCommon";
import Components from "Components";

class FinalReviewAuditing extends BaseIndex {
    constructor(props) {
        super(props);

        this.Name = "Auditing_FinalReviewAuditing";
        this.MenuKey = "FinalReviewAuditing";

        this.InitEventAction();

         //11	终审复核中
         if (this.OrderStatus !== "11") this.RightConfig.RightPropertyNames = [];
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
        SaveApprovalOpinion: state.ApprovalService.SaveFinalReviewApprovalOpinion,
        GetApprovalOpinion: state.ApprovalService.GetFinalReviewApprovalOpinion,
        GetFinalApprovalResult: state.ApprovalService.GetFinalReviewApprovalResult,
    });

    !EnvConfig.IsProd && console.log(props);
    return props;
}

export default connect(mapStateToProps, StaticIndex.MapDispatchToProps)(RootPage(ConnectAction("Auditing_FinalReviewAuditing", FinalReviewAuditing)));