import React, { Component } from "react"
import { Text } from "react-native"

export default class SpanText extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (<Text style={this.props.style}>{this.props.children}</Text>)
    }
}