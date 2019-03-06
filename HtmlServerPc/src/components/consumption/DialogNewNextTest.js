import React from "react";
import { Common } from "UtilsCommon";
import { BaseIndex, Dialog } from "ReactCommon";

export default class DialogNewNextTest extends BaseIndex {
    constructor(props) {
        super(props);

        this.state = { IsVisible: false };
    }

    Show(surplusAmount) {
        this.setState({ IsVisible: true, surplusAmount });
    }

    Close() {
        this.setState({ IsVisible: false });
    }

    render() {
        const { IsVisible, surplusAmount } = this.state;
        if (!IsVisible) return null;

        return (
            <Dialog IsVisible={IsVisible}>
                <div className='dimension operate-tip'>
                    <i className='c_close close_x' onClick={this.Close.bind(this)}>×</i>
                    <h5>确认投标金额</h5>
                    <div className='tip-content'>
                        <p className='red'>{"您输入的投标金额大于平台剩余可投额度：" +  Common.ToCurrency(surplusAmount) + "元，请重新调整。"}</p>
                        <p>详情可拨打客服电话4000-69-521进行咨询</p>
                        <a className='btn small-btn close-x' onClick={this.Close.bind(this)}>好的</a>
                        <a className='btn  small-btn J_getNewTest next' onClick={this.props.ReNewTest}>重新测评</a>
                    </div>
                </div>
            </Dialog>
        )
    }
}