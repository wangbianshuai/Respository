import React from "react"
import { connect } from "dva"
import BaseIndex from "../../Index";
import Header from "../../common/header";
import Footer from "../../common/footer";
import Menu from "../common/menu"

class NewTender extends BaseIndex {
    constructor(props) {
        super(props);
    }

    GetTitle() {
        return "新手标-加入记录-我的新新贷";
    }

    GetCssList() {
        return ["/build/mods/user/bonds/newtender/_.css"];
    }

    GetJsList() {
        return ["/build/mods/user/bonds/newtender/_.js"];
    }

    //服务器渲染加载数据
    static LoadData(ctx, app) {
        return BaseIndex.Dispatch(app._store.dispatch, "PageView", "GetBondsNewTender");
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
                            <a href="../../">首页</a> &gt; <a href="/usercenter/accountInfo.html">我的新新贷</a> &gt;
                <a href="javascript:void(0);">加入记录</a> &gt; <a href="javascript:void(0);">新手标</a>
                        </div>
                    </div>
                </div>
                <div className="info-contaner clearfix">
                    <Menu MenuName1="tender" MenuName2="newtender" MenuStatus={MenuStatus} />

                    <div className="g-right">
                        <div className="m-con-wrap">
                            <div className="m-con-hd user-title" id='J_tabs'>
                                <li className='active'><a href="#">债权列表</a></li>
                                <li className='fr back'><a href="/usercenter/tender/newtender.html" className='return'>返回</a></li>
                            </div>
                            <div className='table-box'>
                                <table id='haveTable'>
                                    <tr className='title'>
                                        <th>借款标题</th>
                                        <th>借款金额</th>
                                        <th>借款利率</th>
                                        <th>借款期限</th>
                                        <th>债权状态</th>
                                        <th>投标时间</th>
                                        <th>债权协议</th>
                                    </tr>
                                </table>
                                <div className="pagination haveTable-page">
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
        PageData: state.PageView.BondsNewTender
    };
}

export default connect(mapStateToProps, BaseIndex.MapDispatchToProps)(NewTender);