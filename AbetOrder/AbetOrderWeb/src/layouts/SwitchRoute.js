import React, { Component } from "react"
import { Switch, Route } from "dva/router";
import IndexPage from "../routes/Index";
import * as Common from "../utils/Common";

export default class SwitchRoute extends Component {
    constructor(props) {
        super(props)

        this.Name = "SwitchRoute";
    }

    shouldComponentUpdate(nextProps, nextState) {
        let blChangedProps = false;

        for (let key in nextProps) {
            if (nextProps[key] !== undefined) {
                if (this.props[key] !== nextProps[key]) { blChangedProps = true; break; }
            }
        }

        return blChangedProps;
    }

    SetCurrentPageId() {
        const menu = Common.ArrayFirst(this.props.MenuList, (f) => f.PageName === this.props.PageName);
        if (menu !== null) menu.PageId = Common.CreateGuid();
    }

    render() {
        this.SetCurrentPageId();
        return (<Switch>
            {
                this.props.MenuList.map(m => (
                    <Route path={"/" + m.PageName} exact component={() => <IndexPage App={this.props.App} PageName={m.PageName} PageId={m.PageId} />} key={m.Id} />
                ))
            }
        </Switch>)
    }
}