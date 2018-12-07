import React from "react";
import { Tip } from "ReactCommon";
import { Common } from "UtilsCommon";
import DialogBorrow from "./DialogBorrow";
import BaseIndex from "../BaseIndex";

export default class Header extends BaseIndex {
    constructor(props) {
        super(props);

        this.state = { InvestClassName: "" }

        this.Init();
    }

    Init() {
        this.Page = this.props.Page;
        this.AddTipList = this.Page.InvokeRootPage("AddTipList");
        this.AddComponent = this.Page.InvokeRootPage("AddComponent");

        this.AddTipList([this.RenderTipPhone(), this.RenderTipWeixin(), this.RenderTipUser(), this.RenderTipInvest()]);
        this.AddComponent("Dialogs", <DialogBorrow key={Common.CreateGuid()} Show={(s) => this.DialogBorrowShow = s} Logout={this.Logout.bind(this, '/usercenter/company/register.html')} />);
    }

    OnMouseOver(key) {
        return (e) => this[key].EffectsMouseOver(e, this.refs[key]);
    }

    SetRef(key) {
        return (c) => this[key] = c;
    }

    RenderTipPhone() {
        const { PcBuildUrl } = this.props;

        return (
            <Tip ref={this.SetRef("TipPhone")} key={Common.CreateGuid()}>
                <div className='qr-code-img header-code-img'><img src={PcBuildUrl + "css/i/qr-code-phone.png"} height='100' width='100' /><span>手机APP下载</span></div>
            </Tip>
        )
    }

    RenderTipWeixin() {
        const { PcBuildUrl } = this.props;

        return (
            <Tip ref={this.SetRef("TipWeixin")} key={Common.CreateGuid()}>
                <div className='qr-code-img header-code-img'><img src={PcBuildUrl + "css/i/qr-code-wechat.png"} height='100' width='100' /><span>微信服务号</span></div>
            </Tip>
        )
    }

    RenderTipUser() {
        return (
            <Tip ref={this.SetRef("TipUser")} key={Common.CreateGuid()}>
                <ul className='user-dropdown'>
                    <li><a href='/usercenter/accountInfo.html'>我的新新贷</a></li>
                    <li><a href='/usercenter/recharge.html'>账户充值</a></li>
                    <li><a href='/account/message.html'>站内信</a></li>
                    <li><a href='/user/logout.html'>退出登录</a></li>
                </ul>
            </Tip>
        )
    }

    TipInvestCall() {
        return (v) => this.setState({ InvestClassName: v ? " dropdown-hover" : "" })
    }

    BorrowMoney() {
        const { UserInfo, IsLogin } = this.props;

        if (IsLogin && parseInt(UserInfo.userType) === 2) this.DialogBorrowShow();
        else window.location.href = "/borrowApply/toBorrowPage.html";
    }

    ReceiveLogout(logout, url) {
        if (parseInt(logout.Code) === 0) {
            Common.RemoveCooke("Token");
            window.location.href = url;
        }
    }

    Logout(url) {
        this.DispatchAction("XxdService", "Logout").then(res => this.ReceiveLogout(res, url));
    }

    RenderTipInvest() {
        const { IsPurchased } = this.props;

        return (
            <Tip ref={this.SetRef("TipInvest")} key={Common.CreateGuid()} MouseOverCall={this.TipInvestCall()}>
                <ul className='invest-dropdown'>
                    {!IsPurchased && <li className='hot'><a href='/detail/thirtytender.html'>新元宝（新手专享）</a><i></i></li>}
                    <li><a href='/detail/monthgold.html'>月进斗金</a></li>
                    <li><a href='/xplan/search/list.html'>新元宝</a></li>
                    <li><a href='/borrow/search/list.html'>散标直投</a></li>
                    <li><a href='/detail/consumptionList.html'>新宜贷</a></li>
                    <li><a href='/traderequest/tradeRequestMoreSearch.html'>债权转让</a></li>
                </ul>
            </Tip>
        )
    }

    render() {
        const { IsCompany, IsCompanyActive, IsLogin, UserInfo } = this.props;
        const { InvestClassName } = this.state;

        return (
            <div id="J_header" className="header clearfix" >
                <div className="header-wrap">
                    <div className="header-nav clearfix">
                        <div className="nav-left">
                            <span>客服电话：4000-169-521 （9:00-18:00工作日）</span>
                            <span className="phone" onMouseOver={this.OnMouseOver("TipPhone")} ref="TipPhone"><i></i></span>
                            <span><a href="/html/promotion/index.html">手机客户端</a></span>
                            <span className="weibo">
                                <a href="http://weibo.com/xinxindai" target="_blank" className='weibo-icon'></a>
                                <i></i>
                            </span>
                            <span className="wechat" onMouseOver={this.OnMouseOver("TipWeixin")} ref="TipWeixin"><i></i></span>
                            <span>投资有风险，选择需谨慎</span>
                        </div>

                        {IsCompany ? <div className="nav-right">
                            <p className="nav-user cursor-default" onMouseOver={this.OnMouseOver("TipUser")} ref="TipUser">欢迎<span id="J_companyName">{UserInfo.nickname}</span></p>
                            <a onClick={this.Logout.bind(this, '/usercenter/company/login.html')}>安全退出</a>
                        </div> : <div className="nav-right">
                                {!IsLogin && <a href="/user/ilogin.html">登录</a>}
                                {!IsLogin && <a href="/user/iregister.html" className="red ga-click" ga-category="注册" ga-action="第一步" ga-label="banner">注册</a>}
                                {!IsLogin && <a href="/usercenter/company/register.html">企业账户</a>}
                                {IsLogin && <span className="nav-user" onMouseOver={this.OnMouseOver("TipUser")} ref="TipUser">欢迎:{UserInfo.nickname}<i></i></span>}
                                <a href="http://bbs.xinxindai.com">社区</a>
                            </div>}

                    </div>
                </div>

                {IsCompany ? <div className="header-menu company-menu">
                    <a href="/" className="logo">
                        <i></i>
                    </a>
                    <ul className="menu" id="J_showMenu">
                        <li><a href="/myloan/loan/9.html">我要借款</a></li>
                        <li className={IsCompanyActive ? 'active' : ""}><a href="/usercenter/company/account.html">我的账户</a></li>
                    </ul>
                </div> : <div className="header-menu">
                        <a href="/" className="logo">
                            <i></i>
                        </a>
                        <ul className="menu">
                            <li><a href="/">首页</a></li>
                            <li onMouseOver={this.OnMouseOver("TipInvest")} ref="TipInvest"><a href="#" className={'new-hot' + InvestClassName}>我要出借<i></i><span></span></a></li>
                            <li><a onClick={this.BorrowMoney.bind(this)}>我要借款</a></li>
                            <li><a href="/html/help/organization.html">信息披露</a></li>
                            <li><a href="/html/introduce/guide.html">新手福利</a></li>
                            <li><a href="/xinsheng/list.html">新新学院</a></li>
                        </ul>
                    </div>}

            </div>
        )
    }
}