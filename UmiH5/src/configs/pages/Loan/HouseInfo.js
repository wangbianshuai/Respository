import House from "../../entities/House";

import { AssignProporties, GetTextBox, GetButton, CreateGuid, ToRem } from "../Common";

export default {
    Name: "HouseInfo",
    Type: "View",
    Style: { marginTop: ToRem(40) },
    Properties: AssignProporties({}, [GetHouseInfoView(),
    { ...GetButton("SaveHouse", "保存", "primary"), EventActionName: "SaveHouse", Style: { marginTop: ToRem(40) } },
    { ...GetButton("AddHouse", "新增房产", ""), EventActionName: "AddHouse", Style: { marginTop: ToRem(40) }, Icon: "plus" }
    ])
}

function GetHouseInfoView() {
    return {
        Name: "HouseList",
        Type: "DataListView",
        DefaultValue: [{ Id: CreateGuid(), Title: "房产信息一" }],
        IsComplexEdit: true,
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
        { Name: "Title", Type: "SpanText", ClassName: "SpanTitle" },
        { ...GetButton("DeleteHouse", "删除", ""), EventActionName: "DeleteHouse", Style: { marginLeft: ToRem(40) }, Icon: "delete" },
        GetTextBox2("HouseUserName", "房产所有人", "", "", 50, true),
        GetTextBox2("HouseAddress", "房产地址", "", "", 100, true),
        GetTextBox3("HouseSpace", "面积", "decimal", "", 10, true, "平米")
    ]
}

function GetTextBox3(Name, Label, DataType, PlaceHolder, MaxLength, IsNullable, addonAfter) {
    return {
        ...GetTextBox2(Name, Label, "", PlaceHolder, MaxLength, IsNullable, addonAfter),
        DataType
    }
}

function GetTextBox2(Name, Label, ContorlType, PlaceHolder, MaxLength, IsNullable, addonAfter) {
    return {
        ...GetTextBox(Name, Label, ContorlType, PlaceHolder, MaxLength),
        AddonAfter: addonAfter,
        IsNullable: IsNullable,
        IsEdit: true,
    }
}