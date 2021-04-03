import { Common } from "UtilsCommon";

var _Menus = {}
export default () => {
    _Menus = {};
    return {
        navMenuList: [
            getsystemManageNavNenu(),
            getPersonCenterNavMenu()
        ],
        menus: _Menus
    }
};


function getPersonCenterNavMenu() {
    var menuList = [];
    menuList.push(addMenu("changePassword", "修改密码", true, "idcard", "/personCenter/changePassword"));

    return addNavMenu("personCenter", "个人中心", true, menuList, false, ["changePassword"]);
}

function getsystemManageNavNenu() {
    var menuList = [];

    menuList.push(addMenu("dictionaryConfigList", "键值配置", false, "table", "/systemManage/dictionaryConfigList"));
    menuList.push(addMenu("dictionaryConfigEdit", "新增", true, "form", "/systemManage/dictionaryConfigEdit", "", null, false, "键值配置", "/systemManage/dictionaryConfigList", null, true));

    menuList.push(addMenu("adminUserList", "用户", false, "table", "/systemManage/adminUserList"));
    menuList.push(addMenu("adminUserEdit", "新增", true, "form", "/systemManage/adminUserEdit", "", null, false, "用户", "/systemManage/adminUserList", null, true));

    menuList.push(addMenu("operationLog", "操作日志", false, "table", "/systemManage/operationLog"));

    return addNavMenu("systemManage", "系统管理", false, menuList, true, ["dictionaryConfigList", "adminUserList", "operationLog"]);
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