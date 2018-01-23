(function () {
    window.configs.UserList = {
        EntityName: "User",
        PrimaryKey: "UserId",
        ActionList: GetActionList()
    };

    function GetActionList() {
        return [AddAction("Query", "DataList", "DataAccess/Query", "DataList")]
    }

    function AddAction(actoinName, stateName, url, dataKey) {
        return { ActionName: actoinName, StateName: stateName, Url: url, DataKey: dataKey }
    }
})();