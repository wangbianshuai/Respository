import React from "react";
import { connect } from "dva";
import { BaseIndex, RootPage, ConnectAction, StaticIndex } from "ReactCommon";
import { EnvConfig, Common } from "UtilsCommon";
import Components from "Components";

class FinalAuditing extends BaseIndex {
    constructor(props) {
        super(props);

        this.Name = "Auditing_FinalAuditing";
        this.MenuKey = "FinalAuditing";

        this.InitEventAction();

        //10	终审审核中
        if (this.OrderStatus !== "10") this.RightConfig.RightPropertyNames = [];

        if (this.RightConfig.RightPropertyNames.length === 0) {
            this.FinalCreditApprovalResult2 = this.GetView("FinalCreditApprovalResult2");
            this.FinalCreditApprovalResult2.Properties = this.FinalCreditApprovalResult2.Properties1;
        }
    }

    componentDidMount() {
        this.PageConfig.EventActions.forEach(a => {
            if (a.Name === "AddCautioner" || a.Name === "AddCoBorrower") a.ExpandAdd = this.ExpandDataListViewAdd.bind(this);
            else if (a.Name === "DeleteCautioner" || a.Name === "DeleteCoBorrower") a.ExpandRemove = this.ExpandDataListViewRemove.bind(this);
        });

        this.PropertyInfo2 = this.GetViewProperty(this.PageConfig, "PropertyInfo2");
        this.PropertyInfo2.Properties.forEach(p => {
            if (p.Name === "IsLocalHouse") p.ValueChange = this.IsLocalHouseChange.bind(this);
            else if (p.Name === "IsMortgage") this.IsMortgage = p;
            else if (p.Name === "MonthMortgage") this.MonthMortgage = p;
        })

        this.InvoiceFile = this.GetViewProperty(this.PageConfig, "InvoiceFile");
        this.InvoiceFile.SetResponse = this.SetInvoiceFileResponse.bind(this);
        this.AvgInvoiceAmount24 = this.GetViewProperty(this.PageConfig, "AvgInvoiceAmount24");
        this.AvgInvoiceAmount12 = this.GetViewProperty(this.PageConfig, "AvgInvoiceAmount12");

        this.InfoServiceRateView2 = this.GetViewProperty(this.PageConfig, "InfoServiceRateView2");
        this.AddServiceRate2Property = this.GetViewProperty(this.PageConfig, "AddServiceRate2");

        this.FinalCreditCalculate2 = this.GetView("FinalCreditCalculate2");
        this.CreditType = this.GetViewProperty(this.FinalCreditCalculate2, "CreditType");
        this.CompanyTotalAmount = this.GetViewProperty(this.FinalCreditCalculate2, "CompanyTotalAmount");
        this.PersonTotalAmount = this.GetViewProperty(this.FinalCreditCalculate2, "PersonTotalAmount");
    }

    GetOrderInfoDataLoad({ data, props, action }) {
        this.ProductId = data.productId;
        this.ProductShortName = data.productShortName
        if (this.ApprovalLoadPeriod && this.ApprovalLoadPeriod.InitDataList) {
            const dataList = this.ApprovalLoadPeriod.InitDataList.filter(f => f.productId === this.ProductId)
            this.ApprovalLoadPeriod.SetDataSource(dataList)
        }

        if (!EnvConfig.IsProd) console.log("GetOrderInfoDataLoad:" + new Date().getTime())
        if (this.CreditType.DataSource.length === 0) this.SetCreditTypeDataSource();
    }

