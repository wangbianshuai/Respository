import React, { Component } from "react"
import * as Common from "../utils/Common"
import Index from "./Index"
import { Upload, message, Button, Icon } from "antd";

export default class Upload2 extends Index {
    constructor(props) {
        super(props)

        this.state = {
            UploadUrl: props.Property.UploadUrl,
            Accept: props.Property.Accept
        };
    }

    componentWillMount() {
        this.Property.SetAccept = () => this.setState({ Accept: this.Property.Accept });
    }

    OnChange(data) {
        const { Property } = this.props;

        if (data.file.status === "error") {
            this.ShowMessage(`${data.file.name} 文件上传失败！`);
        }
        else if (data.file.status === "done") {
            const response = data.file.response;
            if (!Common.IsNullOrEmpty(response)) {
                try {
                    const obj = JSON.stringify(response);
                    if (obj.IsSuccess) {
                        Property.SetUploadResponse && Property.SetUploadResponse(obj)
                    }
                    else if (obj.Message) this.ShowMessage(obj.Message);
                }
                catch (ex) {
                    this.ShowMessage(response);
                }
            }
        }
    }

    GetFullUrl(url) {
        url = url === undefined ? "" : url;
        if (url.indexOf("http") !== 0) url = this.GetRootPath() + url
        return Common.AddUrlRandom(url)
    }

    GetRootPath() {
        return Common.DataApiUrl.replace("api/", "UploadHandler.ashx")
    }

    ShowSuccess(msg) {
        message.success(msg, 3)
    }

    ShowMessage(msg) {
        message.warning(msg, 3)
    }

    BeforeUpload(file) {
        const { Property } = this.props;

        if (Property.Accept) {
            const type = Property.Accept.replace(new RegExp(",", "g"), "|");
            const reg = new RegExp(type)

            const names = file.name.split('.');
            const ft = "." + names[names.length - 1];

            if (!reg.test(ft)) {
                this.ShowMessage("请上传" + type + "文件！");
                return false;
            }
        }

        if (file.size === 0) {
            this.ShowMessage("上传文件大小为零！");
            return false;
        }

        if (Property.FileSize > 0 && file.size > Property.FileSize) {
            this.ShowMessage("上传文件大小不能大于" + Property.FileSizeText + "！");
            return false;
        }

        return true
    }

    render() {
        const { Property } = this.props;

        return (
            <Upload name={Property.Name}
                action={this.GetFullUrl(this.state.UploadUrl)}
                accept={this.state.Accept}
                beforeUpload={this.BeforeUpload.bind(this)}
                onChange={this.OnChange.bind(this)} >
                <Button>
                    <Icon type="upload" /> 上传
                </Button>
            </Upload>
        );
    }
}