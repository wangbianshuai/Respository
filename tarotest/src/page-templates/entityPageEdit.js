import Taro, { useMemo } from "@tarojs/taro";
import EntityPage from "./entityPage";

const EntityPageEdit = (props) => {
  const pageConfig = useMemo(() => {
    const { name, entityName, minActionType, pageExpand, expandActionNames } = props;

    return {
      pageName: name,
      entityName,
      actionNames: ["getEntityData", "saveEntityData"].concat(expandActionNames || []),
      stateNames: {},
      actionOptions: getActionOptions(name, entityName, minActionType, expandActionNames),
      pageExpand,
    };
  }, [props]);

  return <EntityPage name='entityEdit' pageConfig={pageConfig} params={props.params} />
};

function getActionOptions(name, entityName, minActionType, expandActionNames) {
  var actionType = minActionType;

  const actionTypes = {
    //获取实体数据
    getEntityData: getActionType(),
    //保存实体数据
    saveEntityData: getActionType()
  };

  if (expandActionNames) expandActionNames.forEach(a => actionTypes[getActionName(a)] = getActionType());

  function getActionType() {
    var type = actionType;
    actionType += 1;
    return type;
  }

  function getActionName(actionName) {
    const names = actionName.split('/');
    if (names.length === 2) return names[1];
    return actionName;
  }

  return { name, serviceName: entityName + "Service", minActionType, maxActionType: minActionType + 99, actionTypes }
}

export default EntityPageEdit;
