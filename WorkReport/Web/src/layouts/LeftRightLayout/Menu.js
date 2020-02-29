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
    menuList.push(AddMenu("DailyInput", "Daily Input", false, "form", "/WorkReportManage/DailyInput"));
    menuList.push(AddMenu("DailyList", "Daily List", false, "table", "/WorkReportManage/DailyList"));
    menuList.push(AddMenu("PullRequestInput", "Pull Request Input", false, "form", "/WorkReportManage/PullRequestInput"));
    menuList.push(AddMenu("PullRequestList", "Pull Request List", false, "table", "/WorkReportManage/PullRequestList"));
    menuList.push(AddMenu("WorkingHoursList", "Working Hours", false, "table", "/WorkReportManage/WorkingHoursList"));
    menuList.push(AddMenu("WOrkingHoursEdit", "Add", true, "form", "/WorkReportManage/WOrkingHoursEdit", "", null, false, "Working Hours", "/WorkReportManage/WorkingHoursList", null, true));
    menuList.push(AddMenu("StoryList", "Story", false, "table", "/WorkReportManage/StoryList"));
    menuList.push(AddMenu("StoryEdit", "Add", true, "form", "/WorkReportManage/StoryEdit", "", null, false, "Story", "/WorkReportManage/StoryList", null, true));
    menuList.push(AddMenu("WeekList", "Week", false, "table", "/WorkReportManage/WeekList"));
    menuList.push(AddMenu("WeekEdit", "Add", true, "form", "/WorkReportManage/WeekEdit", "", null, false, "Week", "/WorkReportManage/WeekLis", null, true));

    return AddNavMenu("WorkReportManage", "Work Report", false, menuList, true, ["DailyInput", "DailyList", "PullRequestInput", "PullRequestList",
        "WorkingHoursList", "StoryList", "WeekList"]);
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