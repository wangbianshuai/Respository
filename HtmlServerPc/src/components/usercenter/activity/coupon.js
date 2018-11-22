import React from "react"
import { connect } from "dva"
import BaseIndex from "../../Index";
import Header from "../../common/header";
import Footer from "../../common/footer";
import Menu from "../common/menu"

class Coupon extends BaseIndex {
    constructor(props) {
        super(props);
    }

    GetTitle() {
        return "我的优惠券-互动管理-我的新新贷";
    }

    GetCssList() {
        return ["/build/mods/user/activity/coupon/_.css"];
    }

    GetJsList() {
        return ["/build/mods/user/activity/coupon/_.js"];
    }

    //服务器渲染加载数据
    static LoadData(ctx, app) {
        return BaseIndex.Dispatch(app._store.dispatch, "PageView", "GetCoupon");
    }

    render() {
        if (!this.props.PageData || !this.props.PageData.global) return null;

        const PcBuildUrl = this.GetPcBuildUrl();
        const { globalData, isInvestQTDS, isInvestRRY, isInvestBBGS, isInvestXSB } = this.props.PageData;
        const MenuStatus = { isInvestQTDS, isInvestRRY, isInvestBBGS, isInvestXSB }

        return (
            <div id="J_wrapBody">
                <Header PcBuildUrl={PcBuildUrl} globalData={globalData} />

                <div className="g-top">
                    <div className="g-top-con">
                        <div className="container-1200">
                            <a href="../../">首页</a> &gt; <a href="/usercenter/accountInfo.html">我的新新贷</a> > <a
                                href="javascript:void(0);">我的奖励</a>
                        </div>
                    </div>
                </div>
                <div className="info-contaner clearfix">

                    <Menu MenuName1="activity" MenuName2="coupon" MenuStatus={MenuStatus} />

                    <div className="g-right">
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

                <Footer PcBuildUrl={PcBuildUrl} globalData={globalData}  />
            </div>
        )
    }
}

function mapStateToProps(state, ownProps) {
    return {
        PageData: state.PageView.Coupon
    };
}

export default connect(mapStateToProps, BaseIndex.MapDispatchToProps)(Coupon);