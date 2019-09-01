import React, { Component } from "react"
import { Common } from "UtilsCommon";
import Controls from "Controls";
const TextBox = Controls.TextBox;

export default class PasswordByEye extends Component {
    constructor(props) {
        super(props);
        this.Id = Common.CreateGuid();

        this.View = props.View;
        this.Property = props.Property;
        this.EventActions = props.EventActions;

        this.Property.ShowSecondCount = this.ShowSecondCount.bind(this);

        this.state = { SendText: "发送验证码", IsSending: false }
    }

    SendVerifyCode(type) {
        return () => {
            if (this.IsSending) return;
            const props = { ...this.props, SendType: type }
            this.EventActions.InvokeAction(this.Property.EventActionName, props);
        }
    }

    StopInterval() {
        this.TimeIntervalId > 0 && clearInterval(this.TimeIntervalId);
    }

    componentWillUnmount() {
        this.StopInterval();
    }

    ShowSecondCount() {
        this.IsSending = true;
        this.setState({ SendText: '60s后重新发送', IsSending: true });

        let time = 60
        this.StopInterval();
        this.TimeIntervalId = setInterval(() => {
            time--
            this.setState({ SendText: time + 's后重新发送' })
            if (time === 0) {
                window.clearInterval(this.TimeIntervalId);

                this.IsSending = false;
                this.setState({ SendText: '重发验证码', IsSending: false });
            }
        }, 1000)
    }

    render() {
        const { Property, View } = this.props;
        const { SendText, IsSending } = this.state;

        const aStyle = {};
        if (IsSending) aStyle.color = "#ccc";

        const className = this.EventActions.GetClassName(Property.DivClassName);
        const VerifyButton = this.EventActions.GetClassName("VerifyButton" + (IsSending ? " VerifyButtonDisabled" : ""));
        const DivVoice = this.EventActions.GetClassName("DivVoice");

        return (
            <React.Fragment>
                <div className={className}>
                    <TextBox Property={Property} View={View} EventActions={this.EventActions} />
                    <div className={VerifyButton} onClick={this.SendVerifyCode("sms")}><span>{SendText}</span></div>
                </div>
                <div className={DivVoice}>
                    <a onClick={this.SendVerifyCode("voice")} style={aStyle}>语音验证码</a>
                </div>
            </React.Fragment>
        )
    }
}