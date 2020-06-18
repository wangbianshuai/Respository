import React, { Component } from "react"
import { Common } from "UtilsCommon";
import PropertyItem from "./PropertyItem";
import { Tabs, Icon } from "antd";
import styles from "../styles/view.css";

export default class Tabs2 extends Component {
    constructor(props) {
        super(props)

        this.id = Common.createGuid()
        this.state = { isVisible: true }
        props.property.setVisible = this.setVisible.bind(this);
    }

    setVisible(v) {
        this.setState({ isVisible: v })
    }

    getReactComponent(p) {
        const { property, pageAxis } = this.props;

        p.TabPaneId = p.TabPaneId || Common.createGuid();

        const props = { property: p, view: property, pageAxis, key: p.id }

        let tab = p.TabLabel;
        if (p.TabIcon) tab = <React.Fragment><Icon type={p.TabIcon} /><span>{tab}</span></React.Fragment>
        return <Tabs.TabPane tab={tab} key={p.TabPaneId}><PropertyItem {...props} /></Tabs.TabPane>
    }

    RenderProperties() {
        return this.props.property.Properties.map(m => this.getReactComponent(m))
    }

    render() {
        if (!this.state.isVisible) return null;

        const { property } = this.props;

        let className = property.ClassName;
        if (className && styles[className]) className = styles[className];

        return (
            <Tabs className={className} style={property.style} tabBarStyle={property.TabBarStyle}>
                {this.RenderProperties()}
            </Tabs>
        )
    }
}