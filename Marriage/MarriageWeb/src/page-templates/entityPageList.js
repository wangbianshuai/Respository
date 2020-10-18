import EntityPage from './entityPage';

export default (name, entityName, minActionType, pageExpand, expandActionNames, stateNames) => {
  const config = {
    name,
    entityName,
    actionNames: ['searchQuery', 'deleteEntityData', 'excelExport'].concat(expandActionNames || []),
    stateNames: stateNames || {},
    dataActionOptions: getDataActionOptions(name, entityName, minActionType, expandActionNames),
    pageExpand,
  };

  return EntityPage('entityList', config);
};

function getDataActionOptions(name, entityName, minActionType, expandActionNames) {
  var actionType = minActionType;

  const actionTypes = {
    //搜索查询
    searchQuery: getActionType(),
    //删除实体数据
    deleteEntityData: getActionType(),
    //Excel导出
    excelExport: getActionType()
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

  return { name, serviceName: entityName + 'Service', minActionType, maxActionType: minActionType + 99, actionTypes }
}
