import React from "react";
import { connect } from "dva";
import { BaseIndex, RootPage, ConnectAction, StaticIndex } from "ReactCommon";
import { EnvConfig, Common, Md5 } from "UtilsCommon";
import Components from "Components";

class OrderDetail extends BaseIndex {
    constructor(props) {
        super(props);

        this.Name = "CreditManage_OrderDetail";
        this.MenuKey = "OrderDetail";

        this.InitEventAction();

        this.Init();
    }

    Init() {
        const { EditId, SubmitId } = this.PageData;
        if (!EditId && !SubmitId) this.RightConfig.RightPropertyNames = [];

        if (SubmitId) {
            const id = Common.GetStorage("OrderDetailSubmitId");
            if (SubmitId !== Md5(id)) this.RightConfig.RightPropertyNames = [];
            else {
                //01	待提交进件
                if (this.OrderStatus === "01") this.RightConfig.RightPropertyNames = this.RightConfig.RightPropertyNames.filter(f => f === "SubmitRightButtonView");
                else this.RightConfig.RightPropertyNames = [];
            }
        }
        else if (EditId) {
            const id = Common.GetStorage("OrderDetailEditId");
            if (EditId !== Md5(id)) this.RightConfig.RightPropertyNames = [];
            else this.RightConfig.RightPropertyNames = this.RightConfig.RightPropertyNames.filter(f => f !== "SubmitRightButtonView");
        }
    }

    componentDidMount() {
        this.PageConfig.EventActions.forEach(a => {
            if (a.Name === "AddHouse" || a.Name === "AddCar") a.ExpandAdd = this.ExpandDataListViewAdd.bind(this);
            else if (a.Name === "DeleteHouse" || a.Name === "DeleteCar") a.ExpandRemove = this.ExpandDataListViewRemove.bind(this);
        });

        if (this.RightConfig.RightPropertyNames.length > 0) {
            this.isspecial = this.GetViewProperty(this.PageConfig, "isspecial");
            this.isspecial.ValueChange = this.IsSpecialValueChange.bind(this);
        }
    }

    IsSpecialValueChange(value) {
        if (Common.IsEquals(value, "01")) this.Alert("勾选特殊件后，对文件上传最低数量不做限制，主要针对拆标、新三板等单子。确定要改为特殊件吗？");
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

    SetProvincesAndCitys({ dataList }) {
        const list = [];
        const { provinces, citys } = dataList;
        if (provinces) {
            for (var key in provinces) {
                list.push({
                    Code: key, Name: provinces[key], ParentCode: "0",
                    Children: this.GetCityList(key, citys)
                })
            }
        }

        return list;
    }

    GetCityList(provinceCode, citys) {
        if (citys && citys[provinceCode]) {
            const list = [];
            const pc = citys[provinceCode]
            for (var key3 in pc) {
                list.push({ Code: key3, Name: pc[key3], ParentCode: provinceCode });
            }
            return list;
        }
        return [];
    }

    render() {
        return <Components.PropertyItem Property={this.PageConfig} EventActions={this.EventActions} />
    }
}

function mapStateToProps(state, ownProps) {
    const props = StaticIndex.MapStateToProps(state, ownProps, {
        GetOrderDetailEntityData: state.OrderService.GetOrderDetailEntityData,
        SaveOrderDetailEntityData: state.OrderService.SaveOrderDetailEntityData,
        SubmitOrderInfo: state.OrderService.SubmitOrderInfo,
        GetProvincesAndCitys: state.LoanApplyPlatformService.GetProvincesAndCitys
    });

    !EnvConfig.IsProd && console.log(props);
    return props;
}

export default connect(mapStateToProps, StaticIndex.MapDispatchToProps)(RootPage(ConnectAction("CreditManage_OrderDetail", OrderDetail)));