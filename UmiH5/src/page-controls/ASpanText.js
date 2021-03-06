import React from "react"
import Controls from "Controls";
import styles from "../styles/View.scss"

export default class ASpanText extends Controls.BaseIndex {
    constructor(props) {
        super(props)

        this.Name = "ASpanText";
    }

    render() {
        if (!this.state.IsVisible) return null;

        const { Value, Text, ALabel, Style, ClassName, Href, Target } = this.props.Property;
        const text = Value || Text;

        let className = ClassName;
        if (className && styles[className]) className = styles[className];

        let label = null;

        if (ALabel) label = <label>{ALabel}</label>

        return (<span className={className} style={Style}><a href={Href} target={Target}>{text}</a>{label}</span>)
    }
}
