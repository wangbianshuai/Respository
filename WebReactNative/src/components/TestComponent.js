import React, { Component } from "react"
import DivView from "../web-react-native/DivView"
import SpanText from "../web-react-native/SpanText"

export default class TestComponent extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return <DivView><SpanText>测试</SpanText></DivView>
    }
}