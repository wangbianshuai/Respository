export default {
  getUserConditionType(id, actionType, data) {
    const payload = { action: this.getAction(id, actionType) };
    payload.ConditionTypeId = data.entityData.ConditionTypeId;
    payload.UserConditionTypeId = data.pageData.UserConditionTypeId;
    payload.SelectType = 1;
    this.dvaActions.dispatch(this.serviceName, "getUserConditionType", payload);
  },
  saveUserConditionType(id, actionType, data) {
    const { entityData } = data;

    const payload = { action: this.getAction(id, actionType), ...entityData };
    payload.ConditionTypeId = data.pageData.ConditionTypeId;
    payload.UserConditionTypeId = data.pageData.UserConditionTypeId;
    payload.SelectType = 1;

    this.dvaActions.dispatch(this.serviceName, "saveUserConditionType", payload);
  }
}