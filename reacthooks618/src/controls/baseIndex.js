import { Component } from "react";
import { Common } from "UtilsCommon";
import { Icon } from "antd";

export default class BaseIndex extends Component {
    constructor(props) {
        super(props)

        this.id = props.property.id || Common.createGuid()
        props.pageAxis.Controls.push(props.property);
        this.property = props.property;
        this.view = props.view;
        this.pageAxis = props.pageAxis;
        this.isLoadValue = props.property.isLoadValue === true;

        this.setDateDefaultValue();

        this.InitState = {
            Disabled: this.property.Disabled,
            Value: this.getInitValue(),
            isReadOnly: this.property.isReadOnly,
            ClassName: "",
            style: null,
            isVisible: this.property.isVisible !== false || this.property.isFormItem
        }

        this.state = this.InitState;

        this.property.setDisabled = (disabled) => this.setState({ Disabled: disabled });
        this.property.getDisabled = () => this.state.Disabled;
        this.property.setVisible = this.setVisible.bind(this);
        this.property.getVisible = () => this.state.isVisible;

        this.property.getValue = this.getValue.bind(this)

        this.property.setValue = (v) => this.setState({ Value: (v === undefined ? null : v) });

        this.property.setStyle = (s) => this.setState({ style: s });

        this.property.setReadOnly = (isReadOnly) => this.setState({ isReadOnly: isReadOnly });

        this.property.InitState = (initState) => { this.isLoadValue = this.property.isLoadValue === true; this.setState(Object.assign({}, this.InitState, initState)); }

        this.property.Initset = (obj) => { if (obj) for (let key in obj) this[key] = obj[key] };

        this.property.setClassName = (className) => this.setState({ ClassName: className });

        this.property.setFocus = this.setFocus.bind(this);

        this.property.getSelectData = this.getSelectData.bind(this);

        this.property.getDataSource = this.getDataSource.bind(this);
    }

    InitRegExp() {
        const { property } = this;
        if (typeof property.KeyPressRegExp === "string") property.KeyPressRegExp = new RegExp(property.KeyPressRegExp)
        if (typeof property.RegExp === "string") property.RegExp = new RegExp(property.RegExp, "g")
    }

    getInitValue() {
        let value = null;
        if (!Common.isNullOrEmpty(this.property.Value)) value = this.property.Value;
        else if (!Common.isNullOrEmpty(this.property.DefaultValue)) value = this.property.DefaultValue;

        const { isBind, data, name, propertyName } = this.property;
        const name2 = propertyName || name;
        if (value && isBind && data) {
            if (data[name2] === undefined) data[name2] = value;
            else if (data[name2] !== value) value = data[name2];
        }

        return value;
    }

    setVisible(v) {
        this.property.isVisible = v;
        if (this.property.isFormItem && this.property.setFormItemVisible) this.property.setFormItemVisible(v);
        else this.setState({ isVisible: v })
    }

    setFocus() {

    }

    BindDataValue() {
        const { isBind, data, name, propertyName } = this.property;
        const name2 = propertyName || name;
        if (isBind && data) data[name2] = this.getValue();
    }

    KeyPress(e) {
        const keyCode = e.keyCode ? e.keyCode : (e.which ? e.which : e.charCode);
        const keyChar = String.fromCharCode(keyCode);
        return this.property.KeyPress(keyCode, keyChar, e);
    }

    getValue() {
        if (this.state.Value === undefined) return null
        if (typeof this.state.Value === "string") return Common.trim(this.state.Value);
        if (Common.isArray(this.state.Value) && this.property.isString) return this.state.Value.join(",");
        return this.state.Value;
    }

    setDateDefaultValue() {
        if (this.property.isCurrentDay) this.property.DefaultValue = Common.getCurrentDate().substr(0, 10);

        if (this.property.isMonthFirst) this.property.DefaultValue = Common.getCurrentDate().substr(0, 8) + "01";

        if (this.property.isCurrentUser) this.property.DefaultValue = Common.getStorage("LoginUserId");
    }

    componentWillUnmount() {
        this.isDestory = true;
    }

    getProperty(name) {
        return Common.arrayFirst(this.view.Properties, (f) => f.name === name);
    }

    getPropsValue(name) {
        return this.props[name] || this[name]
    }

    getPropertyValue(name) {
        return this.props.property[name] || this[name]
    }

    shouldComponentUpdate(nextProps, nextState) {
        let blChangedProps = false;

        for (let key in nextProps) {
            if (nextProps[key] !== undefined && !Common.isFunction(nextProps[key]) && this.props[key] !== nextProps[key]) {
                blChangedProps = true; break;
            }
        }

        if (!blChangedProps) {
            for (let key in nextState) {
                if (this.state[key] !== nextState[key] && !Common.isFunction(nextState[key])) {
                    blChangedProps = true;
                    if (key === "Value") {
                        if (this.isLoadValue === false) this.isLoadValue = true;
                        else this.ValueChange(nextState.Value);

                        this.StateValueChange(nextState.Value);

                        break;
                    }
                }
            }

            if (this.isValue2) {
                for (let key in nextState) {
                    if (this.state[key] !== nextState[key] && !Common.isFunction(nextState[key])) {
                        blChangedProps = true;

                        if (key === "Value2") {
                            this.ValueChange2(nextState.Value2);
                            break;
                        }
                    }
                }
            }
        }

        return blChangedProps;
    }

    StateValueChange(value) {

    }

    ValueChange2(value) {

    }

    getOptions() {
        return []
    }

