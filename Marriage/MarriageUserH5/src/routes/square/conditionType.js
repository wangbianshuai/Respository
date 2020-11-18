import { EntityPageEdit } from "PageTemplates";

export default EntityPageEdit("square_conditionType", "MarriageSquareUser", '', 1300, {
  expandInit() {
    this.getProperty('title').label = this.pageData.title;
    this.pageData.title = document.title + '-' + this.pageData.title;
  }
}, ['getUserConditionTypeByUser']);