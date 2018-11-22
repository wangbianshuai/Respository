import { Component } from "react"
import * as Common from "../utils/Common"

export default class Index extends Component {
    constructor(props) {
        super(props)

        this.Id = props.Property.Id || Common.CreateGuid()

        this.Property = props.Property;
        this.View = props.View;
        this.IsLoadValue = props.Property.IsLoadValue === true;

        this.SetDateDefaultValue();

        this.InitState = {
            Disabled: this.Property.Disabled,
            Value: this.Property.Value || (this.Property.DefaultValue || null),
            IsReadonly: this.Property.IsReadonly,
            IsVisible: this.Property.IsVisible !== false && this.Property.IsDataRight !== false
        }

        this.state = this.InitState;

        this.Property.SetDisabled = (disabled) => this.setState({ Disabled: disabled });
        this.Property.SetVisible = (isVisible) => this.setState({ IsVisible: isVisible });

        this.Property.GetValue = () => this.state.Value === undefined ? null : this.state.Value;

        this.Property.SetValue = (v) => this.setState({ Value: v });

        this.Property.SetReadonly = (isReadonly) => this.setState({ IsReadonly: isReadonly });

        this.Property.InitState = (initState) => { this.IsLoadValue = false; this.setState(Object.assign({}, this.InitState, initState)); }

        this.Property.InitSet = (obj) => { if (obj) for (let key in obj) this[key] = obj[key] };

        if (this.View && this.View.EntityData) this.IsLoadValue = false;
    }

    SetDateDefaultValue() {
        if (this.Property.IsCurrentDay) this.Property.DefaultValue = Common.GetCurrentDate().substr(0, 10);

        if (this.Property.IsMonthFirst) this.Property.DefaultValue = Common.GetCurrentDate().substr(0, 8) + "01";
    }

    componentWillUnmount() {
        this.IsDestory = true;
    }

    GetProperty(name) {
        return Common.ArrayFirst(this.View.Properties, (f) => f.Name === name);
    }

    GetPropsValue(name) {
        return this.props[name] || this[name]
    }

    GetPropertyValue(name) {
        return this.props.Property[name] || this[name]
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
                if (this.state[key] !== nextState[key]) {
                    blChangedProps = true;
                    if (key === "Value") {
                        if (this.IsLoadValue === false) this.IsLoadValue = true;
                        else this.ValueChange(nextState.Value);
                    }
                    break;
                }
            }
        }

        return blChangedProps;
    }

    GetOptions() {
        return []
    }

    GetDataSource() {
        const { Page, Property } = this.props

        if (Property.ServiceDataSource) {
            this.ValueName = Property.ServiceDataSource.ValueName
            this.TextName = Property.ServiceDataSource.TextName
        }
        else {
            this.ValueName = "Value";
            this.TextName = "Text";
        }

        if (Common.IsArray(Property.DataSource)) {
            this.setState({ Options: this.GetOptions() })
        }
        else if (Property.ServiceDataSource) {
            this.Property.DataSource = []

            Property.ActionType = "Page";
            Property.ActionName = "GetServiceDataSource"

            Property.SetDataSource = (dataList, parentValue) => {
                if (this.IsDestory) return;
                this.Property.DataSource = dataList;
                this.setState({ Options: this.GetOptions(parentValue) });
            };

            const action = Page.GetAction(Property.ServiceDataSource.ActionName);

            if (action.IsFirst === undefined) action.IsFirst = true;

            const list = action.IsFirst ? undefined : Page.props[action.StateName];
            if (list === undefined) Page.InvokeAction(Property, action);
            else Property.SetDataSource(list);

            action.IsFirst = false;
        }
    }

    JudgePush(d, parentValue) {
        if (this.View && this.Property.ParentName && this.Property.ParentPropertyName) {
            const parentProperty = this.GetProperty(this.Property.ParentName);
            if (parentValue === undefined) {
                if (parentProperty.GetValue === undefined) parentValue = parentProperty.GetValue();
                else parentValue = parentProperty.Value || (parentProperty.DefaultValue || null);
            }

            return Common.IsEquals(parentValue, d[this.Property.ParentPropertyName], true);
        }

        return true;
    }

    GetSelectData(value) {
        return Common.ArrayFirst(this.Property.DataSource, (f) => Common.IsEquals(f[this.ValueName], value, true));
    }

    ValueChange(value) {
        const { Property } = this.props
        if (Property.ValueChange) Property.ValueChange(value, this.GetSelectData(value));

        window.setTimeout(() => this.ChildPropertiesChanged(value), 100);
    }

    ChildPropertiesChanged(value) {
        if (Common.IsArray(this.Property.ChildNames)) {
            let p = null;
            this.Property.ChildNames.forEach(n => {
                p = this.GetProperty(n);
                if (p != null && p.SetDataSource) {
                    p.SetDataSource(p.DataSource, value);
                }
            })
        }
    }
}