import React from "react"
import { connect } from "dva"
import { Common } from "UtilsCommon";
import { BaseIndex, Header, Footer, ComponentList, BackTop, Menu } from "ReactCommon";

class Coupon extends BaseIndex {
    constructor(props) {
        super(props);
    }

    GetTitle() {
        return "我的优惠券-互动管理-我的新新贷";
    }

    //服务器渲染加载数据
    static LoadData(ctx, app) {
        const token = ctx.cookies.get("Token");
        const ua = ctx.headers["user-agent"];

        return Promise.all(BaseIndex.InitInvokeActionList(app, Coupon.Actions, Coupon.GetPayload(token, ua)));
    }

    static GetPayload(token, ua) {
        return {
            Token: token,
            UserAgent: ua,
            InvestmentService: { InvestStatus: { data: {} } }
        };
    }

    componentDidMount() {
        Common.SetCookie("Token", "2wmuuBSbUzkXjSqfaNpuUCcAk66RSJuO7wzv5Zi6ZZxqx8xuOdXQvQr8CytF5C4LIDyNjY47RL2Ms-xqPuXVeyMO_9JtcDKg-WZMX_84n8U")
        this.Token = Common.GetCookie("Token");

        this.InitInvokeActionList(Coupon.Actions, Coupon.GetPayload(this.Token));
        
        this.SetMenuMinHeight();
    }

    componentDidUpdate() {
        this.SetMenuMinHeight();
    }

    render() {
        const PcBuildUrl = this.GetPcBuildUrl();
        const { Link } = this.props;
        const IsLogin = this.JudgeLogin();
        const UserInfo = this.GetPropsValue("UserInfo", {});
        const IsPurchased = this.props.InvestStatus === true;
        const MenuStatus = this.GetMenuStatus()

        return (
            <div id="J_wrapBody">
                <Header PcBuildUrl={PcBuildUrl} Page={this} IsLogin={IsLogin} NickName={UserInfo.nickname} UserType={UserInfo.userType} IsPurchased={IsPurchased} />

                <div className="g-top">
                    <div className="g-top-con">
                        <div className="container-1200">
                            <a href="../../">首页</a> &gt; <a href="/usercenter/accountInfo.html">我的新新贷</a> > <a
                                href="javascript:void(0);">我的奖励</a>
                        </div>
                    </div>
                </div>
                <div className="info-contaner clearfix">
                    <Menu MenuName1="activity" MenuName2="coupon" ref={(e) => this.MenuElement = e} MenuStatus={MenuStatus} />
                    <div className="g-right" ref="RightContent">
                        <div className="m-con-wrap">
                            <div className="m-con-hd clearfix">我的奖励</div>
                            <div className="m-con-bd">
                                <div className="filed-user">
                                    <input type="text" placeholder="请输入您的优惠券兑换码" className='J_couponInput'
                                        onkeyup="value=value.replace(/[^\w\.\/]/ig,'')" />
                                    <input type="button" className='J_getCoupon get-coupon disable' value='兑换' />
                                </div>
                            </div>
                            <div className="m-con-hd user-title goupons" id='J_tabs'>
                                <li className='active'><a href="#">新手红包</a></li>
                                <li><a href="#">红包</a></li>
                                <li><a href="#">加息券</a></li>
                                <a href="/help/aboutxxd.html" target='_blank' className='rules'>使用规则</a>
                            </div>
                            <div className="goupons-bd">
                                <div className='j_tabContent'>
                                    <div className='m-con-hd status-title J_statusTitle J_newStatus'>
                                        <li className='active'><a href="#">未使用</a></li>
                                        <li><a href="#">已使用</a></li>
                                        <li><a href="#">已过期</a></li>
                                    </div>
                                    <div className='J_newPacket'>
                                        <div className="enable J_statusBox J_enable">
                                            <ul className="J_newEnableTable">
                                            </ul>
                                            <div className="pagination newEnableTable-page">
                                            </div>
                                        </div>
                                        <div className="used table-box J_statusBox J_used hide">
                                            <table className="J_newUsedTable">
                                                <tr className="title">
                                                    <th>红包名称</th>
                                                    <th>红包金额</th>
                                                    <th>使用时间</th>
                                                    <th>使用产品</th>
                                                </tr>
                                            </table>
                                            <div className="pagination newUsedTable-page">
                                            </div>
                                        </div>
                                        <div className="expired table-box J_statusBox J_expired hide">
                                            <table className="J_newExpiredTable">
                                            </table>
                                            <div className="pagination newExpiredTable-page">
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className='j_tabContent hide '>
                                    <div className='m-con-hd status-title J_statusTitle J_packetStatus'>
                                        <li className='active'><a href="#">未使用</a></li>
                                        <li><a href="#">已使用</a></li>
                                        <li><a href="#">已过期</a></li>
                                    </div>
                                    <div className='J_redPacket'>
                                        <div className="enable J_statusBox J_enable">
                                            <ul className="J_redEnableTable">

                                            </ul>
                                            <div className="pagination redEnableTable-page">
                                            </div>
                                        </div>
                                        <div className="used table-box  J_statusBox J_used hide">
                                            <table className="J_redUsedTable">
                                            </table>
                                            <div className="pagination redUsedTable-page">
                                            </div>
                                        </div>
                                        <div className="expired table-box J_statusBox J_expired hide">
                                            <table className="J_redPastTable">

                                            </table>
                                            <p className="view-txt">仅展示3个月以内的信息</p>
                                            <div className="pagination redPastTable-page">
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className='j_tabContent hide '>
                                    <div className='m-con-hd status-title J_statusTitle J_rateStatus'>
                                        <li className='active'><a href="#">未使用</a></li>
                                        <li><a href="#">已使用</a></li>
                                        <li><a href="#">已过期</a></li>
                                    </div>
                                    <div className='J_raiseRate'>
                                        <div className="enable J_statusBox J_enable">
                                            <ul className="J_raiseRateTable">

                                            </ul>
                                            <div className="pagination raiseRateTable-page">

                                            </div>
                                        </div>
                                        <div className="used table-box J_statusBox J_used hide">
                                            <table className="J_raiseRateUsedTable">

                                            </table>
                                            <div className="pagination raiseRateUsedTable-page">

                                            </div>
                                        </div>
                                        <div className="expired table-box J_statusBox J_expired hide">
                                            <table className="J_raiseRatePastTable">

                                            </table>
                                            <p className="view-txt">仅展示3个月以内的信息</p>
                                            <div className="pagination raiseRatePastTable-page">

                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <Footer PcBuildUrl={PcBuildUrl} Link={Link} Page={this} />
                <ComponentList Name="Tips" Page={this} />
                <ComponentList Name="Dialogs" Page={this} />
                <BackTop Page={this} />
            </div>
        )
    }
}

function mapStateToProps(state, ownProps) {
    const props = BaseIndex.MapStateToPropsForMenu(state, ownProps, {});

    !Common.IsDist && console.log(props);
    return props;
}

Coupon.Actions = BaseIndex.MapActionsForMenu({});

export default connect(mapStateToProps, BaseIndex.MapDispatchToProps)(Coupon);