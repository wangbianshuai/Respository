(function () {
    window.configs.UserList = {
        Name: "UserList",
        EntityName: "User",
        PrimaryKey: "UserId",
        ActionList: GetActionList(),
        Properties: [{
            Name: "Search",
            Type: "Button",
            Text: "测试",
            ActionSteps: ["AlertMessage"]
        }]
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