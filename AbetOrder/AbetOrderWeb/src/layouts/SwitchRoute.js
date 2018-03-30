import React, { Component } from "react"
import { Switch, Route } from "dva/router";
import IndexPage from "../routes/Index";

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

    render() {
        return (<Switch>
            {
                this.props.MenuList.map(m => (
                    <Route path={"/" + m.PageName} exact component={() => <IndexPage App={this.props.App} PageName={m.PageName} Id={m.Id} />} key={m.Id} />
                ))
            }
        </Switch>)
    }
}