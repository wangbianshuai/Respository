export default {
    getAppMatchmaker(id, actionType, data) {
        const payload = { action: this.getAction(id, actionType) };
        payload.UserId = data.pageData.userId;
        payload.MarriageArrangeId = data.pageData.marriageArrangeId;
        this.dvaActions.dispatch(this.serviceName, "getAppMatchmaker", payload);
    }
  }