    SetCreditTypeDataSource() {
        var hasLocalHouse = this.hasLocalRealEstate;

        // [{ Value: "01", Text: "ME" }, { Value: "02", Text: "新三板" }, { Value: "03", Text: "SE-有房" }, { Value: "04", Text: "SE-无房" }]
        let dataList = [];
        if (this.ProductShortName === "ME") {
            dataList = [{ Value: "01", Text: "ME" }, { Value: "02", Text: "新三板" }];
            this.CreditType.DefaultValue = "01";
        }
        else if (this.ProductShortName === "SE" && hasLocalHouse !== undefined) {
            if (hasLocalHouse === "01") {
                dataList = [{ Value: "03", Text: "SE-有房" }];
                this.CreditType.DefaultValue = "03";
            }
            else if (hasLocalHouse === "02") {
                dataList = [{ Value: "04", Text: "SE-无房" }];
                this.CreditType.DefaultValue = "04";
            }
        }

        if (this.ProductShortName === "SE") {
            if (this.CompanyTotalAmount.SetFormItemVisible) this.CompanyTotalAmount.SetFormItemVisible(false);
            else this.CompanyTotalAmount.IsVisible = false;

            if (this.PersonTotalAmount.SetFormItemVisible) this.PersonTotalAmount.SetFormItemVisible(false);
            else this.PersonTotalAmount.IsVisible = false;
        }

        if (!EnvConfig.IsProd) {
            console.log(hasLocalHouse + "," + this.ProductShortName)
            console.log(dataList);
        }
        if (this.CreditType.SetDataSource) this.CreditType.SetDataSource(dataList);
        else this.CreditType.DataSource = dataList;
    }

    GetFinalCreditCalculateDataLoad({ data, props, action }) {
        if (!EnvConfig.IsProd) console.log("GetFinalCreditCalculateDataLoad:" + new Date().getTime())
        if (this.CreditType.DataSource.length === 0) this.SetCreditTypeDataSource();
    }
    GetFinalBaseInfoDataLoad({ data, props, action }) {
        if (!EnvConfig.IsProd) console.log("GetFinalBaseInfoDataLoad:" + new Date().getTime())
        this.hasLocalRealEstate = data.assetsInfo ? data.assetsInfo.hasLocalRealEstate : "";

        if (this.CreditType.DataSource.length === 0) this.SetCreditTypeDataSource();
    }

    SetInvoiceFileResponse(response, property, view) {
        if (response.code === 0) {
            const { data } = response;
            
            view.EntityData = data;

            this.AvgInvoiceAmount24.SetValue(data.monthAvgBillSecondyear);
            this.AvgInvoiceAmount12.SetValue(data.monthAvgBillFierstyear);
        }
        else if (response.message) this.Alert(response.message);
        else this.Alert("上传失败！")
    }

    IsLocalHouseChange(v) {
        if (Common.IsNullOrEmpty(v)) return;
        const isMortgage = this.IsMortgage.GetValue();
        const enable = Common.IsEquals(v, "01") && Common.IsEquals(isMortgage, "01");
        this.MonthMortgage.SetDisabled(!enable);
    }

