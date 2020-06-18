import React from "react"
import { Common } from "UtilsCommon"
import BaseIndex from "./BaseIndex"
import { MapToProps } from "UseHooks";
import { Select, Input } from "antd"
const Option = Select.Option;

class Select2 extends BaseIndex {
    constructor(props) {
        super(props)

        this.state = Object.assign({ Options: [] }, this.state)

        if (!this.property.isMultiple) {
            this.property.getValue = () => this.getSelectValue(true);

            this.property.getText = () => this.getSelectText();
        }
    }

    componentDidMount() {
        this.getDataSource();
    }

    getOptions(parentValue, inputValue) {
        const options = [];
        this.ValueList = [];
        this.ParentValue = parentValue;

        const { EmptyOption, isNullable } = this.property;
        if (EmptyOption) {
            const disabled = !isNullable && !EmptyOption.isNullable;
            options.push(<Option value={EmptyOption.Value} disabled={disabled} key={Common.createGuid()}>{EmptyOption.text}</Option>);
            this.ValueList.push(EmptyOption.Value);
        }

        let value = null, text = null;
        Common.isArray(this.property.DataSource) && this.property.DataSource.forEach(d => {
            text = d[this.TextName];
            value = d[this.ValueName];

            if (this.JudgePush(d, parentValue) && this.JudgeSearch(inputValue, text)) {
                options.push(<Option value={value} key={value}>{text}</Option>)
                this.ValueList.push(value);
            }
        });

        return options;
    }

    JudgeSearch(inputValue, text) {
        if (Common.isNullOrEmpty(inputValue)) return true;
        else if (text && text.toString().toLowerCase().indexOf(inputValue.toLowerCase()) >= 0) return true;
        return false;
    }

    OnChange(value) {
        this.isLoadValue = true;
        this.isChange = true;
        this.setState({ Value: value }, () => { this.isChange = false; this.BindDataValue(); });
    }

    ValueChange(value) {
        const { property } = this.props
        if (property.ValueChange) property.ValueChange(value, this.getSelectData(value));

        if (property.ValueVisibleProperties) this.setValueVisibleProperties(value);
        this.setValueDisabledProperties(value);
        if (property.SelectDataToProperties) this.setSelectDataToProperties(this.getSelectData(value));

        //值改变调用事件行为
        if (property.ValueChangeEventActionName) this.pageAxis.InvokeAction(property.ValueChangeEventActionName, this.props);

        this.ChildPropertiesChanged(value);
    }

    getSelectValue(blget) {
        if (this.isChange) return this.state.Value;

        let value = Common.isNullOrEmpty(this.state.Value) ? undefined : this.state.Value.toString()
        if (!Common.isNullOrEmpty(value) && Common.isArray(this.ValueList)) value = Common.arrayFirst(this.ValueList, (f) => Common.isEquals(f, value, true));
        if (blget) return value === undefined ? null : value;
        if (Common.isNullOrEmpty(value)) {
            const { EmptyOption } = this.property;
            if (EmptyOption) return EmptyOption.Value;
            else return ""
        }
        return value;
    }

    getSelectText() {
        const selectData = this.getSelectData(this.state.Value);
        if (selectData === null) return "";

        return selectData[this.TextName] === undefined ? "" : selectData[this.TextName];
    }

    OnSerach(value) {
        this.SearchValue = value;
        this.StopTimeout();
        this.TimeoutId = setTimeout(() => this.Search(), 300);
    }

    componentWillUnmount() {
        this.isDestory = true;
        this.StopTimeout();
    }

    StopTimeout() {
        if (this.TimeoutId > 0) clearTimeout(this.TimeoutId);
    }

    Search() {
        this.setState({ Options: this.getOptions(this.ParentValue, this.SearchValue) });
    }

    RenderMultipleSelect() {
        const { property } = this.props
        const width = property.Width || "100%"

        let valueList = Common.isNullOrEmpty(this.state.Value) ? [] : this.state.Value;
        if (!Common.isArray(valueList)) valueList = valueList.split(",");

        if (this.state.Options.length === 0) valueList = [];

        return (
            <Select disabled={this.state.Disabled}
                style={{ width: width }}
                value={valueList}
                onChange={this.OnChange.bind(this)}
                allowClear={!!property.AllowClear}
                mode={"multiple"}
                maxTagCount={property.MaxTagCount}
                placeholder={property.placeHolder}
                defaultValue={property.DefaultValue} >{this.state.Options}</Select>
        )
    }

    render() {
        if (!this.state.isVisible) return null;

        const { property } = this.props

        const width = property.Width || "100%"

        if (this.state.isReadOnly) {
            const text = this.getSelectText();

            return <Input readOnly={this.state.isReadOnly}
                type="text"
                addonAfter={property.AddonAfter}
                placeholder={property.placeHolder}
                style={{ width: width }}
                value={text} />
        }

        if (property.isMultiple) return this.RenderMultipleSelect();

        var value = this.getSelectValue();
        if (Common.isNullOrEmpty(value)) value = undefined;

        return (<Select disabled={this.state.Disabled}
            style={{ width: width }}
            value={value}
            onChange={this.OnChange.bind(this)}
            allowClear={!!property.AllowClear}
            mode={property.Mode}
            maxTagCount={property.MaxTagCount}
            placeholder={property.placeHolder}
            showSearch={property.isSearch}
            filterOption={false}
            onSearch={property.isSearch ? this.OnSerach.bind(this) : null}
            notFoundContent={null}
            defaultValue={property.DefaultValue} >{this.state.Options}</Select>)
    }
}

function setProps(owner, page) {
    return {
        DispatchAction: owner.DispatchAction,
        getStateValue: owner.getStateValue
    }
}

//export default MapToProps(setProps)(Select2);

export default (props)=>{

    return <Select></Select>
};