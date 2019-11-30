import React, { useMemo, useState } from "react"
import { Common } from "UtilsCommon";
import PropertyItem from "./PropertyItem";
import { Tabs, Icon } from "antd";
import styles from "../styles/View.css";
import BaseIndex from "./BaseIndex";

export default (props) => {
    const instance = useMemo(() => new Tabs2(), []);

    instance.Init2(props);

    instance.InitState("IsVisible", useState(true));

    return instance.render();
}

class Tabs2 extends BaseIndex {

    Init2(props) {
        if (this.Init(props)) return;

        this.Id = Common.CreateGuid()
        this.state = { IsVisible: true }
        props.Property.SetVisible = this.SetVisible.bind(this);
    }

    SetVisible(v) {
        this.setState({ IsVisible: v })
    }

    GetReactComponent(p) {
        const { Property, PageAxis } = this.props;

        p.TabPaneId = p.TabPaneId || Common.CreateGuid();

        const props = { Property: p, View: Property, PageAxis, key: p.Id }

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