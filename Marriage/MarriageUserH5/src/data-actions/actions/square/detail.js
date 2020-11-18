export default {
    getUserByUser(id, actionType, data) {
        const payload = { action: this.getAction(id, actionType) };
        payload.UserId= data.pageData.userId;
        this.dvaActions.dispatch(this.serviceName, "getUserByUser", payload);
    }
}