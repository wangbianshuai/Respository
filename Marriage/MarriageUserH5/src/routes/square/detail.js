import { EntityPageInfo } from "PageTemplates";

export default EntityPageInfo("square_detail", "MarriageSquareUser", '连理缘', 1200, {
  getUserConditionTypesPayload({ payload }) {
    payload.UserId = this.pageData.userId;
    return payload;
  }
}, ["getUserByUser", 'getUserConditionTypesByUser', 'MarriageSquareService/updateMarriageSquareRoseCount']);