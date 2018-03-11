(function () {
    window.configs.ContentEdit = {
        Name: "ContentEdit",
        Title: "用户列表",
        EntityName: "User",
        PrimaryKey: "UserId",
        ActionList: GetActionList(),
        TemplateName: "EntityListPage",
        SelectNames: ["UserName", "LoginName", "CreateDate"],
        SearchNames: ["UserName", "LoginName"],
        DataItemKeyValues: GetDataItemKeyValues(),
        EventActionList: GetEventActionList()
    };

    function GetActionList() {
        return [AddAction("Query", "DataList", "DataAccess/Query", "DataList"),
        AddAlertAction()]
    }

    function AddAction(actoinName, stateName, url, dataKey) {
        return { ActionName: actoinName, StateName: stateName, Url: url, DataKey: dataKey }
    }

    function AddAlertAction() {
        return { ActionName: "AlertMessage", IsRequest: false, StateName: "AlertMessage", ActionType: "Alert", Message: "测试" }
    }

    function GetDataItemKeyValues() {
        var list = [];
        list.push({ LeftName1: "LoginName", RightName1: "" })
        list.push({ LeftName2: "UserName", RightName2: "CreateDate" })
        return list;
    }

    function GetEventActionList() {
        return [{
            Name: "SearchData",
            Type: "Query",
            IsInitInvoke: true
        }]
    }


})();