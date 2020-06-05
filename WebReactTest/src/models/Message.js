import DvaIndex from "DvaCommon";

const config = {
    Name: "MessageService",
    ServiceName: "MessageApiService",
    ActionList: [
        post("ReSend", "Message/ReSend", "ReSend", "ChangePassworReSendd", true)
    ]
}

function post(actionName, url, stateName, dataKey, IsToken) {
    return { ActionName: actionName, Url: url, Method: "POST", StateName: stateName, DataKey: dataKey, IsToken }
}

export default DvaIndex(config);