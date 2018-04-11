import { Component } from "react"
import * as Common from "../utils/Common"

export default class Index extends Component {
    constructor(props) {
        super(props)

        this.Id = props.Id || Common.CreateGuid();

        this.Property = props.Property;
        this.Page = props.Page;

        if (this.Property) {
            this.Property.SetValue = (value) => this.SetValue(value);
            this.Property.GetValue = () => this.GetValue();
        }
    }

    SetValue(value) { }

    GetValue() { }

    componentWillUnmount() {
        this.IsDestory = true;
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

    GetDataSource(property, actionName, stateName, fn, action) {
        const { Page } = this.props;

        property.Id = property.Id || Common.CreateGuid();
        property.DataSource = []

        property.ActionType = "Page";
        property.ActionName = "GetServiceDataSource"

        property.SetDataSource = (dataList) => {
            if (this.IsDestory) return;
            if (fn) fn(dataList);
            else {
                const data = {}; data[stateName] = dataList;
                this.setState(data);
            }
        };

        action = action || Page.GetAction(actionName);

        if (action.IsFirst === undefined) action.IsFirst = true;

        const list = action.IsFirst ? undefined : Page.props[action.StateName];
        if (list === undefined) Page.InvokeAction(property, action);
        else property.SetDataSource(list);

        action.IsFirst = false;
    }
}