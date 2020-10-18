module.exports = {
    name: 'ServiceInterface',
    viewName: 'ViewServiceInterface',
    primaryKey: 'ServiceInterfaceId',
    properties: getProperties()
  }
  
  function getProperties() {
    return [
        getProperty('ServiceInterfaceId', 'ServiceInterfaceId'),
        getProperty('Name', '名称'),
        getProperty('InterfaceName', '接口名'),
        getProperty('MethodName', '方法名'),
        getProperty('Url', 'URL'),
        getProperty('Remark', '备注'),
        getProperty('CreateDate', '创建时间')
    ]
  }
  
  function getProperty(name, label) { return { name, label } }