import { EntityPageEdit } from "PageTemplates";

export default EntityPageEdit("marriageManage_marriageArrangeEdit", "MarriageArrange", 1200, {
  expandInit() {
    this.manUserIdProperty = this.getProperty('ManUserId');
    this.manUserIdProperty.valueChange = (value, selectData) => this.manUserIdProperty.MatchmakerId = selectData ? selectData.MatchmakerId : undefined;
    this.womanUserIdProperty = this.getProperty('WomanUserId');
    this.womanUserIdProperty.valueChange = (value, selectData) => this.womanUserIdProperty.MatchmakerId = selectData ? selectData.MatchmakerId : undefined;
  },
  expandSetEntityData({ entityData, props, view }) {
    if (!this.pageData.MarriageArrangeId) entityData.SourceType = 3;
    entityData.ManMatchmakerId = this.manUserIdProperty.MatchmakerId;
    entityData.WomanMatchmakerId = this.womanUserIdProperty.MatchmakerId;
    return entityData;
  }
});