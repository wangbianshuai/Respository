import React from "react"
import BaseIndex from "./BaseIndex";
import styles from "../styles/View.scss"

export default class SpanText extends BaseIndex {
    constructor(props) {
        super(props)

        this.Name = "SpanText";
    }

    render() {
        if (!this.state.IsVisible) return null;

        const { Value, Text, Label, Style, ClassName } = this.props.Property;
        const text = Value || Text;

        let className = ClassName;
        if (className && styles[className]) className = styles[className];

        let label = null;

        if (Label) label = <label>{Label}</label>

        return (<span className={className} style={Style}>{text}{label}</span>)
    }
}
