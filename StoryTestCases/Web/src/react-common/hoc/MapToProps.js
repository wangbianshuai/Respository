import React, { Component } from "react";
import { Page } from "UtilsCommon";

export default (setProps) => (WrapComponent) => class MapToProps extends Component {
    constructor(props) {
        super(props);

        this.Page = Page.Current;
        this.Init();
        this.MapProps = setProps(this, Page);
    }

    Init() {
        const { Page } = this;
        this.DispatchAction = Page.Invoke("RootPage", "DispatchAction");
        this.GetStateValue = Page.Invoke("RootPage", "GetStateValue");
        this.SetModalDialog = Page.Invoke("RootPage", "SetModalDialog");
    }

    render() {
        return <WrapComponent  {...this.props} {...this.MapProps} />
    }
}
