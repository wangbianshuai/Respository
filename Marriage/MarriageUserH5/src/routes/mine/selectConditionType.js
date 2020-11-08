import { EntityPageEdit } from "PageTemplates";

export default EntityPageEdit("mine_selectConditionType", "MarriageUser", '', 900, {
  expandInit() {
    this.getProperty('title').label = this.pageData.title;
  }
}, ['getUserConditionType', 'saveUserConditionType']);