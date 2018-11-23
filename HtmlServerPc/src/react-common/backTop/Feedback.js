import React from "react";
import BaseIndex2 from "../BaseIndex2";
import Dialog from "../dialog/Index";

export default class Feedback extends BaseIndex2 {
    constructor(props) {
        super(props);

        this.state = { IsVisible: true, Content: "", Contact: "" }

    }

    componentDidMount() {
        this.props.Page.InitPropsChanged(this.PropsChanged());
    }

    PropsChanged() {
        return (props, nextProps) => {
            if (this.JudgeChanged(props, nextProps, "Opinion")) this.ReceiveOpinion(nextProps.Opinion);
        }
    }

    ReceiveOpinion(opinion) {
        if (opinion.IsSuccess !== false) this.props.Page.Alert("问题反馈已提交", "成功信息", 2000, true, () => this.Close())
    }

    Close() {
        this.setState({ IsVisible: false });
    }

    Ok() {
        if (this.props.Page.props.Loading) return;

        const { Content, Contact } = this.state;

        if (!Content || Content.length < 3) { this.props.Page.Alert("意见反馈不小于三个字"); return; }

        const data = { content: Content, contact: Contact };

        this.props.Page.Dispatch("BizService2", "SubmitOpinion", data)
    }

    render() {
        const { IsVisible, Content, Contact } = this.state;
        if (!IsVisible) return null;
        let num = 200;
        num = num - Content.length;

        return (
            <Dialog IsVisible={IsVisible}>
                <div className="mui-feedback">
                    <div className="mui-dialog-title">
                        意见反馈
                        <a className="c_close" onClick={this.Close.bind(this)}>×</a>
                    </div>
                    <div className="mui-dialog-content">
                        <div className="field-textarea-tip">您的意见<span>还可以输入<i>{num}</i>字</span></div>
                        <textarea maxLength="200" value={Content} onChange={this.InputChange("Content")} placeholder="请填写您的意见，不少于3字且不超过200字"></textarea>
                        <div className="field-input-tip">联系方式(选填)</div>
                        <div className="input-number"><input type="text" className="placeholder" value={Contact} onChange={this.InputChange("Contact")} placeholder="您的邮箱/QQ号/手机号" /></div>
                        <a className="mui-sub-btn c_confirm" onClick={this.Ok.bind(this)}>确认提交</a>
                    </div>
                </div>
            </Dialog>
        )
    }
}