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
        const { Property } = this.props;

        if (Common.IsNullOrEmpty(Property.Label)) {
            return (<Flex>{this.GetReactComponent(Property)}</Flex>)
        }
        else {
            return (<Flex>{this.GetReactComponent(Property)}</Flex>)
        }
    }
}