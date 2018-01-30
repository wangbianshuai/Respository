import React, { Component } from "react"

export default class SpanText extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (<span style={this.props.style}>{this.props.children}</span>)
    }
}