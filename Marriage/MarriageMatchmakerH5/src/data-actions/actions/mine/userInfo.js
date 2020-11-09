export default {
  updateUserInfo(id, actionType, data) {
    const { entityData } = data;

    const payload = { action: this.getAction(id, actionType), ...entityData };

    this.dvaActions.dispatch(this.serviceName, "updateUserInfo", payload);
  }
}