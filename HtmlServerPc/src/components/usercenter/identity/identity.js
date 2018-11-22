import React from "react"
import { connect } from "dva"
import BaseIndex from "../../Index";
import Header from "../../common/header";
import Footer from "../../common/footer";

class Identity extends BaseIndex {
    constructor(props) {
        super(props);
    }

    GetCssList() {
        return ["/build/mods/user/identity/personalIdentity/_.css"];
    }

    GetJsList() {
        return ["/build/mods/user/identity/personalIdentity/_.js"];
    }

    //服务器渲染加载数据
    static LoadData(ctx, app) {
        return BaseIndex.Dispatch(app._store.dispatch, "PageView", "GetUserCenterIdentity");
    }

    render() {
        if (!this.props.PageData || !this.props.PageData.global) return null;

        const PcBuildUrl = this.GetPcBuildUrl();
        const { globalData } = this.props.PageData;

        return (
            <div id="J_wrapBody">
                <Header PcBuildUrl={PcBuildUrl} globalData={globalData} />

                <div className="g-top">
                    <div className="g-top-con">
                        <div className="container-1200">
                            <a href="http://www.xinxindai.com/">首页</a> &gt; <a href="/">注册</a> &gt; 实名认证
            </div>
                    </div>
                </div>
                <div className='info-contaner clearfix'>
                    <div className="m-con-wrap">
                        <div className="m-con-hd clearfix"><a className="left">完善个人资料</a><a className="right">{"< 返回我的新新贷"}</a></div>
                    </div>
                    <table cellpadding="0" cellspacing="0" border="0">
                        <tr className="clearfix">
                            <td className="state"><span className="state-green">已认证</span></td>
                            <td className="item-name">绑定手机</td>
                            <td className="item-desc">绑定后可以使用手机号码登录，并及时收到账户操作提示信息。</td>
                            <td className="item-target">已绑定：<span>177******66</span></td>
                            <td className="item-btn"><a id="J_changePhone">更改绑定</a></td>
                        </tr>
                        <tr className="clearfix">
                            <td className="state"><span className="state-red">未认证</span></td>
                            <td className="item-name">实名认证</td>
                            <td className="item-desc">为确保账户及资金安全，需确认您的真实身份。</td>
                            <td className="item-target"></td>
                            <td className="item-btn"><a id="J_realnameId">认证</a></td>
                        </tr>
                        <tr className="clearfix">
                            <td className="state"><span className="state-red">未认证</span></td>
                            <td className="item-name">银行存款开户</td>
                            <td className="item-desc">开启银行存管账户，确保资金安全。</td>
                            <td className="item-target"></td>
                            <td className="item-btn"><a href="openAccount.html">开启</a></td>
                        </tr>
                        <tr className="clearfix">
                            <td className="state"><span className="state-red">未认证</span></td>
                            <td className="item-name">设置支付密码</td>
                            <td className="item-desc">为确保账户及资金安全，需确认您的真实身份。</td>
                            <td className="item-target"></td>
                            <td className="item-btn"><a id="J_setPaypwd">设置</a></td>
                        </tr>
                        <tr className="clearfix">
                            <td className="state"><span className="state-red">未认证</span></td>
                            <td className="item-name">设置安全保护问题</td>
                            <td className="item-desc">设置安全保护问题用于操作账户资金，确保资金安全。</td>
                            <td className="item-target"></td>
                            <td className="item-btn"><a id="J_setSafeQA">设置</a></td>
                        </tr>
                        <tr className="clearfix">
                            <td className="state"><span className="state-red">未认证</span></td>
                            <td className="item-name">VIP认证</td>
                            <td className="item-desc">成为VIP认证用户，享受全额垫付机制。</td>
                            <td className="item-target"></td>
                            <td className="item-btn"><a id="J_setVipID">设置</a></td>
                        </tr>
                        <tr className="last">
                            <td className="state"><span className="state-red">未认证</span></td>
                            <td className="item-name">绑定邮箱</td>
                            <td className="item-desc">用于找回密码操作，可提高账户安全性。</td>
                            <td className="item-target"></td>
                            <td className="item-btn"><a id="J_setEmail">设置</a></td>
                        </tr>
                    </table>
                </div>
                
                <Footer PcBuildUrl={PcBuildUrl} globalData={globalData} />
            </div>
        )
    }
}

function mapStateToProps(state, ownProps) {
    return {
        PageData: state.PageView.UserCenterIdentity
    };
}

export default connect(mapStateToProps, BaseIndex.MapDispatchToProps)(Identity);