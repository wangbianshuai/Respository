const getConditionTypeView = require('../../views/conditionType');

//square/conditionType 1600-1699
const dataActionTypes = {
  //get entity data
  getEntityData: 1600,
  //Save entity data
  saveEntityData: 1601,
  //get entity data
  getUserConditionTypeByUser: 1602
};

module.exports =getConditionTypeView(dataActionTypes);