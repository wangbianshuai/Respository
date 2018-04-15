(function () {
    window.configs.Factory = {
        Name: "Factory",
        Title: "工厂",
        EntityName: "Factory",
        PrimaryKey: "Id",
        TemplateName: "EntityListPage",
        SelectNames: ["Id", "RowVersion", "Name", "DealingsBookName", "Remark"],
        SearchNames: ["Name"],
        DataColumnNames: ["Name", "DealingsBookName", "Remark"],
        EditNames: ["Name", "DealingsBookId", "Remark"],
        OrderByList: [{ Name: "CreateDate", IsDesc: true }],
        ActionList: GetActionList(),
        Properties: GetProperties()
    };

    function GetProperties() {
        return [{ Label: "名称", Name: "Name", DataType: "string", MaxLength: 50, IsNullable: false },
        {
            Label: "往来账本", Name: "DealingsBookId",
            DataType: "Guid", Type: "Select", ServiceDataSource: GetDealingsBookDataSource(), IsNullable: false
        },
        { Label: "备注", Name: "Remark", DataType: "string", MaxLength: 100, IsNullable: true },
        { Label: "往来账本", Name: "DealingsBookName" }]
    }


    function GetActionList() {
        return [{
            ActionName: "GetDealingsBookList", StateName: "DealingsBookList",
            Url: "ViewDealingsBook?$select=BookId,Name&$orderby=CreateDate", DataKey: "ViewDealingsBook", Method: "GET"
        }]
    }

    function GetDealingsBookDataSource() {
        return {
            ActionName: "GetDealingsBookList",
            ValueName: "BookId",
            TextName: "Name"
        }
    }


})();