import React from "react"
import Index from "./Index"

export default class AButton extends Index {
    constructor(props) {
        super(props)

        this.Name = "AButton";
    }

    ClickAction() {
        const { Page, Property, Params, ClickAction, View } = this.props
        if (ClickAction) ClickAction(Property, Params, View);
        else Page.InvokeAction(Property, Params, View);
    }

    render() {
        const { Property } = this.props
        const text = Property.Label || Property.Text

        return (<a onClick={this.ClickAction.bind(this)}>{text}</a>)
    }
}