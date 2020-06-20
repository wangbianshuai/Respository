import React, { useState } from "react";
import { Card } from "antd";
import PropertyItem from "./propertyItem";
import Base from './base';

export default (props) => {
    const { property, pageId } = Base.getProps(props);
    const [isVisible, setIsVisible] = useState(property.isVisible !== false);

   property.setVisible = (v) => setIsVisible(v);

    if (isVisible) return null;

    const bordered = !!property.bordered;
    const headStyle = property.headStyle || { padding: 0, margin: 0, paddingLeft: 16 };
    const bodyStyle = property.bodyStyle || { padding: 16, margin: 0 };
    const size = property.size || "default";

    return (
        <Card title={property.title} size={size} bordered={bordered} headStyle={headStyle} bodyStyle={bodyStyle}>
            {property.properties.map(m => <PropertyItem property={m} view={property} key={m.id} pageId={pageId} />)}
        </Card>
    )
}