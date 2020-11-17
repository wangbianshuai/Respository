import DvaIndex from "DvaCommon";
import { EntityModelConfig } from 'Configs';

const config = EntityModelConfig('MarriageArrange');

config.actionList.push(post("updateStatus", "MarriageArrange/UpdateStatus", "updateStatus", "MarriageArrange", true));
config.actionList.push(get("getViewEntityData", "ViewMarriageArrange", "getViewEntityData", "ViewMarriageArrange", true));
config.actionList.push(get("getMarriageFee", "MarriageArrange/GetMarriageFee", "getMarriageFee", "MarriageArrange", true));
config.actionList.push(post("updateFee", "MarriageArrange/UpdateFee", "updateFee", "MarriageArrange", true));
config.actionList.push(post("createMarriageArrange", "MarriageArrange", "createMarriageArrange", "MarriageArrange", true));

function post(actionName, url, stateName, dataKey, isToken) {
    return { actionName, url, method: "POST", stateName, dataKey, isToken }
}
function get(actionName, url, stateName, dataKey, isToken, hasToken) {
    return { actionName, url, method: "GET", stateName, dataKey, isToken, hasToken }
}

export default DvaIndex(config);
