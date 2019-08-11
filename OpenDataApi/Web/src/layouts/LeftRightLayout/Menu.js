import { Common } from "UtilsCommon";

var Menus = {}
export default () => {
    Menus = {};
    return {
        NavMenuList: [
            GetConfigManageNavNenu(),
        ],
        Menus
    }
};

function GetConfigManageNavNenu() {
    var menuList = [];
    menuList.push(AddMenu("ApplicationList", "应用", false, "table", "/ConfigManage/ApplicationList"));
    menuList.push(AddMenu("ApplicationEdit", "新增", true, "form", "/ConfigManage/ApplicationEdit", "", null, false, "应用", "/ConfigManage/ApplicationList", null, true));

    return AddNavMenu("ConfigManage", "配置管理", false, menuList, true, ["ApplicationList"]);
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