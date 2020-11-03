import EntityPage from './entityPage';

export default (name, entityName, title, minActionType, pageExpand, expandActionNames, stateNames) => {
  const config = {
    name,
    title,
    entityName,
    actionNames: expandActionNames || [],
    stateNames: stateNames || {},
    dataActionOptions: getDataActionOptions(name, entityName, minActionType, expandActionNames),
    pageExpand,
  };

  return EntityPage('entityInfo', config);
};

function getDataActionOptions(name, entityName, minActionType, expandActionNames) {
  var actionType = minActionType;

  const actionTypes = {};

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