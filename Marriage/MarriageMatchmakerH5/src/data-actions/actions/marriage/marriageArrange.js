export default {
    getMarriageArrangeById(id, actionType, data) {
        const payload = { action: this.getAction(id, actionType) };
        payload.marriageArrangeId= data.pageData.marriageArrangeId;
        this.dvaActions.dispatch(this.serviceName, "getMarriageArrangeById", payload);
    }
}