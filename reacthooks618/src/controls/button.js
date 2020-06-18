import React from "react"
import BaseIndex from "./BaseIndex"
import { Button } from "antd"

export default class Button2 extends BaseIndex {
    constructor(props) {
        super(props)

        this.state = {
            Disabled: this.property.Disabled === undefined ? false : this.property.Disabled,
            isVisible: this.property.isVisible !== false && this.property.isDataRight !== false,
            Loading: false,
            text: this.property.text,
            BututonType: this.property.ButtonType
        };

        this.property.setLoading = (loading) => this.setState({ Loading: loading });
        this.property.setTextType = (text, type) => this.setState({ text: text, BututonType: type || this.property.ButtonType });
    }

    ClickAction() {
        this.pageAxis.InvokeAction(this.property.EventActionName, this.props);
    }

    render() {
        if (!this.state.isVisible) return null;

        const { Loading, text, BututonType } = this.state;
        const { property } = this.props

        return (<Button onClick={this.ClickAction.bind(this)}
            icon={property.Icon}
            disabled={this.state.Disabled}
            style={property.style}
            shape={property.Shape}
            loading={Loading}
            size={property.Size}
            prefix={this.RenderPrefix()}
            type={BututonType}>{text}</Button>)
    }
}