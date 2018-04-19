import React, { Component } from "react"
import { connect } from "dva"
import { message, Modal } from "antd"
import * as Common from "../utils/Common"
import IndexModel from "../models/Index"
import Panel from "../components/Panel"
import PageAction from "../actions/Page"
import EntityListPage from "../templates/EntityListPage"
import EntityEditPage from "../templates/EntityEditPage";
import TabsEntityEditPage from "../templates/TabsEntityEditPage";
import QueryAction from "../actions/Query"
import EntityListPageLayout from "../layouts/EntityListPage"
import EntityEditPageLayout from "../layouts/EntityEditPage";
import TabsEntityEditPageLayout from "../layouts/TabsEntityEditPage";
import EntityEditAction from "../actions/EntityEdit"
import ComplexDataGridAction from "../actions/ComplexDataGrid"
import PageExpand from "../pages/Index"
import { routerRedux } from 'dva/router';

class Index extends Component {
    constructor(props) {
        super(props)

        this.Id = Common.CreateGuid();
    }

    componentWillMount() {
        this.props.InitConfigState()

        this.EventActions = {};
        this.ExpandActions = {};
        this.IsPageLoad = false;
        this.InitActions();

        this.QueryString = Common.GetQueryString();

        this.LoginUser = Common.JsonParse(Common.GetStorage("LoginUserInfo"));
        if (this.LoginUser === null) this.props.ToPage("/Login")
    }

    //初始化行为
    InitActions() {
        //页面通用行为
        this.EventActions.Page = new PageAction({ Page: this })
        //查询行为
        this.EventActions.Query = new QueryAction({ Page: this });
        //实体编辑行为
        this.EventActions.EntityEdit = new EntityEditAction({ Page: this });
        //复杂对象编辑行为
        this.EventActions.ComplexDataGrid = new ComplexDataGridAction({ Page: this });
    }

    InvokeAction(property, params, view) {
        if (property.ActionType === "ExpandPage" && this.ExpandActions[property.ActionName]) {
            this.ExpandActions[property.ActionName](property, params, view);
        }
        if (this.EventActions[property.ActionType] && this.EventActions[property.ActionType][property.ActionName]) {
            this.EventActions[property.ActionType][property.ActionName](property, params, view);
        }
    }

    GetPageConfig() {
        let url = Common.ConfigApiUrl + this.props.PageName
        if (Common.IsDist) url += ".json";

        this.props.Dispatch("Config/GetConfig", { Url: url })
    }

    Dispatch(action, payload) {
        this.props.Dispatch(this.props.PageConfig.Name + "/" + action.ActionName, payload)
    }

    SetActionState(action, payload) {
        this.props.Dispatch(this.props.PageConfig.Name + "/Set_" + action.ActionName, payload)
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
        if (Common.IsEmptyObject(this.props.PageConfig)) return;
        for (let a in this.EventActions) this.EventActions[a].PropsChanged && this.EventActions[a].PropsChanged(this.props, nextProps);

        this.ExpandPropsChanged && this.ExpandPropsChanged(this.props, nextProps);
    }

    SetLoading(nextProps) {
        if (nextProps.Loading) message.loading("加载中……", 0)
        else if (nextProps.Loading === false) message.destroy()
    }

    SetResponseMessage(d, stateName) {
        if (d && d.IsSuccess === false && d.Message) {
            let blModalMessage = false;

            if (this.props.PageConfig && this.props.PageConfig.ActionList) {
                let a = Common.ArrayFirst(this.props.PageConfig.ActionList, (f) => f.StateName === stateName);
                blModalMessage = a !== null && a.IsModalMessage
            }

            if (blModalMessage) this.ShowModalMessage(d.Message);
            else this.ShowMessage(d.Message);

            return true;
        }

        return false
    }

    ShowConfirm(msg, onOk) {
        Modal.confirm({
            title: "确认信息",
            content: msg,
            onOk: onOk
        });
    }

    ShowMessage(msg) {
        message.warning(msg, 3)
    }

    ShowSuccess(msg) {
        Modal.success({
            title: "成功信息",
            content: msg,
            okText: "确定"
        })
    }

    ShowModalMessage(msg) {
        Modal.warning({
            title: "提示信息",
            content: msg,
            okText: "确定"
        });
    }

