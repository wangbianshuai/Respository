import React from "react";
import { Card } from "antd";
import PropertyItem from "./PropertyItem";
import BaseIndex from "./BaseIndex";

export default class Card2 extends BaseIndex {
    constructor(props) {
        super(props);

        this.Name = "Card";
    }

    render() {
        if (!this.state.IsVisible) return null;

        const { Property, PageAxis } = this.props;
        const bordered = !!Property.Bordered;
        const headStyle = Property.HeadStyle || { padding: 0, margin: 0, paddingLeft: 16 };
        const bodyStyle = Property.BodyStyle || { padding: 16, margin: 0 };
        const size = Property.Size || "default";

        return (
            <Card title={Property.Title} size={size} bordered={bordered} headStyle={headStyle} bodyStyle={bodyStyle}>
                {Property.Properties.map(m => <PropertyItem Property={m} View={Property} key={m.Id} PageAxis={PageAxis} />)}
            </Card>
        )

    }
}