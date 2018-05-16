import React from "react"
import * as Common from "../utils/Common"
import Index from "./Index"
import { Flex } from "antd-mobile"

export default class PropertyItem extends Index {
    constructor(props) {
        super(props)

        this.Name = "PropertyItem";
    }

    render() {
        const { Property } = this.props

        const labelCol = Property.LabelCol || 6;
        const wrapperCol = Property.WrapperCol || 18;

        if (Common.IsNullOrEmpty(Property.Label)) {
            return (<Flex>{this.GetReactComponent(Property)}</Flex>)
        }
        else {
            return (<Flex label={Property.Label}
                labelCol={{ span: labelCol }} required={Property.IsEdit && !Property.IsNullable}
                wrapperCol={{ span: wrapperCol }} >{this.GetReactComponent(Property)}</Flex>)
        }
    }
}