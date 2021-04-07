import DvaIndex from "DvaCommon";

export default DvaIndex({
    name: "WebService",
    serviceName: "WebService",
    actionList: [
        get("getPageConfig", "configs", "getConfigs")
    ]
})

function get(actionName, url, stateName) {
    return { actionName, url, method: "GET", stateName };
}
