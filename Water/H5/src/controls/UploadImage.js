import React from "react"
import BaseIndex from "./BaseIndex";
import { MapToProps } from "ReactCommon";
import { Modal, Toast } from "antd-mobile";

class UploadImage extends BaseIndex {
    constructor(props) {
        super(props)

        this.state = Object.assign({ FileName: "", downLoadURL: "" }, this.state);

        this.GetFile(this.state.Value, true);
		
        if (props.Property.IsUrlValue) {
            props.Property.GetValue = this.GetUrlValue.bind(this);
            props.Property.SetValue = this.SetUrlValue.bind(this);
        }
		props.Property.GetUrlValue = this.GetUrlValue.bind(this);
		props.Property.SetUrlValue = this.SetUrlValue.bind(this);
    }

    GetUrlValue() {
        return this.state.downLoadURL;
    }

    SetUrlValue(value) {
        if (!value) return value;
        const vs = value.split("/");
        const fileName = vs[vs.length - 1];
        this.setState({ downLoadURL: value, FileName: fileName })
    }

    StateValueChange(value) {
        if (this.Property.IsUrlValue) return;
        if (!this.IsUpload) this.GetFile(value);
        else this.IsUpload = false;
    }

    GetFile(value, blInit) {
        if (!value) { if (!blInit) this.setState({ FileName: "" }); return; }
        const bizCode = this.Property.BidCode;
        const fileIds = value;
        const payload = { Url: `files?fileIds=[${fileIds}]&bizCode=${bizCode}` }
        this.props.DispatchAction("FileCenterService", "GetFiles", payload).then(res => this.ReceiveFile(res));
    }

    ReceiveFile(res) {
        let fileName = "", downLoadURL = "";
        if (res.items && res.items.length > 0) {
            fileName = res.items[0].fileName;
            downLoadURL = res.items[0].downLoadURL;
        }
        this.setState({ FileName: fileName, downLoadURL })
    }

    ShowInfo(msg) {
        Toast.info(msg, 2)
    }

    OnChange(e) {
        const file = e.target.files[0];
		
		if (file === undefined){return}
        if (!/image/.test(file.type)) { this.ShowInfo("请选择图片"); e.target.value = '';return; }
        
        if (this.Property.IsUploadOpenAccountFile){
			const reg = /\.(jpg|jpeg)$/i;
			if (!reg.test(file.name)) { this.ShowInfo("请选择jpg、jpeg格式图片");e.target.value = ''; return; }
	
			// 大于 3MB
			if (file && file.size > 1024 * 1024 * 3) { this.ShowInfo('请使用小于3MB的图片');e.target.value = ''; return }
		}else{
			const reg = /\.(jpg|jpeg|png)$/i;
			if (!reg.test(file.name)) { this.ShowInfo("请选择jpg、jpeg、png格式图片"); e.target.value = ''; return; }
	
			// 大于 10MB
			if (file && file.size > 1024 * 1024 * 10) { this.ShowInfo('请使用小于10MB的图片');e.target.value = ''; return }
		}
		
        const bizCode = this.Property.BidCode;
        const fileDir = this.Property.DirName;
        const formData = new FormData();
        formData.append("file", file, file.name);
        const payload = { Url: `files?fileDir=${fileDir}&bizCode=${bizCode}`, FormData: formData }
        this.props.DispatchAction("FileCenterService", "UploadFiles", payload).then(res => this.ReceiveUploadFiles(res, file.name));
    }

    ReceiveUploadFiles(res, fileName) {
    	console.log(res)
        if (res.fileId) {
            this.IsUpload = true;
            this.setState({ FileName: fileName, Value: res.fileId, downLoadURL: res.fileURL });
        }
    }

    RenderImage2() {
        const { Label, ClassName } = this.props.Property;
        const { downLoadURL } = this.state;

        const uploadDefault = this.EventActions.GetClassName("upload-default");
        const uploadImg = this.EventActions.GetClassName("upload-img");
        return (
            <div className={ClassName}>
                <div className={uploadDefault}>
                    <i></i>
                    <span>{Label}</span>
                    <input type="file" onChange={this.OnChange.bind(this)} />
                </div>
                {downLoadURL && <div className={uploadImg}>
                    <img src={downLoadURL} alt="" />
                </div>}
            </div>
        )
    }

    LookImage() {
        const { downLoadURL, FileName } = this.state;
        if (!downLoadURL || !FileName) return;

        Modal.alert(FileName, <div className="ModalImage"><img src={downLoadURL} alt="" /></div>);
    }

    render() {
        const { FileName } = this.state;
        const { IsImage2, Label } = this.props.Property;

        if (IsImage2) return this.RenderImage2();

        return (
            <div className="UploadImage">
                <label>{Label}</label>
                <div className="file-upload">
                    <p onClick={this.LookImage.bind(this)}>{FileName ? FileName : "请选择要上传的照片"}</p>
                    <i>选择&nbsp;&gt;</i>
                    <input type="file" onChange={this.OnChange.bind(this)} />
                </div>
            </div>
        )
    }
}

function setProps(owner, page) {
    return {
        DispatchAction: owner.DispatchAction
    }
}

export default MapToProps(setProps)(UploadImage);