import React, { Component } from "react"
import { Common } from "UtilsCommon";
import PropertyItem from "./PropertyItem";
import { Card, Flex } from "antd-mobile";

export default class View extends Component {
    constructor(props) {
        super(props)

        this.Id = Common.CreateGuid()
        this.state = { IsVisible: true }
        props.Property.SetVisible = this.SetVisible.bind(this);
    }

    SetVisible(v) {
        this.setState({ IsVisible: v })
    }

    componentDidMount() {
        if (this.props.Property.EventActionName) {
            this.props.EventActions.InvokeAction(this.props.Property.EventActionName, this.props);
        }
    }

    GetReactComponent(p) {
        const { Property, EventActions } = this.props;

        const props = { Property: p, View: Property, EventActions, key: p.Id }

        const itemProps = p.ItemProps || {}
        if (Property.IsFlex) return <Flex.Item {...itemProps} key={p.Id}><PropertyItem {...props} /></Flex.Item>
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

        // let className = Property.ClassName;
        // if (className && styles[className]) className = styles[className];
        // if (typeof className === "string") className = this.props.EventActions.GetClassName(className);

        const flexProps = Property.FlexProps || {}

        if (Property.IsFlex) return <Flex className={Property.ClassName} style={Property.Style} {...flexProps}>{this.RenderProperties()}</Flex>
        if (Property.IsDiv) return <div className={Property.ClassName} style={Property.Style}>{this.RenderProperties()}</div>
        return this.RenderProperties();
    }
}
