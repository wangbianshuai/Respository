import { EntityPageInfo } from "PageTemplates";

export default EntityPageInfo("boygirl_detail", "MarriageUser", '连理缘', 600, {
  getUserConditionTypesPayload({ payload }) {
    payload.UserId = this.pageData.userId;
    return payload;
  }
}, ["getUserByMatchmaker", 'getUserConditionTypesByMatchmaker']);