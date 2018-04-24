import React, { Component } from "react"
import * as Common from "../utils/Common"
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
import CheckBox2 from "../controls/CheckBox2";
import ColorPicker2 from "../controls/ColorPicker2";

export default class Index extends Component {
    constructor(props) {
        super(props)

        this.Id = props.Id || Common.CreateGuid()
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
            case "Date": return <DatePicker2 {...props} key={property.Id} />
            case "AutoComplete": return <AutoComplete2 {...props} key={property.Id} />
            case "Radio": return <Radio2 {...props} key={property.Id} />
            case "CheckBoxGroup": return <CheckBoxGroup2 {...props} key={property.Id} />
            case "CheckBox": return <CheckBox2 {...props} key={property.Id} />
            case "ColorPicker": return <ColorPicker2 {...props} key={property.Id} />
            default: return null;
        }
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
}