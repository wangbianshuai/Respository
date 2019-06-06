import React from "react";
import { connect } from "dva";
import { BaseIndex, RootPage, ConnectAction, StaticIndex } from "ReactCommon";
import { EnvConfig, Common, Md5 } from "UtilsCommon";
import Components from "Components";
import { Spin } from "antd";

class OrderDetail extends BaseIndex {
    constructor(props) {
        super(props);

        this.Name = "CreditManage_OrderDetail";
        this.MenuKey = "OrderDetail";

        this.InitEventAction();

        this.Init();

        this.state = { IsOrderStatus: this.IsGetOrderStatus };
    }

    Init() {
        this.IsGetOrderStatus = false;
        const { EditId, SubmitId } = this.PageData;
        if (!EditId && !SubmitId) this.RightConfig.RightPropertyNames = [];

        if (SubmitId) {
            const id = Common.GetStorage("OrderDetailSubmitId");
            if (SubmitId !== Md5(id)) this.RightConfig.RightPropertyNames = [];
            else this.GetOrderStatus();
        }
        else if (EditId) {
            const id = Common.GetStorage("OrderDetailEditId");
            if (EditId !== Md5(id)) this.RightConfig.RightPropertyNames = [];
            else this.RightConfig.RightPropertyNames = this.RightConfig.RightPropertyNames.filter(f => f !== "SubmitRightButtonView");
        }
    }

    GetOrderStatus() {
        this.IsGetOrderStatus = true;
        this.props.Invoke(this.ActionTypes.GetOrderStatus, { OrderCode: this.PageData.OrderCode });
    }

    ReceiveGetOrderStatus(data) {
        this.IsGetOrderStatus = false;
        if (this.IsSuccessNextsProps(data)) {
            if (data.OrderStatus === "待提交进件") this.RightConfig.RightPropertyNames = this.RightConfig.RightPropertyNames.filter(f => f === "SubmitRightButtonView");
            else this.RightConfig.RightPropertyNames = [];
        }
        else this.RightConfig.RightPropertyNames = [];

        this.setState({ IsOrderStatus: false }, () => this.props.Invoke(this.ActionTypes.GetAllIndustry));
    }

    componentDidMount() {
        this.PageConfig.EventActions.forEach(a => {
            if (a.Name === "AddHouse" || a.Name === "AddCar") a.ExpandAdd = this.ExpandDataListViewAdd.bind(this);
            else if (a.Name === "DeleteHouse" || a.Name === "DeleteCar") a.ExpandRemove = this.ExpandDataListViewRemove.bind(this);
        });

        this.InitIndustry();

        if (!this.IsGetOrderStatus) this.props.Invoke(this.ActionTypes.GetAllIndustry);
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

    render() {
        if (this.state.IsOrderStatus) return <div className="SpinDiv2"><Spin tip="加载中……" /></div>

        return <Components.PropertyItem Property={this.PageConfig} EventActions={this.EventActions} />
    }
}

function mapStateToProps(state, ownProps) {
    const props = StaticIndex.MapStateToProps(state, ownProps, {
        GetOrderDetailEntityData: state.OrderService.GetOrderDetailEntityData,
        SaveOrderDetailEntityData: state.OrderService.SaveOrderDetailEntityData,
        GetAllIndustry: state.UserCenterService.GetAllIndustry,
        SubmitOrderInfo: state.OrderService.SubmitOrderInfo,
        GetCityList: state.ApiService.GetCityList,
        GetOrderStatus: state.OrderService.GetOrderStatus
    });

    !EnvConfig.IsProd && console.log(props);
    return props;
}

export default connect(mapStateToProps, StaticIndex.MapDispatchToProps)(RootPage(ConnectAction("CreditManage_OrderDetail", OrderDetail)));