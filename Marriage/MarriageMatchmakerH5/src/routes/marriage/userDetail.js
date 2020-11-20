import { EntityPageInfo } from "PageTemplates";

export default EntityPageInfo("marriage_userDetail", "MarriageArrangeUser", '连理缘', 2000, {
  getUserConditionTypesPayload({ payload }) {
    payload.UserId = this.pageData.userId;
    payload.marriageArrangeId = this.pageData.marriageArrangeId;
    return payload;
  }
}, ["getUserByMatchmaker", 'getUserConditionTypesByMatchmaker']);