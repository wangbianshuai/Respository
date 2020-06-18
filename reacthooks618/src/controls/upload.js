import React from "react"
import { Common } from "UtilsCommon"
import { EnvConfig } from "Configs"
import BaseIndex from "./BaseIndex"
import { Upload, message, Button, Icon } from "antd";

export default class Upload2 extends BaseIndex {
    constructor(props) {
        super(props)

        this.InitState = Object.assign({
            UploadUrl: this.property.UploadUrl,
            Accept: this.property.Accept,
            Value: []
        }, this.state);

        this.property.setUploadState = (state) => this.setState(state);
    }

    componentDidMount() {
        if (this.property.isInitState) this.property.InitState();
    }

    OnChange(data) {
        const { property, view } = this.props;
        let fileList = data.fileList;

        if (data.file.status === "error") {
            this.ShowMessage(`${data.file.name} 文件上传失败！`);
        }
        else if (data.file.status === "done") {
            const response = data.file.response;
            if (response) {
                if (property.setResponse) property.setResponse(response, property, view);
                else {
                    if (response.isSuccess) {
                        property.setUploadResponse && property.setUploadResponse(response)
                    }
                    else if (response.message) this.ShowMessage(response.message);
                }
            }
        }

        fileList = fileList.map((file) => {
            if (file.response && file.response.FilePath) file.url = file.response.FilePath;
            else if (property.setResponseUrl) file.url = property.setResponseUrl(file);
            return file;
        });

        this.setState({ Value: fileList });
    }

    getFullUrl(url) {
        url = url === undefined ? "" : url;
        if (url.indexOf("http") !== 0) url = this.getRootPath() + url
        return Common.addUrlRandom(url)
    }

    getRootPath() {
        return EnvConfig.getServiceUrl("ApiService")();
    }

    ShowSuccess(msg) {
        message.success(msg, 3)
    }

    ShowMessage(msg) {
        message.warning(msg, 3)
    }

    BeforeUpload(file) {
        const { property } = this.props;

        if (property.Accept) {
            const type = property.Accept.replace(new RegExp(",", "g"), "|");
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

        if (property.FileSize > 0 && file.size > property.FileSize) {
            this.ShowMessage("上传文件大小不能大于" + property.FileSizeText + "！");
            return false;
        }

        if (this.property.BeforeUpload) return this.property.BeforeUpload(file);

        return true
    }

    render() {
        const { text, extLabel, extStyle, name, fileName, headers } = this.property;
        const text2 = text || "上传";
        const name2 = fileName || name;
        return (
            <Upload name={name2}
                action={this.getFullUrl(this.state.UploadUrl)}
                accept={this.state.Accept}
                headers={headers}
                fileList={this.state.Value}
                withCredentials={true}
                beforeUpload={this.BeforeUpload.bind(this)}
                onChange={this.OnChange.bind(this)} >
                <Button disabled={this.state.Disabled || this.state.isReadOnly}>
                    <Icon type="upload" /> {text2}
                </Button>
                {extLabel && <span style={extStyle}>{extLabel}</span>}
            </Upload>
        );
    }
}