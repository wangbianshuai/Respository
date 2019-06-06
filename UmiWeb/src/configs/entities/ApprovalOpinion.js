import { GetProperty } from "./Common";

export default {
    Name: "ApprovalOpinion",
    PrimaryKey: "OrderCode",
    Properties: GetProperties()
}

function GetProperties() {
    return [
        GetProperty("OpinionRemark", "OpinionRemark", "备注"),
        GetProperty("ApproveStatus", "ApproveStatus", "状态")
    ]
}