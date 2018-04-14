(function () {
    window.configs.DealingsBook = {
        Name: "DealingsBook",
        Title: "往来账本",
        EntityName: "DealingsBook",
        PrimaryKey: "BookId",
        TemplateName: "EntityListPage",
        SelectNames: ["BookId", "RowVersion", "Name", "Remark"],
        SearchNames: ["Name"],
        DataColumnNames: ["Name", "Remark"],
        EditNames: ["Name", "Remark", "BookUsers1", "BookUsers2"],
        InsertUrl: "DealingsBook/Insert2",
        UpdateUrl: "DealingsBook/Update2",
        GetEntityDataUrl: "DealingsBook/GetDealingsBook",
        OrderByList: [{ Name: "CreateDate", IsDesc: true }],
        ActionList: GetActionList(),
        Properties: GetProperties()
    };

    function GetActionList() {
        return [{
            ActionName: "GetUserList", StateName: "UserList",
            Url: "ViewUser?$select=UserId,UserName&$orderby=CreateDate&$filter=DataRight ne 3", DataKey: "ViewUser", Method: "GET"
        }]
    }

    function GetProperties() {
        return [{ Label: "名称", Name: "Name", DataType: "string", MaxLength: 50, IsNullable: false },
        { Label: "备注", Name: "Remark", DataType: "string", MaxLength: 100, IsNullable: true },
        { Label: "甲方记账人", Name: "BookUsers1", IsFlexColumn: true, Type: "CheckBoxGroup", DataType: "Array", ServiceDataSource: GetUserDataSource(), IsNullable: false },
        { Label: "乙方记账人", Name: "BookUsers2", IsFlexColumn: true, Type: "CheckBoxGroup", DataType: "Array", ServiceDataSource: GetUserDataSource(), IsNullable: false }]
    }

    function GetUserDataSource() {
        return {
            ActionName: "GetUserList",
            ValueName: "UserId",
            TextName: "UserName"
        }
    }

})();