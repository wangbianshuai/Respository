import React from "react"
import * as Common from "../utils/Common"
import Index from "./Index"
import { Form } from "antd"
import PageControl from "../pagecontrols/PageControl"
import ExcelImport from "./ExcelImport";
import Button2 from "../controls/Button2"
import Label2 from "../controls/Label2";
import TextBox2 from "../controls/TextBox2"
import AButton from "../controls/AButton";
import Select2 from "../controls/Select2";
import Upload2 from "../controls/Upload2";
import DatePicker2 from "../controls/DatePicker2";
import AutoComplete2 from "../controls/AutoComplete2";
import Radio2 from "../controls/Radio2";
import CheckBoxGroup2 from "../controls/CheckBoxGroup2";

export default class PropertyItem extends Index {
    constructor(props) {
        super(props)

        this.Name = "PropertyItem";
    }

    GetReactComponent(property) {
        const props = { Page: this.props.Page, Property: property, View: this.props.View }

        switch (property.Type) {
            case "Button": return <Button2 {...props} key={property.Id} />
            case "AButton": return <AButton {...props} key={property.Id} />
            case "Label": return <Label2 {...props} key={property.Id} />
            case "TextBox": return <TextBox2 {...props} key={property.Id} />
            case "Select": return <Select2 {...props} key={property.Id} />
            case "Upload": return <Upload2 {...props} key={property.Id} />
            case "ExcelImport": return <ExcelImport {...props} key={property.Id} />
            case "Date": return <DatePicker2 {...props} key={property.Id} />
            case "AutoComplete": return <AutoComplete2 {...props} key={property.Id} />
            case "Radio": return <Radio2 {...props} key={property.Id} />
            case "CheckBoxGroup": return <CheckBoxGroup2 {...props} key={property.Id} />
            default: return null;
        }
    }

    render() {
        const { Property } = this.props

        if (Property.IsExpandControl) {
            const props = { Page: this.props.Page, Property: Property, View: this.props.View }
            return PageControl(props);
        }

        const labelCol = Property.LabelCol || 6;
        const wrapperCol = Property.WrapperCol || 18;

        if (Common.IsNullOrEmpty(Property.Label)) {
            return (<Form.Item>{this.GetReactComponent(Property)}</Form.Item>)
        }
        else {
            return (<Form.Item label={Property.Label}
                labelCol={{ span: labelCol }} required={Property.IsEdit && !Property.IsNullable}
                wrapperCol={{ span: wrapperCol }} >{this.GetReactComponent(Property)}</Form.Item>)
        }
    }
}