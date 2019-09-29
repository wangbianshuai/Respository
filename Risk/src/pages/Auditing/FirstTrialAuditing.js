import React from "react";
import { connect } from "dva";
import { BaseIndex, RootPage, ConnectAction, StaticIndex } from "ReactCommon";
import { EnvConfig, Common } from "UtilsCommon";
import Components from "Components";

class FirstTrialAuditing extends BaseIndex {
    constructor(props) {
        super(props);

        this.Name = "Auditing_FirstTrialAuditing";
        this.MenuKey = "FirstTrialAuditing";

        this.InitEventAction();

         //04	初审审核中
         if (this.OrderStatus !== "04") this.RightConfig.RightPropertyNames = [];
    }

    componentDidMount() {
        this.PageConfig.EventActions.forEach(a => {
            if (a.Name === "AddCompanyBank" || a.Name === "AddPersonBank") a.ExpandAdd = this.ExpandDataListViewAdd.bind(this);
            else if (a.Name === "DeleteCompanyBank" || a.Name === "DeletePersonBank") a.ExpandRemove = this.ExpandDataListViewRemove.bind(this);
        });

        this.CompanyRecordFile = this.GetViewProperty(this.PageConfig, "CompanyRecordFile");
        this.CompanyRecordFile.SetResponse = this.SetCompanyFileResponse.bind(this);
        this.CompanyBankList = this.GetViewProperty(this.PageConfig, "CompanyBankList");

        this.PersonRecordFile = this.GetViewProperty(this.PageConfig, "PersonRecordFile");
        this.PersonRecordFile.SetResponse = this.SetPersonFileResponse.bind(this);
        this.PersonBankList = this.GetViewProperty(this.PageConfig, "PersonBankList");
    }

    SetPersonFileResponse(response, property) {
        if (response.code === 0) {
            response.data.Id = property.DataId;
            this.PersonBankList.Update(response.data);
        }
        else if (response.message) this.Alert(response.message);
        else this.Alert("上传失败！")
    }

    SetCompanyFileResponse(response, property) {
        if (response.code === 0) {
            response.data.Id = property.DataId;
            this.CompanyBankList.Update(response.data);
        }
        else if (response.message) this.Alert(response.message);
        else this.Alert("上传失败！")
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
        return <Components.PropertyItem Property={this.PageConfig} EventActions={this.EventActions} />
    }
}

function mapStateToProps(state, ownProps) {
    const props = StaticIndex.MapStateToProps(state, ownProps, {
        GetApprovalOrderDetail: state.OrderService.GetApprovalOrderDetail,
        GetOrderDetailEntityData: state.OrderService.GetOrderDetailEntityData,
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
        GetApprovalOpinion: state.ApprovalService.GetFirstTrialApprovalOpinion
    });

    !EnvConfig.IsProd && console.log(props);
    return props;
}

export default connect(mapStateToProps, StaticIndex.MapDispatchToProps)(RootPage(ConnectAction("Auditing_FirstTrialAuditing", FirstTrialAuditing)));