export default {
    UpdateProductStatus(id, actionType, data) {
        const primaryKey = data.SelectRowKeys[0];
        const { RowVersion, ProductStatus } = data.SelectDataList[0];
        const entityData = { RowVersion, Id: primaryKey, ProductStatus: ProductStatus === 0 ? 1 : 0 }
        const pathQuery = `(${primaryKey})`;
        this.DvaActions.Dispatch(this.ServiceName, "UpdateProductStatus", { PathQuery: pathQuery, Product: entityData, Action: this.GetAction(id, actionType) });
    }
}