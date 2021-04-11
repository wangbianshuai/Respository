module.exports = {
    name: "index",
    type: "View",
    isDiv:true,
    className:'divUserInfo',
    properties: getProperties()
}

function getProperties() {
    return [
        getUserInfoView(),
        getChangePasswordListMenu(),
        getExitListMenu()
    ]
}

function getUserInfoView() {
    return {
        name: 'userInfo',
        type: 'topUserInfo',
    }
}

function getChangePasswordListMenu() {
    return {
        name: 'changePassowrd',
        type: 'ListMenu',
        className: 'divListMenu',
        dataSource: [{ text: '修改密码', arrow: 'horizontal', thumb: 'changePassword.png', url: '/changePassword.html' }]
    }
}

function getExitListMenu() {
    return {
        name: 'exitListMenu',
        type: 'ExitListMenu',
        className: 'divExitListMenu',
    }
}