    SetPageConfig(nextProps) {
        if (this.JudgeChanged(nextProps, "PageConfig") && nextProps.PageConfig) {
            this.IsPageLoad = false

            //扩展页面功能
            PageExpand(nextProps.PageConfig, this);

            this.InitPage(nextProps.PageConfig);
        }
    }

    InitPage(config) {
        if (Common.IsEmptyObject(config)) return
        config.Name && this.InitModels(config)

        config.ActionList && this.props.InitState(config.Name, config.ActionList)
    }

    InitModels(config) {
        if (this.props.App._models.filter(f => f.namespace === config.Name).length === 0) {
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
        if (PageConfig.InitEventActionList) {
            PageConfig.InitEventActionList.forEach(a => this.EventActions[a.Type] && this.EventActions[a.Type][a.Name] && this.EventActions[a.Type][a.Name](a.Property));
        }
    }

    componentWillUnmount() {
        this.props.InitConfigState();
        this.props.PageConfig && this.props.PageConfig.ActionList && this.props.InitState(this.props.PageConfig.Name, this.props.PageConfig.ActionList)
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (!this.IsPageLoad) return true;

        let blChangedProps = false;

        for (let key in nextProps) {
            if (nextProps[key] !== undefined) {
                if (this.props[key] !== nextProps[key]) {
                    blChangedProps = true;

                    if (this.SetResponseMessage(nextProps[key], key)) blChangedProps = false;

                    if (blChangedProps) break;
                }
            }
        }

        if (!blChangedProps) {
            for (let key in nextState) {
                if (this.state[key] !== nextState[key]) { blChangedProps = true; break; }
            }
        }

        return blChangedProps;
    }

    JudgeChanged(nextProps, name) {
        return nextProps[name] !== undefined && !Common.IsEquals(nextProps[name], this.props[name])
    }

    render() {
        if (Common.IsEmptyObject(this.props.PageConfig) || this.props.PageId !== this.props.PageConfig.PageId) return null;

        const props = { Page: this, Property: this.props.PageConfig }

        this.props.PageConfig.ActionList.forEach(a => props[a.StateName] = this.props[a.StateName])

        switch (this.props.PageConfig.Config.TemplateName) {
            case "EntityListPage": return (<EntityListPageLayout {...props} />)
            case "EntityEditPage": return (<EntityEditPageLayout {...props} />)
            case "TabsEntityEditPage": return (<TabsEntityEditPageLayout {...props} />)
            default: return (<Panel {...props} />)
        }
    }
}

//初始化模板配置
function InitTemplateConfig(config, pageId) {
    if (!config || Common.IsNullOrEmpty(config.TemplateName)) return config

    switch (config.TemplateName) {
        case "EntityListPage": return EntityListPage(config, pageId)
        case "EntityEditPage": return EntityEditPage(config, pageId)
        case "TabsEntityEditPage": return TabsEntityEditPage(config, pageId)
        default: return config
    }
}

function mapStateToProps(state, ownProps) {
    const props = {}

    if (state.Config.Data && state.Config.Data.Name !== ownProps.PageName) {
        props.PageConfig = undefined;
    }
    else {
        let pageConfig = InitTemplateConfig(state.Config.Data, ownProps.PageId);
        props.PageConfig = pageConfig;

        if (pageConfig && pageConfig.IsLoad) {
            if (pageConfig && pageConfig.ActionList && pageConfig.Name && state[pageConfig.Name]) {
                pageConfig.ActionList.forEach(a => props[a.StateName] = state[pageConfig.Name][a.StateName])
            }

            if (pageConfig && pageConfig.StateList) {
                pageConfig.StateList.forEach(s => {
                    if (state[s.Name]) props[s.StateName] = state[s.Name][s.StateName]
                })
            }
        }
        else if (pageConfig) pageConfig.IsLoad = true;
    }

    if (!Common.IsDist) { console.log(props); }

    return props
}

function mapDispatchToProps(dispatch) {
    return {
        InitConfigState() { dispatch({ type: "Config/Set_GetConfig", payload: undefined }) },
        InitState(entityName, actionList) { actionList.forEach(a => dispatch({ type: `${entityName}/Set_${a.ActionName}`, payload: undefined })) },
        Dispatch(type, payload) { dispatch({ type: type, payload: payload }) },
        ToPage(url) { url = Common.AddUrlRandom(url); dispatch(routerRedux.replace(url)) }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Index)