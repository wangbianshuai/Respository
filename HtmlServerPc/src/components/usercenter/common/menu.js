import React, { Component } from "react";

export default class Header extends Component {
    constructor(props) {
        super(props)
    }

    RenderCompanyMenu(i, j) {
        return (
            <div className="g-left">
                <div className="menu">
                    <h2><a href="/usercenter/company/account.html">我的新新贷</a></h2>
                    <ul>
                        <li>
                            <a href="javascript:void(0);" className={i == 'userinfo' ? 'active' : ''}>账户总览</a>
                            <div className="sub">
                                <a href="/usercenter/company/account-info.html">{j === 'account-info' && <i></i>}<strong>基本信息</strong></a>
                                <a href="/usercenter/company/dealDetail.html">{j === 'dealDetail' && <i></i>}<strong>交易明细</strong></a>
                                <a href="/usercenter/company/recharge.html">{j === 'recharge' && <i></i>}<strong>充值</strong></a>
                                <a href="/usercenter/company/withdraw.html">{j === 'withdraw' && <i></i>}<strong>提现</strong></a>
                            </div>
                        </li>
                        <li>
                            <a href="javascript:void(0);" className={i === 'loan' ? 'active' : ''}>借款信息</a>
                            <div className="sub">
                                <a href="/account/loanmanage.html"><strong>借款申请</strong></a>
                                <a href="/account/repaydetail.html"><strong>还款明细</strong></a>
                                <a href="/borrow/dataUpload/water.html"><strong>资料上传</strong></a>
                            </div>
                        </li>
                        <li><a href="/usercenter/company/bundled.html" className={i === 'bundled' ? 'active' : ''}>{j === 'bundled' && <i></i>}<strong>银行设置</strong></a></li>
                        <li><a href="/usercenter/company/security-settings.html" className={i === 'securitySettings' ? 'active' : ''}>{j === 'securitySettings' && <i></i>}<strong>安全设置</strong></a></li>
                    </ul>
                </div>
            </div>
        )
    }

    RenderMenu(i, j, menuStatus) {
        const { isInvestQTDS, isInvestRRY, isInvestBBGS, isInvestXSB } = menuStatus
        return (
            <div className="g-left">
                <div className="menu">
                    <h2><a href="/usercenter/accountInfo.html">我的新新贷</a></h2>
                    <ul>
                        <li><a href="javascript:void(0);" className={i === 'fundRecord' ? 'active' : ''}>资金记录</a>
                            <div className="sub">
                                <a href="/usercenter/fundRecord/dealDetail.html">{j === 'dealDetail' && <i></i>}<strong>交易明细</strong></a>
                                <a href="/usercenter/recharge.html">{j === 'recharge' && <i></i>}<strong>充值</strong></a>
                                <a href="/usercenter/withdraw.html">{j === 'withdraw' && <i></i>}<strong>提现</strong></a>
                                <a href="/usercenter/fundRecord/coinLog.html">{j === 'coinLog' && <i></i>}<strong>新新币</strong></a>
                            </div>
                        </li>
                        <li><a href="javascript:void(0);" className={i === 'tender' ? 'active' : ''}>出借管理</a>
                            <div className="sub">
                                <a href="/usercenter/tender/thirtytender.html">{j === 'thirtytender' && <i></i>}<strong>新元宝(新手专享)</strong></a>
                                {isInvestQTDS && <a href="/usercenter/tender/sevengold.html">{j === 'sevengold' && <i></i>}<strong>七天大胜</strong></a>}
                                <a href="/usercenter/tender/monthgold.html">{j === 'monthgold' && <i></i>}<strong>月进斗金</strong></a>
                                {isInvestRRY && <a href="/usercenter/tender/dayProfit.html">{j === 'dayProfit' && <i></i>}<strong>日日盈</strong></a>}
                                <a href="/usercenter/tender/goldIngot.html">{j === 'goldIngot' && <i></i>}<strong>新元宝</strong></a>
                                {isInvestBBGS && <a href="/usercenter/tender/stepDetail.html">{j === 'stepDetail' && <i></i>}<strong>步步高升</strong></a>}
                                <a href="/usercenter/tender/monthSend.html">{j === 'monthSend' && <i></i>}<strong>月月派</strong></a>
                                <a href="/usercenter/tender/investment.html">{j === 'investment' && <i></i>}<strong>散标直投</strong></a>
                                <a href="/usercenter/tender/creditortTansfer.html">{j === 'creditortTansfer' && <i></i>}<strong>债权转让</strong></a>
                                {isInvestXSB && <a href="/usercenter/tender/newtender.html">{j === 'newtender' && <i></i>}<strong>新手标</strong></a>}
                            </div>
                        </li>
                        <li><a href="javascript:void(0);" className={i === 'loan' ? 'active' : ''}>借款管理</a>
                            <div className="sub">
                                <a href="/account/loanmanage.html"><strong>借款申请</strong></a>
                                <a href="/account/repaydetail.html"><strong>还款明细</strong></a>
                                <a href="/borrow/dataUpload/water.html?infoType=1"><strong>资料上传</strong></a>
                            </div>
                        </li>
                        <li><a href="javascript:void(0);" className={i === 'personalData' ? 'active' : ''}>个人资料</a>
                            <div className="sub">
                                <a href="/usercenter/personalInfo.html">{j === 'personalInfo' && <i></i>}<strong>我的资料</strong></a>
                                <a href="/usercenter/bundled.html">{j === 'bundled' && <i></i>}<strong>银行设置</strong></a>
                                <a href="/usercenter/securitySettings.html">{j === 'securitySettings' && <i></i>}<strong>安全设置</strong></a>
                                <a href="/usercenter/questionnaire.html">{j === 'questionnaire' && <i></i>}<strong>风险测评</strong></a>
                            </div>
                        </li>

                        <li><a href="/usercenter/coupon.html" className={i === 'activity' ? 'active' : ''}>我的奖励</a></li>
                        <li><a href="/usercenter/inviteFriends/inviteFriendsDetail.html" className={i === 'invite' ? 'active' : ''}>邀请好友</a></li>
                        <li><a href="javascript:void(0);" className={i === 'message' ? 'active' : ''}>消息管理</a>
                            <div className="sub">
                                <a href="/account/message.html">{j === 'message' && <i></i>}<strong>站内信</strong></a>
                                <a href="/userNotice/userNoticeConfig.html">{j === 'message' && <i></i>}<strong>用户消息设置</strong></a>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        )
    }

    render() {
        const { IsCompany, MenuName1, MenuName2, MenuStatus } = this.props;

        if (IsCompany) return this.RenderCompanyMenu(MenuName1, MenuName2)
        else return this.RenderMenu(MenuName1, MenuName2, MenuStatus)
    }
}