import React from "react"
import { connect } from "dva"
import BaseIndex from "../Index";
import Header from "../common/header";
import Footer from "../common/footer";

class PurchaseSuccess extends BaseIndex {
    constructor(props) {
        super(props);
    }

    GetTitle() {
        return "新新贷-系统提示";
    }

    GetCssList() {
        return ["/build/mods/detail/purchaseSuccess/_.css"];
    }

    GetJsList() {
        return ["/build/js/common/require.min.js", "/build/mods/detail/purchaseSuccess/_.js"];
    }

    //服务器渲染加载数据
    static LoadData(ctx, app) {
        return BaseIndex.Dispatch(app._store.dispatch, "PageView", "GetPurchaseSuccess");
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
                        <a href="//www.xinxindai.com/">首页</a> &gt; <a href='/usercenter/accountInfo.html'>我的新新贷</a> &gt; <b>操作成功</b>
                    </div>
                </div>

                <div className='container'>
                    <div className='success'>
                        <div className='success-focus'>

                            <h2><i></i>恭喜您，加入成功！</h2>
                            <div className="button-warp">
                                <input type="button" value='查看我的加入记录' className='record' />
                                <input type="button" value='继续投标' className='purchase' />
                            </div>
                        </div>
                        <div className="notice-txt">
                            【重要提醒】根据政策对您权益保障的合规性要求，您需要在服务期到期后，在加入记录中点击”申请退出“按钮进行债权转让，全部债权转让完成后资金将返至您新新贷账户
                         </div>

                    </div>
                    <div className='recommend'>
                        <h3><i></i>向你推荐</h3>
                        <div className='recommend-focus'>
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
        PageData: state.PageView.PurchaseSuccess
    };
}

export default connect(mapStateToProps, BaseIndex.MapDispatchToProps)(PurchaseSuccess);