import React from "react"
import { connect } from "dva"
import BaseIndex from "../../Index";
import Header from "../../common/header";
import Footer from "../../common/footer";

class OpenaccountError extends BaseIndex {
    constructor(props) {
        super(props);
    }

    GetCssList() {
        return ["/build/mods/user/identity/identityFail/_.css"];
    }

    GetJsList() {
        return ["/build/mods/user/identity/identityFail/_.js"];
    }

    //服务器渲染加载数据
    static LoadData(ctx, app) {
        return BaseIndex.Dispatch(app._store.dispatch, "PageView", "GetOpenaccountError");
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
                            <a href="http://www.xinxindai.com">首页</a> &gt; <a href="javascript:void(0);">操作失败</a>
                        </div>
                    </div>
                </div>

                <div className="info-contaner clearfix">
                    <div className='warning'>
                        <p><i></i>errorTitle</p>
                        <span>【失败原因】errorMsg</span>
                    </div>
                    <div className='button'>
                        <input type="button" value='返回首页' onclick='window.location.href = "/"' />
                    </div>
                </div>

                <Footer PcBuildUrl={PcBuildUrl} globalData={globalData}  />
            </div>
        )
    }
}

function mapStateToProps(state, ownProps) {
    return {
        PageData: state.PageView.OpenaccountError
    };
}

export default connect(mapStateToProps, BaseIndex.MapDispatchToProps)(OpenaccountError);