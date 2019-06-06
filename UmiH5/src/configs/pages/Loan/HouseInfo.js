import House from "../../entities/House";

import { AssignProporties, GetTextBox, GetButton, CreateGuid, ToRem } from "../Common";

//借款人房产信息 200-299
const DataActionTypes = {
    //获取实体数据
    GetEntityData: 200,
    //保存实体数据
    SaveEntityData: 299
}

export default {
    Name: "HouseInfo",
    Type: "View",
    Entity: House,
    EventActionName: "GetEntityData",
    SaveEntityDataActionType: DataActionTypes.SaveEntityData,
    GetEntityDataActionType: DataActionTypes.GetEntityData,
    EventActions: GetEventActions(),
    Style: { marginTop: ToRem(40) },
    Properties: AssignProporties({}, [GetHouseInfoView(),
    { ...GetButton("SaveHouse", "保存", "primary"), EventActionName: "SaveHouse", Style: { marginTop: ToRem(40) } },
    { ...GetButton("AddHouse", "新增房产", ""), EventActionName: "AddHouse", Style: { marginTop: ToRem(40) ,marginBottom: ToRem(60) }, Icon: "plus" }
    ])
}

function GetHouseInfoView() {
    return {
        Name: "HouseList",
        Type: "DataListView",
        DefaultValue: [{ Id: CreateGuid(), Title: "房产信息一" }],
        IsFirstDelete: false,
        DeletePropertyName: "DeleteHouse",
        PrimaryKey: "Id",
        Title: "房产信息",
        Properties: AssignProporties({}, [{
            Name: "HouseItemView",
            Type: "View",
            Properties: AssignProporties(House, GetHouseItemProperties())
        }])
    }
}

function GetHouseItemProperties() {
    return [
        GetTitleView(),
        GetTextBox2("HouseUserName", "房产所有人", "", "请输入房屋当前所有权人", 50, true),
        GetTextBox2("HouseAddress", "房产地址", "TextArea", "请输入房屋所在地址", 100, true),
        GetTextBox3("HouseSpace", "面积", "float", "产权证上登记的面积", 10, true, "平米")
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
    { ...GetButton("DeleteHouse", "删除", " "), ClassName: "deleteHouseDescBtn", EventActionName: "DeleteHouse", Style: {  },},
    ]
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

function GetEventActions() {
    return [
        {
            Name: "SaveEntityData",
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
            Name: "GetEntityData",
            Type: "EntityEdit/GetEntityData",
            EditView: "HouseInfo"
        }]
}
