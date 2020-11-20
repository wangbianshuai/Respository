import { EntityPageEdit } from "PageTemplates";

export default EntityPageEdit("marriage_conditionType", "MarriageArrangeUser", '', 1900, {
  expandInit() {
    this.getProperty('title').label = this.pageData.title;
    this.pageData.title = document.title + '-' + this.pageData.title;
  }
}, ['getUserConditionTypeByMatchmaker']);