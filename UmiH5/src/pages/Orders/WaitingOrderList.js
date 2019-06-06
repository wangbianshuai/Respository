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
        //如果工单上次状态为待初审，当前状态为初审审核中，执行处理操作，页面跳转至审核管理-初审审核；
        //如果工单上次状态为补件中，当前状态为初审审核中，执行处理操作，页面跳转至审核管理-初审审核；
        //如果工单上次状态为终审审核中，当前状态为初审审核中，执行处理操作，页面跳转至审核管理-初审审核；
        if (status === "初审审核中") url = "/Auditing/FirstTrialAuditing?OrderCode=#{loanApplyId}"
        //如果工单上次状态为初审审核中，当前状态为补件中，执行处理操作，页面跳转至信贷管理-补件-补件操作；
        //如果工单上次状态为初审电核中，当前状态为补件中，执行处理操作，页面跳转至信贷管理-补件-补件操作；
        //如果工单上次状态为终审审核中，当前状态为补件中，执行处理操作，页面跳转至信贷管理-补件-补件操作；
        //如果工单上次状态为等待签约条件审核中，当前状态为补件中，执行处理操作，页面跳转至信贷管理-补件-补件操作；
        else if (status === "补件中") url = "/CreditManage/OrderPatchEdit?OrderCode=#{loanApplyId}"
        //如果工单上次状态为初审审核中，当前状态为初审电核中，执行处理操作，页面跳转至审核管理-初审电核；
        //如果工单上次状态为补件中，当前状态为初审电核中，执行处理操作，页面跳转至审核管理-初审电核；
        else if (status === "初审电核中") url = "/Auditing/FirstTrialPhoneAuditing?OrderCode=#{loanApplyId}"
        //如果工单上次状态为待实地，当前状态为实地审核中，执行处理操作，页面跳转至实地管理-实地审核；
        //如果工单上次状态为终审审核中，当前状态为实地审核中，执行处理操作，页面跳转至实地管理-实地审核；
        else if (status === "实地审核中") url = "/Auditing/IndeedAuditing?OrderCode=#{loanApplyId}"
        //如果工单上次状态为待终审，当前状态为终审审核中，执行处理操作，页面跳转至终审管理-终审审核；
        //如果工单上次状态为补件中，当前状态为终审审核中，执行处理操作，页面跳转至终审管理-终审审核；
        //如果工单上次状态为终审复核中，当前状态为终审审核中，执行处理操作，页面跳转至终审管理-终审审核；
        //如果工单上次状态为信贷员确认中，当前状态为终审审核中，执行处理操作，页面跳转至终审管理-终审审核；
        //如果工单上次状态为贷审会审核中，当前状态为终审审核中，执行处理操作，页面跳转至终审管理-终审审核；
        else if (status === "终审审核中") url = "/Auditing/FinalAuditing?OrderCode=#{loanApplyId}"
        //如果工单上次状态为终审审核中，当前状态为终审复核中，执行处理操作，页面跳转至终审管理-终审复核；
        else if (status === "终审复核中") url = "/Auditing/FinalReviewAuditing?OrderCode=#{loanApplyId}"
        //如果工单上次状态为终审复核中，当前状态为待贷审会，执行处理操作，则当前页面弹窗操作贷审会设置；
        else if (status === "待贷审会") { this.InvokeEventAction("SetApproveUsers", props); return false }
        //如果工单上次状态为待贷审会，当前状态为贷审会审核中，执行处理操作，页面跳转至终审管理-贷审会审核；
        else if (status === "贷审会审核中") url = "/Auditing/LoanReviewCommittee?OrderCode=#{loanApplyId}"
        //如果工单上次状态为贷审会审核中，当前状态为信贷员确认中，执行处理操作，页面跳转至信贷管理-终审结论确认；
        else if (status === "信贷员确认中") url = "/CreditManage/ApproveResultConfirm?OrderCode=#{loanApplyId}"
        //如果工单上次状态为信贷员确认中，当前状态为等待签约条件审核中，执行处理操作，页面跳转至风控管理-等待签约条件审核；
        //如果工单上次状态为补件中，当前状态为等待签约条件审核中，执行处理操作，页面跳转至风控管理-等待签约条件审核
        else if (status === "等待签约条件审核中") url = "/Auditing/WaitConditionAuditing?OrderCode=#{loanApplyId}"
        else return false;

        return url;
    }

    render() {
        return <Components.PropertyItem Property={this.PageConfig} EventActions={this.EventActions} />
    }
}

function mapStateToProps(state, ownProps) {
    const props = StaticIndex.MapStateToProps(state, ownProps, {
        SearchQuery: state.OrderService.QueryWaitingOrderList,
        UserList: state.ApiService.UserList
    });

    !EnvConfig.IsProd && console.log(props);
    return props;
}

export default connect(mapStateToProps, StaticIndex.MapDispatchToProps)(RootPage(ConnectAction("Orders_WaitingOrderList", WaitingOrderList)));