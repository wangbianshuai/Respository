import React from "react"
import Controls from "Controls";
import styles from "../styles/View.css"

export default class ASpanText extends Controls.BaseIndex {
    constructor(props) {
        super(props)

        this.Name = "ASpanText";
    }

    ClickAction() {
        if (!this.Property.EventActionName) return;
        this.PageAxis.InvokeEventAction(this.Property.EventActionName, this.props);
    }

    render() {
        if (!this.state.IsVisible) return null;

        const { Value, Text, ALabel, Style, ClassName, Href, Target } = this.props.Property;
        const text = Value || Text;

        let className = ClassName;
        if (className && styles[className]) className = styles[className];

        let label = null;

        if (ALabel) label = <label>{ALabel}</label>

        let rel = Target === "_blank" ? "noopener noreferrer" : undefined;

        return (<span className={className} style={Style}><a href={Href} target={Target} onClick={this.ClickAction.bind(this)} rel={rel}>{text}</a>{label}</span>)
    }
}