import React from "react";
import BaseIndex from "../BaseIndex";
import Dialog from "../dialog/Index";

class Feedback extends BaseIndex {
    constructor(props) {
        super(props);

        this.state = { Content: "", Contact: "", OkDisabled: false }

        this.Init();
    }

    Init() {
        this.Page = this.props.Page;
        this.Alert = this.Page.InvokeRootPage("Alert");
        this.OkDisabled = false;
    }

    ReceiveOpinion(opinion) {
        if (opinion.IsSuccess !== false) this.Alert("问题反馈已提交", "成功信息", 2000, true, () => this.props.Close());
        else this.OkDisabled = false;
    }

    Ok() {
        if (this.OkDisabled) return;

        const { Content, Contact } = this.state;

        if (!Content || Content.length < 3) { this.Alert("意见反馈不小于三个字"); return; }

        this.OkDisabled = true;

        const data = { content: Content, contact: Contact };
        this.DispatchAction("BizService2", "SubmitOpinion", data).then(res => this.ReceiveOpinion(res));
    }

    render() {
        const { Content, Contact } = this.state;
        const { Close } = this.props;

        let num = 200;
        num = num - Content.length;

        return (
            <div className="mui-feedback">
                <div className="mui-dialog-title">
                    意见反馈
                        <a className="c_close" onClick={Close.bind(this)}>×</a>
                </div>
                <div className="mui-dialog-content">
                    <div className="field-textarea-tip">您的意见<span>还可以输入<i>{num}</i>字</span></div>
                    <textarea maxLength="200" value={Content} onChange={this.InputChange("Content")} placeholder="请填写您的意见，不少于3字且不超过200字"></textarea>
                    <div className="field-input-tip">联系方式(选填)</div>
                    <div className="input-number"><input type="text" className="placeholder" value={Contact} onChange={this.InputChange("Contact")} placeholder="您的邮箱/QQ号/手机号" /></div>
                    <a className="mui-sub-btn c_confirm" onClick={this.Ok.bind(this)}>确认提交</a>
                </div>
            </div>
        )
    }
}

export default Dialog(Feedback);