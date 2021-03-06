import React, { Component } from "react"
import * as Common from "../utils/Common"

export default class Index extends Component {
    constructor(props) {
        super(props)

        this.Id = props.Id || Common.CreateGuid()
    }

    GetPropsValue(name) {
        return this.props[name] || this[name]
    }

    GetPropertyValue(name) {
        return this.props.Property[name] || this[name]
    }
}