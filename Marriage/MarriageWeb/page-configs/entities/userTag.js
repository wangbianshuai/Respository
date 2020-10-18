module.exports = {
    name: 'UserTag',
    viewName: 'ViewUserTag',
    primaryKey: 'UserTagId',
    properties: getProperties()
  }
  
  function getProperties() {
    return [
        getProperty('UserTagId', 'UserTagId'),
        getProperty('Name', '名称'),
        getProperty('Remark', '备注'),
        getProperty('CreateDate', '创建时间')
    ]
  }
  
  function getProperty(name, label) { return { name, label } }