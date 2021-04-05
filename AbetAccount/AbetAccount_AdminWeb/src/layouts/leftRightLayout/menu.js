import { Common } from "UtilsCommon";

var _Menus = {}
export default () => {
    _Menus = {};
    return {
        navMenuList: [
            getAccountNavMenu(),
            getsystemManageNavNenu(),
            getPersonCenterNavMenu()
        ],
        menus: _Menus
    }
};


function getAccountNavMenu() {
    var menuList = [];

    menuList.push(addMenu("accountBillList", "记账", false, "table", "/accountManage/accountBillList"));
    menuList.push(addMenu("accountBillEdit", "新增", true, "form", "/accountManage/accountBillEdit", "", null, false, "记账", "/accountManage/accountBillList", null, true));
    menuList.push(addMenu("accountBillCount", "记账统计", false, "table", "/accountManage/accountBillCount"));
  
    menuList.push(addMenu("accountItemList", "实体项目", false, "table", "/accountManage/accountItemList"));
    menuList.push(addMenu("accountItemEdit", "新增", true, "form", "/accountManage/accountItemEdit", "", null, false, "实体项目", "/accountManage/accountItemList", null, true));

    menuList.push(addMenu("accountCategoryList", "类型", false, "table", "/accountManage/accountCategoryList"));
    menuList.push(addMenu("accountCategoryEdit", "新增", true, "form", "/accountManage/accountCategoryEdit", "", null, false, "类别", "/accountManage/accountCategoryList", null, true));

    return addNavMenu("accountManage", "记账管理", false, menuList, true, ["accountBillList", "accountCategoryList"]);
}

function getPersonCenterNavMenu() {
    var menuList = [];
    menuList.push(addMenu("changePassword", "修改密码", true, "idcard", "/personCenter/changePassword"));

    return addNavMenu("personCenter", "个人中心", true, menuList, false, ["changePassword"]);
}

function getsystemManageNavNenu() {
    var menuList = [];
    menuList.push(addMenu("adminUserList", "用户", false, "table", "/systemManage/adminUserList"));
    menuList.push(addMenu("adminUserEdit", "新增", true, "form", "/systemManage/adminUserEdit", "", null, false, "用户", "/systemManage/adminUserList", null, true));

    menuList.push(addMenu("operationLog", "操作日志", false, "table", "/systemManage/operationLog"));

    return addNavMenu("systemManage", "系统管理", false, menuList, true, ["accountItemList", "adminUserList", "operationLog"]);
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