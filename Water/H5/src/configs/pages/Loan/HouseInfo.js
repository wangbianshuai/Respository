// import House from "../../entities/House";

import { AssignProporties, GetTextBox, GetButton, CreateGuid, ToRem } from "../Common";

//借款人房产信息 200-299
const DataActionTypes = {
	//获取实体数据
	GetHouseInfo: 200,
	//保存实体数据
	SaveHouseInfo: 299
}

export default {
    Name: "HouseInfo",
    Type: "View",
    EventActionName: "GetHouseInfo",
    SaveEntityDataActionType: DataActionTypes.SaveHouseInfo,
    GetEntityDataActionType: DataActionTypes.GetHouseInfo,
    EventActions: GetEventActions(),
    Style: { marginTop: ToRem(40) },
    Properties: AssignProporties({}, [GetHouseInfoView(),
    { ...GetButton("SaveHouse", "保存", "primary"), EventActionName: "SaveHouseInfo", Style: { marginTop: ToRem(40) } },
    { ...GetButton("AddHouse", "新增房产", ""), EventActionName: "AddHouse", Style: { marginTop: ToRem(40) ,marginBottom: ToRem(60) }, Icon: "plus" },
        {...GetTextView()}
    ])
}

function GetHouseInfoView() {
    return {
        Name: "HouseList",
        Type: "DataListView",
        DefaultValue: [{ Id: CreateGuid(), Title: "房产信息一" }],
        // IsFirstDelete: false,
        DeletePropertyName: "DeleteHouse",
        PrimaryKey: "Id",
        Title: "房产信息",
		IsEdit: true,
        Properties: AssignProporties({}, GetHouseItemProperties())
    }
}

function GetHouseItemProperties() {
    return [
        GetTitleView(),
        GetTextBox2("ower", "房产所有人", "", "请输入房屋当前所有权人", 50, true),
        GetTextBox2("address", "房产地址", "TextArea", "请输入房屋所在地址", 500, true),
        GetTextBox3("area", "面积", "float", "产权证上登记的面积", 10, true, "平米")
    ]
}

function GetTitleView() {
    return {
        Name: "TitleView",
        Type: "View",
        ClassName:"ListviewTitle",
        IsFlex: true,
		IsEdit: false,
        FlexProps: { direction: "row", justify: "center", align: "between" },
        Properties: AssignProporties({}, GetTitleViewProperties())
    }
}

function GetTitleViewProperties() {
    return [{Id: CreateGuid(), Name: "Title", Type: "SpanText", ClassName: "SpanLabel", Label: "（选填）" },
    { ...GetButton("DeleteHouse", " ", ""), ClassName: "deleteHouseDescBtn", EventActionName: "DeleteHouse",},
    ]
}

function GetTextView(){
    return {
        Name: "Tips",
        Type: "View",
        IsDiv:true,
        ClassName: "CarListViewTips",
        FlexProps: { direction: "row", justify: "center", align: "between" },
        Properties: [{ Id: CreateGuid(),Name: "Title", Type: "SpanText", ClassName: "SpanLabel",Label:'※ 最多可提交5处房产'}]
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
		IsView: false,
    }
}

function GetEventActions() {
    return [
        {
            Name: "SaveHouseInfo",
            Type: "EntityEdit/SaveEntityData",
            EditView: "HouseInfo"
        },
        {
            Name: "AddHouse",
            Type: "DataListView/Add",
            DataListView: "HouseList"
        },
        {
            Name: "DeleteHouse",
            Type: "DataListView/Remove",
            DataListView: "HouseList"
        },
        {
            Name: "GetHouseInfo",
            Type: "EntityEdit/GetEntityData",
            EditView: "HouseInfo"
        }]
}
