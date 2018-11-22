import React from "react"
import { connect } from "dva"
import BaseIndex from "../../Index";
import Header from "../../common/header";
import Footer from "../../common/footer";

class OpenAccount extends BaseIndex {
    constructor(props) {
        super(props);
    }

    GetCssList() {
        return ["/build/mods/user/fundRecord/rechargeIdentity/_.css"];
    }

    GetJsList() {
        return ["/build/mods/user/fundRecord/rechargeIdentity/_.js"];
    }

    //服务器渲染加载数据
    static LoadData(ctx, app) {
        return BaseIndex.Dispatch(app._store.dispatch, "PageView", "GetFundRecordOpenAccount");
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
                            <a href="../../../template/thymeleaf">首页</a> &gt; <a href="/usercenter/accountInfo.html">我的新新贷</a> &gt; <a href="javascript:void(0);">银行存管开户</a>
                        </div>
                    </div>
                </div>
                <div className="info-contaner clearfix">
                    <div className="m-con-wrap">
                        <div className="m-con-hd title">银行存管开户</div>
                        <div className="m-con-bd recharge">
                            <div className="warmth-warn">
                                <p>为确保资金安全，请<a href="../personal/info.html">您在交易之前完善信息</a>。</p>
                            </div>

                            <div className="stepsbar">
                                <div className="step-default stepfirst step-current"><strong>1</strong>实名认证</div>
                                <div className="step-default stepsecond"><strong>2</strong>存管开户</div>
                                <div className="step-default stepthird"><strong>3</strong>完成</div>
                            </div>

                            <div id="step1">
                                <div className="filed-user">
                                    <span className="fourtxt">证件类型</span>
                                    <input type="text" placeholder="证件类型" id="idType" value="身份证" disabled />
                                </div>
                                <div className="filed-user">
                                    <span className="fourtxt">真实姓名</span>
                                    <input type="text" placeholder="您的真实姓名" id="realName" maxlength={10} />
                                </div>
                                <div className="filed-user">
                                    <span className="fourtxt">证件号码</span>
                                    <input type="text" placeholder="您的证件号码" id="idCode" />
                                </div>
                                <div className="wrong-tip wt-pos" id="errorTip1" style="display:none;"></div>
                                <div className="filed-user">
                                    <span></span>
                                    <p><a className="btn" id="btn-step1">下一步</a></p>
                                </div>
                            </div>

                            <div id="step2" className="disnone">
                                <div className="csd">
                                    资金存管机构：<span>上海华瑞银行股份有限公司(简称：华瑞银行)</span>
                                </div>
                                <div className="disabledInput">
                                    <div className="filed-user">
                                        <span className="fourtxt">真实姓名</span>
                                        <input type="text" disabled value="" id="showRealname" />
                                    </div>
                                    <div className="filed-user">
                                        <span className="fourtxt">证件号码</span>
                                        <input type="text" disabled value="" id="showIdcode" />
                                    </div>

                                </div>
                                <div className="filed-user" style="margin-top:15px;">
                                    <span></span>
                                    <p style="font-size:16px;">您将以<span id="userTypenew" style="width:auto; color:#2096e9;">出借人</span>身份进行开户，开户成功后身份无法修改<span id="showIdKindclick" style="font-size:16px; text-decoration:underline; color:#999999; cursor:pointer; margin-left:10px;">修改身份</span></p>
                                </div>
                                <div className="filed-user">
                                    <span></span>
                                    <p><a className="btn" id="btn-step2">同意开户</a></p>
                                    <div style="margin-top:15px;"><a href="../detail/userProtocol.html" className='agreement' target="_blank" style="display:inline; padding-left:0; margin-left:186px;">《用户授权协议》</a></div>
                                </div>
                                <input type="hidden" id="showIdKind" />
                            </div>

                            <div id="step3" className="disnone">
                                <div className="csd">
                                    资金存管机构：<span>上海华瑞银行股份有限公司(简称：华瑞银行)</span>
                                </div>
                                <div className="step3info">
                                    <p className="tit">银行存管已开户</p>
                                    <p className="info">注：存管账号登录用户名为手机号138******99，默认登录密码为手机号后六位</p>
                                    <div className="filed-user">
                                        <p><a className="btn" id="btn-step3" href="recharge.html">完成开户</a></p>
                                    </div>
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
        PageData: state.PageView.FundRecordOpenAccount
    };
}

export default connect(mapStateToProps, BaseIndex.MapDispatchToProps)(OpenAccount);