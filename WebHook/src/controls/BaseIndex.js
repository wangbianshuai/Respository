import { Common } from "UtilsCommon";
import { Icon } from "antd";

export default class BaseIndex {

    Init(props) {
        if (!this.IsInit) this.IsInit = true; else return true;

        this.props = props;
        this.state = {};
        this.fnState = {};

        this.Id = props.Property.Id || Common.CreateGuid()
        props.PageAxis.Controls.push(props.Property);
        this.Property = props.Property;
        this.View = props.View;
        this.PageAxis = props.PageAxis;
        this.IsLoadValue = props.Property.IsLoadValue === true;

        this.SetDateDefaultValue();

        this.InitialState = {
            Disabled: this.Property.Disabled,
            Value: this.GetInitValue(),
            IsReadOnly: this.Property.IsReadOnly,
            ClassName: "",
            Style: null,
            IsVisible: this.Property.IsVisible !== false || this.Property.IsFormItem
        }

        this.Property.SetDisabled = (disabled) => this.setState({ Disabled: disabled });
        this.Property.GetDisabled = () => this.state.Disabled;
        this.Property.SetVisible = this.SetVisible.bind(this);
        this.Property.GetVisible = () => this.state.IsVisible;

        this.Property.GetValue = this.GetValue.bind(this)

        this.Property.SetValue = (v) => this.setState({ Value: (v === undefined ? null : v) });

        this.Property.SetStyle = (s) => this.setState({ Style: s });

        this.Property.SetReadOnly = (isReadOnly) => this.setState({ IsReadOnly: isReadOnly });

        this.Property.InitState = (initialState) => { this.IsLoadValue = this.Property.IsLoadValue === true; this.setState(Object.assign({}, this.InitialState, initialState)); }

        this.Property.InitSet = (obj) => { if (obj) for (let key in obj) this[key] = obj[key] };

        this.Property.SetClassName = (className) => this.setState({ ClassName: className });

        this.Property.SetFocus = this.SetFocus.bind(this);

        this.Property.GetSelectData = this.GetSelectData.bind(this);

        this.Property.GetDataSource = this.GetDataSource.bind(this);
    }

    InitState(name, list) {
        this.state[name] = list[0]
        this.fnState[name] = list[1]
    }

    setState(state, callback) {
        for (var key in state) {
            this.state[key] = state[key];
            if (this.fnState[key]) this.fnState[key](state[key])
        }
        callback && callback();
    }

    InitRegExp() {
        const { Property } = this;
        if (typeof Property.KeyPressRegExp === "string") Property.KeyPressRegExp = new RegExp(Property.KeyPressRegExp)
        if (typeof Property.RegExp === "string") Property.RegExp = new RegExp(Property.RegExp, "g")
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
        const { IsBind, Data, Name, PropertyName } = this.Property;
        const name = PropertyName || Name;
        if (IsBind && Data) Data[name] = this.GetValue();
    }

    KeyPress(e) {
        const keyCode = e.keyCode ? e.keyCode : (e.which ? e.which : e.charCode);
        const keyChar = String.fromCharCode(keyCode);
        return this.Property.KeyPress(keyCode, keyChar, e);
    }

    GetValue() {
        if (this.state.Value === undefined) return null
        if (typeof this.state.Value === "string") return Common.Trim(this.state.Value);
        return this.state.Value;
    }

