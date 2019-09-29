import React from "react";
import { connect } from "dva";
import { BaseIndex, RootPage, ConnectAction, StaticIndex } from "ReactCommon";
import { EnvConfig } from "UtilsCommon";
import Components from "Components";

class LoanReviewCommittee extends BaseIndex {
    constructor(props) {
        super(props);

        this.Name = "Auditing_LoanReviewCommittee";
        this.MenuKey = "LoanReviewCommittee";

        this.InitEventAction();

        //13	贷审会进行中
        if (this.OrderStatus !== "13") this.RightConfig.RightPropertyNames = [];
    }

    componentDidMount() {
        this.OpinionText = this.GetViewProperty(this.PageConfig, "OpinionText");
    }

    SetGetApprovalOpinionDetails({ data, props, action }) {
        this.OpinionText.SetValue(data.OpinionText)
    }

    render() {
        const { OrderStatus2 } = this;
        //14	信贷员确认中 15	等待签约条件确认中16	拒绝17	废弃18	通过
        if (OrderStatus2 === "14" || OrderStatus2 === "15" || OrderStatus2 === "16" || OrderStatus2 === "17" || OrderStatus2 === "18") this.PageConfig.Properties = this.PageConfig.Properties2;
        else this.PageConfig.Properties = this.PageConfig.Properties1;

        return <Components.PropertyItem Property={this.PageConfig} EventActions={this.EventActions} />
    }
}

function mapStateToProps(state, ownProps) {
    const props = StaticIndex.MapStateToProps(state, ownProps, {
        GetOrderInfoEntityData: state.OrderService.GetOrderDetailEntityData,
        GetApprovalOpinionDetails: state.ApprovalService.GetApprovalOpinionDetails,
        GetApprovalOpinion: state.ApprovalService.GetCommitteeApprovalOpinion,
        SaveApprovalOpinion: state.ApprovalService.SaveCommitteeApprovalOpinion,
    });

    !EnvConfig.IsProd && console.log(props);
    return props;
}

export default connect(mapStateToProps, StaticIndex.MapDispatchToProps)(RootPage(ConnectAction("Auditing_LoanReviewCommittee", LoanReviewCommittee)));