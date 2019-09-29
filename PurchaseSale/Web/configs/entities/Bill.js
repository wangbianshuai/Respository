module.exports = {
    Name: "Bill",
    PrimaryKey: "Id",
    Properties: GetProperties(),
    IncomePaymentDataSource: GetIncomePaymentDataSource(),
    PersonTypeDataSource: GetPersonTypeDataSource(),
    UserDataSource:GetUserDataSource()
}

function GetProperties() {
    return [
        GetProperty("Id", "Id"),
        GetProperty("Amount2", "金额"),
        GetProperty("DataCode", "进销单号"),
        GetProperty("BillDate", "日期"),
        GetProperty("BillTypeName", "类型"),
        GetProperty("IncomePaymentName", "收支"),
        GetProperty("Remark", "备注"),
        GetProperty("CreateUserName","经手人"),
        GetProperty("CreateDate", "创建时间")
    ]
}

function GetProperty(Name, Label) { return { Name, Label } }

function GetIncomePaymentDataSource() {
    return [{ Value: 2, Text: "支出" }, { Value: 1, Text: "收入" }]
}

function GetPersonTypeDataSource() {
    return {
        ValueName: "Id",
        TextName: "Name",
        StateName: "BillTypes",
        ServiceName: "BillService",
        ActionName: "GetBillTypes",
        ParentValueName: "IncomePayment",
        IsRefresh: true,
        Payload: {}
    }
}

function GetUserDataSource(){
    return {
        ValueName: "UserId",
        TextName: "UserName",
        StateName: "Users",
        ServiceName: "BillService",
        ActionName: "GetUsers",
        IsRefresh: true,
        Payload: {}
    }
}
