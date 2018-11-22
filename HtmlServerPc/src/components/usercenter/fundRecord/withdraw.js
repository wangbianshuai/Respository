import React from "react"
import { connect } from "dva"
import BaseIndex from "../../Index";
import Header from "../../common/header";
import Footer from "../../common/footer";
import Menu from "../common/menu"

class Withdraw extends BaseIndex {
    constructor(props) {
        super(props);
    }

    GetCssList() {
        return ["/build/mods/user/fundRecord/withdraw/_.css"];
    }

    GetJsList() {
        return ["/build/mods/user/fundRecord/withdraw/_.js"];
    }

    //服务器渲染加载数据
    static LoadData(ctx, app) {
        return BaseIndex.Dispatch(app._store.dispatch, "PageView", "GetFundRecordWithdraw");
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
                            <a href="../../">首页</a> &gt; <a href="/usercenter/accountInfo.html">我的新新贷</a> &gt; <a href="javascript:void(0);">提现</a>
                        </div>
                    </div>
                </div>
                <div className="info-contaner clearfix">
                    <Menu MenuName1="funds" MenuName2="withdraw" MenuStatus={MenuStatus} />

                    <div className="g-right">
                        <div className="m-con-wrap">
                            <div className="m-con-hd clearfix">提现
                    <a className="withdrawRecord" href="/usercenter/fundRecord/dealDetail.html?tab=3">提现记录</a>
                            </div>
                            <div className="m-con-bd withdraw">

                                <div className="filed-user">
                                    <span className="threetxt">提现到</span>
                                    <p className="openbank" id="J_selectBank"><span>请选择银行卡</span><i onclick="window.location.href = '/usercenter/bundled.html'">选择&nbsp; &gt;</i></p>
                                </div>

                                <div className="filed-user">
                                    <span className="fourtxt">到账时间</span>
                                    <p className="intotime"><span>T+1个工作日</span><i>(不同银行到账时间可能会略有不同)</i></p>
                                </div>
                                <div className="filed-user">
                                    <span className="fourtxt">账户余额</span>
                                    <p><span className="priceShow"><label id="balance">0.00</label>元</span></p>
                                </div>
                                <div className="filed-user">
                                    <span>可提现金额</span>
                                    <p><span className="priceShow"><label id="restdrawmoney">0.00</label>元</span></p>
                                </div>
                            </div>
                            <div className="m-con-bd withdraw">
                                <div className="filed-user freetips">
                                    <p>当月剩余提现次数：<label id="withdrawalsTime">0</label>次</p>
                                </div>
                                <div className="filed-user">
                                    <span className="fourtxt">提现金额</span>
                                    <input id="drawmondy" type="text" placeholder="请输入提现金额" value="" />
                                    元
                                <a id="sumdraw">全额提现</a>
                                </div>
                                <div className="wrong_tip wt_pos" id="errorTip1"></div>
                                <div className="filed-user">
                                    <span className="threetxt">手续费</span>
                                    <p><span className="priceShow"><label id="counter">0.00</label>元</span></p>
                                </div>
                                <div className="filed-user">
                                    <span className="fourtxt">到账金额</span>
                                    <p><span className="red priceShow"><label id="arrival">0.00</label>元</span></p>
                                </div>
                            </div>
                            <div className="m-con-bd withdraw last">
                                <div className="filed-user">
                                    <span className="fourtxt">支付密码</span>
                                    <input type="text" placeholder="请输入交易密码" id="payPassword" />
                                    <a id="forgetPassword">忘记密码</a>
                                </div>
                                <div className="wrong_tip wt_pos" id="errorTip2"></div>
                                <div className="filed-user">
                                    <span></span>
                                    <p><a className="btn" id="setOkbtn">确认提现</a></p>
                                </div>
                                <div className="warmth-warn">
                                    <p>1. 提现到账时间：0-3个工作日，最快当日到账(如遇双休日、节假日顺延)。</p>
                                    <p>2. 提现资金到银行卡的具体时间，请以银行为准。如节假日遇到银行调整，以最新公告为准。</p>
                                    <p>3. 提现时如遇任何问题，请联系客服：4000-169-521(工作日9:00-18:00)。</p>
                                    <p>4. 提现免手续费。</p>
                                    <p>5. 每月可成功提现<span id="monthlyWithdrawals">0</span>次，超出请联系客服或次月再进行提现(当月可成功提现次数不可叠加至次月使用)。</p>
                                    <p>6. 为了您的提现安全，若您在银行提现界面终止提现操作，消耗的可提现次数预计将于2个小时之后返回。</p>
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
        PageData: state.PageView.FundRecordWithdraw
    };
}

export default connect(mapStateToProps, BaseIndex.MapDispatchToProps)(Withdraw);