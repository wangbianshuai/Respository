export default {
    UpdatePurchaseStatus2(id, actionType, data) {
        const primaryKey = data.SelectRowKeys[0];
        const { RowVersion } = data.SelectDataList[0];
        const entityData = { RowVersion, Id: primaryKey, PurchaseStatus: 2 }
        const pathQuery = `(${primaryKey})`;
        this.DvaActions.Dispatch(this.ServiceName, "UpdatePurchaseStatus2", { PathQuery: pathQuery, Purchase: entityData, Action: this.GetAction(id, actionType) });
    },
    UpdatePurchaseStatus3(id, actionType, data) {
        const primaryKey = data.SelectRowKeys[0];
        const { RowVersion } = data.SelectDataList[0];
        const entityData = { RowVersion, Id: primaryKey, PurchaseStatus: 3 }
        const pathQuery = `(${primaryKey})`;
        this.DvaActions.Dispatch(this.ServiceName, "UpdatePurchaseStatus3", { PathQuery: pathQuery, Purchase: entityData, Action: this.GetAction(id, actionType) });
    },
    GetEntityData(id, actionType, data) {
        const { PrimaryKey } = data.Entity;
        const primaryKey = data.EntityData[PrimaryKey];
        const pathQuery = `/GetPurchase(${primaryKey})`;
        this.DvaActions.Dispatch(this.ServiceName, "GetEntityData", { PathQuery: pathQuery, Action: this.GetAction(id, actionType) });
    }
}