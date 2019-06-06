import React, { Component } from "react"
import { Modal } from "antd-mobile"

export default class ModalDialog extends Component {
    constructor(props) {
        super(props)

        this.state = { Visible: props.Property.Visible };
        props.Property.SetVisible = (v) => this.setState({ Visible: v });
        props.Property.SetLoading = this.SetLoading.bind(this);
        props.Property.IsDialog = true;
    }

    Ok() {
        if (this.Loading) return;
        if (this.props.Property.OnOk) this.props.Property.OnOk(this.props.Property);
        else this.Cancel();
    }

    SetLoading(loading) {
        this.Loading = loading;
    }

    Cancel() {
        this.setState({ Visible: false });
        if (this.props.Property.OnCancel) this.props.Property.OnCancel();
    }

    render() {
        if (!this.props.Property) return null;

        const { Title, GetComponent, Component, Style, MaskClosable, ClassName } = this.props.Property;

        const maskClosable = MaskClosable === undefined ? false : MaskClosable;

        return (
            <Modal title={Title} visible={this.state.Visible} className={ClassName}
                transparent={true} style={Style}
                maskClosable={maskClosable}
                onClose={this.Cancel.bind(this)}
                footer={this.RenderFooter()} >
                {Component || GetComponent()}
            </Modal>
        )

    }

    RenderFooter() {
        const { OkText } = this.props.Property;

        const okText = OkText ? OkText : "确定"

        return [{ text: '取消', onPress: this.Cancel.bind(this) }, { text: okText, onPress: this.Ok.bind(this) }];
    }
}