import React, { Component } from "react"
import { Common } from "UtilsCommon";
import Components from "Components";
import { Card, Flex } from "antd-mobile";
import styles from "../styles/View.scss";

const PropertyItem = Components.PropertyItem;

export default class PageView1 extends Component {
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

        const props = { Property: p, View: Property, EventActions, key: p.Id }

        return <PropertyItem {...props} />
    }

    RenderProperties() {
        return this.props.Property.Properties.map(m => this.GetReactComponent(m))
    }

    render() {
        if (!this.state.IsVisible) return null;

        const { Property, EventActions } = this.props;

        if (Property.Title) {
            return (
                <Card title={Common.ReplaceDataContent(EventActions.PageData, Property.Title)} style={Property.Style} bordered={false} headStyle={{ padding: 0, margin: 0, paddingLeft: 16 }} bodyStyle={{ padding: 16, margin: 0 }}>
                    {this.RenderProperties()}
                </Card>
            )
        }

        let className = Property.ClassName;
        if (className && styles[className]) className = styles[className];

        if (Property.IsFlex) return <Flex className={className} style={Property.Style}>{this.RenderProperties()}</Flex>
        if (Property.IsDiv) return <div className={className} style={Property.Style}>{this.RenderProperties()}</div>
        return this.RenderProperties();
    }
}
