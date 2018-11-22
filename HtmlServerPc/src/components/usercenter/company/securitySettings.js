import React from "react"
import { connect } from "dva"
import BaseIndex from "../../Index";
import Header from "../../common/header";
import Footer from "../../common/footer";
import Menu from "../common/menu"

class SecuritySettings extends BaseIndex {
    constructor(props) {
        super(props);
    }

    GetTitle() {
        return "安全设置-企业用户-我的新新贷";
    }

    GetCssList() {
        return ["/build/css/reset.css", "/build/mods/company/security-settings/_.css"];
    }

    GetJsList() {
        return ["/build/mods/company/security-settings/_.js"];
    }

    //服务器渲染加载数据
    static LoadData(ctx, app) {
        return BaseIndex.Dispatch(app._store.dispatch, "PageView", "GetCompanySecuritySettings");
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
                            <a href="../../">首页</a> &gt; <a href="/usercenter/company/account.html">我的新新贷</a> &gt; <a
                                href="javascript:void(0);">企业用户</a> &gt; <a href="javascript:void(0);">安全设置</a>
                        </div>
                    </div>
                </div>
                <div className="info-contaner clearfix">
                    <Menu MenuName1="securitySettings" MenuName2="securitySettings" MenuStatus={MenuStatus} IsCompany={true} />

                    <div className="g-right">
                        <div className="m-con-wrap">
                            <div className="m-con-hd user-title" id='J_tabs'>
                                <li><a href="#">授权管理</a></li>
                            </div>
                            <div className="m-con-bd">
                                <div className='j_tabContent'>
                                    <span id="editInsure" style={{ fontSize: "16px", color: "#57a8ff", float: "right", width: "110px", height: "35px", lineHeight: "35px", border: "1px solid #57a8ff", borderRadius: "5px", textAlign: "center", display: "block", cursor: "pointer", margin: "20px 0" }}>刷新</span>
                                    <table id="tableTitle" cellSpacing={0} style={{ marginTop: "15px" }}>
                                        <tr>
                                            <td style="width:170px;">授权内容</td>
                                            <td style="width:160px;">授权金额</td>
                                            <td style="width:160px;">授权期限</td>
                                            <td style="width:125px;">授权状态</td>
                                            <td>备注</td>
                                        </tr>
                                    </table>
                                    <table id="tableCon" cellSpacing={0} style={{ borderTop: "none", marginBottom: "100px", display: "none" }}>

                                    </table>
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
        PageData: state.PageView.CompanySecuritySettings
    };
}

export default connect(mapStateToProps, BaseIndex.MapDispatchToProps)(SecuritySettings);