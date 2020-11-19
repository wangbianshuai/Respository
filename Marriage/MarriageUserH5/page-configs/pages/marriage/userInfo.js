const getUserInfoView = require('../../views/userInfo');

//square/userInfo 1800-1899
const dataActionTypes = {
    //get entity data
    getEntityData: 1800,
    //Save entity data
    saveEntityData: 1801
};

module.exports = getUserInfoView(dataActionTypes, 2);