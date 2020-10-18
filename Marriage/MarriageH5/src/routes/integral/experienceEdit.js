import { EntityPageEdit } from "PageTemplates";

export default EntityPageEdit("integral_experienceEdit", "Experience", '科研经验详情', 2900, {
    expandInit() {
        this.experienceEditEditProperty = this.getProperty('experienceEditEdit');
        this.deleteButtonProperty = this.getProperty('deleteButton');

        const { ResearchExUID, Status } = this.pageData;

        this.deleteButtonProperty.isVisible = !!ResearchExUID && Status !== '100';

        this.tabs1Property = this.getProperty('tabs1');

        if (this.loginUser.UserType !== 20) {
            this.tabs1Property.tabs = [{ title: '文献', url: "/integral/get?tabPage=0" },
            { title: '调查问卷', url: "/integral/get?tabPage=1" },
            { title: '其它', url: "/integral/get?tabPage=2" }]
        }

        if (ResearchExUID && Status === '10') {
            this.experienceEditEditProperty.properties.forEach(p => {
                if (p.name === 'Status') p.isVisible = true;
                if (p.name === 'ApplicationUIDs' || p.name === 'TechniqueUIDs' || p.name === 'Description' || p.name === 'RealContent') {
                    p.isReadOnly = true;
                }
                else if (p.name != 'save') {
                    p.type = 'LeftRightSpan';
                    p.className = 'divLeftRightSpan'
                    p.isListItem = true;
                }
                else p.isVisible = false;
            });
        }
        else if (ResearchExUID && Status === '100') {
            this.experienceEditEditProperty.properties.forEach(p => {
                if (p.name === 'Status' || p.name === 'Points') p.isVisible = true;
                if (p.name === 'ApplicationUIDs' || p.name === 'TechniqueUIDs' || p.name === 'Description' || p.name === 'RealContent') {
                    p.isReadOnly = true;
                }
                else if (p.name != 'save') {
                    p.type = 'LeftRightSpan';
                    p.className = 'divLeftRightSpan'
                    p.isListItem = true;
                }
                else p.isVisible = false;
            });
        }
    },
    saveEntityDataCallback() {
        this.alertSuccess('保存成功', () => {
            this.toPage('/integral/get?tabPage=1');
        });
    }
}, ['deleteEntityData', 'LibraryService/getApplications', 'LibraryService/getTechniques']);