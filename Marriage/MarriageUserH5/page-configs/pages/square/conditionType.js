const getConditionTypeView = require('../../views/conditionType');

//square/conditionType 1300-1399
const dataActionTypes = {
  //get entity data
  getEntityData: 1300,
  //Save entity data
  saveEntityData: 1301,
  //get entity data
  getUserConditionTypeByUser: 1302
};

module.exports =getConditionTypeView(dataActionTypes);