export default {
    getUserByMatchmaker(id, actionType, data) {
        const payload = { action: this.getAction(id, actionType) };
        this.dvaActions.dispatch(this.serviceName, "getUserByMatchmaker", payload);
    }
}