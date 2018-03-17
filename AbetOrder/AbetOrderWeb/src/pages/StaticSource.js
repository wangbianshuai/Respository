import * as Common from "../utils/Common";

export default class StaticSource {
    constructor(pageConfig, page) {
        this.PageConfig = pageConfig;
        this.Page = page;
        this.InitLoad()
    }

    InitLoad() {
        this.PageConfig.EditView.Properties.forEach(p => {
            if (p.Name === "FileType") { this.FileTypeProperty = p; this.SetFileType(p); }
            else if (p.Name === "FileUpload") {
                this.FileUploadProperty = p;
                p.BeforeUpload = this.SetFileUploadBeforeUpload.bind(this);
                p.SetUploadResponse = this.SetFileUploadResponse.bind(this);
            }
            else if (p.Name === "FilePath") {
                this.FilePathProperty = p;
                p.ValueChange = this.SetFilePathValueChange.bind(this);
            }
            else if (p.Name === "FileSize") this.FileSizeProperty = p;
            else if (p.Name === "FileName") this.FileNameProperty = p;
        });

        this.PageConfig.EditView.DataLoad = () => {
            const entityData = this.PageConfig.EditView.EntityData;
            if (entityData != null && !Common.IsNullOrEmpty(entityData.FilePath)) {
                this.FilePathProperty.SetReadonly && this.FilePathProperty.SetReadonly(true);
            }
        };
    }

    SetFileUploadBeforeUpload(file) {
        let names = file.name.split('.');
        const ft = names[names.length - 1];

        const fileName = this.FileNameProperty.GetValue ? this.FileNameProperty.GetValue() : "";

        if (!Common.IsNullOrEmpty(fileName)) {
            names = fileName.split('.');
            const ft2 = names.length > 1 ? names[names.length - 1] : "";
            if (ft != ft2) { this.Page.ShowMessage("上传文件类型与文件名类型不一致！"); return false; }
            return true
        }

        return true;
    }

    SetFileUploadResponse(response) {
        this.FilePathProperty.SetValue(response.FilePath);
        this.FilePathProperty.SetReadonly(true);
        this.FileSizeProperty.SetValue(response.FileSize);
        this.FileNameProperty.SetValue(response.FileName);
    }

    SetFilePathValueChange(value) {
        value = value || "";
        const fileType = this.FileTypeProperty.GetValue ? this.FileTypeProperty.GetValue() : "html";
        const url = "?EntityName=StaticSource&ft=" + fileType + "&fp=" + value;
        this.FileUploadProperty.SetUploadState && this.FileUploadProperty.SetUploadState({ UploadUrl: url });
    }

    SetFileType(p) {
        p.ValueChange = (value, selectData) => {
            if (selectData != null) {
                this.FileUploadProperty.FileSize = selectData.FileSize;
                this.FileUploadProperty.FileSizeText = selectData.FileSizeText;
                const filePath = this.FilePathProperty.GetValue ? this.FilePathProperty.GetValue() || "" : "";
                const url = "?EntityName=StaticSource&ft=" + value + "&fp=" + filePath;

                this.FileUploadProperty.SetUploadState && this.FileUploadProperty.SetUploadState({ Accept: selectData.Accept, UploadUrl: url });
            }
        };
    }
}