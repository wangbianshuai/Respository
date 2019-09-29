import React from "react";
import { connect } from "dva";
import { BaseIndex, RootPage, ConnectAction, StaticIndex } from "ReactCommon";
import { EnvConfig } from "UtilsCommon";
import Components from "Components";

class OrderPatchEdit extends BaseIndex {
    constructor(props) {
        super(props);

        this.Name = "CreditManage_OrderPatchEdit";
        this.MenuKey = "OrderPatchEdit";

        this.InitEventAction();

        //05	补件中
        if (this.OrderStatus !== "05") this.RightConfig.RightPropertyNames = [];
    }

    componentDidMount() {
        this.PatchInfo = this.GetView("PatchInfo");
        this.InfoTip = this.GetControl("InfoTip");
        this.PatchInfo.ExpandEntityDataLoad = this.PatchInfoLoad.bind(this);
        this.ToAttachPage = this.GetViewProperty(this.PatchInfo, "ToAttachPage");
    }

    // (1:初审补单   2：终审补单  3：重审补单  4：实地审核附件   5：终审审核附件) 
    PatchInfoLoad() {
        const { EntityData } = this.PatchInfo;
        this.InfoTip && this.InfoTip.SetValue(EntityData.MainTip);

        const role = EntityData.requestUserRole;
        if (role && role.indexOf("初审") >= 0) this.ToAttachPage.PatchType = 1;
        else if (role && role.indexOf("终审") >= 0) this.ToAttachPage.PatchType = 2;
        else if (role) this.ToAttachPage.PatchType = 3;
        else this.ToAttachPage.SetDisabled(true);
    }

    render() {
        return <Components.PropertyItem Property={this.PageConfig} EventActions={this.EventActions} />
    }
}

function mapStateToProps(state, ownProps) {
    const props = StaticIndex.MapStateToProps(state, ownProps, {
        GetOrderInfoEntityData: state.OrderService.GetOrderDetailEntityData,
        GetPatchInfoEntityData: state.OrderService.PatchInfo,
        SavePatchInfoEntityData: state.OrderService.SavePatchInfo
    });

    !EnvConfig.IsProd && console.log(props);
    return props;
}

export default connect(mapStateToProps, StaticIndex.MapDispatchToProps)(RootPage(ConnectAction("CreditManage_OrderPatchEdit", OrderPatchEdit)));