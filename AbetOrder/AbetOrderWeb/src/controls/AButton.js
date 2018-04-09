import React from "react"
import Index from "./Index"

export default class AButton extends Index {
    constructor(props) {
        super(props)

        this.Name = "AButton";
    }

    ClickAction() {
        const { Page, Property, Params, ClickAction } = this.props
        if (ClickAction) ClickAction(Property, Params);
        else Page.InvokeAction(Property, Params);
    }

    render() {
        const { Property } = this.props
        const text = Property.Label || Property.Text

        return (<a onClick={this.ClickAction.bind(this)}>{text}</a>)
    }
}