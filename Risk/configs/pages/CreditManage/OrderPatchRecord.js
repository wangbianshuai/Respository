const { AssignProporties } = require("../../Common");
const ReadBaseInfo = require("../../views/Order/ReadBaseInfo");
const PatchRecord = require("../../views/OrderPatch/PatchRecord");

const DataActionTypes = {
    //获取实体数据
    GetOrderInfoEntityData: 1000,
    //获取补件记录
    GetPatchRecordEntityData: 1001
};

module.exports = {
    Name: "OrderPatchRecord",
    Type: "View",
    EventActions: GetEventActions(),
    Properties: AssignProporties({ Name: "OrderPatchRecord" }, [ReadBaseInfo(DataActionTypes), PatchRecord(DataActionTypes, true)])
}

function GetEventActions() {
    return [{
        Name: "GetOrderInfoEntityData",
        Type: "EntityEdit/GetEntityData",
        EditView: "OrderInfo"
    },
    {
        Name: "GetPatchRecordEntityData",
        Type: "EntityEdit/GetEntityData",
        EditView: "PatchRecord"
    },
    {
        Name: "ToAttachPage1",
        Type: "Page/ToAttachPage"
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