import { EntityPageInfo } from "PageTemplates";

export default EntityPageInfo("boygirl_selectLover", "MarriageUser", document.title + '-择偶标准', 900, {
  getUserConditionTypesPayload({ payload }) {
    payload.UserId = this.pageData.userId;
    return payload;
  }
}, ["getUserConditionTypesByMatchmaker"]);