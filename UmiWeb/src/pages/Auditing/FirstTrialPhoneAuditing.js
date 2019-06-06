import React from "react";
import { connect } from "dva";
import { BaseIndex, RootPage, ConnectAction, StaticIndex } from "ReactCommon";
import { EnvConfig } from "UtilsCommon";
import Components from "Components";
import { Spin } from "antd";

class FirstTrialPhoneAuditing extends BaseIndex {
    constructor(props) {
        super(props);

        this.Name = "Auditing_FirstTrialPhoneAuditing";
        this.MenuKey = "FirstTrialPhoneAuditing";

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
        if (!this.IsSuccessNextsProps(data) || data.OrderStatus !== "初审电核中") this.RightConfig.RightPropertyNames = [];

        this.setState({ IsOrderStatus: false });
    }

    SetGetPatchExitOrderInfoLoad({ data, props, action }) {
        const { EditPropertiyViewList } = action.Parameters;

        EditPropertiyViewList.forEach(v => {
            if (!v.EntityData || !v.EntityData.RecordList || v.EntityData.RecordList.length === 0) v.SetVisible(false);
        });
    }

    render() {
        if (this.state.IsOrderStatus) return <div className="SpinDiv2"><Spin tip="加载中……" /></div>

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
        GetPatchExitOrderInfo: state.OrderService.GetPatchExitOrderInfo,
        GetOrderStatus: state.OrderService.GetOrderStatus
    });

    !EnvConfig.IsProd && console.log(props);
    return props;
}

export default connect(mapStateToProps, StaticIndex.MapDispatchToProps)(RootPage(ConnectAction("Auditing_FirstTrialPhoneAuditing", FirstTrialPhoneAuditing)));