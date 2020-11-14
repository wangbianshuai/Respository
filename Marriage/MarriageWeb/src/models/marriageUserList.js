import DvaIndex from "DvaCommon";
import { EntityModelConfig } from 'Configs';

const config = EntityModelConfig('MarriageUser');

config.actionList.push(post("updateStatus", "MarriageUser/UpdateStatus", "updateStatus", "MarriageUser", true));
config.actionList.push(get("getViewEntityData", "ViewMarriageUser", "getViewEntityData", "ViewMarriageUser", true));

function post(actionName, url, stateName, dataKey, isToken) {
    return { actionName, url, method: "POST", stateName, dataKey, isToken }
}
function get(actionName, url, stateName, dataKey, isToken, hasToken) {
    return { actionName, url, method: "GET", stateName, dataKey, isToken, hasToken }
}

export default DvaIndex(config);
