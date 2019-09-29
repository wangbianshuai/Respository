const { AssignProporties } =require( "../../Common");
const ReadBaseInfo =require( "../../views/Order/ReadBaseInfo");
const PatchOperation =require( "../../views/OrderPatch/PatchOperation");

const DataActionTypes = {
    //获取实体数据
    GetOrderInfoEntityData: 900,
    //获取补件信息
    GetPatchInfoEntityData: 901,
    //保存补件信息
    SavePatchInfoEntityData: 902
};

module.exports= {
    Name: "OrderPatchEdit",
    Type: "View",
    EventActions: GetEventActions(),
    Properties: AssignProporties({Name:"OrderPatchEdit"}, [ReadBaseInfo(DataActionTypes), PatchOperation(DataActionTypes)])
}

function GetEventActions() {
    return [{
        Name: "GetOrderInfoEntityData",
        Type: "EntityEdit/GetEntityData",
        EditView: "OrderInfo"
    },
    {
        Name: "SavePatchInfoEntityData",
        Type: "EntityEdit/SaveEntityData",
        EditView: "PatchInfo",
        ToPageUrl: "/Orders/HandledOrderList",
        SetDisabledViewList: ["PatchInfo", "PatchInfoRightButtonView"]
    },
    {
        Name: "ToAttachPage1",
        Type: "Page/ToAttachPage"
    },
    {
        Name: "GetPatchInfoEntityData",
        Type: "EntityEdit/GetEntityData",
        EditView: "PatchInfo"
    },
    {
        Name: "ToOrderDetail",
        Type: "Page/OpenUrl",
        PageUrl: "/risk/CreditManage/OrderDetail?OrderCode=#{OrderCode}&LookCode=ee1645b3-f024-37c8-b08a-c734b4657aaa"
    },
    {
        Name: "SearchCustomer",
        Type: "Page/ToQueryCustomer"
    }]
}