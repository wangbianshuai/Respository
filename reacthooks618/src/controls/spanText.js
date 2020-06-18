import React from "react"
import BaseIndex from "./BaseIndex";
import styles from "../styles/view.css"
import { Common } from "UtilsCommon";

export default class SpanText extends BaseIndex {
    constructor(props) {
        super(props)

        this.name = "SpanText";
    }

    render() {
        if (!this.state.isVisible) return null;

        const { pageAxis } = this;
        const { Value, text, label, style, className } = this.props.property;
        let text2 = Value || text;

        text2 = Common.replaceDataContent(pageAxis.pageData, text);

        if (!Common.isNullOrEmpty(this.state.Value)) text2 = this.state.Value;

        let className = className;
        if (className && styles[className]) className = styles[className];

        let label2 = null;

        if (label) label2 = <label>{label}</label>

        return (<span className={className} style={style}>{text2}{label2}</span>)
    }
}