import React from "react"
import { connect } from "dva"
import BaseIndex from "../../Index";
import Header from "../../common/header";
import Footer from "../../common/footer";
import Menu from "../common/menu"
import { Common } from "UtilsCommon";

class Account extends BaseIndex {
    constructor(props) {
        super(props);
    }

    GetTitle() {
        return "我的资料-个人资料-我的新新贷";
    }

    GetCssList() {
        return ["/build/css/reset.css", "/build/mods/company/account/_.css"];
    }

    GetJsList() {
        return ["/build/mods/company/account/_.js"];
    }

    //服务器渲染加载数据
    static LoadData(ctx, app) {
        return BaseIndex.Dispatch(app._store.dispatch, "PageView", "GetCompanyAccount");
    }

    RenderCompanyLoanInfoRow(item) {
        return (
            <tr>
                <td>{Common.DateFormat(item.repaymentTime, 'yyyy-MM-dd')}</td>
                <td>{item.loanTitle}</td>
                <td>{item.loanType}</td>
                <td>{item.loanAmount}</td>
                <td>{item.annualRate}</td>
                <td>{item.term}</td>
                <td><a href="/account/repaydetail.html">查看</a></td>
            </tr>
        )
    }

    render() {
        if (!this.props.PageData || !this.props.PageData.global) return null;

        const PcBuildUrl = this.GetPcBuildUrl();
        const { globalData, global, isInvestQTDS, isInvestRRY, isInvestBBGS, isInvestXSB, companyDetailInfo, companyLoanInfoList } = this.props.PageData;
        const MenuStatus = { isInvestQTDS, isInvestRRY, isInvestBBGS, isInvestXSB }
        const nowHours = new Date().getHours();

        return (
            <div id="J_wrapBody">
                <Header PcBuildUrl={PcBuildUrl} globalData={globalData} IsCompany={true} IsCompanyActive={true} />

                <div className="g-top">
                    <div className="g-top-con">
                        <div className="container-1200">
                            <a href="/">首页</a> &gt; <a href="/usercenter/accountInfo.html">我的新新贷</a> &gt; <a
                                href="javascript:void(0);">企业用户</a> &gt; <a href="javascript:void(0);">我的账户</a>
                        </div>
                    </div>
                </div>
                <div className="info-contaner clearfix">
                    <Menu MenuName1="home" MenuName2="account" MenuStatus={MenuStatus} IsCompany={true} />

                    <div className="g-right">
                        <div className="m-con-wrap" id="account">
                            <div className="m-con-hd title">
                                我的账户<span>（企业版）</span>
                            </div>
                            <div className="user-detail flex-container">
                                <div className="boad flex-item">
                                    <div className="boad-title">
                                        {nowHours < 6 && <span style={{ color: "#333" }}>凌晨好，</span>}
                                        {nowHours >= 6 && nowHours < 12 && <span style={{ color: "#333" }}>上午好，</span>}
                                        {nowHours >= 12 && nowHours < 18 && <span style={{ color: "#333" }}>下午好，</span>}
                                        {nowHours >= 18 && nowHours <= 23 && <span style={{ color: "#333" }}>晚上好，</span>}
                                        <span>{globalData.nickName}</span>
                                    </div>
                                    <div className="boad-extra">上次登录：{globalData.userDetailInfo.data.userDetailInfo.lastLoginTime}</div>
                                </div>
                                <div className="boad flex-item">
                                    <div>账户余额(元)</div>
                                    <div className="blue-num">{companyDetailInfo.accountBalance}</div>
                                </div>
                                <div className="boad flex-item">
                                    <div>待还总额(元)</div>
                                    <div className="orange-num">{companyDetailInfo.returnedAmount}</div>
                                </div>
                                <div className="boad flex-item">
                                    <div>累计借款(元)</div>
                                    <div className="blue-num">{companyDetailInfo.accumulatedLoan}</div>
                                </div>
                            </div>
                            <div className="flex-container user-btns">
                                <div className="boad flex-item">
                                    <button className="m-btn m-btn-primary" onclick="window.location.href='/myloan/loan/9.html'" style="width:200px"><span>我要借款</span></button>
                                </div>
                                <div className="boad flex-item">
                                    <button onclick="window.location.href='/usercenter/company/recharge.html'" className="m-btn m-btn-primary"><span>充值</span></button>
                                </div>
                                <div className="boad flex-item">
                                    <button onclick="window.location.href='/usercenter/company/withdraw.html'" className="m-btn"><span>提现</span></button>
                                </div>
                                <div className="boad flex-item">
                                    <button onclick="window.location.href='/account/repaydetail.html'" className="m-btn"><span>还款</span></button>
                                </div>
                            </div>
                            <div className="m-con-hd title">我的借款</div>
                            <div className="table">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>下一个还款日</th>
                                            <th>借款标题</th>
                                            <th>借款类型</th>
                                            <th>借款金额</th>
                                            <th>年利率</th>
                                            <th>期限</th>
                                            <th>操作</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {Common.IsNoEmptyArray(companyLoanInfoList) ?
                                            companyLoanInfoList.map(m => this.RenderCompanyLoanInfoRow(m))
                                            : <tr>
                                                <td>-</td>
                                                <td>-</td>
                                                <td>-</td>
                                                <td>-</td>
                                                <td>-</td>
                                                <td>-</td>
                                                <td>-</td>
                                            </tr>
                                        }
                                    </tbody>
                                </table>
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
        PageData: state.PageView.CompanyAccount
    };
}

export default connect(mapStateToProps, BaseIndex.MapDispatchToProps)(Account);