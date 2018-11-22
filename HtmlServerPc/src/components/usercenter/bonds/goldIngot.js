import React from "react"
import { connect } from "dva"
import BaseIndex from "../../Index";
import Header from "../../common/header";
import Footer from "../../common/footer";
import Menu from "../common/menu"

class GoldIngot extends BaseIndex {
    constructor(props) {
        super(props);
    }

    GetTitle() {
        return "新元宝-加入记录-我的新新贷";
    }

    GetCssList() {
        return ["/build/mods/user/bonds/goldIngot/_.css"];
    }

    GetJsList() {
        return ["/build/mods/user/bonds/goldIngot/_.js"];
    }

    //服务器渲染加载数据
    static LoadData(ctx, app) {
        return BaseIndex.Dispatch(app._store.dispatch, "PageView", "GetBondsGoldIngot");
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
                <a href="javascript:void(0);">加入记录</a> &gt; <a href="javascript:void(0);">新元宝</a>
                        </div>
                    </div>
                </div>
                <div className="info-contaner clearfix">
                    <Menu MenuName1="tender" MenuName2="goldIngot" MenuStatus={MenuStatus} />

                    <div className="g-right">
                        <div className="m-con-wrap">
                            <div className="m-con-hd user-title">
                                <li className='active'><a href="#" className='J_XYBName'></a></li>
                                <li className='fr back'><a href="/usercenter/tender/goldIngot.html" className='return'>返回</a></li>
                            </div>
                            <div className='table-box' >
                                <table id='haveTable'>
                                    <tr className='title'>
                                        <th>加入金额</th>
                                        <th>收益率</th>
                                        <th>起息时间</th>
                                        <th className='outType'>可申请退出时间</th>
                                        <th>收益处理方式</th>
                                        <th>查看协议</th>
                                        <th>操作</th>
                                    </tr>
                                </table>
                            </div>
                            <div className="m-con-hd user-title record-title" id='J_tabs'>
                                <li className='active'><a href="#">出借记录</a></li>
                                <li><a href="#">我的债权</a></li>
                            </div>
                            <div className='data-box'>
                                <div className='table-box j_tabContent'>
                                    <table id='recordTable'>
                                        <tr className='title'>
                                            <th>序号</th>
                                            <th>日期</th>
                                            <th>加入金额</th>
                                            <th>历史年化收益</th>
                                            <th>出借平台</th>
                                            <th>优惠券信息</th>
                                        </tr>
                                    </table>
                                    <div className="pagination recordTable-page">
                                    </div>
                                </div>
                                <div className='table-box j_tabContent hide'>
                                    <table id='creditorTable'>
                                        <tr className='title'>
                                            <th>借款标题</th>
                                            <th>借款金额</th>
                                            <th>借款利率</th>
                                            <th>借款期限</th>
                                            <th>状态</th>
                                            <th>投标时间</th>
                                            <th>操作</th>
                                        </tr>
                                    </table>
                                    <div className="pagination creditorTable-page">
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
        PageData: state.PageView.BondsGoldIngot
    };
}

export default connect(mapStateToProps, BaseIndex.MapDispatchToProps)(GoldIngot);