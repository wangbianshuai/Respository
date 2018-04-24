import React from "react"
import * as Common from "../utils/Common"
import Index from "./Index"
import { Upload, message, Button, Icon } from "antd";

export default class Upload2 extends Index {
    constructor(props) {
        super(props)

        this.InitState = {
            UploadUrl: this.Property.UploadUrl,
            Accept: this.Property.Accept,
            Value: []
        }

        this.Property.SetUploadState = (state) => this.setState(state);
    }

    componentWillMount() {
        if (this.Property.IsInitState) this.Property.InitState();
    }

    OnChange(data) {
        const { Property } = this.props;
        let fileList = data.fileList;

        if (data.file.status === "error") {
            this.ShowMessage(`${data.file.name} 文件上传失败！`);
        }
        else if (data.file.status === "done") {
            const response = data.file.response;
            if (response) {
                if (Property.SetResponse) Property.SetResponse(response);
                else {
                    if (response.IsSuccess) {
                        Property.SetUploadResponse && Property.SetUploadResponse(response)
                    }
                    else if (response.Message) this.ShowMessage(response.Message);
                }
            }
        }

        fileList = fileList.map((file) => {
            if (file.response && file.response.FilePath) file.url = file.response.FilePath;
            else if (Property.SetResponseUrl) file.url = Property.SetResponseUrl(file);
            return file;
        });

        this.setState({ Value: fileList });
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

        if (this.Property.BeforeUpload) return this.Property.BeforeUpload(file);

        return true
    }

    render() {
        const { Property } = this.props;

        return (
            <Upload name={Property.Name}
                action={this.GetFullUrl(this.state.UploadUrl)}
                accept={this.state.Accept}
                headers={Property.Headers}
                fileList={this.state.Value}
                beforeUpload={this.BeforeUpload.bind(this)}
                onChange={this.OnChange.bind(this)} >
                <Button disabled={this.state.Disabled}>
                    <Icon type="upload" />  {Property.UploadText || "上传"}
                </Button>
            </Upload>
        );
    }
}