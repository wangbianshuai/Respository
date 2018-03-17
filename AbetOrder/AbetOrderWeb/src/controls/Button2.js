import React, { Component } from "react"
import * as Common from "../utils/Common"
import Index from "./Index"
import { Button } from "antd"

export default class Button2 extends Index {
    constructor(props) {
        super(props)

        this.state = {
            Disabled: false
        };
    }

    ClickAction() {
        const { Page, Property, Params } = this.props
        Page.InvokeAction(Property, Params);
    }

    render() {
        const { Property } = this.props
        const text = Property.Label || Property.Text

        return (<Button onClick={this.ClickAction.bind(this)}
            icon={Property.Icon}
            disabled={this.state.Disabled}
            style={Property.Style}
            type={Property.ButtonType}>{text}</Button>)
    }
}