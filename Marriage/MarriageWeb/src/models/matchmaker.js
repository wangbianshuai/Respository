import DvaIndex from "DvaCommon";
import { EntityModelConfig } from 'Configs';

const config = EntityModelConfig('Matchmaker');

config.actionList.push(post("updateStatus", "Matchmaker/UpdateStatus", "updateStatus", "Matchmaker", true));
config.actionList.push(get("getViewEntityData", "ViewMatchmaker", "getViewEntityData", "ViewMatchmaker", true));

function post(actionName, url, stateName, dataKey, isToken) {
    return { actionName, url, method: "POST", stateName, dataKey, isToken }
}
function get(actionName, url, stateName, dataKey, isToken, hasToken) {
    return { actionName, url, method: "GET", stateName, dataKey, isToken, hasToken }
}

export default DvaIndex(config);