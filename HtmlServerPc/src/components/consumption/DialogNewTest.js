import React from "react";

import { BaseIndex, Dialog } from "ReactCommon";

export default class DialogNewTest extends BaseIndex {
    constructor(props) {
        super(props);

        this.state = { IsVisible: false };
    }

    Show() {
        this.setState({ IsVisible: true });
    }

    Close() {
        this.setState({ IsVisible: false });
    }

    render() {
        const { IsVisible } = this.state;
        if (!IsVisible) return null;

        return (
            <Dialog IsVisible={IsVisible}>
                <div className='measurement-tip'>
                    <h3><i></i>温馨提示<span className='c_close' onClick={this.Close.bind(this)}>×</span></h3>
                    <p>为了不影响您的出借，请先进行风险承受能力评估（仅需花费您10秒钟）</p>
                    <div><a href='/usercenter/questionnaire.html?location=1'>开始测试</a></div>
                </div>
            </Dialog >
        )
    }
}