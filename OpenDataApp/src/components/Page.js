import React, { Component } from "react";
import * as Common from "../utils/Common"
import Index from "./Index"

export default class Page extends Index {
    constructor(props) {
        super(props)

        this.RootType = "div"
        this.RootClassName = "DivPage"
        this.Children = []
    }

    componentDidMount() {
        const { PageConfig } = this.props

        PageConfig.Properties.forEach(p => {
            p.Id = p.Id || Common.CreateGuid()
            const c = this.GetReactComponent(p)
            if (c !== null) this.Children.push(c)
        })
    }

    componentWillReceiveProps(nextProps) {

    }

    render() {
        return React.createElement(this.RootType, { className: this.RootClassName }, this.Children)
    }
}