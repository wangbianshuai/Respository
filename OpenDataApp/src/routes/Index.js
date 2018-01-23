import React, { Component } from "react"
import { connect } from "dva"
import { Toast } from "antd-mobile"
import * as Common from "../utils/Common"

class Index extends Component {
    constructor(props) {
        super(props)

        this.QueryString = Common.GetQueryString()
        this.EntityName = Common.GetObjValue(this.QueryString, "Page", "Index")
        this.GetPageConfig()
    }

    GetPageConfig() {
        
    }

    componentDidMount() {

    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.Loading) Toast.loading("加载中……", 0)
        else if (nextProps.Loading === false) Toast.hide()

    }

    componentWillUnmount() {

    }

    SetResponseMessage(d) {
        if (d && !d.IsSuccess && d.Message) { Toast.fail(d.Message); return true; }

        return false
    }

    JudgeChanged(nextProps, name) {
        return nextProps[name] !== undefined && nextProps[name] !== this.props[name]
    }

    render() {
        return null
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