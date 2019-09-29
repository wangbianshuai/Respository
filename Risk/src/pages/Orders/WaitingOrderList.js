import React from "react";
import { connect } from "dva";
import { BaseIndex, RootPage, ConnectAction, StaticIndex } from "ReactCommon";
import { EnvConfig, Common } from "UtilsCommon";
import Components from "Components";

class WaitingOrderList extends BaseIndex {
    constructor(props) {
        super(props);

        this.Name = "Orders_WaitingOrderList";
        this.MenuKey = "WaitingOrderList";

        this.InitEventAction();
    }

    componentDidMount() {
        this.SelectDataToListView = Common.ArrayFirst(this.PageConfig.DialogViews, (f) => f.Name === "SelectDataToListView");
        this.HandlerType = Common.ArrayFirst(this.SelectDataToListView.Properties, (f) => f.Name === "HandlerType");
        this.HandlerType.ValueChange = this.HandlerTypeChange.bind(this);
    }

    HandlerTypeChange(value) {
        this.SelectDataToListView.Properties.forEach(p => {
            if (p.Name !== "HandlerType") p.SetVisible(Common.IsEquals(value, 0))
        });
    }

    HandlerOrderSetPageUrl({ data, props, action }) {
        var url = "";
        const status = data.workOrderState;

        //执行规则：
        //04	初审审核中
        if (status === "04") url = "/Auditing/FirstTrialAuditing?OrderCode=#{loanApplyId}"
        //05	补件中
        else if (status === "05") url = "/CreditManage/OrderPatchEdit?OrderCode=#{loanApplyId}"
        //06	初审电核中
        else if (status === "06") url = "/Auditing/FirstTrialPhoneAuditing?OrderCode=#{loanApplyId}"
        //08	实地审核中
        else if (status === "08") url = "/Auditing/IndeedAuditing?OrderCode=#{loanApplyId}"
        //10	终审审核中
        else if (status === "10") url = "/Auditing/FinalAuditing?OrderCode=#{loanApplyId}"
        //11	终审复核中
        else if (status === "11") url = "/Auditing/FinalReviewAuditing?OrderCode=#{loanApplyId}"
        //12	待贷审会
        else if (status === "12") { this.InvokeEventAction("SetApproveUsers", props); return false }
        //13	贷审会进行中
        else if (status === "13") url = "/Auditing/LoanReviewCommittee?OrderCode=#{loanApplyId}"
        //14	信贷员确认中
        else if (status === "14") url = "/CreditManage/ApproveResultConfirm?OrderCode=#{loanApplyId}"
        //15	等待签约条件确认中
        else if (status === "15") url = "/Auditing/WaitConditionAuditing?OrderCode=#{loanApplyId}"
        else return false;


        url = Common.ReplaceDataContent(data, url);
        return url;
    }

    SetUserDataList({ dataList }) {
        dataList.forEach(d => {
            d.UserId = d.userId;
            d.UserName = d.name + (d.employeeId ? "（" + d.employeeId + "）" : "");
        });

        return dataList;
    }

    render() {
        return <Components.PropertyItem Property={this.PageConfig} EventActions={this.EventActions} />
    }
}

function mapStateToProps(state, ownProps) {
    const props = StaticIndex.MapStateToProps(state, ownProps, {
        SearchQuery: state.OrderService.QueryWaitingOrderList,
        RoleUserList: state.UserService.RoleUserList,
        HandlerOrder: state.OrderService.CommitteeHandlerOrder,
        HandUpOrder: state.OrderService.HandUpOrder
    });

    !EnvConfig.IsProd && console.log(props);
    return props;
}

export default connect(mapStateToProps, StaticIndex.MapDispatchToProps)(RootPage(ConnectAction("Orders_WaitingOrderList", WaitingOrderList)));