    SetDateDefaultValue() {
        if (this.Property.IsCurrentDay) this.Property.DefaultValue = Common.GetCurrentDate().substr(0, 10);

        if (this.Property.IsMonthFirst) this.Property.DefaultValue = Common.GetCurrentDate().substr(0, 8) + "01";

        if (this.Property.IsCurrentUser) this.Property.DefaultValue = Common.GetStorage("LoginUserId");
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

    ValueChangeEffect() {
        if (this.IsLoadValue === false) this.IsLoadValue = true;
        else this.ValueChange(this.state.Value);

        this.StateValueChange(this.state.Value);
    }

    StateValueChange(value) {

    }

    ValueChange2(value) {

    }

    GetOptions() {
        return []
    }

    ReceiveDataSource(res) {
        const { Property, PageAxis } = this.props

        let dataList = []
        if (this.IsSuccessProps(res)) {
            if (res.Action && res.Data) res = res.Data;
            if (Property.ListName) dataList = res[Property.ListName];
            else dataList = res;

            //扩展设置数据列表
            if (Property.ExpandSetDataList) {
                dataList = PageAxis.GetFunction(Property.ExpandSetDataList)({ dataList, Property });
            }
        }
        if (Property.IsOnlyInit) Property.InitDataList = dataList;
        else Property.SetDataSource(dataList);
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
        const { Property, View } = this.props

        if (Property.ServiceDataSource) {
            this.ValueName = Property.ServiceDataSource.ValueName;
            this.TextName = Property.ServiceDataSource.TextName;
            this.ParentValueName = Property.ServiceDataSource.ParentValueName;
        }
        else {
            this.ValueName = Property.ValueName || "Value";
            this.TextName = Property.TextName || "Text";
            this.ParentValueName = Property.ParentValueName || "ParentValue"
        }

        Property.SetDataSource = (dataList, parentValue) => {
            if (this.IsDestory) return;
            if (!Common.IsArray(dataList)) dataList = [];
            this.Property.DataSource = dataList;
            this.Property.ParentValue = parentValue;
            this.setState({ Options: this.GetOptions(parentValue) });
        };

        if (Common.IsArray(Property.DataSource)) {
            this.setState({ Options: this.GetOptions() })
        }
        else if (Property.ServiceDataSource) {
            Property.DataSource = []

            if (!Property.ServiceDataSource.IsLocal) {
                const state = this.GetStateValue(Property.ServiceDataSource.StateName);
                if (this.IsSuccessProps(state) && !Property.ServiceDataSource.IsRefresh) this.ReceiveDataSource(state);
                else {
                    var payload = Property.ServiceDataSource.Payload || {};
                    if (Property.ServiceDataSource.GetPayload) payload = this.PageAxis.GetFunction(Property.ServiceDataSource.GetPayload)({ Property, View })
                    this.DispatchAction(Property.ServiceDataSource.ServiceName, Property.ServiceDataSource.ActionName, payload).then(res => this.ReceiveDataSource(res));
                }
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
        this.SetValueDisabledProperties(value);

        window.setTimeout(() => {
            //值改变调用事件行为
            if (Property.ValueChangeEventActionName) this.PageAxis.InvokeEventAction(Property.ValueChangeEventActionName, this.props);

            this.ChildPropertiesChanged(value);
        }, 100);
    }

    SetValueVisibleProperties(value) {
        if (Common.IsNullOrEmpty(value)) return;

        const { ValueVisibleProperties } = this.Property;

        for (let key in ValueVisibleProperties) {
            this.SetPropertiesVisible(ValueVisibleProperties[key], Common.IsEquals(key, value))
        }
    }

    SetValueDisabledProperties(value) {
        if (Common.IsNullOrEmpty(value)) return;

        const { ValueDisabledProperties, ValueEnableProperties } = this.Property;

        if (ValueDisabledProperties) {
            for (let key in ValueDisabledProperties) {
                this.SetPropertiesDisabled(ValueDisabledProperties[key], Common.IsEquals(key, value))
            }
        }

        if (ValueEnableProperties) {
            for (let key in ValueEnableProperties) {
                this.SetPropertiesDisabled(ValueEnableProperties[key], !Common.IsEquals(key, value))
            }
        }
    }

    SetSelectDataToProperties(data) {
        data = data || {};

        this.Property.SelectDataToProperties.forEach(p => this.SetPropertyValue(p, data));
    }

    SetPropertyValue(name, data) {
        const p = this.GetProperty(name);
        if (!p) return;

        name = p.PropertyName || p.Name;
        var v = data[name]

        if (p.SetValue) p.SetValue(v);
        else p.Value = v;

        if (p.PropertyName2) {
            v = data[p.PropertyName2];
            if (p.SetValue2) p.SetValue2(v);
            else p.Value2 = v;
        }
    }

    SetPropertiesDisabled(names, disabled) {
        names.forEach(n => {
            const p = this.GetProperty(n);
            if (p && p.SetDisabled) p.SetDisabled(disabled);
        });
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