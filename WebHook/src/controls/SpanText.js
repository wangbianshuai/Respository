import { useMemo, useState } from "react"
import BaseIndex from "./BaseIndex";
import styles from "../styles/View.css"
import { Common } from "UtilsCommon";

export default (props) => {
    const instance = useMemo(() => new SpanText(), []);

    instance.Init(props);

    instance.InitState("IsVisible", useState(instance.InitialState.IsVisible))

    return instance.render();
}

class SpanText extends BaseIndex {
    constructor(props) {
        super(props)

        this.Name = "SpanText";
    }

    render() {
        if (!this.state.IsVisible) return null;

        const { PageAxis } = this;
        const { Value, Text, Label, Style, ClassName } = this.props.Property;
        let text = Value || Text;

        text = Common.ReplaceDataContent(PageAxis.PageData, text);

        if (!Common.IsNullOrEmpty(this.state.Value)) text = this.state.Value;

        let className = ClassName;
        if (className && styles[className]) className = styles[className];

        let label = null;

        if (Label) label = <label>{Label}</label>

        return (<span className={className} style={Style}>{text}{label}</span>)
    }
}