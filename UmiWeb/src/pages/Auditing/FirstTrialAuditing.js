import React from "react";
import { connect } from "dva";
import { BaseIndex, RootPage, ConnectAction, StaticIndex } from "ReactCommon";
import { EnvConfig, Common } from "UtilsCommon";
import Components from "Components";
import { Spin } from "antd";

class FirstTrialAuditing extends BaseIndex {
    constructor(props) {
        super(props);

        this.Name = "Auditing_FirstTrialAuditing";
        this.MenuKey = "FirstTrialAuditing";

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
        if (!this.IsSuccessNextsProps(data) || data.OrderStatus !== "初审审核中") this.RightConfig.RightPropertyNames = [];

        this.setState({ IsOrderStatus: false }, () => this.InitLoad());
    }

    InitLoad() {
        this.PageConfig.EventActions.forEach(a => {
            if (a.Name === "AddCompanyBank" || a.Name === "AddPersonBank") a.ExpandAdd = this.ExpandDataListViewAdd.bind(this);
            else if (a.Name === "DeleteCompanyBank" || a.Name === "DeletePersonBank") a.ExpandRemove = this.ExpandDataListViewRemove.bind(this);
        });

        this.InitIndustry();

        this.props.Invoke(this.ActionTypes.GetAllIndustry);
    }

    InitIndustry() {
        this.CompanyBaseInfo2 = this.GetView("CompanyBaseInfo2");
        this.CompanyBaseInfo2.Properties.forEach(p => {
            if (p.Name === "Industry1") { p.IsLoadValue = true; this.CompanyTypeProperty = p; }
            else if (p.Name === "Industry2") { p.IsLoadValue = true; this.IndustryBigTypeProperty = p; }
            else if (p.Name === "Industry3") { p.IsLoadValue = true; this.IndustryMiddleTypeProperty = p; }
            else if (p.Name === "Industry4") this.IndustryMinimumTypeProperty = p;
        });
    }

    ReceiveSetIndustry(data) {
        this.ReceiveSetIndustry1(data.Industry1);
        this.ReceiveSetIndustry2(data.Industry2);
        this.ReceiveSetIndustry3(data.Industry3);
        this.ReceiveSetIndustry4(data.Industry4);
    }

    ReceiveSetIndustry1(data) {
        this.SetSelectDataSource(this.CompanyTypeProperty, data);
    }

    ReceiveSetIndustry2(data) {
        const parentValue = this.CompanyTypeProperty.GetValue();
        this.SetSelectDataSource(this.IndustryBigTypeProperty, data, parentValue);
    }

    ReceiveSetIndustry3(data) {
        const parentValue = this.IndustryBigTypeProperty.GetValue();
        this.SetSelectDataSource(this.IndustryMiddleTypeProperty, data, parentValue);
    }

    ReceiveSetIndustry4(data) {
        const parentValue = this.IndustryMiddleTypeProperty.GetValue();
        this.SetSelectDataSource(this.IndustryMinimumTypeProperty, data, parentValue);
    }

    SetSelectDataSource(p, dataList, parentValue) {
        if (p.SetDataSource) p.SetDataSource(dataList, parentValue)
        else p.DataSource = dataList;
    }

    ExpandDataListViewAdd(props, action) {
        const { DataListView } = action.Parameters;
        const dataList = DataListView.GetValue();
        const title = DataListView.Title;
        if (dataList.length >= 5) { this.Alert(`对不起，最多只能新建5个${title}！`); return; }

        const len = this.GetLenName(dataList.length);

        const data = { Id: Common.CreateGuid(), Title: `${title}${len}` }

        DataListView.Add(data)
    }

    GetLenName(len) {
        if (len === 0) return "一";
        else if (len === 1) return "二";
        else if (len === 2) return "三";
        else if (len === 3) return "四";
        else if (len === 4) return "五";

        return len + 1;
    }

    ExpandDataListViewRemove(props, action) {
        const { DataListView } = action.Parameters;
        const title = DataListView.Title;

        const list = DataListView.GetValue().filter(f => f.Id !== props.Property.DataId);
        list.forEach((d, i) => {
            const len = this.GetLenName(i);
            d.Title = `${title}${len}`
        });

        DataListView.SetValue(list);
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
        GetOrderDetailEntityData: state.OrderService.GetOrderDetailEntityData,
        GetAllIndustry: state.UserCenterService.GetAllIndustry,
        SaveApprovalOrderDetail: state.OrderService.SaveApprovalOrderDetail,
        GetCompanyFinanceInfo: state.FinanceService.GetCompanyFinanceInfo,
        SaveCompanyFinanceInfo: state.FinanceService.SaveCompanyFinanceInfo,
        ComputeCollectBankInfo: state.FinanceService.ComputeCollectBankInfo,
        GetCreditInfo: state.CreditService.GetCreditInfo,
        SaveCreditInfo: state.CreditService.SaveCreditInfo,
        ComputeCreditQuota: state.CreditService.ComputeCreditQuota,
        GetCreditQuota: state.CreditService.GetCreditQuota,
        GetPatchExitOrderInfo: state.OrderService.GetPatchExitOrderInfo,
        SaveApprovalOpinion: state.ApprovalService.SaveFirstTrialApprovalOpinion,
        GetApprovalOpinion: state.ApprovalService.GetFirstTrialApprovalOpinion,
        GetOrderStatus: state.OrderService.GetOrderStatus
    });

    !EnvConfig.IsProd && console.log(props);
    return props;
}

export default connect(mapStateToProps, StaticIndex.MapDispatchToProps)(RootPage(ConnectAction("Auditing_FirstTrialAuditing", FirstTrialAuditing)));