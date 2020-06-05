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
        const { Label, Text, DataText, Href, Style } = this.props.Property
        let text = DataText;
        text = text || (Label || Text)
        
        return (<a onClick={this.ClickAction.bind(this)} style={Style} href={Href}>{text}</a>)
    }
}