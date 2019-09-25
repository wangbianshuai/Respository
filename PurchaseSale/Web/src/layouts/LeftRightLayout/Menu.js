import { Common } from "UtilsCommon";

var Menus = {}
export default () => {
    Menus = {};
    return {
        NavMenuList: [
            GetSystemManageNavNenu(),
        ],
        Menus
    }
};

function GetSystemManageNavNenu() {
    var menuList = [];
    menuList.push(AddMenu("UserList", "用户", false, "table", "/SystemManage/UserList"));
    menuList.push(AddMenu("UserEdit", "新增", true, "form", "/SystemManage/UserEdit", "", null, false, "正则表达式", "/SystemManage/UserList", null, true));

    return AddNavMenu("SystemManage", "系统管理", false, menuList, true, ["UserList"]);
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