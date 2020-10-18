export default {
    searchOrder(id, actionType, data) {
        this.searchQuery(id, actionType, data);
    },
    setsearchOrder(id, actionType, data) {
        this.setsearchQuery(id, actionType, data)
    },
    createOrder(id, actionType, data) {
        const { entityData } = data;

        const payload = { action: this.getAction(id, actionType) };
        payload.formData = {
            Param: JSON.stringify(entityData),
            Act: 'Gifts_CreateGiftBill'
        }

        this.dvaActions.dispatch(this.serviceName, "createOrder", payload);
    }

}