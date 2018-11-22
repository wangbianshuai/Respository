import React from "react"
import { connect } from "dva"
import BaseIndex from "../../Index";
import Header from "../../common/header";
import Footer from "../../common/footer";
import Menu from "../common/menu"

class Bundled extends BaseIndex {
    constructor(props) {
        super(props);
    }

    GetCssList() {
        return ["/build/css/reset.css", "/build/mods/company/bundled/_.css"];
    }

    GetJsList() {
        return ["/build/mods/company/bundled/_.js"];
    }

    //服务器渲染加载数据
    static LoadData(ctx, app) {
        return BaseIndex.Dispatch(app._store.dispatch, "PageView", "GetCompanyBundled");
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
                            <a href="../../">首页</a> &gt; <a href="/usercenter/company/account.html">我的新新贷</a> &gt; <a href="javascript:void(0);">企业用户</a> &gt; <a href="javascript:void(0);">银行设置</a>
                        </div>
                    </div>
                </div>
                <div className="info-contaner clearfix">
                    <Menu MenuName1="bundled" MenuName2="bundled" MenuStatus={MenuStatus} IsCompany={true} />

                    <div className="g-right">
                        <div className="m-con-wrap">
                            <div className="m-con-hd clearfix">我的银行卡</div>
                            <div className="m-con-bd bundled">

                                <ul className="clearfix" id="hasCard">
                                    <li>
                                        <p className="clearfix mark">
                                            <span className="fl bklogo-js"></span>
                                        </p>
                                        <p className="cardno">
                                            <span>****</span>
                                            <span>****</span>
                                            <span>****</span>
                                            <span className="last">1344</span>
                                        </p>
                                        <p className="btns-operat">
                                            <span>t+1个工作日内到账</span>
                                        </p>
                                    </li>
                                </ul>
                            </div>
                            <div className="m-con-bd">
                                <div className="warmth-warn">
                                    <p>温馨提示：</p>
                                    <p>1. 企业用户只能使用网银充值。</p>
                                    <p>2. 一个企业同一时间只能绑定一个对公户（基本户或一般户皆可）。</p>
                                    <p>3. 变更对公户请致电客服：4000-169-521（9:00-18:00工作日）。</p>
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
        PageData: state.PageView.CompanyBundled
    };
}

export default connect(mapStateToProps, BaseIndex.MapDispatchToProps)(Bundled);