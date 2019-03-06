const r = (entryPath, routePath, chunks, template) => { return { entryPath, routePath, chunks, template } }

//路由配置
//routePath:koa访问路由路径，多个用字符串数
//entryPath:打包入口路径（controller js）、koa视图路径、react组件路径（components js）三者相对路径一致。
//chunks：打包通用js集合

const chunks1 = ["css/public", "js/jquery", "js/react-dva", "js/util-common", "js/dva-common", "js/react-common"];
const chunks2 = ["js/jquery"];

const RouterConfigs = [
     r("home/index", ["/", "/index.html"], chunks1),
    // r("consumption/consumptionDetail", "/detail/consumption/:bidCode.html", chunks1),
    // r("consumption/consumptionList", "/detail/consumptionList.html", chunks1),
    // r("detail/authorizStatus", "/detail/authorizStatus.html", chunks1),
    // r("detail/investFail", "/detail/investFail.html", chunks1),
    // r("detail/monthgold", "/detail/monthgold.html", chunks1),
    // r("detail/newtender", ["/detail/newtender.html", "/detail/newtender-:months.html"], chunks1),
    // r("detail/purchaseSuccess", "/detail/purchaseSuccess.html", chunks1),
    // r("detail/thirtytender", "/detail/thirtytender.html", chunks1),
    // r("protocol/userlicenseAgree", "/detail/userProtocol.html", chunks1),
    //r("usercenter/activity/coupon", "/usercenter/coupon.html", chunks1),
    // r("usercenter/activity/inviteFriendsDetail", "/usercenter/inviteFriends/inviteFriendsDetail.html"),
    // r("usercenter/bonds/goldIngot", "/usercenter/bonds/goldIngot.html"),
    // r("usercenter/bonds/monthgold", "/usercenter/bonds/monthgold.html"),
    // r("usercenter/bonds/monthSend", "/usercenter/bonds/monthSend.html"),
    // r("usercenter/bonds/newtender", "/usercenter/bonds/newtender.html"),
    // r("usercenter/bonds/sevengold", "/usercenter/bonds/sevengold.html"),
    // r("usercenter/bonds/stepDetail", "/usercenter/bonds/stepDetail.html"),
    // r("usercenter/bonds/thirtytender", "/usercenter/bonds/thirtytender.html"),
    // r("usercenter/common/error", "/usercenter/error.html"),
    // r("usercenter/common/openaccountError", "/usercenter/openaccountError.html"),
    // r("usercenter/common/openaccountSuccess", "/usercenter/openaccountSuccess.html"),
    // r("usercenter/common/success", "/usercenter/success.html"),
    // r("usercenter/company/account-info", "/usercenter/company/account-info.html"),
    // r("usercenter/company/account", "/usercenter/company/account.html"),
    // r("usercenter/company/authentication", "/usercenter/company/authentication.html"),
    // r("usercenter/company/bundled", "/usercenter/company/bundled.html"),
    // r("usercenter/company/dealDetail", "/usercenter/company/dealDetail.html"),
    // r("usercenter/company/login", "/usercenter/company/login.html"),
    // r("usercenter/company/recharge", "/usercenter/company/recharge.html"),
    // r("usercenter/company/register", "/usercenter/company/register.html"),
    // r("usercenter/company/securitySettings", "/usercenter/company/security-settings.html"),
    // r("usercenter/company/userLicense", "/usercenter/company/license.html", [], "./src/views/userLicense.html"),
    // r("usercenter/company/withdraw", "/usercenter/company/withdraw.html"),
    // r("usercenter/fundRecord/coinLog", "/usercenter/fundRecord/coinLog.html"),
    // r("usercenter/fundRecord/dealDetail", "/usercenter/fundRecord/dealDetail.html"),
    // r("usercenter/fundRecord/openAccount", "/usercenter/fundRecord/openAccount.html"),
    // r("usercenter/fundRecord/recharge", "/usercenter/fundRecord/recharge.html"),
    // r("usercenter/fundRecord/withdraw", "/usercenter/fundRecord/withdraw.html"),
    // r("usercenter/identity/borrow", "/usercenter/identityBorrow.html"),
    // r("usercenter/identity/identity", "/usercenter/identity.html"),
    // r("usercenter/message/message", "/usercenter/message.html"),
    // r("usercenter/account", "/usercenter/accountInfo.html")
];

const KoaRoutes = {}, WebpackPageConfigs = [];

RouterConfigs.forEach(c => {
    if (c.routePath.forEach) c.routePath.forEach(p => KoaRoutes[p] = c.entryPath);
    else KoaRoutes[c.routePath] = c.entryPath;

    let template = "./src/views/index.html";
    if (c.template) template = c.template;
    const jsPath = `./src/controllers/${c.entryPath}.js`;
    const filename = `views/${c.entryPath}.html`;
    let chunks = c.chunks || [];
    chunks = chunks.concat(["manifest", c.entryPath]);

    WebpackPageConfigs.push({ name: c.entryPath, template, jsPath, filename, chunks });
});

const c = (f, t) => { return { from: `./src/${f}`, to: t } };

const CopyConfigs = [
    c("public/css/gif", "css/gif"),
    c("public/css/i", "css/i"),
    c("public/img", "img")
];

module.exports = { KoaRoutes, WebpackPageConfigs, CopyConfigs };



