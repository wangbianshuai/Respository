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

        this.Property.ControlType = "password";
        this.state = { IsVisibleEye: false }
    }

    SetEyeVisible() {
        const visible = !this.state.IsVisibleEye;
        const type = visible ? "text" : "password";
        this.setState({ IsVisibleEye: visible }, () => this.Property.SetControlType(type))
    }

    GetImageUrl(name) {
        return require(`../assets/${name}`);
    }

    render() {
        const { Property, View } = this.props;
        const { IsVisibleEye } = this.state;

        const closeEyeStyle = {};
        const openEyeStyle = {}
        if (IsVisibleEye) closeEyeStyle.display = "none";
        else openEyeStyle.display = "none";

        const className = this.EventActions.GetClassName(Property.DivClassName);
        const img1 = this.EventActions.GetClassName("img1");
        const img2 = this.EventActions.GetClassName("img2");
        const EyeButton = this.EventActions.GetClassName("EyeButton");
        
        return (
            <div className={className}>
                <TextBox Property={Property} View={View} EventActions={this.EventActions} />
                <div className={EyeButton} onClick={this.SetEyeVisible.bind(this)}>
                    <img alt="" src={this.GetImageUrl("closeeye.png")} className={img1} style={closeEyeStyle} />
                    <img alt="" src={this.GetImageUrl("eye.png")} className={img2} style={openEyeStyle} />
                </div>
            </div>
        )
    }
}