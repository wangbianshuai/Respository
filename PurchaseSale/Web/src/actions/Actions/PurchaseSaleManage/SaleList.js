export default {
    UpdateSaleStatus2(id, actionType, data) {
        const primaryKey = data.SelectRowKeys[0];
        const { RowVersion } = data.SelectDataList[0];
        const entityData = { RowVersion, Id: primaryKey, SaleStatus: 2 }
        const pathQuery = `(${primaryKey})`;
        this.DvaActions.Dispatch(this.ServiceName, "UpdateSaleStatus2", { PathQuery: pathQuery, Sale: entityData, Action: this.GetAction(id, actionType) });
    },
    UpdateSaleStatus3(id, actionType, data) {
        const primaryKey = data.SelectRowKeys[0];
        const { RowVersion } = data.SelectDataList[0];
        const entityData = { RowVersion, Id: primaryKey, SaleStatus: 3 }
        const pathQuery = `(${primaryKey})`;
        this.DvaActions.Dispatch(this.ServiceName, "UpdateSaleStatus3", { PathQuery: pathQuery, Sale: entityData, Action: this.GetAction(id, actionType) });
    },
    GetEntityData(id, actionType, data) {
        const { PrimaryKey } = data.Entity;
        const primaryKey = data.EntityData[PrimaryKey];
        const pathQuery = `/GetSale(${primaryKey})`;
        this.DvaActions.Dispatch(this.ServiceName, "GetEntityData", { PathQuery: pathQuery, Action: this.GetAction(id, actionType) });
    }
}