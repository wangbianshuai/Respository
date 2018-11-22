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
        return ["/build/css/reset.css", "/build/mods/company/recharge/_.css"];
    }

    GetJsList() {
        return ["/build/mods/company/recharge/_.js"];
    }

    //服务器渲染加载数据
    static LoadData(ctx, app) {
        return BaseIndex.Dispatch(app._store.dispatch, "PageView", "GetCompanyRecharge");
    }

    render() {
        if (!this.props.PageData || !this.props.PageData.global) return null;

        const PcBuildUrl = this.GetPcBuildUrl();
        const { globalData, isInvestQTDS, isInvestRRY, isInvestBBGS, isInvestXSB } = this.props.PageData;
        const MenuStatus = { isInvestQTDS, isInvestRRY, isInvestBBGS, isInvestXSB }

        return (
            <div id="J_wrapBody">
                <Header PcBuildUrl={PcBuildUrl} globalData={globalData} IsCompany={true} IsCompanyActive={false} />

                <div className="g-top">
                    <div className="g-top-con">
                        <div className="container-1200">
                            <a href="../../">首页</a> &gt; <a href="/usercenter/company/account.html">我的新新贷</a> &gt; <a href="javascript:void(0);">企业用户</a> &gt; <a href="javascript:void(0);">充值</a>
                        </div>
                    </div>
                </div>
                <div className="info-contaner clearfix">
                    <Menu MenuName1="userinfo" MenuName2="recharge" MenuStatus={MenuStatus} IsCompany={true} />

                    <div className="g-right">
                        <div className="m-con-wrap ">
                            <div className="m-con-hd clearfix">
                                <a href="javascript:void(0);" className="banking-btn active">网银充值</a>
                            </div>
                            <div className="banking-recharge recharge-list" style="display:block;">
                                <div className="m-con-bd">
                                    <div className="filed-user">
                                        <span className="threetxt">充值金额</span>
                                        <input type="text" placeholder="请输入充值金额" id="bankAmount" value="" /> 元(免手续费)
                                    </div>
                                    <div className="wrong_tip wt_pos" id="errorTip" style="display: none;">错误提示</div>
                                    <a className="next" id="bankBtn">确认充值</a>
                                </div>
                            </div>
                            <div className="warmth-warn quick-info">
                                <p>温馨提示：</p>
                                <p>1. 新新贷使用的是银行资金存管模式，网贷客户交易结算资金账户是完全属于您个人的独立账户，实现完全的资金隔离，新新贷会根据您的授权划拨资金给借款人，除此之外无权动用。</p>
                                <p>2. 严禁洗钱、信用卡套现，一经发现将予以处罚，包括但不限于：冻结账户、永久停止服务，并可能会影响银行征信记录。 </p>
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
        PageData: state.PageView.CompanyRecharge
    };
}

export default connect(mapStateToProps, BaseIndex.MapDispatchToProps)(Recharge);