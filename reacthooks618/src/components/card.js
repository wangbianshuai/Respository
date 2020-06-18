import React from "react";
import { Card } from "antd";
import PropertyItem from "./PropertyItem";
import BaseIndex from "./BaseIndex";

export default class Card2 extends BaseIndex {
    constructor(props) {
        super(props);

        this.name = "Card";
    }

    render() {
        if (!this.state.isVisible) return null;

        const { property, pageAxis } = this.props;
        const bordered = !!property.Bordered;
        const headStyle = property.HeadStyle || { padding: 0, margin: 0, paddingLeft: 16 };
        const bodyStyle = property.BodyStyle || { padding: 16, margin: 0 };
        const size = property.Size || "default";

        return (
            <Card title={property.Title} size={size} bordered={bordered} headStyle={headStyle} bodyStyle={bodyStyle}>
                {property.Properties.map(m => <PropertyItem property={m} view={property} key={m.id} pageAxis={pageAxis} />)}
            </Card>
        )

    }
}