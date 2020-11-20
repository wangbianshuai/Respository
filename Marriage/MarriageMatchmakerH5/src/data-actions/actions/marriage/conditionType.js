export default {
  getUserConditionTypeByMatchmaker(id, actionType, data) {
    const payload = { action: this.getAction(id, actionType) };
    payload.ConditionTypeId = data.entityData.ConditionTypeId;
    payload.UserConditionTypeId = data.pageData.UserConditionTypeId;
    payload.SelectType = 1;
    payload.UserId = data.pageData.userId;
    payload.marriageArrangeId = data.pageData.marriageArrangeId;
    this.dvaActions.dispatch(this.serviceName, "getUserConditionTypeByMatchmaker", payload);
  }
}