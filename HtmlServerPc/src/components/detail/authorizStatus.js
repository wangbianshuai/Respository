import React from "react"
import { connect } from "dva"
import BaseIndex from "../Index";
import Header from "../common/header";
import Footer from "../common/footer";

class AuthorizStatus extends BaseIndex {
    constructor(props) {
        super(props);
    }

    GetCssList() {
        return ["/build/mods/detail/authorizStatus/_.css"];
    }

    GetJsList() {
        return ["/build/mods/detail/authorizStatus/_.js"];
    }

    //服务器渲染加载数据
    static LoadData(ctx, app) {
        return BaseIndex.Dispatch(app._store.dispatch, "PageView", "GetAuthorizStatus");
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
                        <a href="//www.xinxindai.com/">首页</a> &gt; <b>操作成功</b>
                    </div>
                </div>

                <div className="info-contaner clearfix">
                    <div className="warning" id="J_showSucess">
                        <div className="disnone" id="J_showCode">{"{code}"}</div>
                        <i className="fail-icon sucess-icon" id="J_showIcon"></i><p className="showInfo" >{"{message}"}</p>
                    </div>
                    <div className='button'>
                        <input type="button" value='返回首页' onclick='window.location.href = "/"' />
                    </div>
                </div>

                <Footer PcBuildUrl={PcBuildUrl} globalData={globalData} />
            </div>
        )
    }
}

function mapStateToProps(state, ownProps) {
    return {
        PageData: state.PageView.AuthorizStatus
    };
}

export default connect(mapStateToProps, BaseIndex.MapDispatchToProps)(AuthorizStatus);