    ReceiveDataSource(res) {
        const { property, pageAxis } = this.props

        let dataList = []
        if (this.isSuccessProps(res)) {
            if (res.Action && res.data) res = res.data;
            if (property.ListName) dataList = res[property.ListName];
            else dataList = res;

            //扩展设置数据列表
            if (property.expandsetDataList) {
                dataList = pageAxis.getFunction(property.expandsetDataList)({ dataList, property });
            }
        }
        if (property.isOnlyInit) property.InitDataList = dataList;
        else property.setDataSource(dataList);
    }

    isSuccessProps(obj) {
        return obj && obj.isSuccess !== false;
    }

    RenderPrefix() {
        const { PrefixIcon } = this.property
        if (PrefixIcon) return <Icon type={PrefixIcon.type} style={PrefixIcon.style} />
        return null;
    }

    getDataSource() {
        const { property, view } = this.props

        if (property.ServiceDataSource) {
            this.ValueName = property.ServiceDataSource.ValueName;
            this.TextName = property.ServiceDataSource.TextName;
            this.ParentValueName = property.ServiceDataSource.ParentValueName;
        }
        else {
            this.ValueName = property.ValueName || "Value";
            this.TextName = property.TextName || "text";
            this.ParentValueName = property.ParentValueName || "ParentValue"
        }

        property.setDataSource = (dataList, parentValue) => {
            if (this.isDestory) return;
            if (!Common.isArray(dataList)) dataList = [];
            this.property.DataSource = dataList;
            this.property.ParentValue = parentValue;
            this.setState({ Options: this.getOptions(parentValue) });
        };

        if (Common.isArray(property.DataSource)) {
            this.setState({ Options: this.getOptions() })
        }
        else if (property.ServiceDataSource) {
            property.DataSource = []

            if (!property.ServiceDataSource.isLocal) {
                const state = this.props.getStateValue(property.ServiceDataSource.StateName);
                if (this.isSuccessProps(state) && !property.ServiceDataSource.isRefresh) this.ReceiveDataSource(state);
                else {
                    var payload = property.ServiceDataSource.Payload || {};
                    if (property.ServiceDataSource.getPayload) payload = this.pageAxis.getFunction(property.ServiceDataSource.getPayload)({ property, view })
                    this.props.DispatchAction(property.ServiceDataSource.ServiceName, property.ServiceDataSource.ActionName, payload).then(res => this.ReceiveDataSource(res));
                }
            }
        }
    }

    JudgePush(d, parentValue) {
        if (this.view && this.property.ParentName && this.property.ParentPropertyName) {
            const parentProperty = this.getProperty(this.property.ParentName);
            if (parentValue === undefined) {
                if (parentProperty.getValue === undefined) parentValue = parentProperty.getValue();
                else parentValue = parentProperty.Value || (parentProperty.DefaultValue || null);
            }

            return Common.isEquals(parentValue, d[this.property.ParentPropertyName], true);
        }

        return true;
    }

    getSelectData(value) {
        if (value === undefined) value = this.getValue();
        return Common.arrayFirst(this.property.DataSource, (f) => Common.isEquals(f[this.ValueName], value, true));
    }

    ValueChange(value) {
        const { property } = this.props
        if (property.ValueChange) property.ValueChange(value, this.getSelectData(value));

        if (property.ValueVisibleProperties) this.setValueVisibleProperties(value);
        this.setValueDisabledProperties(value);

        window.setTimeout(() => {
            //值改变调用事件行为
            if (property.ValueChangeEventActionName) this.pageAxis.InvokeAction(property.ValueChangeEventActionName, this.props);

            this.ChildPropertiesChanged(value);
        }, 100);
    }

    setValueVisibleProperties(value) {
        if (Common.isNullOrEmpty(value)) return;

        const { ValueVisibleProperties } = this.property;

        for (let key in ValueVisibleProperties) {
            this.setPropertiesVisible(ValueVisibleProperties[key], Common.isEquals(key, value))
        }
    }

    setValueDisabledProperties(value) {
        if (Common.isNullOrEmpty(value)) return;

        const { ValueDisabledProperties, ValueEnableProperties } = this.property;

        if (ValueDisabledProperties) {
            for (let key in ValueDisabledProperties) {
                this.setPropertiesDisabled(ValueDisabledProperties[key], Common.isEquals(key, value))
            }
        }

        if (ValueEnableProperties) {
            for (let key in ValueEnableProperties) {
                this.setPropertiesDisabled(ValueEnableProperties[key], !Common.isEquals(key, value))
            }
        }
    }

    setSelectDataToProperties(data) {
        data = data || {};

        this.property.SelectDataToProperties.forEach(p => this.setPropertyValue(p, data));
    }

    setPropertyValue(name, data) {
        const p = this.getProperty(name);
        if (!p) return;

        name = p.propertyName || p.name;
        var v = data[name]

        if (p.setValue) p.setValue(v);
        else p.Value = v;

        if (p.PropertyName2) {
            v = data[p.PropertyName2];
            if (p.setValue2) p.setValue2(v);
            else p.Value2 = v;
        }
    }

    setPropertiesDisabled(names, disabled) {
        names.forEach(n => {
            const p = this.getProperty(n);
            if (p && p.setDisabled) p.setDisabled(disabled);
        });
    }

    setPropertiesVisible(names, isVisible) {
        names.forEach(n => {
            const p = this.getProperty(n);
            if (p && p.setVisible) p.setVisible(isVisible);
        });
    }

    ChildPropertiesChanged(value) {
        if (Common.isArray(this.property.ChildNames)) {
            let p = null;
            this.property.ChildNames.forEach(n => {
                p = this.getProperty(n);
                if (p != null && p.setDataSource) {
                    if (!Common.isNullOrEmpty(p.ParentValue) && p.ParentValue !== value) p.setValue(null);
                    p.setDataSource(p.DataSource, value);
                }
            })
        }
    }
}