import { EntityPageEdit } from "PageTemplates";

export default EntityPageEdit("boygirl_userStatus", "MarriageUser", '', 1200, {
  expandInit() {
    this.pageData.title = document.title + '-审核状态';
    this.statusProperty = this.getProperty('Status');
    this.noPassReasonProperty = this.getProperty('NoPassReason');
    this.statusProperty.valueChange = this.statusValueChange.bind(this);
  },
  statusValueChange(value) {
    const isVisible = value === 2;
    if (this.noPassReasonProperty.setVisible) this.noPassReasonProperty.setVisible(isVisible);
    this.noPassReasonProperty.isVisible = isVisible;
  }
}, ['getUserStatusByMatchmaker', 'updateUserStatusByMatchmaker']);