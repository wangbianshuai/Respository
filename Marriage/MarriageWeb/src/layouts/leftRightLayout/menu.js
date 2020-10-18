import { Common } from "UtilsCommon";

var _Menus = {}
export default () => {
    _Menus = {};
    return {
        navMenuList: [
            getLiveManageNavMenu(),
            getWeChatManageNavMenu(),
            getsystemManageNavNenu(),
            getPersonCenterNavMenu()
        ],
        menus: _Menus
    }
};

function getLiveManageNavMenu() {
    var menuList = [];
    if (Common.isAdmin()) {
        menuList.push(addMenu("liveVodPlayInfoList", "点播播放流量", false, "table", "/liveManage/liveVodPlayInfoList"));
        menuList.push(addMenu("liveVodPlaySyncRecordList", "点播流量同步记录", false, "table", "/liveManage/liveVodPlaySyncRecordList"));
    }

    return addNavMenu("liveManage", "直播管理", false, menuList, true, ["liveVodPlayInfoList", "liveVodPlaySyncRecordList"]);
}

function getWeChatManageNavMenu() {
    var menuList = [];
    if (Common.isAdmin()) {
        menuList.push(addMenu("sendTemplateMessageList", "发送模板消息", false, "table", "/weChatManage/sendTemplateMessageList"));
        menuList.push(addMenu("sendTemplateMessageEdit", "新增", true, "form", "/weChatManage/sendTemplateMessageEdit", "", null, false, "发送模板消息", "/weChatManage/sendTemplateMessageList", null, true));

        menuList.push(addMenu("weChatTemplateList", "微信消息模板", false, "table", "/weChatManage/weChatTemplateList"));

        menuList.push(addMenu("userList", "粉丝用户", false, "table", "/weChatManage/userList"));

        menuList.push(addMenu("userTagList", "粉丝标签", false, "table", "/weChatManage/userTagList"));
        menuList.push(addMenu("userTagEdit", "新增", true, "form", "/weChatManage/userTagEdit", "", null, false, "粉丝标签", "/weChatManage/userTagList", null, true));

        menuList.push(addMenu("actionTypeList", "行为类型", false, "table", "/weChatManage/actionTypeList"));
        menuList.push(addMenu("actionTypeEdit", "新增", true, "form", "/weChatManage/actionTypeEdit", "", null, false, "行为类型", "/weChatManage/actionTypeList", null, true));

        menuList.push(addMenu("serviceInterfaceList", "服务接口", false, "table", "/weChatManage/serviceInterfaceList"));
        menuList.push(addMenu("serviceInterfaceEdit", "新增", true, "form", "/weChatManage/serviceInterfaceEdit", "", null, false, "服务接口", "/weChatManage/serviceInterfaceList", null, true));
    }

    return addNavMenu("weChatManage", "微信管理", false, menuList, true, ["sendTemplateMessageList", "weChatTemplateList", "userList", "userTagList", "actionTypeList", "serviceInterfaceList"]);
}

function getPersonCenterNavMenu() {
    var menuList = [];
    menuList.push(addMenu("appAccountInfo", "App账户信息", true, "idcard", "/personCenter/appAccountInfo"));
    menuList.push(addMenu("changePassword", "修改密码", true, "idcard", "/personCenter/changePassword"));

    return addNavMenu("personCenter", "账户中心", true, menuList, false, ["appAccountInfo", "changePassword"]);
}

function getsystemManageNavNenu() {
    var menuList = [];
    if (Common.isAdmin()) {
        menuList.push(addMenu("appAccountList", "App账户", false, "table", "/systemManage/appAccountList"));
        menuList.push(addMenu("appAccountEdit", "新增", true, "form", "/systemManage/appAccountEdit", "", null, false, "App账户", "/systemManage/appAccountList", null, true));

        menuList.push(addMenu("dictionaryConfigList", "键值配置", false, "table", "/systemManage/dictionaryConfigList"));
        menuList.push(addMenu("dictionaryConfigEdit", "新增", true, "form", "/systemManage/dictionaryConfigEdit", "", null, false, "键值配置", "/systemManage/dictionaryConfigList", null, true));
    }

    menuList.push(addMenu("adminUserList", "用户", false, "table", "/systemManage/adminUserList"));
    menuList.push(addMenu("adminUserEdit", "新增", true, "form", "/systemManage/adminUserEdit", "", null, false, "用户", "/systemManage/adminUserList", null, true));

    menuList.push(addMenu("operationLog", "操作日志", false, "table", "/systemManage/operationLog"));
    menuList.push(addMenu("requestServiceLogList", "请求服务日志", false, "table", "/systemManage/requestServiceLogList"));
    menuList.push(addMenu("requestServiceLogEdit", "新增", true, "form", "/systemManage/requestServiceLogEdit", "", null, false, "请求服务日志", "/systemManage/requestServiceLogList", null, true));

    return addNavMenu("systemManage", "系统管理", false, menuList, true, ["appAccountList", "dictionaryConfigList", "adminUserList", "operationLog", "requestServiceLogList"]);
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