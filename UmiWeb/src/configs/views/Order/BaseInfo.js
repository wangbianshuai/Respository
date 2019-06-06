import Order from "../../entities/Order";

import { AssignProporties, GetTextBox, GetSelect, GetButton } from "../../pages/Common";

var DataActionTypes = {}

export default (actionTypes) => {
    DataActionTypes = actionTypes;

    return {
        Name: "OrderBaseInfo",
        Type: "View",
        Properties: AssignProporties({}, [GetInfoView(), GetRightButtonView()])
    }
}

function GetInfoView() {
    return {
        Name: "OrderInfo",
        Type: "RowsColsView",
        Entity: Order,
        IsForm: true,
        LabelAlign: "left",
        Title: "工单编号-#{OrderCode}",
        Style: { marginTop: 8 },
        PropertyName: "OrderInfo",
        DefaultEditData: { ViewName: "OrderInfo" },
        SaveEntityDataActionType: DataActionTypes.SaveOrderDetailEntityData,
        Properties: AssignProporties(Order, GetProperties())
    }
}

function GetRightButtonView() {
    return {
        Name: "OrderInfoRightButtonView",
        Type: "View",
        ClassName: "DivRightButton",
        IsDiv: true,
        Properties: AssignProporties({}, GetRightButtonProperties())
    }
}

function GetRightButtonProperties() {
    return [{ ...GetButton("SaveOrderBaseInfo", "保存", "primary"), IsDisabled: true, EventActionName: "SaveOrderInfoEntityData", Style: { marginRight: 36, width: 84 } }]
}

function GetProperties() {
    return [
        GetReadOnlyTextBox("BorrowerUser", "借款人", 1, 1),
        GetReadOnlyTextBox("Borrowers", "企业名称", 1, 2),
        GetReadOnlyTextBox("UserType", "用户类型", 1, 3),
        GetTextBox3("BorrowerAmount", "借款申请金额", 2, 1, "float", "请输入借款申请金额", 20, false, "元"),
        GetEditSelect("BorrowerPeriod", "借款申请期限", Order.BorrowerPeriodDataSource, 2, 2, false, "请输入借款申请期限"),
        GetEditSelect("BackMethod", "还款方式", Order.BackMethodDataSource, 2, 3, false, "请选择还款方式"),
        GetEditSelect("BorrowerUse", "借款用途", Order.BorrowerUseDataSource, 3, 1, false, "请输入借款用途"),
        GetReadOnlyTextBox("ProductType", "产品", 3, 2),
        GetReadOnlyTextBox("LoanUser", "信贷员", 3, 3),
        GetReadOnlyTextBox("BorrowChannel", "借款申请渠道", 4, 1),
        GetReadOnlyTextBox("BorrowerDate", "借款申请时间", 4, 2),
        GetCascader("OrderArea", "借款人所在地", 4, 3, false, "请选择借款人所在地", Order.OrderAreaDataSource, "0"),
    ]
}

function GetCascader(Name, Label, X, Y, IsNullable, PlaceHolder, ServiceDataSource, RootValue) {
    return {
        Name, Label, X, Y, IsNullable, PlaceHolder, ServiceDataSource, RootValue,
        IsColon: false,
        Type: "Cascader",
        IsFormItem: true, ColSpan: 8,
        LabelCol: 10,
        WrapperCol: 21,
        IsEdit: true,
        AllowClear: true,
        ReadRightName: "OrderInfoRightButtonView",
        Style: {
            display: "flex",
            flexDirection: "column",
            marginBottom: 10
        }
    }
}

function GetEditSelect(Name, Label, DataSource, X, Y, IsNullable, PlaceHolder, DefaultValue) {
    return {
        ...GetSelect(Name, Label, DataSource, X, Y, DefaultValue),
        IsColon: false,
        IsFormItem: true, ColSpan: 8,
        LabelCol: 10,
        WrapperCol: 21,
        IsNullable: IsNullable,
        PlaceHolder: PlaceHolder,
        IsEdit: true,
        ReadRightName: "OrderInfoRightButtonView",
        Style: {
            display: "flex",
            flexDirection: "column",
            marginBottom: 10
        }
    }
}

function GetTextBox3(Name, Label, X, Y, DataType, PlaceHolder, MaxLength, IsNullable, addonAfter) {
    return {
        ...GetTextBox2(Name, Label, X, Y, "", PlaceHolder, MaxLength, IsNullable, addonAfter),
        DataType,
        Scale: 2
    }
}

function GetTextBox2(Name, Label, X, Y, ContorlType, PlaceHolder, MaxLength, IsNullable, addonAfter) {
    return {
        ...GetTextBox(Name, Label, ContorlType, X, Y, PlaceHolder, MaxLength),
        IsColon: false,
        IsFormItem: true, ColSpan: 8,
        LabelCol: 10,
        WrapperCol: 21,
        AddonAfter: addonAfter,
        IsNullable: IsNullable,
        IsEdit: true,
        ReadRightName: "OrderInfoRightButtonView",
        Style: {
            display: "flex",
            flexDirection: "column",
            marginBottom: 10
        }
    }
}

function GetReadOnlyTextBox(Name, Label, X, Y, addonAfter) {
    return {
        ...GetTextBox(Name, Label, "", X, Y, "", 200),
        IsColon: false,
        IsFormItem: true, ColSpan: 8,
        LabelCol: 10,
        WrapperCol: 21,
        IsReadOnly: true,
        AddonAfter: addonAfter,
        Style: {
            display: "flex",
            flexDirection: "column",
            marginBottom: 10
        }
    }
}

