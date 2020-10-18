import DvaIndex from "DvaCommon";
import { EntityModelConfig } from 'Configs';

const config = EntityModelConfig('SendTemplateMessage');

config.actionList.push(post("saveEntityDataToSend", "SendTemplateMessage/SaveToSend", "saveEntityDataToSend", "SendTemplateMessage", true));

function post(actionName, url, stateName, dataKey, istoken) {
    return { actionName, url, method: "POST", stateName, dataKey, istoken }
}

export default DvaIndex(config);
