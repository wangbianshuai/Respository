export default {
    saveEntityData(id, actionType, data) {
        const { primaryKey } = data.entity;
        const { entityData } = data;
        let primaryKeyValue = data.oldEntityData && data.oldEntityData[primaryKey] ? data.oldEntityData[primaryKey] : null;
        if (primaryKeyValue) entityData[primaryKey] = primaryKeyValue;

        const payload = { action: this.getAction(id, actionType), ...entityData };

        this.dvaActions.dispatch(this.serviceName, "saveEntityData", payload);
    }
  }