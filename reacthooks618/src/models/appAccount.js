import DvaIndex from "DvaCommon";
import { EntityModelConfig } from 'Configs';

const config = EntityModelConfig('AppAccount');

config.actionList.push(post("updateStatus", "AppAccount/Update", "updateStatus", "AppAccount", true));

function post(actionName, url, stateName, dataKey, istoken) {
  return { actionName, url, method: "POST", stateName, dataKey, istoken }
}

export default DvaIndex(config);
