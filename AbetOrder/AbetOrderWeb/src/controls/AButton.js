import React, { Component } from "react"
import * as Common from "../utils/Common"
import Index from "./Index"

export default class AButton extends Index {
    constructor(props) {
        super(props)
    }

    ClickAction() {
        const { Page, Property, Params } = this.props
        Page.InvokeAction(Property, Params);
    }

    render() {
        const { Property } = this.props
        const text = Property.Label || Property.Text

        return (<a href="javascript:void(0);" onClick={this.ClickAction.bind(this)}>{text}</a>)
    }
}