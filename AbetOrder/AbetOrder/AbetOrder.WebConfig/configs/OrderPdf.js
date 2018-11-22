(function () {
    window.configs.OrderPdf = {
        Name: "OrderPdf",
        Title: "订单PDF",
        EntityName: "OrderPdf",
        PrimaryKey: "Id",
        TemplateName: "EntityListPage",
        UpdateStatusUrl: "OrderPdf/ReGenPdf",
        SelectNames: ["Id", "OrderName2", "FailId", "GenStatus", "PdfPath", "FailMessage", "CreateUserName", "GenStatusName", "PdfTypeName", "CreateDate"],
        SearchNames: ["PdfType", "GenStatus", "OrderName2"],
        DataColumnNames: ["OrderName2", "PdfTypeName", "GenStatusName", "CreateUserName", "CreateDate"],
        OrderByList: [{ Name: "CreateDate", IsDesc: true }],
        Properties: GetProperties(),
        DefaultConditions: GetDefaultConditions(),
        IsNewAdd: false,
        IsUpdate: true,
        IsDelete: false,
        TableWidth: 1000
    };

    function GetDefaultConditions() {
        return [{
            Name: "DataRight",
            Type: "int",
            IsCurrentUser: true,
            PropertyName: "DataRight"
        }]
    }

    function GetProperties() {
        return [{
            Label: "类型", Name: "PdfType", AllowClear: true, OperateLogic: "=",
            DataType: "byte", Type: "Select", DataSource: GetPdfTypeDataSource()
        },
        {
            Label: "状态", Name: "GenStatus",
            DataType: "int", Type: "Select", DataSource: GetStatusDataSource(), OperateLogic: "=", AllowClear: true
        },
        { Label: "订单", Name: "OrderName2", IsOpenPage: true, IsRandom: false, SearchProperty: { PropertyName: null }, PropertyName: "PdfPath", PageUrl: "{PdfPath}", DataType: "string", PlaceHolder: "模糊匹配订单编号或门板花式" },
        { Label: "类型", Name: "PdfTypeName" },
        { Label: "创建时间", Name: "CreateDate" },
        { Label: "创建人", Name: "CreateUserName" },
        { Label: "状态", Name: "GenStatusName" }]
    }

    function GetStatusDataSource() {
        return [{ Value: "1", Text: "成功" }, { Value: "2", Text: "失败" }]
    }

    function GetPdfTypeDataSource() {
        return [{ Value: "1", Text: "订单" }, { Value: "2", Text: "加工单" }]
    }

})();

