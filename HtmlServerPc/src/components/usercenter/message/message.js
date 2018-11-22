import React from "react"
import { connect } from "dva"
import BaseIndex from "../../Index";
import Header from "../../common/header";
import Footer from "../../common/footer";
import Menu from "../common/menu"

class Message extends BaseIndex {
    constructor(props) {
        super(props);
    }

    GetTitle() {
        return "站内信-消息管理-我的新新贷";
    }

    GetCssList() {
        return ["/build/mods/user/message/message/_.css"];
    }

    GetJsList() {
        return ["/build/mods/user/message/message/_.js"];
    }

    //服务器渲染加载数据
    static LoadData(ctx, app) {
        return BaseIndex.Dispatch(app._store.dispatch, "PageView", "GetUserCenterMessage");
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
                <a href="javascript:void(0);">消息管理</a> &gt; <a href="javascript:void(0);">站内信</a>
                        </div>
                    </div>
                </div>
                <div className="info-contaner clearfix">
                    <Menu MenuName1="message" MenuName2="message" MenuStatus={MenuStatus} />

                    <div className="g-right">
                        <div className="m-con-wrap">
                            <div className="m-con-hd">站内信</div>

                            <div className="m-con-bd message">
                                <div className='mes-delete'>
                                    <input type="checkbox" className='all-check fl' />
                                    <input className='keyup' type="button" value='删除' />
                                </div>
                                <div className='mes-container clearfix'>
                                    <div className='mes-list clearfix'>
                                        <input type='checkbox' className='mes-check fl' />
                                        <div className='mes-logo fl'></div>
                                        <div className='mes-info fl'>
                                            <p>实名审核站内信</p>
                                            <span>您的实名申请已经通过验证。</span>
                                        </div>
                                        <div className='mes-time fr'>2016-08-29</div>
                                    </div>
                                    <div className='mes-list clearfix'>
                                        <input type='checkbox' className='mes-check fl' />
                                        <div className='mes-logo fl'></div>
                                        <div className='mes-info fl'>
                                            <p>实名审核站内信</p>
                                            <span>您的实名申请已经通过验证。</span>
                                        </div>
                                        <div className='mes-time fr'>2016-08-29</div>
                                    </div>
                                    <div className='mes-list clearfix last'>
                                        <input type='checkbox' className='mes-check fl' />
                                        <div className='mes-logo fl'></div>
                                        <div className='mes-info fl'>
                                            <p>实名审核站内信</p>
                                            <span>您的实名申请已经通过验证。</span>
                                        </div>
                                        <div className='mes-time fr'>2016-08-29</div>
                                    </div>
                                </div>
                                <div className='mes-delete'>
                                    <input type="checkbox" className='all-check fl' />
                                    <input className='keyup' type="button" value='删除' />
                                </div>
                            </div>

                            <div className='m-con-bd no-message'>
                                <img src="../img/sunflower.png" alt="" />
                                <span>还没有消息哦～</span>
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
        PageData: state.PageView.UserCenterMessage
    };
}

export default connect(mapStateToProps, BaseIndex.MapDispatchToProps)(Message);