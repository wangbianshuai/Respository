export default {
    getUserByUser(id, actionType, data) {
        const payload = { action: this.getAction(id, actionType) };
        payload.UserId = data.pageData.userId;
        payload.Type = 1;
        this.dvaActions.dispatch(this.serviceName, "getUserByUser", payload);
    }
}