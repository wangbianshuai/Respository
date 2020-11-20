export default {
  getUserByMatchmaker(id, actionType, data) {
    const payload = { action: this.getAction(id, actionType) };
    payload.UserId = data.pageData.userId;
    payload.marriageArrangeId = data.pageData.marriageArrangeId;
    this.dvaActions.dispatch(this.serviceName, "getUserByMatchmaker", payload);
  }
}