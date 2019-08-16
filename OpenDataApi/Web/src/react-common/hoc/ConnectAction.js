import React, { Component } from "react";
import Actions from "Actions";
import { Common } from "UtilsCommon";

export default (name, WrapComponent, options) => class ConnectAction extends Component {
    constructor(props) {
        super(props);

        this.state = { ActionData: {} };
        this.ActionData = {};

        this.Name = name;
        this.Id = Common.CreateGuid();
        Actions.InitAction(name, options);
        this.ActionName = options ? options.Name : name;
        Actions.Receive(this.ActionName, this.Id, this.Receive.bind(this));
    }

    Invoke(actionType, data) {
        try {
            Actions.Invoke(this.Id, actionType, data);
        }
        catch (err) {
            this.Receive(actionType, { IsSuccess: false, Message: err.message })
        }
    }

    Receive(actionType, data) {
        if (this.IsDestory) return;
        if (data && data.Action && data.Data) data = data.Data;
        const actionData = { ...this.ActionData };
        actionData[actionType] = data;
        this.ActionData = actionData;
        this.setState({ ActionData: actionData })
    }

    componentWillUnmount() {
        this.IsDestory = true;
        Actions.RemoveReceive(this.ActionName, this.Id);
    }

    render() {
        return <WrapComponent {...this.props} Invoke={this.Invoke.bind(this)} GetActionTypes={Actions.GetActionTypes} {...this.state.ActionData} />
    }
}
