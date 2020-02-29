import React, { Component } from "react"
import { Modal, Button } from "antd"

export default class ModalDialog extends Component {
    constructor(props) {
        super(props)

        this.state = { Visible: props.Property.Visible }
        this.OkProperty = {};

        this.Init();
    }

    Init() {
        this.props.Property.SetVisible = (v) => this.setState({ Visible: v });
    }

    Ok(e) {
        if (this.OkProperty.SetDisabled === undefined) {
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

        const { IsOk, Title, Width, OkText, BodyStyle } = this.props.Property;
        
        if (IsOk === false) {
            return (
                <Modal title={Title} visible={this.state.Visible} bodyStyle={BodyStyle}
                    width={Width} onCancel={this.Cancel.bind(this)}
                    footer={this.RenderLookFooter()}>
                    {this.RenderComponent()}
                </Modal>
            )
        }
        else {
            return (
                <Modal title={Title} visible={this.state.Visible} bodyStyle={BodyStyle}
                    okText={OkText || "确定"} cancelText="取消" width={Width}
                    onOk={this.Ok.bind(this)} onCancel={this.Cancel.bind(this)} >
                    {this.RenderComponent()}
                </Modal>
            )
        }
    }

    RenderComponent() {
        const { Component, Style } = this.props.Property;

        if (Style) return <div style={Style}>{Component}</div>
        else return Component;
    }

    RenderLookFooter() {
        return (
            <div>
                <Button onClick={this.Cancel.bind(this)}>取消</Button>
            </div>
        )
    }
}