import React, { useMemo, useEffect } from "react";
import { Common, Page, EnvConfig } from "UtilsCommon";
import Actions from "Actions";
import ModalDialog from "../common/ModalDialog";
import ComponentList from "../ComponentList";
import { message } from "antd";
import useDvaData from "../useHooks/useDvaData";
import router from 'umi/router';

const Token = Common.GetCookie("Token");

export default (WrapComponent, mapStateToProps) => props => {
    const [dispatch, dispatchAction, setActionState, state] = useDvaData(mapStateToProps, Token);

    const obj = useMemo(() => { return { Name: "RootPage" } }, []);

    Init(obj, dispatch, dispatchAction, setActionState)

    useEffect(() => {
        if (obj.state === undefined) InitProps(state, obj.StateActionTypes);
        else ShouldComponentUpdate(state, obj.state, props, obj.StateActionTypes);
        obj.state = state;

        !EnvConfig.IsProd && console.log(state);
    }, [state, obj, props])

    return (
        <React.Fragment>
            <WrapComponent PageData={props.location.PageData} DispatchAction={dispatchAction} Dispatch={dispatch} SetActionState={setActionState} />
            <ComponentList Page={obj.Page} Name="Dialogs" />
        </React.Fragment>
    )
}

function Init(obj, dispatch, dispatchAction, setActionState) {
    if (!obj.IsInit) obj.IsInit = true; else return;

    obj.Page = new Page();

    obj.Functions = { Dispatch: dispatch, DispatchAction: dispatchAction, SetActionState: setActionState, ToLogin }
    obj.Invoke = () => (name) => obj.Functions[name] || function () { };

    obj.Page.Init();
    obj.Page.InitInstance(obj.Name, obj.Invoke());
    obj.Page.InitInvoke("Dialogs", (instance) => obj.AddDialog = instance.Invoke("Add"));
    obj.Functions.SetModalDialog = SetModalDialog(obj)

    obj.StateActionTypes = {};
    Actions.InitDvaActions(InitDvaActions(obj, dispatch, dispatchAction, setActionState));

    return obj;
}

function SetModalDialog(obj) {
    return (p) => {
        obj.AddDialog(<ModalDialog key={p.Id} Property={p} />);
    }
}

function InitDvaActions(obj, dispatch, dispatchAction, setActionState) {
    return {
        Dispatch: dispatch,
        DispatchAction: dispatchAction,
        SetActionState: setActionState,
        SetStateActionTypes: SetStateActionTypes(obj)
    }
}

function SetStateActionTypes(obj) {
    return (stateActionTypes) => {
        for (var key in stateActionTypes) {
            if (!obj.StateActionTypes[key]) obj.StateActionTypes[key] = stateActionTypes[key];
            else obj.SetStateActionTypes[key] = obj.StateActionTypes[key].concat(stateActionTypes[key])
        }
    }
}

function SetLoading(nextState) {
    if (nextState.Loading) message.loading("加载中……", 0)
    else if (nextState.Loading === false) message.destroy()
}

function IsLoginPage(props) {
    const { location: { pathname } } = props;
    let name = pathname.toLowerCase().replace(".html", "");
    return name === '/login';
}

function ShouldComponentUpdate(nextState, state, props, stateActionTypes) {
    //Show while loading
    if (nextState.Loading !== state.Loading) SetLoading(nextState);

    let blChangedProps = false;

    for (let key in nextState) {
        if (nextState[key] !== undefined && !Common.IsFunction(nextState[key]) && state[key] !== nextState[key]) {
            blChangedProps = true;
            
            if (SetResponseMessage(nextState[key], props)) blChangedProps = false;

            if (blChangedProps) break;
        }
    }

    if (blChangedProps) ComponentWillReceiveProps2(nextState, stateActionTypes);

    return blChangedProps;
}

function SetResponseMessage(d, props) {
    var data = d.Data ? d.Data : d;
    if (Common.IsArray(data) && data.length > 0) data = data[0];
    if (data && data.IsReLogin && data.IsSuccess === false && !IsLoginPage(props)) {
        ToLogin();
        return true;
    }

    if (d && !d.Action && d && d.IsSuccess === false && d.Message) {
        ShowMessage(d.Message);
        return true;
    }

    return false
}

function ToLogin() {
    router.push("/login")
}

function ShowMessage(msg) {
    message.warning(msg, 3)
}

function ComponentWillReceiveProps2(nextState, state, stateActionTypes) {
    for (let key in nextState) {
        if (nextState[key] !== state[key]) ReceiveActionData(key, nextState[key], stateActionTypes);
    }
}

function InitProps(state, stateActionTypes) {
    for (let key in state) {
        ReceiveActionData(key, state[key], stateActionTypes);
    }
}

function ReceiveActionData(key, data, stateActionTypes) {
    if (!data) return;
    try {
        if (data.Action && data.Action.ActionType > 0) Actions.Dispatch(data.Action.ActionType, data);
        else if (stateActionTypes[key]) stateActionTypes[key].forEach(a => Actions.Dispatch(a, data));
    }
    catch (err) {
        SetResponseMessage({ IsSuccess: false, Message: err.message });
    }
}
