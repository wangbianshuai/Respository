import React, { Component } from "react"
import { connect } from "dva"
import { Toast } from "antd-mobile"
import * as Common from "../utils/Common"
import IndexModel from "../models/Index"
import Panel from "../components/Panel"
import PageAction from "../actions/Page"
import EntityListPage from "../templates/EntityListPage"
import QueryAction from "../actions/Query"

class Index extends Component {
    constructor(props) {
        super(props)

        props.InitConfigState()

        this.QueryString = Common.GetQueryString()
        this.PageName = Common.GetObjValue(this.QueryString, "Page", "UserList")
        this.EventActions = {};
        this.IsPageLoad = false;
        this.InitActions();
    }

    //初始化行为
    InitActions() {
        //页面通用行为
        this.EventActions.Page = new PageAction({ Page: this })
        //查询行为
        this.EventActions.Query = new QueryAction({ Page: this });
    }

    GetPageConfig() {
        const url = Common.ConfigApiUrl + this.PageName
        this.props.Dispatch("Config/GetConfig", { Url: url })
    }

    Dispatch(action, payload) {
        this.props.Dispatch(this.props.PageConfig.EntityName + "/" + action.ActionName, payload)
    }

    GetAction(actionName) {
        var list = this.props.PageConfig.ActionList.filter(f => f.ActionName === actionName)
        return list.length > 0 ? list[0] : null
    }

    componentDidMount() {
        this.GetPageConfig()
    }

    componentWillReceiveProps(nextProps) {
        this.SetLoading(nextProps)
        this.SetPageConfig(nextProps)
        this.PropsChanged(nextProps)
    }

    PropsChanged(nextProps) {
        for (let a in this.EventActions) this.EventActions[a].PropsChanged && this.EventActions[a].PropsChanged(this.props, nextProps);
    }

    SetLoading(nextProps) {
        if (nextProps.Loading) Toast.loading("加载中……", 0)
        else if (nextProps.Loading === false) Toast.hide()
    }

    SetPageConfig(nextProps) {
        if (this.JudgeChanged(nextProps, "PageConfig") && nextProps.PageConfig) {
            this.IsPageLoad = false
            this.InitPage(nextProps.PageConfig);
        }
    }

    InitPage(config) {
        if (Common.IsEmptyObject(config)) return
        config.EntityName && this.InitModels(config)

        config.ActionList && this.props.InitState(config.EntityName, config.ActionList)
    }

    InitModels(config) {
        if (this.props.App._models.filter(f => f.namespace === config.EntityName).length === 0) {
            this.props.App.model(Common.ToModels(new IndexModel(config)))
        }
    }

    //组件完成更新
    componentDidUpdate() {
        //初始化页面配置，即初始化页面,类似Page_Load
        if (this.props.PageConfig && !this.IsPageLoad) {
            this.IsPageLoad = true;
            this.PageLoad();
        }
    }

    //页页加载
    PageLoad() {
        const { PageConfig } = this.props;

        //加载初始调用事件行为
        if (PageConfig.EventActionList) {
            const list = PageConfig.EventActionList.filter(f => f.IsInitInvoke)
            list.forEach(a => this.EventActions[a.Type] && this.EventActions[a.Type][a.Name] && this.EventActions[a.Type][a.Name]());
        }
    }

    componentWillUnmount() {

    }

    SetResponseMessage(d) {
        if (d && !d.IsSuccess && d.Message) { Toast.fail(d.Message); return true; }

        return false
    }

    JudgeChanged(nextProps, name) {
        return nextProps[name] !== undefined && !Common.IsEquals(nextProps[name], this.props[name])
    }

    render() {
        if (Common.IsEmptyObject(this.props.PageConfig)) return null

        const props = { Page: this, Property: this.props.PageConfig }
        for (var key in this.props) if (key !== "PageConfig") props[key] = this.props[key]
       // return (<Panel {...props} />)
       return null;
    }
}

//初始化模板配置
function InitTemplateConfig(config) {
    if (!config || Common.IsNullOrEmpty(config.TemplateName)) return config

    switch (config.TemplateName) {
        case "EntityListPage": return EntityListPage(config)
        default: return config
    }
}

function mapStateToProps(state, ownProps) {
    const props = {}

    let pageConfig = null

    if (ownProps.PageConfig === undefined) {
        //pageConfig = InitTemplateConfig(state.Config.Data)
        props.PageConfig = state.Config.Data;
    }
    else pageConfig = ownProps.PageConfig

    if (pageConfig && pageConfig.ActionList && pageConfig.EntityName && state[pageConfig.EntityName]) {
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