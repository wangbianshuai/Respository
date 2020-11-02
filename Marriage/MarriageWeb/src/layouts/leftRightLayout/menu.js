import { Common } from "UtilsCommon";

var _Menus = {}
export default () => {
    _Menus = {};
    return {
        navMenuList: [
            getMarriageManage(),
            getsystemManageNavNenu(),
            getPersonCenterNavMenu()
        ],
        menus: _Menus
    }
};

function getMarriageManage() {
    var menuList = [];

    menuList.push(addMenu("marriageMakePairList", "相亲匹配", false, "table", "/marriageManage/marriageMakePairList"));
    
    menuList.push(addMenu("marriageUserList", "相亲人员", false, "table", "/marriageManage/marriageUserList"));
   
    menuList.push(addMenu("marriageArrangeList", "相亲安排", false, "table", "/marriageManage/marriageArrangeList"));
    menuList.push(addMenu("marriageArrangeEdit", "新增", true, "form", "/marriageManage/marriageArrangeEdit", "", null, false, "相亲安排", "/marriageManage/marriageArrangeList", null, true));

    menuList.push(addMenu("marriageRecordList", "相亲记录", false, "table", "/marriageManage/marriageRecordList"));
    menuList.push(addMenu("marriageSuccessList", "相亲成功记录", false, "table", "/marriageManage/marriageSuccessList"));
    menuList.push(addMenu("matchmakerFeeDetailList", "红娘中介费明细", false, "table", "/marriageManage/matchmakerFeeDetailList"));
   
    menuList.push(addMenu("matchmakerList", "红娘", false, "table", "/marriageManage/matchmakerList"));
    menuList.push(addMenu("matchmakerEdit", "新增", true, "form", "/marriageManage/matchmakerEdit", "", null, false, "红娘", "/marriageManage/matchmakerList", null, true));
    

    menuList.push(addMenu("conditionTypeList", "条件类型", false, "table", "/marriageManage/conditionTypeList"));
    menuList.push(addMenu("conditionTypeEdit", "新增", true, "form", "/marriageManage/conditionTypeEdit", "", null, false, "条件类型", "/marriageManage/conditionTypeList", null, true));

    menuList.push(addMenu("dataSourceList", "数据源", false, "table", "/marriageManage/dataSourceList"));
    menuList.push(addMenu("dataSourceEdit", "新增", true, "form", "/marriageManage/dataSourceEdit", "", null, false, "数据源", "/marriageManage/dataSourceList", null, true));

    return addNavMenu("marriageManage", "相亲管理", false, menuList, true, ["marriageMakePairList"]);
}

function getPersonCenterNavMenu() {
    var menuList = [];
    menuList.push(addMenu("changePassword", "修改密码", true, "idcard", "/personCenter/changePassword"));

    return addNavMenu("personCenter", "个人中心", true, menuList, false, ["changePassword"]);
}

function getsystemManageNavNenu() {
    var menuList = [];

    menuList.push(addMenu("dictionaryConfigList", "键值配置", false, "table", "/systemManage/dictionaryConfigList"));
    menuList.push(addMenu("dictionaryConfigEdit", "新增", true, "form", "/systemManage/dictionaryConfigEdit", "", null, false, "键值配置", "/systemManage/dictionaryConfigList", null, true));


    menuList.push(addMenu("appUserList", "用户", false, "table", "/systemManage/appUserList"));
    menuList.push(addMenu("appUserEdit", "新增", true, "form", "/systemManage/appUserEdit", "", null, false, "用户", "/systemManage/appUserList", null, true));

    menuList.push(addMenu("operationLog", "操作日志", false, "table", "/systemManage/operationLog"));

    return addNavMenu("systemManage", "系统管理", false, menuList, true, ["dictionaryConfigList", "appUserList", "operationLog"]);
}

function addNavMenu(key, menuName, isRight, menuList, isVisible, menuKeys) {
    _Menus[key] = {
        key: key,
        menuName,
        menuList,
        isRight,
        isVisible,
        menuKeys,
        id: Common.createGuid()
    }

    return _Menus[key];
}

function addMenu(key, menuName, isRight, iconType, pageName, queryString, children, isVisible, parentMenuName, parentPageName, parentQueryString, isGetMenuName, openKey) {
    _Menus[key] = {
        key,
        menuName,
        iconType,
        pageName,
        queryString,
        children,
        isVisible: isVisible !== false,
        isRight: isRight,
        parentMenuName,
        parentPageName,
        parentQueryString,
        isGetMenuName,
        openKey,
        id: Common.createGuid()
    }

    return _Menus[key];
}