import React, { Component } from "react"
import * as Common from "../utils/Common"
import Index from "./Index"
import { NavBar, Icon } from "antd-mobile"

export default class NavBar2 extends Index {
    constructor(props) {
        super(props)

        this.Mode = "light"
        this.IsLeftIcon = true
    }

    GetLeftIcon() {
        const blLeftIcon = this.GetPropertyValue("IsLeftIcon")
        if (blLeftIcon) return (<Icon type="left" />)
        return null
    }

    GetRightContent() {
        return [<Icon key="0" type="ellipsis" />]
    }

    render() {
        const { Property } = this.props

        return (<NavBar mode={this.GetPropertyValue("Mode")} icon={this.GetLeftIcon()} rightContent={this.GetRightContent()}>{Property.Title}</NavBar>)
    }
}