import React, { Component } from "react";
import { Common } from "UtilsCommon";

export default class Header extends Component {
    constructor(props) {
        super(props);

        this.state = {
            MenuName1: props.MenuName1,
            MinHeight: 0
        }

        this.MenuList = this.GetMenuList();
        this.CompanyMenuList = this.GetCompanyMenuList();
    }

    GetCompanyMenuList() {
        return [
            this.GetMenu("userinfo", "账户总览", null, [
                this.GetMenu("account-info", "基本信息", "/usercenter/company/account-info.html"),
                this.GetMenu("dealDetail", "交易明细", "/usercenter/company/dealDetail.html"),
                this.GetMenu("recharge", "充值", "/usercenter/company/recharge.html"),
                this.GetMenu("withdraw", "提现", "/usercenter/company/withdraw.html")
            ]),
            this.GetMenu("loan", "借款信息", null, [
                this.GetMenu("loanmanage", "借款申请", "/account/loanmanage.html"),
                this.GetMenu("repaydetail", "还款明细", "/account/repaydetail.html"),
                this.GetMenu("water", "资料上传", "/borrow/dataUpload/water.html")
            ]),
            this.GetMenu("bundled", "银行设置", "/usercenter/company/bundled.html"),
            this.GetMenu("securitySettings", "银行设置", "/usercenter/company/security-settings.html")
        ];
    }

    GetMenuList() {
        return [
            this.GetMenu("fundRecord", "资金记录", null, [
                this.GetMenu("dealDetail", "交易明细", "/usercenter/fundRecord/dealDetail.html"),
                this.GetMenu("recharge", "充值", "/usercenter/recharge.html"),
                this.GetMenu("withdraw", "提现", "/usercenter/withdraw.html"),
                this.GetMenu("coinLog", "新新币", "/usercenter/fundRecord/coinLog.html")
            ]),
            this.GetMenu("tender", "出借管理", null, [
                this.GetMenu("thirtytender", "新元宝(新手专享)", "/usercenter/tender/thirtytender.html"),
                this.GetMenu("sevengold", "七天大胜", "/usercenter/tender/sevengold.html"),
                this.GetMenu("monthgold", "月进斗金", "/usercenter/tender/monthgold.html"),
                this.GetMenu("dayProfit", "日日盈", "/usercenter/tender/dayProfit.html"),
                this.GetMenu("goldIngot", "新元宝", "/usercenter/tender/goldIngot.html"),
                this.GetMenu("stepDetail", "步步高升", "/usercenter/tender/stepDetail.html"),
                this.GetMenu("monthSend", "月月派", "/usercenter/tender/monthSend.html"),
                this.GetMenu("investment", "散标直投", "/usercenter/tender/investment.html"),
                this.GetMenu("creditortTansfer", "债权转让", "/usercenter/tender/creditortTansfer.html"),
                this.GetMenu("newtender", "新手标", "/usercenter/tender/newtender.html")
            ]),
            this.GetMenu("loan", "借款信息", null, [
                this.GetMenu("loanmanage", "借款申请", "/account/loanmanage.html"),
                this.GetMenu("repaydetail", "还款明细", "/account/repaydetail.html"),
                this.GetMenu("water", "资料上传", "/borrow/dataUpload/water.html?infoType=1")
            ]),
            this.GetMenu("personalData", "个人资料", null, [
                this.GetMenu("personalInfo", "我的资料", "/usercenter/personalInfo.html"),
                this.GetMenu("bundled", "银行设置", "/usercenter/bundled.html"),
                this.GetMenu("securitySettings", "安全设置", "/usercenter/securitySettings.html"),
                this.GetMenu("questionnaire", "风险测评", "/usercenter/questionnaire.html")
            ]),
            this.GetMenu("activity", "我的奖励", "/usercenter/coupon.html"),
            this.GetMenu("invite", "邀请好友", "/usercenter/inviteFriends/inviteFriendsDetail.html"),
            this.GetMenu("message", "消息管理", null, [
                this.GetMenu("message", "站内信", "/account/message.html"),
                this.GetMenu("userNoticeConfig", "用户消息设置", "/userNotice/userNoticeConfig.html")
            ])
        ];
    }

    GetMenu(name, label, url, childMenus) {
        return { Id: Common.CreateGuid(), Name: name, Label: label, Url: url, ChildMenus: childMenus };
    }

    FirstMenuClick(menuName) {
        this.setState({ MenuName1: menuName });
    }

    RenderMenuItem(item) {
        const { MenuName2 } = this.props;
        const { MenuName1 } = this.state;

        let selected = item.Selected
        if (MenuName1 === item.Name) selected = !selected;
        item.Selected = selected;

        let className = this.props.MenuName1 === item.Name ? "active" : "";
        className += selected ? ' showTab' : '';

        const style = selected ? {} : { display: "none" };

        return (
            <li key={item.Id}>
                {item.Url ? <a href={item.Url} className={className}>{MenuName2 === item.Name && <i></i>}<strong>{item.Label}</strong></a>
                    : <a onClick={this.FirstMenuClick.bind(this, item.Name)} className={className}>{item.Label}</a>}
                {item.ChildMenus && <div className="sub" style={style}>{item.ChildMenus.map(m => this.RenderChildMenuItem(m))}</div>}
            </li>
        )
    }

    RenderChildMenuItem(item) {
        const { MenuName2, MenuStatus } = this.props;
        const { isInvestQTDS, isInvestRRY, isInvestBBGS, isInvestXSB } = MenuStatus;

        if (!isInvestQTDS && item.Name === "sevengold") return null;
        if (!isInvestRRY && item.Name === "dayProfit") return null;
        if (!isInvestBBGS && item.Name === "stepDetail") return null;
        if (!isInvestXSB && item.Name === "newtender") return null;

        return (
            <a href={item.Url} key={item.Id}>{MenuName2 === item.Name && <i></i>}<strong>{item.Label}</strong></a>
        )
    }

    SetMinHeight(height) {
        if (this.state.MinHeight !== height) this.setState({ MinHeight: height });
    }

    render() {
        const menuList = this.props.IsCompany ? this.CompanyMenuList : this.MenuList;
        const url = this.props.IsCompany ? "/usercenter/company/account.html" : "/usercenter/accountInfo.html";
        const { MinHeight } = this.state;

        const style = {};
        if (MinHeight > 0) style.minHeight = MinHeight + "px";

        return (
            <div className="g-left" style={style}>
                <div className="menu">
                    <h2><a href={url}>我的新新贷</a></h2>
                    <ul>{menuList.map(m => this.RenderMenuItem(m))}</ul>
                </div>
            </div>
        )
    }
}