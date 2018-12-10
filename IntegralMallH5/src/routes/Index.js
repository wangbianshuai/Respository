import { Component } from "react"
import { Toast, Modal } from "antd-mobile"
import * as Common from "../utils/Common"
import { routerRedux } from 'dva/router';

export default class Index extends Component {
    constructor(props) {
        super(props)

        this.state = {};

        this.Id = Common.CreateGuid();
    }

    static MapDispatchToProps(dispatch) {
        return {
            Dispatch(type, payload, isloading) { dispatch({ type: type, payload: payload, isloading: isloading }) },
            ToPage(url) { dispatch(routerRedux.push(url)) },//js页面跳转
            GoBack() { dispatch(routerRedux.goBack()) }//js页面返回上一页
        }
    }

    JudgeLogin() {
        if (this.EntityName !== "HomePage" && !(this.props.UserInfo && this.props.UserInfo.UserId)) { this.props.ToPage("/HomePage"); return; }
        return true;
    }

    Dispatch(name, actionName, payload) {
        let isloading = true;

        const action = this.GetModelAction(name, actionName);
        if (action !== null) {
            if (action.IsOperation) this.SetActionState(name, actionName);
            else isloading = !(this.props[action.StateName] !== undefined && this.props[action.StateName].IsSuccess !== false)
        }

        this.props.Dispatch(name + "/" + actionName, payload, isloading)
    }

    SetActionState(name, actionName, payload) {
        this.props.Dispatch(name + "/Set_" + actionName, payload)
    }

    componentWillReceiveProps2(nextProps) {
        this.SetLoading(nextProps)
        this.PropsChanged(nextProps)
    }

    PropsChanged(nextProps) {
    }

    SetLoading(nextProps) {
        if (nextProps.Loading) Toast.loading("加载中……", 0)
        else if (nextProps.Loading === false) Toast.hide()
    }

    SetResponseMessage(d, stateName) {
        if (d && d.IsSuccess === false && d.Message) {
            this.ShowMessage(d.Message);
            return true;
        }

        if (d && d.IsLogin === false) { this.props.ToPage("/HomePage"); return true; }

        return false
    }

    ShowConfirm(msg, onOk) {
        Modal.alert({
            title: "确认信息",
            content: msg,
            onOk: onOk
        });
    }

    ShowMessage(msg) {
        Toast.fail(msg, 3)
    }

    ShowSuccess(msg) {
        Modal.alert({
            title: "成功信息",
            content: msg,
            okText: "确定"
        })
    }

    ShowModalMessage(msg) {
        Modal.alert({
            title: "提示信息",
            content: msg,
            okText: "确定"
        });
    }

    GetModelAction(name, actionName) {
        const model = Common.ArrayFirst(this.props.App._models, f => f.namespace === name);
        if (model && model.actions) return Common.ArrayFirst(model.actions, f => f.ActionName === actionName);
        return null;
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        return { ReceivePropsId: Common.CreateGuid() };
    }

    shouldComponentUpdate(nextProps, nextState) {
        nextState.ReceivePropsId !== this.state.ReceivePropsId && this.componentWillReceiveProps2(nextProps);

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
}