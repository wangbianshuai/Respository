import React from "react";
import { Common } from "UtilsCommon";
import BaseIndex from "./BaseIndex";
import { Radio, Input } from "antd";
import { MapToProps } from "UseHooks";
const RadioGroup = Radio.Group
const RadioButton = Radio.Button;

class Radio2 extends BaseIndex {
    constructor(props) {
        super(props)

        this.state = Object.assign({ Options: [] }, this.state);
    }

    componentDidMount() {
        this.getDataSource();
    }

    getOptions() {
        const options = [];

        this.property.DataSource.forEach(d => {
            if (this.property.isButton) {
                const style = {}
                if (this.property.ButtonWidth) {
                    style.width = this.property.ButtonWidth;
                    style.textAlign = "center";
                }
                options.push(<RadioButton style={style} value={d[this.ValueName]} key={d[this.ValueName]}>{d[this.TextName]}</RadioButton>)
            }
            else options.push(<Radio value={d[this.ValueName]} key={d[this.ValueName]}>{d[this.TextName]}</Radio>)
        });

        return options;
    }

    OnChange(e) {
        this.setState({ Value: e.target.value })
    }

    getSelectText(value) {
        const d = Common.arrayFirst(this.property.DataSource, (f) => Common.isEquals(f[this.ValueName], value));
        return d === null ? "" : d[this.TextName]
    }

    render() {
        if (!this.state.isVisible) return null;

        const { property } = this.props

        const value = Common.isNullOrEmpty(this.state.Value) ? undefined : this.state.Value;

        if (this.state.isReadOnly) {
            if (property.label) {
                const text = this.getSelectText(value);

                return <Input readOnly={this.state.isReadOnly}
                    type="text"
                    value={text} />
            }
            else {
                return (<RadioGroup disabled={this.state.Disabled}
                    value={value} style={property.style}>{this.state.Options}</RadioGroup>)
            }
        }

        return (<RadioGroup disabled={this.state.Disabled}
            value={value} style={property.style}
            onChange={this.OnChange.bind(this)}
            defaultValue={property.DefaultValue} >{this.state.Options}</RadioGroup>)
    }
}

function setProps(owner, page) {
    return {
        DispatchAction: owner.DispatchAction,
        getStateValue: owner.getStateValue
    }
}

//export default MapToProps(setProps)(Radio2);

export default (props)=>{
    return <RadioGroup></RadioGroup>
}