import React from "react";
import { connect } from "dva";
import { BaseIndex, RootPage, ConnectAction, StaticIndex } from "ReactCommon";
import { EnvConfig } from "UtilsCommon";
import Components from "Components";

class WaitConditionAuditing extends BaseIndex {
    constructor(props) {
        super(props);

        this.Name = "Auditing_WaitConditionAuditing";
        this.MenuKey = "WaitConditionAuditing";

        this.InitEventAction();

        //15	等待签约条件确认中
        if (this.OrderStatus !== "15") this.RightConfig.RightPropertyNames = [];
    }

    SetGetPatchExitOrderInfoLoad({ data, props, action }) {
        const v = action.Parameters.EditView;

        if (!v.EntityData || !v.EntityData.RecordList || v.EntityData.RecordList.length === 0) v.SetVisible(false);
    }

    render() {
        return <Components.PropertyItem Property={this.PageConfig} EventActions={this.EventActions} />
    }
}

function mapStateToProps(state, ownProps) {
    const props = StaticIndex.MapStateToProps(state, ownProps, {
        GetOrderInfoEntityData: state.OrderService.GetOrderDetailEntityData,
        GetPatchRecordEntityData: state.OrderService.GetPatchExitOrderInfo,
        GetApprovalOpinion: state.ApprovalService.GetWaitConditionApprovalOpinion,
        SaveApprovalOpinion: state.ApprovalService.SaveWaitConditionApprovalOpinion,
    });

    !EnvConfig.IsProd && console.log(props);
    return props;
}

export default connect(mapStateToProps, StaticIndex.MapDispatchToProps)(RootPage(ConnectAction("Auditing_WaitConditionAuditing", WaitConditionAuditing)));