import DvaIndex from "DvaCommon";

const config = {
  name: 'A2ApiService',
  serviceName: 'A2ApiService',
  actionList: [
    post("syncWeChatUser", "User/SyncWeChatUser", "syncWeChatUser", true),
    post("syncWeChatTemplate", "Message/SyncWeChatTemplate", "syncWeChatTemplate", true)
  ]
}
function post(actionName, url, stateName, istoken) {
  return { actionName, url, method: "POST", stateName, istoken }
}

export default DvaIndex(config);
