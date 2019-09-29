module.exports = {
    Name: "PersonBillType",
    PrimaryKey: "Id",
    Properties: GetProperties(),
    IncomePaymentDataSource:GetIncomePaymentDataSource()
}

function GetProperties() {
    return [
        GetProperty("Id", "Id"),
        GetProperty("Name", "名称"),
        GetProperty("IncomePaymentName","收支"),
        GetProperty("Remark", "备注"),
        GetProperty("CreateDate", "创建时间")
    ]
}

function GetProperty(Name, Label) { return { Name, Label } }

function GetIncomePaymentDataSource(){
    return [{ Value: 1, Text: "收入" }, { Value: 1, Text: "支出" }]
}