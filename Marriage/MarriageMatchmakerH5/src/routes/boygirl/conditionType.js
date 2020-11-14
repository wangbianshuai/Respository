import { EntityPageEdit } from "PageTemplates";

export default EntityPageEdit("boygirl_conditionType", "MarriageUser", '', 1100, {
  expandInit() {
    this.getProperty('title').label = this.pageData.title;
    this.pageData.title = document.title + '-' + this.pageData.title;
  }
}, ['getUserConditionTypeByMatchmaker']);