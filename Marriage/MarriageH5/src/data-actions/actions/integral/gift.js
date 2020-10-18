export default {
    addCart(id, actionType, data) {
        const { UID } = data.oldEntityData;
        const entityData = { GiftUID: UID, Quantity: 1, Detail: '' }

        const payload = { action: this.getAction(id, actionType) };

        payload.formData = {
            Param: JSON.stringify(entityData),
            Act: 'Gifts_AddGiftToCart'
        }

        this.dvaActions.dispatch(this.serviceName, "addCart", payload);
    },
}