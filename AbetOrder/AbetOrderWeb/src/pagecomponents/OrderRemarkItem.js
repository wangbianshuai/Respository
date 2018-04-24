import React from "react"
import Index from "./Index"
import { Input, InputNumber, Row, Col, Divider } from "antd";
import * as Common from "../utils/Common";
import ModalDialog from "../components/ModalDialog";
const { TextArea } = Input;

export default class OrderRemarkItem extends Index {
    constructor(props) {
        super(props)

        this.state = Object.assign({ RemarkStyleId: "" }, props.Data, );
    }

    componentWillMount() {
        const view = { IsVisible: true, Properties: this.GetStyleEditProperties() }
        view.Properties.forEach(p => {
            p.Id = Common.CreateGuid();
            p.RowId = Common.CreateGuid();
            p.ColId = Common.CreateGuid()
        });

        this.StyleView = view;
        this.StyleEditView = this.InitSetView(view)

        this.RemarkStyleProperty = {
            Title: "设置备注样式", Visible: false,
            Component: this.GetStyleEdit(),
            OnOk: this.SetRemarkStyle.bind(this)
        };
    }

    SetRemarkStyle(e, p, dailog) {
        this.StyleView.Properties.forEach(p => this.props.Data[p.Name] = p.GetValue());
        dailog.Cancel();
        this.setState({ RemarkStyleId: Common.CreateGuid() });
    }

    GetStyleEdit() {
        return this.RenderView(this.StyleEditView);
    }

    GetStyleEditProperties() {
        return [{ Label: "字体", Name: "FontFamily", ColSpan: 20, X: 1, Y: 1, Type: "TextBox", DataType: "string", MaxLength: 50 },
        { Label: "大小", Name: "FontSize", ColSpan: 20, X: 2, Y: 1, DefaultValue: "14px", DataType: "string", Type: "Select", DataSource: this.GetFontSizeDataSource() },
        { Label: "颜色", Name: "FontColor", ColSpan: 20, X: 3, Y: 1, Type: "ColorPicker", DataType: "string", MaxLength: 20 },
        { Label: "是否加粗", Text: "加粗", ColSpan: 20, X: 4, Y: 1, Name: "IsBold", Type: "CheckBox", DataType: "byte", },
        { Label: "是否下划线", Text: "下划线", ColSpan: 20, X: 5, Y: 1, Name: "IsUnderline", Type: "CheckBox", DataType: "byte" }]
    }

    GetFontSizeDataSource() {
        return [{ Value: "12px", Text: "12px" }, { Value: "14px", Text: "14px" },
        { Value: "16px", Text: "16px" }, { Value: "18px", Text: "18px" },
        { Value: "20px", Text: "20px" }, { Value: "22px", Text: "22px" },
        { Value: "24px", Text: "24px" }, { Value: "26px", Text: "26px" },
        { Value: "28px", Text: "28px" }, { Value: "30px", Text: "30px" },
        { Value: "32px", Text: "32px" }, { Value: "34px", Text: "34px" }, { Value: "36px", Text: "36px" }]
    }

    RenderInputNumber(name, placeholder, max, min, step, maxLength, readOnly) {
        let value = this.state[name];
        value = value === undefined ? "" : value;

        if (readOnly) {
            return <Input placeholder={placeholder}
                readOnly={readOnly}
                value={value} />
        }
        else {
            return <InputNumber placeholder={placeholder}
                style={{ width: "100%" }}
                onChange={this.InputNumberChange.bind(this, name)}
                maxLength={maxLength || 10}
                max={max}
                min={min}
                readOnly={readOnly}
                step={step}
                value={value} />
        }
    }

    RenderRemarkStyleDialog() {
        return <ModalDialog Property={this.RemarkStyleProperty} Page={this.props.Page} />
    }

    SetStyle() {
        let v = null;
        this.StyleView.Properties.forEach(p => {
            v = this.props.Data[p.Name];
            if (p.Name === "FontSize" && Common.IsNullOrEmpty(v)) v = "14px";
            if (p.SetValue) p.SetValue(v);
            else p.Value = v;
        });
        this.RemarkStyleProperty.SetVisible(true);
    }

    InputNumberChange(name, value) {
        const data = {};
        data[name] = value;
        this.props.Data[name] = data[name];
        this.setState(data);
    }

    render() {
        return (<div>
            <Row gutter={6} style={{ padding: "8px 8px" }}>
                <Col span={2}>
                    {this.RenderInputNumber("DisplayIndex", "", 99, 1, 1, 2, !this.props.IsEdit)}
                </Col>
                <Col span={19}>
                    {this.RenderRemark()}
                </Col>
                {this.props.IsEdit ?
                    <Col span={3}>
                        <a style={{ lineHeight: "32px" }} onClick={this.SetStyle.bind(this)}>样式</a>
                        <Divider type="vertical" />
                        <a style={{ lineHeight: "32px" }} onClick={this.props.Delete}>删除</a>
                    </Col> : null}
            </Row>
            {this.props.IsEdit ? this.RenderRemarkStyleDialog() : null}
        </div>)
    }

    RenderRemark() {
        const d = this.props.Data;
        const s = {};
        if (d.FontFamily) s.fontFamily = d.FontFamily;
        if (d.FontSize) s.fontSize = d.FontSize;
        if (d.FontColor) s.color = d.FontColor;
        if (d.IsBold) s.fontWeight = 700;
        if (d.IsUnderline) s.textDecoration = "underline";

        return <TextArea rows={2}
            placeholder={"备注"}
            onChange={this.OnChangeRemark.bind(this)}
            maxLength={200}
            style={s}
            readOnly={!this.props.IsEdit}
            value={this.state.Remark} />
    }

    OnChangeRemark(e) {
        this.props.Data.Remark = e.target.value;
        this.setState({ Remark: e.target.value })
    }
}