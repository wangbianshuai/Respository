import React, { useState } from "react"
import { Common } from "UtilsCommon";
import PropertyItem from "./propertyItem";
import { Tabs, Icon } from "antd";
import styles from "../styles/view.css";
import Base from './base';

const getReactComponent = (p, property, pageId) => {
    p.tabPaneId = p.tabPaneId || Common.createGuid();

    const props = { property: p, view: property, pageId, key: p.id };

    let tab = p.tabLabel;
    if (p.tabIcon) tab = <React.Fragment><Icon type={p.tabIcon} /><span>{tab}</span></React.Fragment>;
    return <Tabs.TabPane tab={tab} key={p.tabPaneId}><PropertyItem {...props} /></Tabs.TabPane>;
};

const renderProperties = (property, pageId) => {
    return property.properties.map(m => getReactComponent(m, property, pageId))
}

export default (props) => {
    const { property, pageId } = Base.getProps(props);
    const [isVisible, setIsVisible] = useState(property.isVisible !== false);

   property.setVisible = (v) => setIsVisible(v);

    if (!isVisible) return null;

    const className = Base.getClassName(property, styles);

    return (
        <Tabs className={className} style={property.style} tabBarStyle={property.tabBarStyle}>
            {renderProperties(property, pageId)}
        </Tabs>
    )
}