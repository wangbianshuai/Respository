import React from "react";
import { Common, Page } from "UtilsCommon";
import { BaseIndex } from "ReactCommon";
import Actions from "Actions";
import ModalDialog from "../common/ModalDialog";
import ComponentList from "../ComponentList";
import { message } from "antd"

export default (WrapComponent) => class RootPage extends BaseIndex {
    constructor(props) {
        super(props);

        this.Name = "RootPage";

        this.Init()
    }

    Init() {
        this.Page = new Page();

        this.Page.Init();
        this.Page.InitInstance(this.Name, this.Invoke());
        this.Page.InitInvoke("Dialogs", (obj) => this.AddDialog = obj.Invoke("Add"));

        this.StateActionTypes = {};
        Actions.InitDvaActions(this.InitDvaActions());
    }

    InitDvaActions() {
        return {
            Dispatch: this.Dispatch.bind(this),
            DispatchAction: this.DispatchAction.bind(this),
            SetActionState: this.SetActionState.bind(this),
            SetStateActionTypes: this.SetStateActionTypes.bind(this)
        }
    }

    SetStateActionTypes(stateActionTypes) {
        for (var key in stateActionTypes) {
            if (!this.StateActionTypes[key]) this.StateActionTypes[key] = stateActionTypes[key];
            else this.SetStateActionTypes[key] = this.StateActionTypes[key].concat(stateActionTypes[key])
        }
    }

    componentDidMount() {
        this.InitProps();
    }

    SetLoading(nextProps) {
        if (nextProps.Loading) message.loading("加载中……", 0)
        else if (nextProps.Loading === false) message.destroy()
    }

    shouldComponentUpdate(nextProps, nextState) {
        //设置加载中显示
        if (nextProps.Loading !== this.props.Loading) this.SetLoading(nextProps);

        let blChangedProps = false;

        for (let key in nextProps) {
            if (nextProps[key] !== undefined && !Common.IsFunction(nextProps[key]) && this.props[key] !== nextProps[key]) {
                blChangedProps = true;

                if (this.SetResponseMessage(nextProps[key], key)) blChangedProps = false;

                if (blChangedProps) break;
            }
        }

        if (blChangedProps) this.componentWillReceiveProps2(nextProps);

        return blChangedProps;
    }

    SetResponseMessage(d, stateName) {
        var data = d.Data ? d.Data : d;
        if (Common.IsArray(data) && data.length > 0) data = data[0];
        if (data && data.IsReLogin && data.IsSuccess === false && !this.IsLoginPage()) {
            this.ToLogin();
            return true;
        }

        if (d && !d.Action && d && d.IsSuccess === false && d.Message) {
            this.ShowMessage(d.Message);
            return true;
        }

        return false
    }

    IsLoginPage() {
        const { location: { pathname } } = this.props;
        let name = pathname.toLowerCase().replace(".html", "");
        return name === '/login';
    }

    componentWillReceiveProps2(nextProps) {
        for (let key in nextProps) {
            if (nextProps[key] !== this.props[key]) this.ReceiveActionData(key, nextProps[key]);
        }
    }

    InitProps() {
        for (let key in this.props) {
            this.ReceiveActionData(key, this.props[key]);
        }
    }

    ReceiveActionData(key, data) {
        if (!data) return;
        try {
            if (data.Action && data.Action.ActionType > 0) Actions.Dispatch(data.Action.ActionType, data);
            else if (this.StateActionTypes[key]) this.StateActionTypes[key].forEach(a => Actions.Dispatch(a, data));
        }
        catch (err) {
            console.warn("react-common/hoc/RootPage/ReceiveActionData", err);
            this.SetResponseMessage({ IsSuccess: false, Message: err.message });
        }
    }

    SetModalDialog(p) {
        this.AddDialog(<ModalDialog key={p.Id} Property={p} />);
    }

    render() {
        return (
            <React.Fragment>
                <WrapComponent Dispatch={this.props.Dispatch} PageData={this.props.location.PageData} />
                <ComponentList Page={this.Page} Name="Dialogs" />
            </React.Fragment>
        )
    }
}