import { Component } from "react"
import * as Common from "../utils/Common"

export default class Index extends Component {
    constructor(props) {
        super(props)

        this.Id = props.Id || Common.CreateGuid()
    }

    shouldComponentUpdate(nextProps, nextState) {
        let blChangedProps = false;

        for (let key in nextProps) {
            if (nextProps[key] !== undefined) {
                if (this.props[key] !== nextProps[key]) { blChangedProps = true; break; }
            }
        }

        if (!blChangedProps) {
            for (let key in nextState) {
                if (this.state[key] !== nextState[key]) { blChangedProps = true; break; }
            }
        }

        return blChangedProps;
    }

    GetDataSource(actionName, stateName) {
        const { Page } = this.props;

        const property = {};
        property.DataSource = []

        property.ActionType = "Page";
        property.ActionName = "GetServiceDataSource"

        property.SetDataSource = (dataList) => {
            const data ={}; data[stateName]=dataList;
            this.setState(data);
        };

        const action = Page.GetAction(actionName);

        const list = Page.props[action.StateName];
        if (list === undefined) Page.InvokeAction(property, action);
        else property.SetDataSource(list);
    }
}