import React, { Component } from 'react';
import { connect } from 'dva';
import * as Common from "../utils/Common"
import styles from '../styles/Index.css'
import { List, InputItem, WhiteSpace, WingBlank, Button, Toast, Flex } from "antd-mobile"
import BasePage from "./BasePage"

class Index extends BasePage {
    constructor(props) {
        super(props)

        this.state = {}
    }

    componentDidMount2() {
    }

    componentWillReceiveProps2(nextProps) {

    }

    RenderHtml() {
        return (<div></div>)
    }
}

function mapStateToProps(state) {
    return {
    }
}

function mapDispatchToProps(dispatch) {
    return {
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Index)