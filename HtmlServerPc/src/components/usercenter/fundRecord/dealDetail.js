import React from "react"
import { connect } from "dva"
import BaseIndex from "../../Index";
import Header from "../../common/header";
import Footer from "../../common/footer";
import Menu from "../common/menu"
import { Common } from "UtilsCommon";

class DealDetail extends BaseIndex {
    constructor(props) {
        super(props);
    }

    GetTitle() {
        return "交易明细-资金记录-我的新新贷";
    }

    GetCssList() {
        return ["/build/mods/user/fundRecord/dealDetail/_.css"];
    }

    GetJsList() {
        return ["/build/mods/user/fundRecord/dealDetail/_.js"];
    }

    //服务器渲染加载数据
    static LoadData(ctx, app) {
        return BaseIndex.Dispatch(app._store.dispatch, "PageView", "GetFundRecordDealDetail");
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
                            <a href="http://www.xinxindai.com/">首页</a> &gt; <a href="javascript:void(0);">我的新新贷</a> &gt;
                <a href="javascript:void(0);">资金记录</a> &gt;
                <a href="javascript:void(0);">交易明细</a>

                        </div>
                    </div>
                </div>
                <div className="info-contaner clearfix">
                    <Menu MenuName1="fundRecord" MenuName2="dealDetail" MenuStatus={MenuStatus} />

                    <div className="g-right">
                        <div className="m-con-wrap">
                            <div className="m-con-hd user-title" id='J_tabs'>
                                <li className='active'><a href="#">资金记录</a></li>
                                <li><a href="#">充值记录</a></li>
                                <li><a href="#">提现记录</a></li>
                            </div>
                            <div className='data-box'>
                                <div className='deal-data j_tabContent'>
                                    <div className='filt-box J_capitalUl'>
                                        <ul className='J_capitalType'>
                                            <li>资金类别：</li>
                                            <a href='javascript:;' className='active'>全部</a>
                                            <a href='javascript:;'>投标</a>
                                            <a href='javascript:;'>借款</a>
                                            <a href='javascript:;'>还款</a>
                                            <a href='javascript:;'>充值</a>
                                            <a href='javascript:;'>提现</a>
                                            <a href='javascript:;'>奖励</a>
                                            <a href='javascript:;'>收款</a>
                                            <a href='javascript:;'>冻结</a>
                                            <a href='javascript:;'>其他</a>
                                        </ul>
                                        <ul className='time-filt J_capitalLimit'>
                                            <li>时间范围：</li>
                                            <a href='javascript:;' className='active'>全部</a>
                                            <a href='javascript:;'>最近一周</a>
                                            <a href='javascript:;'>1个月</a>
                                            <a href='javascript:;'>2个月</a>
                                            <a href='javascript:;'>3个月</a>
                                            <a href='javascript:;'>6个月</a>
                                            <a href='javascript:;'>12个月</a>
                                            <a href='javascript:;'>12个月以上</a>
                                        </ul>
                                    </div>
                                    <div className='deal-table table-box'>
                                        <table id='capitalTable'>
                                            <tr className='title'>
                                                <th className='one'>日期&nbsp;&nbsp;|&nbsp;&nbsp;交易流水号</th>
                                                <th className='two'>类型</th>
                                                <th className='three'>发生金额(元)</th>
                                                <th className='four'>可用余额(元)</th>
                                                <th>备注</th>
                                            </tr>
                                        </table>
                                        <div className="pagination capitalRecord-page">
                                        </div>
                                    </div>
                                </div>
                                <div className='recharge-data j_tabContent hide'>
                                    <div className='filt-box J_rechargeUl'>
                                        <ul className='usable-data'>
                                            <li>可用余额：</li>
                                            <li>{Common.ToCurrency(globalData.overview.data.availableBalance)}元</li>
                                            <li className='next-li'>冻结金额：</li>
                                            <li>{Common.ToCurrency(globalData.overview.data.frozenAmount)}元</li>
                                        </ul>
                                        <ul className='J_rechargeStatus'>
                                            <li>充值状态：</li>
                                            <a href='javascript:;' className='active'>全部</a>
                                            <a href='javascript:;'>处理中</a>
                                            <a href='javascript:;'>成功</a>
                                            <a href='javascript:;'>失败</a>
                                        </ul>
                                        <ul className='time-filt J_rechargeLimit'>
                                            <li>时间范围：</li>
                                            <a href='javascript:;' className='active'>全部</a>
                                            <a href='javascript:;'>最近一周</a>
                                            <a href='javascript:;'>1个月</a>
                                            <a href='javascript:;'>2个月</a>
                                            <a href='javascript:;'>3个月</a>
                                            <a href='javascript:;'>6个月</a>
                                            <a href='javascript:;'>12个月</a>
                                            <a href='javascript:;'>12个月以上</a>
                                        </ul>
                                    </div>
                                    <div className='recharge-table table-box'>
                                        <table id='rechargeTable'>
                                            <tr className='title'>
                                                <th className='one'>充值时间&nbsp;&nbsp;|&nbsp;&nbsp;流水单账号</th>
                                                <th className='two'>充值方式</th>
                                                <th className='three'>充值金额(元)</th>
                                                <th className='four'>支付方式</th>
                                                <th>充值状态</th>
                                            </tr>
                                        </table>
                                        <div className="pagination rechargeRecord-page">
                                        </div>
                                    </div>
                                </div>
                                <div className='withdraw-data j_tabContent hide'>
                                    <div className='filt-box J_withdrawUl'>
                                        <ul className='usable-data'>
                                            <li>可用余额：</li>
                                            <li>{Common.ToCurrency(globalData.overview.data.availableBalance)}元</li>
                                            <li className='next-li'>冻结金额：</li>
                                            <li>{Common.ToCurrency(globalData.overview.data.frozenAmount)}元</li>
                                        </ul>
                                        <ul className='J_withdrawStatus'>
                                            <li>提现状态：</li>
                                            <a href='javascript:;' className='active'>全部</a>
                                            <a href='javascript:;'>处理中</a>
                                            <a href='javascript:;'>成功</a>
                                            <a href='javascript:;'>失败</a>
                                        </ul>
                                        <ul className='time-filt J_withdrawLimit'>
                                            <li>时间范围：</li>
                                            <a href='javascript:;' className='active'>全部</a>
                                            <a href='javascript:;'>最近一周</a>
                                            <a href='javascript:;'>1个月</a>
                                            <a href='javascript:;'>2个月</a>
                                            <a href='javascript:;'>3个月</a>
                                            <a href='javascript:;'>6个月</a>
                                            <a href='javascript:;'>12个月</a>
                                            <a href='javascript:;'>12个月以上</a>
                                        </ul>
                                    </div>
                                    <div className='withdraw-table table-box'>
                                        <table id='withdrawTable'>
                                            <tr className='title'>
                                                <th className='one'>提现时间&nbsp;&nbsp;|&nbsp;&nbsp;流水单账号</th>
                                                <th className='two'>提现银行&nbsp;&nbsp;|&nbsp;&nbsp;提现账号</th>
                                                <th className='three'>提现总额(元)</th>
                                                <th className='four'>到账金额(元)</th>
                                                <th className='five'>手续费(元)</th>
                                                <th>状态</th>
                                            </tr>
                                        </table>
                                        <div className="pagination withdrawRecord-page">
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>


                <Footer PcBuildUrl={PcBuildUrl} globalData={globalData} />
            </div>
        )
    }
}

function mapStateToProps(state, ownProps) {
    return {
        PageData: state.PageView.FundRecordDealDetail
    };
}

export default connect(mapStateToProps, BaseIndex.MapDispatchToProps)(DealDetail);