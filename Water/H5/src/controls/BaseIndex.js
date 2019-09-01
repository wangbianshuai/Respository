import { Component } from "react";
import { Common } from "UtilsCommon";
import { Icon } from "antd-mobile";

export default class BaseIndex extends Component {
    constructor(props) {
        super(props)

        this.Id = props.Property.Id || Common.CreateGuid()
        props.EventActions.Controls.push(props.Property);
        this.Property = props.Property;
        this.View = props.View;
        this.EventActions = props.EventActions;
        this.IsLoadValue = props.Property.IsLoadValue === true;

        this.SetDateDefaultValue();

        this.InitState = {
            Disabled: this.Property.Disabled,
            Value: this.GetInitValue(),
            IsReadOnly: this.Property.IsReadOnly,
            ClassName: "",
            Style: null,
            IsVisible: this.Property.IsVisible !== false || this.Property.IsFormItem
        }

        this.state = this.InitState;

        this.Property.SetDisabled = (disabled) => this.setState({ Disabled: disabled });
        this.Property.SetVisible = this.SetVisible.bind(this);
        this.Property.GetVisible = () => this.state.IsVisible;

        this.Property.GetValue = this.GetValue.bind(this)

        this.Property.SetValue = (v) => this.setState({ Value: v });

        this.Property.SetStyle = (s) => this.setState({ Style: s });

        this.Property.SetReadonly = (isReadonly) => this.setState({ IsReadOnly: isReadonly });

        this.Property.InitState = (initState) => { this.IsLoadValue = this.Property.IsLoadValue === true; this.setState(Object.assign({}, this.InitState, initState)); }

        this.Property.InitSet = (obj) => { if (obj) for (let key in obj) this[key] = obj[key] };

        this.Property.SetClassName = (className) => this.setState({ ClassName: className });

        if (this.View && this.View.EntityData) this.IsLoadValue = this.Property.IsLoadValue === true;
        else this.IsLoadValue = true;

        this.Property.SetFocus = this.SetFocus.bind(this);

        this.Property.GetSelectData = this.GetSelectData.bind(this);

        this.Property.GetDataSource = this.GetDataSource.bind(this);

        if (this.Property.ClassName) this.Property.ClassName = this.EventActions.GetClassName(this.Property.ClassName)
    }

    GetInitValue() {
        if (!Common.IsNullOrEmpty(this.Property.Value)) return this.Property.Value;
        if (!Common.IsNullOrEmpty(this.Property.DefaultValue)) return this.Property.DefaultValue;

        return null;
    }

    SetVisible(v) {
        this.Property.IsVisible = v;
        if (this.Property.IsFormItem && this.Property.SetFormItemVisible) this.Property.SetFormItemVisible(v);
        else this.setState({ IsVisible: v })
    }

    SetFocus() {

    }

    BindDataValue() {
        const { IsBind, Data, Name } = this.Property;
        if (IsBind && Data) Data[Name] = this.GetValue();
    }

    KeyPress(e) {
        const keyCode = e.keyCode ? e.keyCode : (e.which ? e.which : e.charCode);
        const keyChar = String.fromCharCode(keyCode);
        return this.Property.KeyPress(keyCode, keyChar, e);
    }

    GetValue() {
        if (this.state.Value === undefined) return null
        if (typeof (this.state.Value) == "string") return Common.Trim(this.state.Value);
        return this.state.Value;
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
            if (nextProps[key] !== undefined && !Common.IsFunction(nextProps[key]) && this.props[key] !== nextProps[key]) {
                blChangedProps = true; break;
            }
        }

        if (!blChangedProps) {
            for (let key in nextState) {
                if (this.state[key] !== nextState[key] && !Common.IsFunction(nextState[key])) {
                    blChangedProps = true;
                    if (key === "Value") {
                        if (this.IsLoadValue === false) this.IsLoadValue = true;
                        else this.ValueChange(nextState.Value);

                        this.StateValueChange(nextState.Value);

                        break;
                    }
                }
            }
        }

        return blChangedProps;
    }

    StateValueChange(value) {

    }

    GetOptions() {
        return []
    }

    ReceiveDataSource(res) {
        const { Property } = this.props
        let dataList = []
        if (this.IsSuccessProps(res)) {
            if (Property.ListName) dataList = res[Property.ListName];
            else dataList = res;
        }
        Property.SetDataSource(dataList);
    }

    IsSuccessProps(obj) {
        return obj && obj.IsSuccess !== false;
    }

    RenderPrefix() {
        const { PrefixIcon } = this.Property
        if (PrefixIcon) return <Icon type={PrefixIcon.Type} style={PrefixIcon.Style} />
        return null;
    }

    GetDataSource() {
        const { Property } = this.props

        if (Property.ServiceDataSource) {

            this.ValueName = Property.ServiceDataSource.ValueName
            this.TextName = Property.ServiceDataSource.TextName
            this.ParentValueName = Property.ServiceDataSource.ParentValueName
        }
        else {
            this.ValueName = "Value";
            this.TextName = "Text";
            this.ParentValueName = "ParentValue"
        }

        if (Common.IsArray(Property.DataSource)) {
            this.setState({ Options: this.GetOptions() })
        }
        else if (Property.ServiceDataSource) {
            Property.DataSource = []

            Property.SetDataSource = (dataList, parentValue) => {
                if (this.IsDestory) return;
                if (dataList.Action && dataList.Data) dataList = dataList.Data;
                if (!Common.IsArray(dataList)) dataList = [];
                this.Property.DataSource = dataList;
                this.Property.ParentValue = parentValue;
                this.setState({ Options: this.GetOptions(parentValue) });
            };

            if (!Property.ServiceDataSource.IsLocal) {
                const state = this.props.GetStateValue(Property.ServiceDataSource.StateName);
                if (this.IsSuccessProps(state)) this.ReceiveDataSource(state);
                else this.props.DispatchAction(Property.ServiceDataSource.ServiceName, Property.ServiceDataSource.ActionName, Property.Payload || {}).then(res => this.ReceiveDataSource(res));
            }
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
        if (value === undefined) value = this.GetValue();
        return Common.ArrayFirst(this.Property.DataSource, (f) => Common.IsEquals(f[this.ValueName], value, true));
    }

    ValueChange(value) {
        const { Property } = this.props
        if (Property.ValueChange) Property.ValueChange(value, this.GetSelectData(value));

        if (Property.ValueVisibleProperties) this.SetValueVisibleProperties(value);

        //值改变调用事件行为
        if (Property.ValueChangeEventActionName) this.EventActions.InvokeAction(Property.ValueChangeEventActionName, this.props);

        window.setTimeout(() => this.ChildPropertiesChanged(value), 100);
    }

    SetValueVisibleProperties(value) {
        if (!value) return;

        const { ValueVisibleProperties } = this.Property;

        for (let key in ValueVisibleProperties) {
            this.SetPropertiesVisible(ValueVisibleProperties[key], Common.IsEquals(key, value))
        }
    }

    SetPropertiesVisible(names, isVisible) {
        names.forEach(n => {
            const p = this.GetProperty(n);
            if (p && p.SetVisible) p.SetVisible(isVisible);
        });
    }

    ChildPropertiesChanged(value) {
        if (Common.IsArray(this.Property.ChildNames)) {
            let p = null;
            this.Property.ChildNames.forEach(n => {
                p = this.GetProperty(n);
                if (p != null && p.SetDataSource) {
                    if (!Common.IsNullOrEmpty(p.ParentValue) && p.ParentValue !== value) p.SetValue(null);
                    p.SetDataSource(p.DataSource, value);
                }
            })
        }
    }
}