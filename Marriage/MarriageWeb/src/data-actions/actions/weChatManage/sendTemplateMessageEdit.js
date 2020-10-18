export default {
    saveEntityDataToSend(id, actionType, data) {
        const { name, primaryKey } = data.entity;
        const primaryKeyValue = data.oldEntityData && data.oldEntityData[primaryKey] ? data.oldEntityData[primaryKey] : null;

        var pathQuery;
        if (primaryKeyValue) {
            data.entityData[primaryKey] = primaryKeyValue;
            pathQuery = `(${primaryKeyValue})`;
        }

        const payload = { action: this.getAction(id, actionType) };
        payload[name] = data.entityData;
        payload.pathQuery = pathQuery

        this.dvaActions.dispatch(this.serviceName, "saveEntityDataToSend", payload);
    }
}