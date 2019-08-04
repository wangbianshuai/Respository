import React from "react"
import { Common } from "UtilsCommon"
import BaseIndex from "./BaseIndex"
import { MapToProps } from "ReactCommon";
import { Select, Input } from "antd"
const Option = Select.Option;

class Select2 extends BaseIndex {
    constructor(props) {
        super(props)

        this.state = Object.assign({ Options: [] }, this.state)

        if (!this.Property.IsMultiple) {
            this.Property.GetValue = () => this.GetSelectValue(true);

            this.Property.GetText = () => this.GetSelectText();
        }
    }

    componentDidMount() {
        this.GetDataSource();
    }

    GetOptions(parentValue, inputValue) {
        const options = [];
        this.ValueList = [];
        this.ParentValue = parentValue;

        const { EmptyOption, IsNullable } = this.Property;
        if (EmptyOption) {
            const disabled = !IsNullable && !EmptyOption.IsNullable;
            options.push(<Option value={EmptyOption.Value} disabled={disabled} key={Common.CreateGuid()}>{EmptyOption.Text}</Option>);
            this.ValueList.push(EmptyOption.Value);
        }

        let value = null, text = null;
        Common.IsArray(this.Property.DataSource) && this.Property.DataSource.forEach(d => {
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
        if (Common.IsNullOrEmpty(inputValue)) return true;
        else if (text && text.toString().indexOf(inputValue) >= 0) return true;
        return false;
    }

    OnChange(value) {
        this.IsLoadValue = true;
        this.IsChange = true;
        this.setState({ Value: value }, () => { this.IsChange = false; this.BindDataValue(); });
    }

    ValueChange(value) {
        const { Property } = this.props
        if (Property.ValueChange) Property.ValueChange(value, this.GetSelectData(value));

        if (Property.ValueVisibleProperties) this.SetValueVisibleProperties(value);
        this.SetValueDisabledProperties(value);
        if (Property.SelectDataToProperties) this.SetSelectDataToProperties(this.GetSelectData(value));

        //值改变调用事件行为
        if (Property.ValueChangeEventActionName) this.EventActions.InvokeAction(Property.ValueChangeEventActionName, this.props);

        this.ChildPropertiesChanged(value);
    }

    GetSelectValue(blGet) {
        if (this.IsChange) return this.state.Value;

        let value = Common.IsNullOrEmpty(this.state.Value) ? undefined : this.state.Value.toString()
        if (!Common.IsNullOrEmpty(value) && Common.IsArray(this.ValueList)) value = Common.ArrayFirst(this.ValueList, (f) => Common.IsEquals(f, value, true));
        if (blGet) return value === undefined ? null : value;
        if (Common.IsNullOrEmpty(value)) {
            const { EmptyOption } = this.Property;
            if (EmptyOption) return EmptyOption.Value;
            else return ""
        }
        return value;
    }

    GetSelectText() {
        const selectData = this.GetSelectData(this.state.Value);
        if (selectData === null) return "";

        return selectData[this.TextName] === undefined ? "" : selectData[this.TextName];
    }

    OnSerach(value) {
        this.SearchVaue = value;
        this.StopTimeout();
        this.TimeoutId = setTimeout(() => this.Search(), 300);
    }

    componentWillUnmount() {
        this.IsDestory = true;
        this.StopTimeout();
    }

    StopTimeout() {
        if (this.TimeoutId > 0) clearTimeout(this.TimeoutId);
    }

    Search() {
        this.setState({ Options: this.GetOptions(this.ParentValue, this.SearchValue) });
    }

    RenderMultipleSelect() {
        const { Property } = this.props
        const width = Property.Width || "100%"

        let valueList = Common.IsNullOrEmpty(this.state.Value) ? [] : this.state.Value;
        if (!Common.IsArray(valueList)) valueList = valueList.split(",")
 
        return (
            <Select disabled={this.state.Disabled}
                style={{ width: width }}
                value={valueList}
                onChange={this.OnChange.bind(this)}
                allowClear={!!Property.AllowClear}
                mode={"multiple"}
                maxTagCount={Property.MaxTagCount}
                placeholder={Property.PlaceHolder}
                defaultValue={Property.DefaultValue} >{this.state.Options}</Select>
        )
    }

    render() {
        if (!this.state.IsVisible) return null;

        const { Property } = this.props

        const width = Property.Width || "100%"

        if (this.state.IsReadOnly) {
            const text = this.GetSelectText();

            return <Input readOnly={this.state.IsReadOnly}
                type="text"
                addonAfter={Property.AddonAfter}
                placeholder={Property.PlaceHolder}
                style={{ width: width }}
                value={text} />
        }

        if (Property.IsMultiple) return this.RenderMultipleSelect();

        const value = this.GetSelectValue()

        return (<Select disabled={this.state.Disabled}
            style={{ width: width }}
            value={value}
            onChange={this.OnChange.bind(this)}
            allowClear={!!Property.AllowClear}
            mode={Property.Mode}
            maxTagCount={Property.MaxTagCount}
            placeholder={Property.PlaceHolder}
            showSearch={Property.IsSearch}
            showArrow={!Property.IsSearch}
            onSearch={Property.IsSearch ? this.OnSerach.bind(this) : null}
            notFoundContent={null}
            defaultValue={Property.DefaultValue} >{this.state.Options}</Select>)
    }
}

function setProps(owner, page) {
    return {
        DispatchAction: owner.DispatchAction,
        GetStateValue: owner.GetStateValue
    }
}

export default MapToProps(setProps)(Select2);