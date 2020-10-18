import { EntityPageEdit } from "PageTemplates";

export default EntityPageEdit("integral_documentEdit", "Document", '文献详情', 3000, {
    expandInit() {
        this.documentEditEditProperty = this.getProperty('documentEditEdit');
        this.deleteButtonProperty = this.getProperty('deleteButton');

        const { ClientDocumentsUID, Status } = this.pageData;

        this.deleteButtonProperty.isVisible = !!ClientDocumentsUID && Status !== '100';

        this.tabs1Property = this.getProperty('tabs1');

        if (this.loginUser.UserType !== 20) {
            this.tabs1Property.tabs = [{ title: '文献', url: "/integral/get?tabPage=0" },
            { title: '调查问卷', url: "/integral/get?tabPage=1" },
            { title: '其它', url: "/integral/get?tabPage=2" }]
        }

        if (!ClientDocumentsUID) {
            this.filesUIDProperty = this.getProperty('FilesUID');
            this.filesUIDProperty.isNew = true;
        }

        if (ClientDocumentsUID && Status === '10') {
            this.documentEditEditProperty.properties.forEach(p => {
                if (p.name === 'Status') p.isVisible = true;
                if (p.name === 'ApplicationUIDs' || p.name === 'TechniqueUIDs' || p.name === 'FilesUID' || p.name === 'Keywords') {
                    p.isReadOnly = true;
                }
                else if (p.name != 'save') {
                    p.type = 'LeftRightSpan';
                    p.className = 'divLeftRightSpan2'
                    p.isListItem = true;
                }
                else p.isVisible = false;
            });
        }
        else if (ClientDocumentsUID && Status === '100') {
            this.documentEditEditProperty.properties.forEach(p => {
                if (p.name === 'Status' || p.name === 'Points') p.isVisible = true;
                if (p.name === 'ApplicationUIDs' || p.name === 'TechniqueUIDs' || p.name === 'FilesUID' || p.name === 'Keywords') {
                    p.isReadOnly = true;
                }
                else if (p.name != 'save') {
                    p.type = 'LeftRightSpan';
                    p.className = 'divLeftRightSpan2'
                    p.isListItem = true;
                }
                else p.isVisible = false;
            });
        }
    },
    saveEntityDataCallback() {
        this.alertSuccess('保存成功', () => {
            this.toPage('/integral/get?tabPage=0');
        });
    }
}, ['deleteEntityData', 'LibraryService/getApplications', 'LibraryService/getTechniques', 'getFilesUID', 'downloadFile', 'uploadFile', 'deleteFile']);