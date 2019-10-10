export default {
    SumbitEntityData(id, actionType, data) {
        data.EntityData.SaleStatus = 1;
        this.SaveEntityData(id, actionType, data);
    }
}