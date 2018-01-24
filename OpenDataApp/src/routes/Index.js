import React, { Component } from "react"
import { connect } from "dva"
import { Toast } from "antd-mobile"
import * as Common from "../utils/Common"

class Index extends Component {
    constructor(props) {
        super(props)

        this.QueryString = Common.GetQueryString()
        this.PageName = Common.GetObjValue(this.QueryString, "Page", "UserList")
        this.GetPageConfig()
    }

    GetPageConfig() {
        const url = Common.ConfigApiUrl + this.PageName
        this.props.Dispatch("Config/GetConfig", { Url: url })
    }

    componentDidMount() {
        const app = Common.App
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

function mapStateToProps(state, ownProps) {
    const props = {}

    let pageConfig = null

    if (ownProps.PageConfig === undefined) {
        pageConfig = state.Config.Data
        props.PageConfig = pageConfig;
    }
    else pageConfig = ownProps.PageConfig

    if (pageConfig && pageConfig.EntityName && state[pageConfig.EntityName]) {
        pageConfig.ActionList.forEach(a => props[a.StateName] = state[pageConfig.EntityName][a.StateName])
    }

    if (pageConfig && pageConfig.StateList) {
        pageConfig.StateList.forEach(s => {
            if (state[s.EntityName]) props[s.StateName] = state[s.EntityName][s.StateName]
        })
    }

    console.log(state)
    console.log(props)

    return props
}

function mapDispatchToProps(dispatch) {
    return {
        InitState(actionList) { actionList.forEach(a => dispatch({ type: `Set_${a.ActionName}`, payload: undefined })) },
        Dispatch(type, payload) { dispatch({ type: type, payload: payload }) }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Index)