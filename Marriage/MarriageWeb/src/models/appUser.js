import DvaIndex from "DvaCommon";
import { EntityModelConfig } from 'Configs';

const config = EntityModelConfig('AppUser');

config.actionList.push(post("login", "AppUser/Login", "login", "AppUser"));
config.actionList.push(post("changePassword", "AppUser/ChangePassword", "changePassword", "changePassword", true));

function post(actionName, url, stateName, dataKey, istoken) {
  return { actionName, url, method: "POST", stateName, dataKey, istoken }
}

export default DvaIndex(config);
