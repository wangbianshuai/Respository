import { AssignProporties, GetTextBox, GetButton, CreateGuid, ToRem } from "../Common";

const DataActionTypes = {
	//获取
	GetCarInfo: 600,
	//保存
	SaveCarInfo: 699
}

export default {
    Name: "CarInfo",
    Type: "View",
    EventActionName: "GetCarInfo",
    SaveEntityDataActionType: DataActionTypes.SaveCarInfo,
    GetEntityDataActionType: DataActionTypes.GetCarInfo,
    EventActions: GetEventActions(),
    Style: { marginTop: ToRem(40) },
    Properties: AssignProporties({}, [GetCarInfoView(),
        { ...GetButton("SaveCar", "保存", "primary"), EventActionName: "SaveCarInfo", Style: { marginTop: ToRem(40) } },
        { ...GetButton("AddCar", "新增车产", ""), EventActionName: "AddCar", Style: { marginTop: ToRem(40) ,marginBottom: ToRem(30) }, Icon: "plus" },
        {...GetTextView()}
    ])
}

function GetCarInfoView() {
    return {
        Name: "CarList",
        Type: "DataListView",
        DefaultValue: [{ Id: CreateGuid(), Title: "车产信息一" }],
        // IsFirstDelete: false,
        DeletePropertyName: "DeleteCar",
        PrimaryKey: "Id",
        Title: "车产信息",
		IsEdit: true,
        Properties: AssignProporties({}, GetCarItemProperties())
    }
}

function GetCarItemProperties() {
    return [
        GetTitleView(),
        GetTextBox2("numberPlate", "车牌号码", "", "请输入车牌号码", 50, true),
		GetSelect("carType", "车辆类型",GetCarTypeSource()),
        // GetTextBox2("carType", "车辆类型", " ", "请输入车辆类型", 100, true),
        GetTextBox3("ower", "车辆所有人", "", "请输入车辆所有人", 150, true),
        GetTextBox2("owerHomeAddress", "车辆所有人住址", "TextArea", "请输入车辆所有人住址", 500, true),
        GetSelect("useType", "使用性质",GetUseSource()),
        GetTextBox3("brandModel", "品牌类型", "", "请输入车辆品牌类型", 500, true),
        GetTextBox2("vehicleId", "车辆识别代码", "", "请输入车辆VIN码", 50, true),
        GetTextBox2("engineId", "发动机号码", "", "请输入车辆发动机号码", 100, true),
        GetDateText2("registrationDate", "注册日期"),
        GetDateText2("issueDate", "发证日期"),
    ]
}

function GetTitleView() {
    return {
        Name: "TitleView",
        Type: "View",
        ClassName:"ListviewTitle",
        IsFlex: true,
        FlexProps: { direction: "row", justify: "center", align: "between" },
        Properties: AssignProporties({}, GetTitleViewProperties())
    }
}

function GetTitleViewProperties() {
    return [{ Name: "Title", Type: "SpanText", ClassName: "SpanLabel", Label: "（选填）" },
        { ...GetButton("DeleteCar", " ", " "), ClassName: "deleteHouseDescBtn", EventActionName: "DeleteCar", Style: {  },},
    ]
}

function GetTextView(){
    return {
        Name: "Tips",
        Type: "View",
        IsDiv:true,
        ClassName: "CarListViewTips",
        FlexProps: { direction: "row", justify: "center", align: "between" },
        Properties: [{Id: CreateGuid(), Name: "Title", Type: "SpanText", ClassName: "SpanLabel",Label:'※ 最多可提交5辆车产'}]
    }
}

function GetTextBox3(Name, Label, DataType, PlaceHolder, MaxLength, IsNullable, Extra) {
    return {
        ...GetTextBox2(Name, Label, "", PlaceHolder, MaxLength, IsNullable, Extra),
        DataType
    }
}

function GetTextBox2(Name, Label, ContorlType, PlaceHolder, MaxLength, IsNullable, Extra) {
    return {
        ...GetTextBox(Name, Label, ContorlType, PlaceHolder, MaxLength),
        Extra,
        IsNullable: IsNullable,
        IsEdit: true,
    }
}

function GetDateText2(name, label) {
    return {
        Label: label, Name: name, Type: "DatePicker", IsNullable: false, IsListItem: false, IsEdit: true, ClassName: "SelectItem1",IsVisible:true
    }
}

function GetSelect(name, label, dataSource) {
    return {
        Label: label,
        Name: name,
        Type: "Select",
        IsNullable: false,
        IsListItem: false,
		IsEdit: true,
        ClassName: "SelectItem1",
        DataSource: dataSource
    }
}

function GetCarTypeSource() {
	return [{Value: '01', Text: "轿车（5人座）"},
		{Value: '02', Text: "SUV"},
		{Value: '03', Text: "商务型（7人座）"},
		{Value: '04', Text: "客车"},
		{Value: '05', Text: "货车"}
		]
}

function GetUseSource() {
    return [{Value: '01', Text: "营运"},
        {Value: '02', Text: "非营业"}]
}

function GetEventActions() {
    return [
        {
            Name: "SaveCarInfo",
            Type: "EntityEdit/SaveEntityData",
            EditView: "CarInfo"
        },
        {
            Name: "AddCar",
            Type: "DataListView/Add",
            DataListView: "CarList"
        },
        {
            Name: "DeleteCar",
            Type: "DataListView/Remove",
            DataListView: "CarList"
        },
        {
            Name: "GetCarInfo",
            Type: "EntityEdit/GetEntityData",
            EditView: "CarInfo"
        }]
}
