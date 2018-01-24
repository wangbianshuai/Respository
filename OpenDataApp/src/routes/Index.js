import React, { Component } from "react"
import { connect } from "dva"
import { Toast } from "antd-mobile"
import * as Common from "../utils/Common"
import IndexModel from "../models/Index"
import Page from "../components/Page"

class Index extends Component {
    constructor(props) {
        super(props)

        props.InitConfigState()

        this.QueryString = Common.GetQueryString()
        this.PageName = Common.GetObjValue(this.QueryString, "Page", "UserList")
    }

    GetPageConfig() {
        const url = Common.ConfigApiUrl + this.PageName
        this.props.Dispatch("Config/GetConfig", { Url: url })
    }

    componentDidMount() {
        this.GetPageConfig()
    }

    componentWillReceiveProps(nextProps) {
        this.SetLoading(nextProps)
        this.SetPageConfig(nextProps)
    }

    SetLoading(nextProps) {
        if (nextProps.Loading) Toast.loading("加载中……", 0)
        else if (nextProps.Loading === false) Toast.hide()
    }

    SetPageConfig(nextProps) {
        if (this.JudgeChanged(nextProps, "PageConfig") && nextProps.PageConfig) {
            this.InitPage(nextProps.PageConfig)
        }
    }

    InitPage(config) {
        this.InitModels(config)

        config.ActionList && this.props.InitState(config.EntityName, config.ActionList)
    }

    InitModels(config) {
        if (this.props.App._models.filter(f => f.namespace === config.EntityName).length === 0) {
            this.props.App.model(Common.ToModels(new IndexModel(config)))
        }
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
        if (!this.props.PageConfig) return null
        return <Page {...this.props} />
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
        InitConfigState() { dispatch({ type: "Config/Set_GetConfig", payload: undefined }) },
        InitState(entityName, actionList) { actionList.forEach(a => dispatch({ type: `${entityName}/Set_${a.ActionName}`, payload: undefined })) },
        Dispatch(type, payload) { dispatch({ type: type, payload: payload }) }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Index)