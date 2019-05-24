import React, { Component } from "react"
import { Common, EnvConfig } from "UtilsCommon";
import Controls from "Controls";
const TextBox = Controls.TextBox;

export default class ImageVerifyCode extends Component {
    constructor(props) {
        super(props)

        this.Name = "ImageVerifyCode";

        this.View = props.View;
        this.Property = props.Property;
        this.EventActions = props.EventActions;
        this.state = { VerifyUrl: "" }
        props.Property.RefreshVerifyUrl = this.RefreshVerifyUrl.bind(this);
    }

    componentDidMount() {
        this.RefreshVerifyUrl();

        this.props.Property.SetFocus();
    }

    RefreshVerifyUrl() {
        const imageUrl = this.props.Property.ImageUrl;

        let url = "";
        if (imageUrl) url = Common.AddUrlRandom(imageUrl);
        else {
            url = Common.AddUrlRandom("/userCenter/kaptcha.jpg");
            if (EnvConfig.Env === "local") url = "//test-m.xxd.com" + url;
        }

        this.setState({ VerifyUrl: url })
    }

    render() {
        const { Property } = this.props
        const { VerifyUrl } = this.state;

        const className = this.EventActions.GetClassName(Property.DivClassName);

        return (
            <div className={className}>
                <TextBox Property={Property} View={this.View} EventActions={this.EventActions} />
                <img src={VerifyUrl} onClick={this.RefreshVerifyUrl.bind(this)} alt="" />
            </div>
        )
    }
}