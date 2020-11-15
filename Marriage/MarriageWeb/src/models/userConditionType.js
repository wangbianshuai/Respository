import DvaIndex from "DvaCommon";
import { EntityModelConfig } from 'Configs';

const config = EntityModelConfig('UserConditionType');

config.actionList.push(post("getUserConditionType1", "UserConditionType/GetUserConditionType", "getUserConditionType1", null, true));
config.actionList.push(post("getUserConditionType2", "UserConditionType/GetUserConditionType", "getUserConditionType2", null, true));

function post(actionName, url, stateName, dataKey, isToken) {
    return { actionName, url, method: "POST", stateName, dataKey, isToken }
}

export default DvaIndex(config);
