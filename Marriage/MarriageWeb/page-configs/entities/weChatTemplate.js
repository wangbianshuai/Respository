module.exports = {
    name: 'WeChatTemplate',
    primaryKey: 'TemplateId',
    properties: getProperties()
  }
  
  function getProperties() {
    return [
        getProperty('TemplateId', 'TemplateId'),
        getProperty('Title', '标题'),
        getProperty('PrimaryIndustry', '一级行业'),
        getProperty('PrimaryIndustry', '一级行业'),
        getProperty('Content', '内容'),
        getProperty('Example', '示例'),
        getProperty('UpdateDate', '更新时间')
    ]
  }
  
  function getProperty(name, label) { return { name, label } }