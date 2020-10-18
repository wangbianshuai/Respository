import DvaIndex from "DvaCommon";

export default DvaIndex({
    name: "ReceiveMessage",
    serviceName: "WebService",
    actionList: [
        get("judgeLogin", "judgeLogin"),
        get('setTitle', 'setTitle'),
        get('redirectUrl', 'redirectUrl')
    ]
})

function get(actionName, stateName) {
    return { actionName, isRequest: false, stateName };
}
