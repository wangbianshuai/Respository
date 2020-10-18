import { EntityPageEdit } from "PageTemplates";

export default EntityPageEdit("integral_getEdit", "Integral", '申请详情', 2500, {
    expandInit() {
        this.getEditEditProperty = this.getProperty('getEditEdit');
        this.deleteButtonProperty = this.getProperty('deleteButton');

        const { PointRequireUID, Status } = this.pageData;

        this.deleteButtonProperty.isVisible = !!PointRequireUID && Status !== '100';

        this.tabs1Property = this.getProperty('tabs1');

        if (this.loginUser.UserType !== 20) {
            this.tabs1Property.tabs = [{ title: '文献', url: "/integral/get?tabPage=0" },
            { title: '调查问卷', url: "/integral/get?tabPage=1" },
            { title: '其它', url: "/integral/get?tabPage=2" }]

            this.pageData.tabPage = 2
        }
        else this.pageData.tabPage = 3;

        if (PointRequireUID && Status === '10') {
            this.getEditEditProperty.properties.forEach(p => {
                if (p.name === 'Status') p.isVisible = true;
                if (p.name != 'save') {
                    p.type = 'LeftRightSpan';
                    p.className = 'divLeftRightSpan'
                    p.isListItem = true;
                }
                else p.isVisible = false;
            });
        }
        else if (PointRequireUID && Status === '100') {
            this.getEditEditProperty.properties.forEach(p => {
                if (p.name === 'Status' || p.name === 'Points') p.isVisible = true;
                if (p.name != 'save') {
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
            this.toPage('/integral/get?tabPage='+ this.pageData.tabPage);
        });
    }
}, ['deleteEntityData']);