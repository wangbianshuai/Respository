export default {
    getUserInfo(id, actionType, data) {
        const payload = { action: this.getAction(id, actionType) };
        this.dvaActions.dispatch(this.serviceName, "getUserInfo", payload);
    }
}