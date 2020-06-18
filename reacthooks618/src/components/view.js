import React, { Component } from "react"
import { Common } from "UtilsCommon";
import PropertyItem from "./PropertyItem";
import { Card } from "antd";
import styles from "../styles/view.css";

export default class view extends Component {
    constructor(props) {
        super(props)

        this.id = Common.createGuid()
        this.state = { isVisible: props.property.isVisible !== false }
        props.property.setVisible = this.setVisible.bind(this);
        props.property.ReLoad= this.componentDidMount.bind(this);
    }

    setVisible(v) {
        this.setState({ isVisible: v })
    }

    componentDidMount() {
        const { property, pageAxis } = this.props;

        if (property.EventActionName) {
            pageAxis.InvokeAction(property.EventActionName, this.props);
        }
    }

    getReactComponent(p) {
        const { property, pageAxis } = this.props;

        const props = { property: p, view: property, pageAxis, key: p.id }

        return <PropertyItem {...props} />
    }

    RenderProperties() {
        return this.props.property.Properties.map(m => this.getReactComponent(m))
    }

    render() {
        if (!this.state.isVisible) return null;

        const { property, pageAxis } = this.props;

        if (property.Title) {
            return (
                <Card title={Common.replaceDataContent(pageAxis.PageData, property.Title)} style={property.style} bordered={false} headStyle={{ padding: 0, margin: 0, paddingLeft: 16 }} bodyStyle={{ padding: 16, margin: 0 }}>
                    {this.RenderProperties()}
                </Card>
            )
        }

        let className = property.ClassName;
        if (className && styles[className]) className = styles[className];

        if (property.isDiv) return <div className={className} style={property.style}>{this.RenderProperties()}</div>
        return this.RenderProperties();
    }
}