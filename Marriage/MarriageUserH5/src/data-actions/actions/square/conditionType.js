export default {
  getUserConditionTypeByUser(id, actionType, data) {
    const payload = { action: this.getAction(id, actionType) };
    payload.ConditionTypeId = data.entityData.ConditionTypeId;
    payload.UserConditionTypeId = data.pageData.UserConditionTypeId;
    payload.SelectType = 1;
    payload.Type = 1;
    payload.UserId = data.pageData.userId;
    this.dvaActions.dispatch(this.serviceName, "getUserConditionTypeByUser", payload);
  }
}