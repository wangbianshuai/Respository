import { GetProperty } from "./Common";

export default {
    Name: "Order",
    PrimaryKey: "OrderId",
    Properties: GetProperties()
}

function GetProperties() {
    return [
        GetProperty("OrderId", "OrderId", "OrderId", "long"),
        GetProperty("OrderCode", "OrderCode", "工单编号", "string", false),
        GetProperty("Borrowers", "Borrowers", "借款主体", "string", false, 100),
        GetProperty("BorrowerUser", "BorrowerUser", "主借人", "string", false, 100),
        GetProperty("ProductType", "ProductType", "产品类型", "string", false),
        GetProperty("LoanUser", "LoanUser", "信贷员", "string", false),
        GetProperty("BorrowerDate", "BorrowerDate", "借款申请时间", "date", false),
        GetProperty("UpdateDate", "UpdateDate", "更新时间", "date", false),
        GetProperty("OrderStatus", "OrderStatus", "状态", "string", false)
    ]
}

