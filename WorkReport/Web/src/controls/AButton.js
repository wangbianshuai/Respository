import React from "react"
import BaseIndex from "./BaseIndex"

export default class AButton extends BaseIndex {
    constructor(props) {
        super(props)

        this.Name = "AButton";
    }

    ClickAction() {
        this.EventActions.InvokeAction(this.Property.EventActionName, this.props);
    }

    render() {
        const { Property, DataText, Href } = this.props
        let text = DataText;
        text = text || (Property.Label || Property.Text)

        return (<a onClick={this.ClickAction.bind(this)} href={Href}>{text}</a>)
    }
}