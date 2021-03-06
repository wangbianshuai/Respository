export default (name, serviceName) => {
  return {
    name: name + 'Service',
    serviceName: serviceName || 'ApiService',
    actionList: [
      post('searchQuery', name, 'searchQuery', 'View' + name, true),
      post('insert', name, 'saveEntityData', null, true, true),
      put('update', name, 'saveEntityData', null, true, true),
      delete2('delete', name, 'deleteEntityData', null, true, true),
      get('getEntityData', name, 'getEntityData', name, true),
      post('excelExport', 'View' + name, 'excelExport', '', true),
    ]
  }
}

function get(actionName, url, stateName, dataKey, istoken, hastoken) {
  return { actionName, url, method: 'GET', stateName, dataKey, istoken, hastoken };
}

function post(actionName, url, stateName, dataKey, istoken, isOperation) {
  return { actionName, url, stateName, dataKey, istoken, isOperation };
}

function put(actionName, url, stateName, dataKey, istoken, isOperation) {
  return { actionName, url, stateName, method: 'PUT', dataKey, istoken, isOperation };
}

function delete2(actionName, url, stateName, dataKey, istoken, isOperation) {
  return { actionName, url, stateName, method: 'DELETE', dataKey, istoken, isOperation };
}
