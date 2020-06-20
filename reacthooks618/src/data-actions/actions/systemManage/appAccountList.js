export default {
  updateStatus(id, actionType, data) {
    const primaryKey = data.selectRowKeys[0];
    const { RowVersion, Status } = data.selectDataList[0];
    const entityData = { RowVersion, AppAcountId: primaryKey, Status: Status === 1 ? 2 : 1 }
    const pathQuery = `(${primaryKey})`;
    this.dvaActions.dispatch(this.serviceName, "updateStatus", { pathQuery, AppAccount: entityData, action: this.getAction(id, actionType) });
  }
}