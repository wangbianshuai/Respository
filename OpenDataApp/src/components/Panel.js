import React, { Component } from "react"
import * as Common from "../utils/Common"
import Index from "./Index"

export default class Panel extends Index {
    constructor(props) {
        super(props)

        this.RootType = "div"
        this.RootClassName = "DivPanel"
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
        return React.createElement(this.RootType, { className: this.RootClassName }, this.Children)
    }
}