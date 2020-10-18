import DvaIndex from "DvaCommon";
import { EntityModelConfig } from 'Configs';

const config = EntityModelConfig('User');

config.actionList.push(post("setUserTag", "User/SetUserTag", "setUserTag", "User", true));
config.actionList.push(post("cancelUserTag", "User/CancelUserTag", "cancelUserTag", "User", true));

function post(actionName, url, stateName, dataKey, istoken) {
  return { actionName, url, method: "POST", stateName, dataKey, istoken }
}

export default DvaIndex(config);
