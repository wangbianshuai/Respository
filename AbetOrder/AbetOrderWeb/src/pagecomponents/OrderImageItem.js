import React from "react"
import Index from "./Index"
import { Input, InputNumber, Row, Col } from "antd";
import * as Common from "../utils/Common";
import Upload2 from "../controls/Upload2"

export default class OrderImageItem extends Index {
    constructor(props) {
        super(props)

        this.state = Object.assign({}, props.Data);
    }

    componentWillMount() {
        this.UploadProperty = {
            Id: Common.CreateGuid(),
            Name: "FileUpload",
            UploadUrl: "?EntityName=OrderImage&ft=image",
            IsEdit: false,
            IsInitState: true,
            Accept: ".jpg,.png,.gif", FileSize: 1024 * 1024, FileSizeText: "1M"
        };

        this.UploadProperty.SetUploadResponse = this.SetFileUploadResponse.bind(this);
    }

    SetFileUploadResponse(response) {
        this.props.Data.ImageUrl = response.FilePath;
        this.setState({ ImageUrl: response.FilePath })
    }

    RenderInput(name, placeholder) {
        let value = this.state[name];
        value = value === undefined ? "" : value;

        return <Input placeholder={placeholder}
            onChange={this.OnChange.bind(this)}
            maxLength={50}
            readOnly={!this.props.IsEdit}
            value={value} />
    }

    OnChange(e) {
        const value = e.target.value;
        this.props.Data.Name = value;
        this.setState({ Name: value });
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

    InputNumberChange(name, value) {
        this.props.Data[name] = value;
        const data = {};
        data[name] = value;
        this.setState(data);
    }

    RenderUpload() {
        if (!this.props.IsEdit) return null;

        const props = { Page: this.props.Page, Property: this.UploadProperty, View: this.props.View }
        return <Upload2 {...props} key={this.UploadProperty.Id} />
    }

    render() {
        let url = "";
        if (!Common.IsNullOrEmpty(this.state.ImageUrl)) url = Common.DataApiUrl.replace("api/", "") + this.state.ImageUrl;
        return (<div>
            <Row gutter={6} style={{ padding: "8px 8px", borderBottom: "1px solid #e8e8e8" }}>
                <Col span={2}>
                    {this.RenderInputNumber("DisplayIndex", "", 99, 1, 1, 2, !this.props.IsEdit)}
                </Col>
                <Col span={6}>
                    {this.RenderInput("Name", "图片名称，为空，则保存为\"图+序号\"")}
                </Col>
                <Col span={4}>{!Common.IsNullOrEmpty(url) ?
                    <a href={url} target="_blank" >
                        <img src={url} alt="" border="0" width="120" height="90" />
                    </a> : null}
                </Col>
                {this.props.IsEdit ?
                    <Col span={10}>
                        {this.RenderUpload()}
                    </Col> : null}
                {this.props.IsEdit ?
                    <Col span={2}>
                        <a style={{ lineHeight: "32px" }} onClick={this.props.Delete}>删除</a>
                    </Col> : null}
            </Row>
        </div>)
    }
}