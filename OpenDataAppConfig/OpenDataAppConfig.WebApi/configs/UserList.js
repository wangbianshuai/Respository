(function () {
    window.configs.UserList = {
        Name: "UserList",
        Title: "用户列表",
        EntityName: "User",
        PrimaryKey: "UserId",
        ActionList: GetActionList(),
        TemplateName: "EntityListPage"
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


})();