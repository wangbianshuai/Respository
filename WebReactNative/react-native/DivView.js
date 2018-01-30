import React, { Component } from "react"
import { View } from "react-native"

export default class DivView extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (<View style={this.props.style}>{this.props.children}</View>)
    }
}