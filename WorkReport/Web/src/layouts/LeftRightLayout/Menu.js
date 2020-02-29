import { Common } from "UtilsCommon";

var Menus = {}
export default () => {
    Menus = {};
    return {
        NavMenuList: [
            GetWorkReportNavMenu(),
            GetSystemManageNavNenu(),
            GetPersonCenterNavMenu()
        ],
        Menus
    }
};

function GetPersonCenterNavMenu() {
    var menuList = [];
    menuList.push(AddMenu("ChangePassword", "修改密码", true, "idcard", "/PersonCenter/ChangePassword"));

    return AddNavMenu("PersonCenter", "个人中心", true, menuList, false);
}

function GetWorkReportNavMenu() {
    var menuList = [];
    menuList.push(AddMenu("WorkReportInput", "Story Test Cases Input", false, "form", "/WorkReportManage/WorkReportInput"));
    menuList.push(AddMenu("WorkReportList", "Story Test Cases List", false, "table", "/WorkReportManage/WorkReportList"));
    menuList.push(AddMenu("WorkReportCount", "Story Test Cases Count", false, "table", "/WorkReportManage/WorkReportCount"));

    return AddNavMenu("WorkReportManage", "Story Test Cases", false, menuList, true, ["WorkReportInput", "WorkReportList", "WorkReportCount"]);
}

function GetSystemManageNavNenu() {
    var menuList = [];
    menuList.push(AddMenu("UserList", "用户", false, "table", "/SystemManage/UserList"));
    menuList.push(AddMenu("UserEdit", "新增", true, "form", "/SystemManage/UserEdit", "", null, false, "用户", "/SystemManage/UserList", null, true));

    menuList.push(AddMenu("OperationLog", "操作日志", false, "table", "/SystemManage/OperationLog"));

    return AddNavMenu("SystemManage", "系统管理", false, menuList, true, ["UserList", "OperationLog"]);
}

function AddNavMenu(key, name, isRight, menuList, IsVisible, MenuKeys) {
    Menus[key] = {
        Key: key,
        MenuName: name,
        MenuList: menuList,
        IsRight: isRight,
        IsVisible,
        MenuKeys,
        Id: Common.CreateGuid()
    }

    return Menus[key];
}

function AddMenu(key, name, isRight, type, pageName, queryString, children, isVisible, parentMenuName, parentPageName, parentQueryString, isGetMenuName, openKey) {
    Menus[key] = {
        Key: key,
        MenuName: name,
        IconType: type,
        PageName: pageName,
        QueryString: queryString,
        Children: children,
        IsVisible: isVisible !== false,
        IsRight: isRight,
        ParentMenuName: parentMenuName,
        ParentPageName: parentPageName,
        ParentQueryString: parentQueryString,
        IsGetMenuName: isGetMenuName,
        OpenKey: openKey,
        Id: Common.CreateGuid()
    }

    return Menus[key];
}