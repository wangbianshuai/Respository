import { useMemo, useState, useEffect } from "react"
import { Common, EnvConfig } from "UtilsCommon"
import BaseIndex from "./BaseIndex"
import { Upload, message, Button, Icon } from "antd";

export default (props) => {
    const instance = useMemo(() => new Upload2(), []);

    instance.Init2(props);

    const { ClassName, Style, IsVisible } = instance.InitialState;

    instance.InitState("ClassName", useState(ClassName));
    instance.InitState("Style", useState(Style));
    instance.InitState("IsVisible", useState(IsVisible));

    instance.InitState("UploadUrl", useState([]));
    instance.InitState("Accept", useState(props.Property.UploadUrl));
    instance.InitState("Value", useState(props.Property.Accept));

    useEffect(() => instance.componentDidMount(), [instance])

    return instance.render();
}

class Upload2 extends BaseIndex {
    Init2(props) {
        if (this.Init(props)) return;

        this.Property.SetUploadState = (state) => this.setState(state);
    }

    componentDidMount() {
        if (this.Property.IsInitState) this.Property.InitState();
    }

    OnChange(data) {
        const { Property, View } = this.props;
        let fileList = data.fileList;

        if (data.file.status === "error") {
            this.ShowMessage(`${data.file.name} 文件上传失败！`);
        }
        else if (data.file.status === "done") {
            const response = data.file.response;
            if (response) {
                if (Property.SetResponse) Property.SetResponse(response, Property, View);
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
        return EnvConfig.GetServiceUrl("ApiService")();
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
        const { Text, ExtLabel, ExtStyle, Name, FileName, Headers } = this.Property;
        const text = Text || "上传";
        const name = FileName || Name;
        return (
            <Upload name={name}
                action={this.GetFullUrl(this.state.UploadUrl)}
                accept={this.state.Accept}
                headers={Headers}
                fileList={this.state.Value}
                withCredentials={true}
                beforeUpload={this.BeforeUpload.bind(this)}
                onChange={this.OnChange.bind(this)} >
                <Button disabled={this.state.Disabled || this.state.IsReadOnly}>
                    <Icon type="upload" /> {text}
                </Button>
                {ExtLabel && <span style={ExtStyle}>{ExtLabel}</span>}
            </Upload>
        );
    }
}