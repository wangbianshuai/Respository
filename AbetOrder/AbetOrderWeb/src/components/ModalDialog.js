import React from "react"
import Index from "./Index"
import { Modal, Button } from "antd"

export default class ModalDialog extends Index {
    constructor(props) {
        super(props)

        this.state = { Visible: props.Property.Visible }
    }

    componentWillMount() {
        this.props.Property.SetVisible = (v) => this.setState({ Visible: v });
    }

    Ok(e) {
        if (!this.OkProperty) {
            this.OkProperty.Element = e.target;
            this.OkProperty.SetDisabled = (disabled) => { this.OkProperty.Element.disabled = disabled }
        }
        if (this.props.Property.OnOk) this.props.Property.OnOk(e, this.OkProperty);
    }

    Cancel() {
        if (this.OkProperty && this.OkProperty.SetDisabled) this.OkProperty.SetDisabled(false);
        this.setState({ Visible: false });
        if (this.props.Property.OnCancel) this.props.Property.OnCancel();
    }

    render() {
        if (!this.props.Property) return null;

        const { IsOk, Title, Width, Component, OkText, Style } = this.props.Property;

        if (IsOk === false) {
            return (
                <Modal title={Title} visible={this.state.Visible} style={Style}
                    width={Width} onCancel={this.Cancel.bind(this)}
                    footer={this.RenderLookFooter()}>
                    {Component}
                </Modal>
            )
        }
        else {
            return (
                <Modal title={Title} visible={this.state.Visible} style={Style}
                    okText={OkText || "确定"} cancelText="取消" width={Width}
                    onOk={this.Ok.bind(this)} onCancel={this.Cancel.bind(this)} >
                    {Component}
                </Modal>
            )
        }
    }

    RenderLookFooter() {
        return (
            <div>
                <Button onClick={this.Cancel.bind(this)}>取消</Button>
            </div>
        )
    }
}