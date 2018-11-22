import React, { Component } from "react";
import { Tip } from "ReactCommon";

export default class Header extends Component {
    constructor(props) {
        super(props);

        this.TipProperty = {};
    }

    OnMouseOver() {
        return (e) => this.TipProperty.SetVisible(true);
    }

    render() {
        const { IsCompany, IsCompanyActive, PcBuildUrl, IsLogin, NickName } = this.props;
        const { TipIsVisible } = this.state;

        return (
            <div id="J_header" className="header clearfix" >
                <div className="header-wrap">
                    <div className="header-nav clearfix">
                        <div className="nav-left">
                            <span>客服电话：4000-169-521 （9:00-18:00工作日）</span>
                            <span className="phone" onMouseOver={this.OnMouseOver()}>
                                <Tip Property={this.TipProperty}>
                                    <div className='qr-code-img'><img src={PcBuildUrl + "css/i/qr-code-phone.png"} height='100' width='100' /></div>
                                </Tip>
                                <i></i></span>
                            <span><a href="/html/promotion/index.html">手机客户端</a></span>
                            <span className="weibo" position="bottom" tipcontent={PcBuildUrl + "css/i/qr-weibo.png"}>
                                <a href="http://weibo.com/xinxindai" target="_blank" className='weibo-icon'></a>
                                <i></i>
                            </span>
                            <span className="wechat j_qrCodeTip" position="bottom" tipcontent={PcBuildUrl + "css/i/qr-code-wechat.png"}><i></i></span>
                            <span>投资有风险，选择需谨慎</span>
                        </div>

                        {IsCompany ? <div className="nav-right">
                            <p className="nav-user j_userDropdown cursor-default" position="bottom" tipcontent="html">欢迎<span id="J_companyName">{NickName}</span></p>
                            <a href="javascript:void(0);" id="J_safeLogout">安全退出</a>
                        </div> : <div className="nav-right">
                                {!IsLogin && <a href="/user/ilogin.html">登录</a>}
                                {!IsLogin && <a href="/user/iregister.html" className="red ga-click" ga-category="注册" ga-action="第一步" ga-label="banner">注册</a>}
                                {!IsLogin && <a href="/usercenter/company/register.html">企业账户</a>}
                                {IsLogin && <span className="nav-user j_userDropdown" position="bottom" tipcontent="html" >欢迎:{NickName}<i></i></span>}
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
                            <li className="j_investDropdown" position="bottom" tipcontent="html"><a href="#" className='new-hot'>我要出借<i></i><span></span></a></li>
                            <li><a href="javascript:void(0)" id="J_borrowMoney">我要借款</a></li>
                            <li><a href="/html/help/organization.html">信息披露<i></i></a></li>
                            <li><a href="/html/introduce/guide.html">新手福利</a></li>
                            <li><a href="/xinsheng/list.html">新新学院</a></li>
                        </ul>
                    </div>}

            </div>
        )
    }
}