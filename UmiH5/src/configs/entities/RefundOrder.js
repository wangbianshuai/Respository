import { GetProperty } from "./Common";

export default {
    Name: "RefundOrder",
    PrimaryKey: "OrderCode",
    Properties: GetProperties()
}

function GetProperties() {
    return [
        GetProperty("CreateDate", "CreateDate", "发起时间"),
        GetProperty("CreateUser", "CreateUser", "发起方"),
        GetProperty("ApprovalOpinion", "ApprovalOpinion", "审核意见"),
        GetProperty("ApprovalRemark", "ApprovalRemark", "备注"),
        GetProperty("Title", "Title", "标题")
    ]
}