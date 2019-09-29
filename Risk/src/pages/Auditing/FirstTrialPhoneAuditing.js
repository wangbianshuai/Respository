import React from "react";
import { connect } from "dva";
import { BaseIndex, RootPage, ConnectAction, StaticIndex } from "ReactCommon";
import { EnvConfig } from "UtilsCommon";
import Components from "Components";

class FirstTrialPhoneAuditing extends BaseIndex {
    constructor(props) {
        super(props);

        this.Name = "Auditing_FirstTrialPhoneAuditing";
        this.MenuKey = "FirstTrialPhoneAuditing";

        this.InitEventAction();

        //06	初审电核中
        if (this.OrderStatus !== "06") this.RightConfig.RightPropertyNames = [];
    }

    SetGetPatchExitOrderInfoLoad({ data, props, action }) {
        const { EditPropertiyViewList } = action.Parameters;

        EditPropertiyViewList.forEach(v => {
            if (!v.EntityData || !v.EntityData.RecordList || v.EntityData.RecordList.length === 0) v.SetVisible(false);
        });
    }

    render() {
        return <Components.PropertyItem Property={this.PageConfig} EventActions={this.EventActions} />
    }
}

function mapStateToProps(state, ownProps) {
    const props = StaticIndex.MapStateToProps(state, ownProps, {
        GetOrderInfoEntityData: state.OrderService.GetOrderDetailEntityData,
        GetCompanyContactCheck: state.ContactService.GetCompanyContactCheck,
        SaveCompanyContactCheck: state.ContactService.SaveCompanyContactCheck,
        GetKinsfolkContactCheck: state.ContactService.GetKinsfolkContactCheck,
        SaveKinsfolkContactCheck: state.ContactService.SaveKinsfolkContactCheck,
        GetOwnerContactCheck: state.ContactService.GetOwnerContactCheck,
        SaveOwnerContactCheck: state.ContactService.SaveOwnerContactCheck,
        GetWorkmateContactCheck: state.ContactService.GetWorkmateContactCheck,
        SaveWorkmateContactCheck: state.ContactService.SaveWorkmateContactCheck,
        GetApprovalOpinion: state.ApprovalService.GetFirstTrialPhoneApprovalOpinion,
        SaveApprovalOpinion: state.ApprovalService.SaveFirstTrialPhoneApprovalOpinion,
        GetPatchExitOrderInfo: state.OrderService.GetPatchExitOrderInfo
    });

    !EnvConfig.IsProd && console.log(props);
    return props;
}

export default connect(mapStateToProps, StaticIndex.MapDispatchToProps)(RootPage(ConnectAction("Auditing_FirstTrialPhoneAuditing", FirstTrialPhoneAuditing)));