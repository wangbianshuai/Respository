import React, { Component } from "react"
import * as Common from "../utils/Common"
import Index from "./Index"
import Panel from "./Panel"

export default class Page extends Index {
    constructor(props) {
        super(props)
    }

    componentDidMount() {

    }

    componentWillReceiveProps(nextProps) {

    }

    render() {
        return <Panel Property={this.props.PageConfig}  />
    }
}