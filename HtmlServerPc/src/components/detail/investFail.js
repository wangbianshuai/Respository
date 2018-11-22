import React from "react"
import { connect } from "dva"
import BaseIndex from "../Index";
import Header from "../common/header";
import Footer from "../common/footer";

class InvestFail extends BaseIndex {
    constructor(props) {
        super(props);
    }

    GetCssList() {
        return ["/build/mods/detail/investFail/_.css"];
    }

    GetJsList() {
        return ["/build/js/common/require.min.js", "/build/mods/detail/investFail/_.js"];
    }

    //服务器渲染加载数据
    static LoadData(ctx, app) {
        return BaseIndex.Dispatch(app._store.dispatch, "PageView", "GetInvestFail");
    }

    render() {
        if (!this.props.PageData || !this.props.PageData.global) return null;

        const PcBuildUrl = this.GetPcBuildUrl();
        const { globalData } = this.props.PageData;

        return (
            <div id="J_wrapBody">
                <Header PcBuildUrl={PcBuildUrl} globalData={globalData} />

                <div className="detail-crumbs">
                    <div className="crumbs">
                        <a href="//www.xinxindai.com/">首页</a> &gt; <a href='/usercenter/accountInfo.html'>我的新新贷</a> &gt; <b>操作失败</b>
                    </div>
                </div>

                <div className='container'>
                    <h3><i></i>出借失败了！</h3>
                    <div className='demand'>
                        <h5>应监管需要，您需要先开通银行存管账户才能够顺利出借哦～</h5>
                        <p><span className='time'>5</span>秒后为您自动跳转至开户页……</p>
                    </div>
                    <a href="/usercenter/openAccount.html" className='open-account'>立即开户</a>
                </div>

                <Footer PcBuildUrl={PcBuildUrl} globalData={globalData} />
            </div>
        )
    }
}

function mapStateToProps(state, ownProps) {
    return {
        PageData: state.PageView.InvestFail
    };
}

export default connect(mapStateToProps, BaseIndex.MapDispatchToProps)(InvestFail);