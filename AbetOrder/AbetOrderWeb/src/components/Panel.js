import React, { Component } from "react"
import * as Common from "../utils/Common"
import Index from "./Index"

export default class Panel extends Index {
    constructor(props) {
        super(props)
    }

    render() {
        return (<div>{this.props.PageName}</div>)
    }
}