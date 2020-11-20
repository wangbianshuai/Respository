import { EntityPageInfo } from "PageTemplates";

export default EntityPageInfo("marriage_selectLover", "MarriageArrangeUser", document.title + '-择偶标准', 2200, {
  getUserConditionTypesPayload({ payload }) {
    payload.UserId = this.pageData.userId;
    return payload;
  }
}, ["getUserConditionTypesByMatchmaker"]);