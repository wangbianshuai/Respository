import { EntityPageEdit } from "PageTemplates";

export default EntityPageEdit("boygirl_selectConditionType", "MarriageUser", '', 1000, {
  expandInit() {
    this.getProperty('title').label = this.pageData.title;
  }
}, ['getUserConditionTypeByMatchmaker']);