import { GetProperty } from "./Common";

export default {
    Name: "Patch",
    PrimaryKey: "OrderCode",
    Properties: GetProperties()
}

function GetProperties() {
    return [
        GetProperty("CreateDate", "CreateDate", "发起时间"),
        GetProperty("CreateUser", "CreateUser", "发起方"),
        GetProperty("ApprovalOpinion", "ApprovalOpinion", "审核意见"),
        GetProperty("ApprovalRemark", "ApprovalRemark", "备注"),
        GetProperty("PatchRemark", "PatchRemark", "备注"),
        GetProperty("MainTip", "MainTip", "重要提示"),
        GetProperty("SubmitDate", "SubmitDate", "提交时间"),
        GetProperty("ReceiveUser", "ReceiveUser", "接收方")
    ]
}