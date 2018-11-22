import React from "react"
import { connect } from "dva"
import BaseIndex from "../../Index";
import Header from "../../common/header";
import Footer from "../../common/footer";
import Menu from "../common/menu"
import { Common } from "UtilsCommon";

class CoinLog extends BaseIndex {
    constructor(props) {
        super(props);
    }

    GetTitle() {
        return "新新币-资金记录-我的新新贷";
    }

    GetCssList() {
        return ["/build/mods/user/fundRecord/coinLog/_.css"];
    }

    GetJsList() {
        return ["/build/mods/user/fundRecord/coinLog/_.js"];
    }

    //服务器渲染加载数据
    static LoadData(ctx, app) {
        return BaseIndex.Dispatch(app._store.dispatch, "PageView", "GetFundRecordCoinLog");
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
                            <a href="../../">首页</a> &gt; <a href="/usercenter/accountInfo.html">我的新新贷</a> &gt;>&gt; <a
                                href="javascript:void(0);">资金记录</a> &gt; <a href="javascript:void(0);">新新币</a>
                        </div>
                    </div>
                </div>
                <div className="info-contaner clearfix">
                    <Menu MenuName1="fundRecord" MenuName2="coinLog" MenuStatus={MenuStatus} />

                    <div className="g-right">
                        <div className="m-con-wrap">
                            <div className="m-con-hd user-title" id='J_tabs'>
                                <li className='active'><a href="#">新新币兑换</a></li>
                                <li><a href="#">新新币明细</a></li>
                            </div>
                            <div className='data-box'>
                                <div className='conversion j_tabContent'>
                                    <p>新新币总额：<span id="J_totalAmount">{globalData.coins.data.num}</span>个</p>
                                    <p>可兑换金额：<span id="J_convertMoney">{Common.ToCurrency(globalData.coins.data.amount)}</span>元</p>
                                    <p>可用余额：<span id="J_userMoney">{Common.ToCurrency(globalData.overview.data.availableBalance)}</span>元</p>
                                    <p>我要兑换：<input type="tel" className='J_xxCoinNumber' placeholder='请输入新新币个数' onkeyup="this.value=this.value.replace(/[^\d]/g,'')" onafterpaste="this.value=this.value.replace(/[^\d]/g,'')" />个新新币，累计折合现金<span className='J_discounting'>0</span>元</p>
                                    <a href="#" className='btn' id='conversion'>确认兑换</a>
                                    <div className='conversion-tip'>
                                        <h5>新新币兑换说明</h5>
                                        <p>新新币兑换人民币的比例为{globalData.coins.data.ratio}:1，成功兑换后可用余额增加，新新币数量减少。</p>
                                    </div>
                                </div>
                                <div className='recharge-data j_tabContent hide'>
                                    <div className='filt-box'>
                                        <ul className='usable-data'>
                                            <li>新新币数量：</li>
                                            <li><span id="J_totalAmount1">{globalData.coins.data.num}</span>个</li>
                                            <li className='next-li'>可兑换金额：</li>
                                            <li><span id="J_convertMoney1">{Common.ToCurrency(globalData.coins.data.amount)}</span>元</li>
                                        </ul>
                                        <ul className='J_timeimit'>
                                            <li>时间范围：</li>
                                            <a href='javascript:;' className='active'>不限</a>
                                            <a href='javascript:;'>1个月</a>
                                            <a href='javascript:;'>2个月</a>
                                            <a href='javascript:;'>3个月</a>
                                            <a href='javascript:;'>6个月</a>
                                            <a href='javascript:;'>12个月</a>
                                            <a href='javascript:;'>12个月以上</a>
                                        </ul>
                                        <ul className='time-filt J_dealType'>
                                            <li>交易类型：</li>
                                            <a href='javascript:;' className='active'>不限</a>
                                            <a href='javascript:;'>获得新新币</a>
                                            <a href='javascript:;'>兑换新新币</a>
                                        </ul>
                                    </div>
                                    <div className='recharge-table table-box'>
                                        <table id='rechargeTable'>
                                            <tr className='title'>
                                                <th className='one'>时间</th>
                                                <th className='two'>交易类型</th>
                                                <th className='three'>新新币数量</th>
                                                <th className='four'>记录备注</th>
                                            </tr>
                                        </table>
                                        <div className="pagination rechargeRecord-page">
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
        PageData: state.PageView.FundRecordCoinLog
    };
}

export default connect(mapStateToProps, BaseIndex.MapDispatchToProps)(CoinLog);