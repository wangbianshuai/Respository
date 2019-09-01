export default class Js2Native {
    constructor(bridge) {
        this.Bridge = bridge;
    }

    InitInvoke(fn) {
        this.Bridge.Js2NativeInvokeList.push(fn);
    }

    GetUserInfo() {
        //获取当前登录用户信息
        //token	用户token	 
        //userId 用户ID
        //userName 用户名
        //mobilestring 用户手机号
        //openAccountStatus 开户状态	0:未开户 1:已开户
        //vip 会员等级	黄金会员/钻石会员
        return this.Bridge.Js2NativeAction("xxd_userInfo");
    }

    GetClientVersion() {
        //获取App版本及设备信息
        //response
        //systemName 系统名称	iOS/Android
        //systemVersion	系统版本号	12.1/9.0
        //model	设备类型 iPhone/iPad/iTouch
        //appVersion 应用版本号	4.9.0
        //appId	应用类型 XXD_IOS_INVESTMENT：新新贷金融（理财端） XXD_IOS_Loan：新宜贷(借款端)
        //userAgent	ua	Mozilla/5.0 (iPhone; CPU iPhone OS 11_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15F79 Xxd/iOS_finance_4.9.0
        return this.Bridge.Js2NativeAction("xxd_clinetInfo");
    }

    JumpToLogin() {
        //跳转到App登录页面(包含注册)
        return this.Bridge.Js2NativeAction("xxd_jumpToLogin", null);
    }

    JumpToShareView(shareTopic, shareDesc, shareUrl, shareImageUrl, qrUrl) {
        //弹出App分享窗口
        //shareTopic 分享的标题	我在新新贷投资好久啦，送你108元红包，快领！
        //shareDesc	分享的描述	我已经领取了0张，就等你了，6年老平台，银行资金存管，值得信赖，快来领取吧。
        //shareUrl 分享的链接	http://stage-m.xxd.com/invite/register?identity=c33ee5ffe0f54cdfa89f2d749690411e
        //shareImageUrl 分享的缩略图	http://stage-m.xxd.com/static/mods/invite/imgs/share.png
        //qrUrl 分享的二维码地址	http://stage-m.xxd.com/invite/register?identity=c33ee5ffe0f54cdfa89f2d749690411e
        //response { "platformType":"1"   }
        //platformType 分享成功的平台	1:微信好友 2:微信朋友圈 3:QQ好友 4:QQ空间 5:微博 6:其它
        return this.Bridge.Js2NativeAction("xxd_jumpToShareView", { shareTopic, shareDesc, shareUrl, shareImageUrl, qrUrl });
    }

    SetShareInfo(shareTopic, shareDesc, shareUrl, shareImageUrl, qrUrl) {
        //显示APP右上角分享按钮并设置分享参数
        //shareTopic 分享的标题	我在新新贷投资好久啦，送你108元红包，快领！
        //shareDesc	分享的描述	我已经领取了0张，就等你了，6年老平台，银行资金存管，值得信赖，快来领取吧。
        //shareUrl 分享的链接	http://stage-m.xxd.com/invite/register?identity=c33ee5ffe0f54cdfa89f2d749690411e
        //shareImageUrl 分享的缩略图	http://stage-m.xxd.com/static/mods/invite/imgs/share.png
        //qrUrl 分享的二维码地址	http://stage-m.xxd.com/invite/register?identity=c33ee5ffe0f54cdfa89f2d749690411e
        return this.Bridge.Js2NativeAction("xxd_setShareInfo", { shareTopic, shareDesc, shareUrl, shareImageUrl, qrUrl }, false);
    }

    ToPop(fromType, status) {
        //回到指定页面
        //fromType:1:富有开户 2:富有充值 3:富有绑定手机号 4:富有绑定银行卡 5:等等
        //status:0:操作失败 1:操作成功 3:等等
        return this.Bridge.Js2NativeAction("xxd_pop", { fromType, status }, false);
    }

    JumpToCustomView(type, data) {
        //跳转到指定页面
        //type:1:首页 2:产品列表页 3:发现 4:我的钱袋页面 5:产品详情页 6:确认购买页 7:加入记录页 8:资产总览 
        //type:9:充值 10:提现 11:账户管理 12:我的新新币 13:我的福利 14:应用设置页 15:风险评测页 16:开户页 17:加入记录详情页 18:web页面
        //data:根据不同的type确定对应的参数，例如产品详情页需要提供产品ID
        return this.Bridge.Js2NativeAction("xxd_jumpToCustomView", { type, data }, false);
    }

    SetNavigatinBarTitle(title) {
        //强制修改当前页面导航栏标题
        return this.Bridge.Js2NativeAction("xxd_setNavigatinBarTitle", { title }, false);
    }

    OpenUrl(openType, value) {
        //调用系统功能
        //openType:1:电话 2:短息 3:浏览器 4:邮件
        //根据openType的值决定，当openType为1是 value 应该是一个电话号码 1>>13916646641 2>>13916646641 3>>http://www.baidu.com4>>sample@gmail.com
        return this.Bridge.Js2NativeAction("xxd_openUrl", { openType, value }, false);
    }

    UserOpenAccount() {
        //用户存管开户
        return this.Bridge.Js2NativeAction("xxd_userOpenAccount", null, false)
    }
	
	UserInfoSaveSuccess() {
		//借款用户完善基本信息保存成功
		return this.Bridge.Js2NativeAction("xxd_userInfoSaveSuccess", null, false)
	}

    LoanLoginSuccess(token) {
        //{Token:信贷员登录token}
        //信贷员登录成功
        return this.Bridge.Js2NativeAction("xxd_loanLoginSuccess", { Token: JSON.stringify(token) }, false)
    }

    UserRegisterSuccess(userName) {
        //{UserName:用户名}
        //借款用户注册成功
        return this.Bridge.Js2NativeAction("xxd_userRegisterSuccess", { UserName: userName }, false)
    }
	
	UserAuthSuccess(){
		//认证成功跳转
		return this.Bridge.Js2NativeAction("xxd_userAuthSuccess", null, false)
	}
	
	OpenAccountResult(){
		//开户结果页跳转
		return this.Bridge.Js2NativeAction("xxd_OpenAccountStatus", null, false)
	}
	
    LoanReLogin() {
        //信贷员重新登录
        return this.Bridge.Js2NativeAction("xxd_loanReLogin", null, false);
    }
}