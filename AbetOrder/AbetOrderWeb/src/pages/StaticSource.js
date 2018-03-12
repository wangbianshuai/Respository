import * as Common from "../utils/Common";

export default class StaticSource {
    constructor(pageConfig, page) {
        this.PageConfig = pageConfig;
        this.Page = page;
        this.InitLoad()
    }

    InitLoad() {
        this.FileUploadProperty = null;
        this.FilePathProperty = null;
        this.FileTypeProperty = null;
        this.PageConfig.EditView.Properties.forEach(p => {
            if (p.Name === "FileType") { this.FileTypeProperty = p; this.SetFileType(p); }
            else if (p.Name === "FileUpload") this.FileUploadProperty = p;
            else if (p.Name === "FilePath") {
                this.FilePathProperty = p;
                p.ValueChange = this.SetFilePathValueChange;
            }
        });
    }

    SetFilePathValueChange(value) {
        const fileType = this.FileTypeProperty.GetValue ? this.FileTypeProperty.GetValue() : "html";
        this.FileUploadProperty.Upload = "?ft={0}" + fileType + "&fp=" + value;
        this.FileUploadProperty.SetUploadState && this.FileUploadProperty.SetUploadState();
    }

    SetFileType(p) {
        p.SelectChanged = (value, selectData) => {
            if (selectData != null) {
                this.FileUploadProperty.Accept = selectData.Accept;
                this.FileUploadProperty.FileSize = selectData.FileSize;
                this.FileUploadProperty.FileSizeText = selectData.FileSizeText;
                const filePath = this.FilePathProperty.GetValue ? this.FilePathProperty.GetValue() : "";
                this.FileUploadProperty.Upload = "?ft={0}" + value + "&fp=" + filePath;

                this.FileUploadProperty.SetUploadState && this.FileUploadProperty.SetUploadState();
            }
        };
    }
}