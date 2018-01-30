import React, { Component } from "react"

export default class DivView extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (<div style={this.props.style}>{this.props.children}</div>)
    }
}