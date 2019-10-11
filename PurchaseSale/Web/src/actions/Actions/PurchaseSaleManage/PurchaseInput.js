export default {
    SumbitEntityData(id, actionType, data) {
        data.EntityData.PurchaseStatus = 1;
        this.SaveEntityData(id, actionType, data);
    }
}