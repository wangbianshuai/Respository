import React, { Component } from "react"
import * as Common from "../utils/Common"
import Index from "./Index"
import { Flex } from "antd-mobile"

export default class Panel extends Index {
    constructor(props) {
        super(props)

        this.RootType = Flex
        this.Children = []
    }

    componentDidMount() {
        const { Property } = this.props

        Property.Properties.forEach(p => {
            p.Id = p.Id || Common.CreateGuid()
            const c = this.GetReactComponent(p)
            if (c !== null) this.Children.push(c)
        })
    }

    componentWillReceiveProps(nextProps) {

    }

    render() {
        return (<Flex><Flex.Item>{this.Children}</Flex.Item></Flex>)
    }
}