import React from "react"
import Controls from "Controls";
import styles from "../styles/View.css"

export default class AExpandCollapse extends Controls.BaseIndex {
    constructor(props) {
        super(props)

        this.Name = "AExpandCollapse";

        this.state = Object.assign({ Options: [], IsExpanded: this.Property.IsExpanded }, this.state);

        this.Property.SetExpanded = this.SetExpanded.bind(this);
    }

    SetExpanded(isExpanded) {
        this.Property.IsExpanded = isExpanded;
        this.EventActions.InvokeAction(this.Property.EventActionName, this.props);
        this.setState({ IsExpanded: isExpanded })
    }

    ClickAction() {
        if (!this.Property.EventActionName) return;
        this.Property.IsExpanded = !this.Property.IsExpanded
        this.EventActions.InvokeAction(this.Property.EventActionName, this.props);
        this.setState({ IsExpanded: !this.state.IsExpanded })
    }

    SetAllVisible() {
        if (!this.Property.AllPrpertyName || this.IsAllVisible) return;

        const allProperty = this.EventActions.GetView(this.Property.AllPrpertyName);
        if (allProperty != null) allProperty.SetVisible(true);

        this.IsAllVisible = true;
    }

    render() {
        if (!this.state.IsVisible) return null;

        const { ExpandLabel, CollapseLabel, Style, ClassName, } = this.props.Property;
        const text = this.state.IsExpanded ? CollapseLabel : ExpandLabel;

        if (this.state.Value) {
            let className = ClassName;
            const style = {}
            if (this.state.Value !== "未命中") style.color = "red";
            if (this.state.Value === "加载中……") style.color = "#999999";
            if (className && styles[className]) className = styles[className];
            return <span className={className} style={style}>{this.state.Value}</span>
        }

        this.SetAllVisible();

        return (<a href={"javascipt:void(0)"} style={Style} onClick={this.ClickAction.bind(this)}>{text}</a>)
    }
}