import { EntityPageInfo } from "PageTemplates";

export default EntityPageInfo("marriage_detail", "MarriageArrangeUser", '连理缘', 1700, {
  getUserConditionTypesPayload({ payload }) {
    payload.UserId = this.pageData.userId;
    return payload;
  }
}, ["getUserByUser", 'getUserConditionTypesByUser']);