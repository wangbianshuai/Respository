import React from "react"
import Index from "./Index"
import { Button } from "antd-mobile"

export default class Button2 extends Index {
    constructor(props) {
        super(props)

        this.state = {
            Disabled: false,
            IsVisible: this.Property.IsVisible !== false && this.Property.IsDataRight !== false
        };
    }

    ClickAction() {
        const { Page, Property, Params, ClickAction, View } = this.props
        if (ClickAction) ClickAction(Property, Params, View);
        else Page.InvokeAction(Property, Params, View);
    }

    render() {
        const { Property } = this.props
        const text = Property.Label || Property.Text

        if (!this.state.IsVisible) return null;

        return (<Button onClick={this.ClickAction.bind(this)}
            icon={Property.Icon}
            disabled={this.state.Disabled}
            style={Property.Style}
            type={Property.ButtonType}>{text}</Button>)
    }
}