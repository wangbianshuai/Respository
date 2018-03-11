import * as Common from "../utils/Common";

export default class StaticSource {
    constructor(pageConfig, page) {
        this.PageConfig = pageConfig;
        this.Page = page;
        this.InitLoad()
    }

    InitLoad() {
        this.FileUploadProperty = null;
        this.PageConfig.EditView.Properties.forEach(p => {
            if (p.Name === "FileType") this.SetFileType(p);
            else if (p.Name === "FileUpload") this.FileUploadProperty = p;
        });
    }

    SetFileType(p) {
        p.SelectChanged = (value, selectData) => {
            if (selectData != null) {
                this.FileUploadProperty.Accept = selectData.Accept;
                this.FileUploadProperty.FileSize = selectData.FileSize;
                this.FileUploadProperty.FileSizeText = selectData.FileSizeText;

                this.FileUploadProperty.SetAccept && this.FileUploadProperty.SetAccept();
            }
        };
    }
}