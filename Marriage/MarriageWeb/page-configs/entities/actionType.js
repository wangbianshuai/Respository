module.exports = {
    name: 'ActionType',
    viewName: 'ViewActionType',
    primaryKey: 'ActionTypeId',
    properties: getProperties()
  }
  
  function getProperties() {
    return [
        getProperty('ActionTypeId', 'ActionTypeId'),
        getProperty('Name', '名称'),
        getProperty('ActionKey', '行为KEY值'),
        getProperty('Remark', '备注'),
        getProperty('CreateDate', '创建时间')
    ]
  }
  
  function getProperty(name, label) { return { name, label } }