    ExpandDataListViewAdd(props, action) {
        const { DataListView } = action.Parameters;
        const dataList = DataListView.GetValue();
        const title = DataListView.Title;
        if (dataList.length >= 2) { this.Alert(`对不起，最多只能新建2个${title}！`); return; }

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

    SaveFinalCreditCalculateCallback({ data, props, action }) {
        if (!this.FinalCalulateAmout) {
            const { EditView } = action.Parameters;
            this.FinalCalulateAmout = Common.ArrayFirst(EditView.Properties, f => f.Name === "FinalCalulateAmout");
        }
        this.FinalCalulateAmout.SetValue(data.calcLoanAmount);

        this.AlertSuccess("计算成功！")
    }

    SetInfoManageRateList({ dataList }) {
        dataList.forEach(d => {
            d.InfoManageRate = d.feeRate;
            d.ManageCollectionType = d.chargeStage;
            d.ManageCollectionMethod = d.chargeWay;
        });

        return dataList;
    }

    SetInfoServiceRateList({ dataList }) {
        dataList.forEach(d => {
            d.InfoServiceRate = d.feeRate;
            d.ServiceCollectionType = d.chargeStage;
            d.ServiceCollectionMethod = d.chargeWay;
        });

        return dataList;
    }

    SetInfoServiceRateList2({ dataList }) {
        dataList.forEach(d => {
            d.InfoServiceRate2 = d.feeRate;
            d.ServiceCollectionType2 = d.chargeStage;
            d.ServiceCollectionMethod2 = d.chargeWay;
        });

        return dataList;
    }

    SetFineRateList({ dataList }) {
        dataList.forEach(d => d.FineRate = d.feeRate);

        return dataList;
    }

    SetApprovedLoanPeriodDataList({ dataList, Property }) {
        if (this.ProductId) {
            Property.IsOnlyInit = false;
            dataList = dataList.filter(f => f.productId === this.ProductId);
        }
        else this.ApprovalLoadPeriod = Property;
        dataList.forEach(d => {
            d.PeriodValue = d.loanPeriod + "," + d.loanPeriodUnit;
            d.approveInterestRate = d.interestRate;
            d.PeriodName = d.loanPeriod + (d.loanPeriodUnit === "03" ? "个月" : d.loanPeriodUnit === "01" ? "日" : d.loanPeriodUnit)
        });

        return dataList;
    }

    GetFinalCreditApprovalResultDataLoad({ data, props, action }) {
        if (data.ServiceCollectionMethod2) {
            if (this.AddServiceRate2Property.SetVisible) this.AddServiceRate2Property.SetVisible(false);

            this.InfoServiceRateView2.SetVisible(true);
        }
    }

    AddServiceRate2(props, action) {
        this.AddServiceRate2Property = props.Property;
        this.InfoServiceRateView2.SetVisible(true);
        props.Property.SetVisible(false);
    };

    DeleteInfoService2(props, action) {
        this.InfoServiceRateView2.SetVisible(false);
        this.AddServiceRate2Property.SetVisible(true);
        this.InfoServiceRateView2.Properties.forEach(p => p.IsEdit && p.SetValue(null));
    };

    render() {
        return <Components.PropertyItem Property={this.PageConfig} EventActions={this.EventActions} />
    }
}

function mapStateToProps(state, ownProps) {
    const props = StaticIndex.MapStateToProps(state, ownProps, {
        GetOrderInfoEntityData: state.OrderService.GetOrderDetailEntityData,
        GetPatchExitOrderInfo: state.OrderService.GetPatchExitOrderInfo,
        SaveApprovalOpinion: state.ApprovalService.SaveFinalApprovalOpinion,
        GetApprovalOpinion: state.ApprovalService.GetFinalApprovalOpinion,
        GetFinalBaseInfo: state.FinanceService.GetFinalBaseInfo,
        SaveFinalBaseInfo: state.FinanceService.SaveFinalBaseInfo,
        GetCreditInfo: state.CreditService.GetFinalCreditInfo,
        SaveCreditInfo: state.CreditService.SaveFinalCreditInfo,
        GetCautionerInfo: state.OrderService.GetCautionerInfo,
        SaveCautionerInfo: state.OrderService.SaveCautionerInfo,
        GetCoBorrowerInfo: state.OrderService.GetCoBorrowerInfo,
        SaveCoBorrowerInfo: state.OrderService.SaveCoBorrowerInfo,
        GetFinalCreditCalculate: state.CreditService.GetFinalCreditCalculate,
        SaveFinalCreditCalculate: state.CreditService.SaveFinalCreditCalculate,
        GetFinalCreditApprovalResult: state.CreditService.GetFinalCreditApprovalResult,
        SaveFinalCreditApprovalResult: state.CreditService.SaveFinalCreditApprovalResult,
        BackMethodList: state.BackMethodService.DataList,
        FineRateList: state.PlatformRateService.FineRateList,
        InfoManageList: state.PlatformRateService.InfoManageList,
        InfoServiceList: state.PlatformRateService.InfoServiceList,
        ProductRateList: state.ProductRateService.DataList
    });

    !EnvConfig.IsProd && console.log(props);
    return props;
}

export default connect(mapStateToProps, StaticIndex.MapDispatchToProps)(RootPage(ConnectAction("Auditing_FinalAuditing", FinalAuditing)));
