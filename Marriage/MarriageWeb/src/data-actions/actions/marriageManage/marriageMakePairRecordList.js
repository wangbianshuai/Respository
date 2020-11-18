export default {
  getMarriageMakePairsDetails(id, actionType, data) {
    const { primaryKey } = data.entity;
    const primaryKeyValue = data.entityData[primaryKey];
    const pathQuery = `(${primaryKeyValue})`;
    this.dvaActions.dispatch(this.serviceName, "getMarriageMakePairsDetails", { pathQuery, action: this.getAction(id, actionType) });
  }
}