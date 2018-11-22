import React from "react"
import { connect } from "dva"
import BaseIndex from "../../Index";
import Header from "../../common/header";
import Footer from "../../common/footer";
import Menu from "../common/menu"

class InviteFriendsDetail extends BaseIndex {
    constructor(props) {
        super(props);
    }

    GetTitle() {
        return "邀请好友-我的新新贷";
    }

    GetCssList() {
        return ["/build/mods/user/activity/inviteFriendsDetail/_.css"];
    }

    GetJsList() {
        return ["/build/mods/user/activity/inviteFriendsDetail/_.js"];
    }

    //服务器渲染加载数据
    static LoadData(ctx, app) {
        return BaseIndex.Dispatch(app._store.dispatch, "PageView", "GetInviteFriendsDetail");
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
                            <a href="../../">首页</a> &gt; <a href="/usercenter/accountInfo.html">我的新新贷</a> &gt; <a href="javascript:void(0);">邀请好友</a>
                        </div>
                    </div>
                </div>
                <div className="info-contaner clearfix">
                    <Menu MenuName1="invite" MenuName2="inviteFriends" MenuStatus={MenuStatus} />

                    <div className="g-right">
                        <div className="m-con-wrap " id='invate'>
                            <div className="m-con-hd invate-title">
                                <span>邀请好友</span>
                                <a href="/html/inviteFriendsNew/index.html">查看活动规则》</a>
                            </div>
                            <div className='invate-detail clearfix'>
                                <div className='invate-content'>
                                    <div className="title invate-detail-title">
                                        <i></i>
                                        <span>我的邀请战绩</span>
                                        <i></i>
                                    </div>
                                    <ul className="list-wrapper record-list">
                                        <li>
                                            <div><span className="num" id="J_jdNum">--</span>元</div>
                                            <div>已获京东E卡</div>
                                        </li>
                                        <li>
                                            <div><span className="num" id="J_fxNum">--</span>元</div>
                                            <div>已获返现</div>
                                        </li>
                                        <li>
                                            <div><span className="num" id="J_peopleNum">--</span>人</div>
                                            <div>已邀请人数</div>
                                        </li>
                                    </ul>
                                    <div className="title grade-title">
                                        <i></i>
                                        <span>我的邀请等级</span>
                                        <i></i>
                                    </div>
                                    <ul className="list-wrapper grade-list">
                                        <li>
                                            <div><span className="num" id="J_gradeAmount">--</span>元</div>
                                            <div>所有好友在投总额</div>
                                        </li>
                                        <li>
                                            <div><span className="num" id="J_gradeP">--</span>人</div>
                                            <div>达标邀请人数</div>
                                        </li>
                                        <li>
                                            <div><span className="num" id="J_gradePer">--</span>%</div>
                                            <div>收益返现比</div>
                                        </li>
                                    </ul>
                                    <div className="grade-notify">注：所有好友在投总额，随着好友出借额动态变化；达标邀请人数指累积出借金额大于等于5000元的好友数量；返现比例根据以上两项动态变化，计算返现以当时的收益返现比为准。</div>
                                </div>
                                <div className='scanQ'>
                                    <div className="scanQ-container">
                                        <div className="scanQ-image">
                                        </div>
                                        <div className="scanQ-text">
                                            <span>手机客户端下载</span>
                                        </div>
                                        <div className="invate-content-notify">
                                            <span>注: 邀请好友功能仅限手机app，请扫描二维码下载，进入app进行邀请。</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="m-con-hd user-title property">
                            </div>
                            <div>
                                <div className="m-con-hd invitefriends-tab">
                                    <nav>
                                        <ul>
                                            <li className="invitefriends-tab-item">
                                                <span className='active inviteD'>
                                                    好友明细
                                    </span>
                                            </li>
                                            <li className="invitefriends-tab-item">
                                                <span className='rewardD'>
                                                    奖励明细
                                    </span>
                                            </li>
                                        </ul>
                                    </nav>
                                </div>
                                <div className='data-box clearfix'>
                                    <div className='table-box'>
                                        <table align="center" id='inviteD'>
                                            <tr className='title'>
                                                <th>好友</th>
                                                <th>注册时间</th>
                                                <th>预期收益</th>
                                                <th>本期预期收益</th>
                                            </tr>
                                            <tr>
                                                <td colSpan="4">暂无记录</td>
                                            </tr>
                                        </table>
                                        <table align="center" id='rewardD'>
                                            <tr className='title'>
                                                <th>已邀请好友</th>
                                                <th>注册时间</th>
                                                <th>首投时间</th>
                                            </tr>
                                            <tr>
                                                <td colSpan="3">暂无记录</td></tr>
                                        </table>
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
        PageData: state.PageView.InviteFriendsDetail
    };
}

export default connect(mapStateToProps, BaseIndex.MapDispatchToProps)(InviteFriendsDetail);