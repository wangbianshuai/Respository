import React from "react"
import { connect } from "dva"
import BaseIndex from "../../Index";
import Header from "../../common/header";
import Footer from "../../common/footer";
import Menu from "../common/menu"

class Recharge extends BaseIndex {
    constructor(props) {
        super(props);
    }

    GetTitle() {
        return "快捷充值_新新贷";
    }

    GetCssList() {
        return ["/build/css/reset.css", "/build/mods/user/fundRecord/recharge/_.css"];
    }

    GetJsList() {
        return ["/build/mods/user/fundRecord/recharge/_.js"];
    }

    //服务器渲染加载数据
    static LoadData(ctx, app) {
        return BaseIndex.Dispatch(app._store.dispatch, "PageView", "GetFundRecordRecharge");
    }

    render() {
        if (!this.props.PageData || !this.props.PageData.global) return null;

        const PcBuildUrl = this.GetPcBuildUrl();
        const { globalData, isInvestQTDS, isInvestRRY, isInvestBBGS, isInvestXSB, userInfo } = this.props.PageData;
        const MenuStatus = { isInvestQTDS, isInvestRRY, isInvestBBGS, isInvestXSB }

        return (
            <div id="J_wrapBody">
                <Header PcBuildUrl={PcBuildUrl} globalData={globalData} />

                <div className="g-top">
                    <div className="g-top-con">
                        <div className="container-1200">
                            <a href="../../">首页</a> &gt; <a href="/usercenter/accountInfo.html">我的新新贷</a> &gt; <a href="javascript:void(0);">充值</a>
                        </div>
                    </div>
                </div>
                <div className="info-contaner clearfix">
                    <Menu MenuName1="funds" MenuName2="recharge" MenuStatus={MenuStatus} />

                    <div className="g-right">
                        <div className="m-con-wrap ">
                            <div className="m-con-hd clearfix">
                                {userInfo.usertype === "3" && <a href="javascript:void(0);" className="active quick-btn">快捷充值</a>}
                                <a href="javascript:void(0);" className={userInfo.usertype === "3" ? "banking-btn active" : "banking-btn"}>网银充值</a>
                                {userInfo.usertype === "3" && <a className="rechargeRecord" href="/usercenter/fundRecord/dealDetail.html?tab=2">充值记录</a>}
                            </div>
                            {userInfo.usertype !== "3" && <div className="quick-recharge recharge-list">
                                <div className="m-con-bd">
                                    <div className="filed-user">
                                        <span className="threetxt">我的银行卡</span>
                                        <p className="openbank"><span className="defaullogos">请选择银行卡</span><i onclick="window.location.href='/usercenter/bundled.html'">更换</i></p>
                                        <div className="bluetipexc">
                                            <i className="bluetip"></i>
                                            <strong><label>单笔限额5000元，单日限额20000元，单月限额20000元</label></strong>
                                        </div>
                                    </div>
                                    <div className="filed-user">
                                        <span className="threetxt">充值金额</span>
                                        <input type="text" placeholder="请输入充值金额" id="quickAmount" value="" /> 元(免手续费)
                                    </div>
                                    <div className="wrong_tip wt_pos" id="errorTip1">错误提示</div>
                                    <a className="next" id="quickBtn">确认充值</a>
                                </div>
                            </div>
                            }
                            {userInfo.usertype === "3" && <div className="banking-recharge recharge-list">
                                <div className="m-con-bd">
                                    <div className="filed-user">
                                        <span className="threetxt">充值金额</span>
                                        <input type="text" placeholder="请输入充值金额" id="bankAmount" value="" /> 元(免手续费)
                        </div>
                                    <div className="wrong_tip wt_pos" id="errorTip2">错误提示</div>
                                    <a className="next" id="bankBtn">确认充值</a>
                                </div>
                            </div>}
                            <div className="offline-recharge recharge-list">
                                <div className="m-con-bd">
                                    <div className="filed-user">
                                        <span className="threetxt">我的银行卡</span>
                                        <p className="openbank"><span className="defaullogos">请选择银行卡</span><i onclick="window.location.href='/usercenter/bundled.html'">更换</i></p>
                                    </div>
                                    <div className="filed-user" style="margin-top:35px;">新新贷存管账户</div>
                                    <ul className="tableList">
                                        <li>
                                            <strong>收款方户名</strong>
                                            <strong>收款方账号</strong>
                                            <strong>收款方开户行</strong>
                                        </li>
                                        <li>
                                            <span>新新贷（上海）金融信息服务有限公司</span>
                                            <span>800003071918</span>
                                            <span>上海华瑞银行股份有限公司</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            <div className="warmth-warn quick-info">
                                <p>温馨提示：</p>
                                <p>1. 新新贷使用的是银行资金存管模式，网贷客户交易结算资金账户是完全属于您个人的独立账户，实现完全的资金隔离，新新贷会根据您的授权划拨资金给借款人，除此之外无权动用。
                    </p>
                                <p>2. 严禁洗钱、信用卡套现，一经发现将予以处罚，包括但不限于：冻结账户、永久停止服务，并可能会影响银行征信记录。
                    </p>
                            </div>

                            <div className="warmth-warn banking-info">
                                <p>温馨提示：</p>
                                <p>1. 新新贷使用的是银行资金存管模式，网贷客户交易结算资金账户是完全属于您个人的独立账户，实现完全的资金隔离，新新贷会根据您的授权划拨资金给借款人，除此之外无权动用。
                    </p>
                                <p>2. 严禁洗钱、信用卡套现，一经发现将予以处罚，包括但不限于：冻结账户、永久停止服务，并可能会影响银行征信记录。
                    </p>
                            </div>

                            <div className="warmth-warn offline-info">
                                <p>操作说明：</p>
                                <p>1. 线下充值针对大额转账需要，适用于充值金额超过50,000元。小于此金额，建议您使用快捷充值或网银充值。</p>
                                <p>2. 仅支持网银、手机银行、柜面操作，不支持支付宝、微信、ATM、现金转账。</p>
                                <p>3. 仅支持使用您已绑定存管户的银行卡进行操作；若需从本人其它银行卡转账，请先更换绑定银行卡。</p>
                                <p>4. 线下充值非实时到账：银行核对转入账户成功后，钱款将于一个工作日内从新新贷存管账户转入您在华瑞银行开设的个人存管账户中。</p>
                                <p>5. 充值过程中收取转账费用以银行规定为准；新新贷不收取其他任何费用。</p>
                                <p>6. 如充值失败，钱款将在10个工作日内退回您充值的银行卡。</p>
                                <p style="margin-bottom:15px;">7. 线下充值如遇问题，请联系客服：4000-169-521(工作日9:00-18:00)。</p>

                                <p>温馨提示：</p>
                                <p>1. 新新贷使用的是银行资金存管模式，网贷客户交易结算资金账户是完全属于您个人的独立账户，实现平台和资金安全隔离，新新贷会根据您的授权划拨资金给借款人，除此之外无权动用。
                    </p>
                                <p>2. 严禁洗钱、信用卡套现，一经发现将予以处罚，包括但不限于：冻结账户、永久停止服务，并可能会影响银行征信记录。
                    </p>
                            </div>
                        </div>
                    </div>

                    <div className="supernatant">
                        <p>提示</p>
                        <span>充值成功 !</span>
                        <input type="button" value="确认" />
                    </div>
                </div>

                <Footer PcBuildUrl={PcBuildUrl} globalData={globalData} />
            </div>
        )
    }
}

function mapStateToProps(state, ownProps) {
    return {
        PageData: state.PageView.FundRecordRecharge
    };
}

export default connect(mapStateToProps, BaseIndex.MapDispatchToProps)(Recharge);