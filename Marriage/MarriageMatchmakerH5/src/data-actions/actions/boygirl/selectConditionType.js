export default {
  getUserConditionTypeByMatchmaker(id, actionType, data) {
    const payload = { action: this.getAction(id, actionType) };
    payload.ConditionTypeId = data.entityData.ConditionTypeId;
    payload.UserConditionTypeId = data.pageData.UserConditionTypeId;
    payload.SelectType = 2;
    payload.UserId = data.pageData.userId;
    this.dvaActions.dispatch(this.serviceName, "getUserConditionTypeByMatchmaker", payload);
  }
}