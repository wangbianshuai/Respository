module.exports = {
    Name: "PersonBill",
    PrimaryKey: "Id",
    Properties: GetProperties(),
    IncomePaymentDataSource:GetIncomePaymentDataSource(),
    PersonTypeDataSource:GetPersonTypeDataSource()
}

function GetProperties() {
    return [
        GetProperty("Id", "Id"),
        GetProperty("Amount", "金额"),
        GetProperty("IncomePaymentName","收支"),
        GetProperty("BillDate","日期"),
        GetProperty("PersonBillTypeName","类型"),
        GetProperty("IncomePaymentName","收支"),
        GetProperty("Remark", "备注"),
        GetProperty("CreateDate", "创建时间")
    ]
}

function GetProperty(Name, Label) { return { Name, Label } }

function GetIncomePaymentDataSource(){
    return [{ Value: 1, Text: "收入" }, { Value: 1, Text: "支出" }]
}

function GetPersonTypeDataSource() {
    return {
        ValueName: "Id",
        TextName: "Name",
        StateName: "PersonBillTypes",
        ServiceName: "PersonBillService",
        ActionName: "GetPersonBillTypes",
        IsRefresh: true,
        Payload: {}
    }
}