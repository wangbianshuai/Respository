export default {
    getMatchmakerById(id, actionType, data) {
        const payload = { action: this.getAction(id, actionType) };
        payload.matchmakerId= data.pageData.matchmakerId;
        payload.marriageArrangeId= data.pageData.marriageArrangeId;
        this.dvaActions.dispatch(this.serviceName, "getMatchmakerById", payload);
    }
}