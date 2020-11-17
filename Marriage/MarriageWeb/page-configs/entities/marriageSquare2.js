module.exports = {
    name: "MarriageSquare2",
    viewName: 'ViewMarriageSquare2',
    primaryKey: "MarriageSquareId",
    properties: getProperties()
  }
  
  function getProperties() {
    return [
        getProperty("MarriageSquareId", "MarriageSquareId"),
        getProperty("ManUserName", "男方"),
        getProperty("ManMatchmakerName", "男方红娘"),
        getProperty("RoseCount", "男方赠送玫瑰数"),
        getProperty("UpdateDate", "男方最近赠送时间"),
        getProperty("WomanUserName", "女方"),
        getProperty("WomanMatchmakerName", "女方红娘"),
        getProperty("RoseCount2", "女方赠送玫瑰数"),
        getProperty("UpdateDate2", "女方最近赠送时间"),
        getProperty("ArrangeId", "相亲安排编号")
    ]
  }
  
  function getProperty(name, label) { return { name, label } }