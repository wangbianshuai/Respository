import React, { Component } from "react"
import { Common } from "UtilsCommon";
import PropertyItem from "./PropertyItem";
import { Tabs, Icon } from "antd";
import styles from "../styles/View.css";

export default class Tabs2 extends Component {
    constructor(props) {
        super(props)

        this.Id = Common.CreateGuid()
        this.state = { IsVisible: true }
        props.Property.SetVisible = this.SetVisible.bind(this);
    }

    SetVisible(v) {
        this.setState({ IsVisible: v })
    }

    GetReactComponent(p) {
        const { Property, EventActions } = this.props;

        p.TabPaneId = p.TabPaneId || Common.CreateGuid();

        const props = { Property: p, View: Property, EventActions, key: p.Id }

        let tab = p.TabLabel;
        if (p.TabIcon) tab = <React.Fragment><Icon type={p.TabIcon} /><span>{tab}</span></React.Fragment>
        return <Tabs.TabPane tab={tab} key={p.TabPaneId}><PropertyItem {...props} /></Tabs.TabPane>
    }

    RenderProperties() {
        return this.props.Property.Properties.map(m => this.GetReactComponent(m))
    }

    render() {
        if (!this.state.IsVisible) return null;

        const { Property } = this.props;

        let className = Property.ClassName;
        if (className && styles[className]) className = styles[className];

        return (
            <Tabs className={className} style={Property.Style} tabBarStyle={Property.TabBarStyle}>
                {this.RenderProperties()}
            </Tabs>
        )
    }
}