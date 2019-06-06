import { GetProperty } from "./Common";

export default {
    Name: "InvoiceInfo",
    PrimaryKey: "OrderCode",
    Properties: GetProperties()
}

function GetProperties() {
    return [
        GetProperty("InvoiceFile", "InvoiceFile", "开票数据导入"),
        GetProperty("AvgInvoiceAmount24", "AvgInvoiceAmount24", "企业月均开票金额（近13～24个月）"),
        GetProperty("AvgInvoiceAmount12", "AvgInvoiceAmount12", "企业月均开票金额（近12个月）")
    ]
}