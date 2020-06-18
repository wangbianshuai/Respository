export default {
    UpdateAppAccountStatus(id, actionType, data) {
        const primaryKey = data.SelectRowKeys[0];
        const { RowVersion, Status } = data.SelectDataList[0];
        const entityData = { RowVersion, Id: primaryKey, Status: Status === 1 ? 2 : 1 }
        const pathQuery = `(${primaryKey})`;
        this.DvaActions.Dispatch(this.ServiceName, "UpdateAppAccountStatus", { PathQuery: pathQuery, AppAccount: entityData, Action: this.GetAction(id, actionType) });
    }
}