import { EntityPageInfo } from "PageTemplates";

export default EntityPageInfo("marriage_detail", "MarriageArrangeUser", '连理缘', 2000, {
  getUserConditionTypesPayload({ payload }) {
    payload.UserId = this.pageData.userId;
    return payload;
  }
}, ["getUserByMatchmaker", 'getUserConditionTypesByMatchmaker']);