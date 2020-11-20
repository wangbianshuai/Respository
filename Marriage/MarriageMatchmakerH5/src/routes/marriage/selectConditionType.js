import { EntityPageEdit } from "PageTemplates";

export default EntityPageEdit("marriage_selectConditionType", "MarriageArrangeUser", '', 2100, {
  expandInit() {
    this.getProperty('title').label = this.pageData.title;
  }
}, ['getUserConditionTypeByMatchmaker']);