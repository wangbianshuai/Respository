import { useMemo, useState, useEffect } from "react"
import { Common } from "UtilsCommon";
import PropertyItem from "./PropertyItem";
import { Card } from "antd";
import styles from "../styles/View.css";
import BaseIndex from "./BaseIndex";

export default (props) => {
    const instance = useMemo(() => new View(), []);

    instance.Init2(props);

    instance.InitState("IsVisible", useState(props.Property.IsVisible !== false));

    useEffect(() => { instance.componentDidMount() }, [instance])

    return instance.render();
}

class View extends BaseIndex {

    Init2(props) {
        this.Init(props);

        this.Id = Common.CreateGuid()
        props.Property.SetVisible = this.SetVisible.bind(this);
        props.Property.ReLoad = this.componentDidMount.bind(this);
    }

    SetVisible(v) {
        this.setState({ IsVisible: v })
    }

    componentDidMount() {
        const { Property, PageAxis } = this.props;

        if (Property.EventActionName) {
            PageAxis.InvokeEventAction(Property.EventActionName, this.props);
        }
    }

    GetReactComponent(p) {
        const { Property, PageAxis } = this.props;

        const props = { Property: p, View: Property, PageAxis, key: p.Id }

        return <PropertyItem {...props} />
    }

    RenderProperties() {
        return this.props.Property.Properties.map(m => this.GetReactComponent(m))
    }

    render() {
        if (!this.state.IsVisible) return null;

        const { Property, PageAxis } = this.props;

        if (Property.Title) {
            return (
                <Card title={Common.ReplaceDataContent(PageAxis.PageData, Property.Title)} style={Property.Style} bordered={false} headStyle={{ padding: 0, margin: 0, paddingLeft: 16 }} bodyStyle={{ padding: 16, margin: 0 }}>
                    {this.RenderProperties()}
                </Card>
            )
        }

        let className = Property.ClassName;
        if (className && styles[className]) className = styles[className];

        if (Property.IsDiv) return <div className={className} style={Property.Style}>{this.RenderProperties()}</div>
        return this.RenderProperties();
    }
}