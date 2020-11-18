export default {
    createMarriageArrange(id, actionType, data) {
        const { name } = data.entity;

        data.entityData.ManMatchmakerId = data.oldEntityData.ManMatchmakerId;
        data.entityData.WomanMatchmakerId = data.oldEntityData.WomanMatchmakerId;
        data.entityData.ManUserId = data.oldEntityData.ManUserId;
        data.entityData.WomanUserId = data.oldEntityData.WomanUserId;
        data.entityData.SourceType = 1;

        const payload = { action: this.getAction(id, actionType) };
        payload[name] = data.entityData;

        this.dvaActions.dispatch('MarriageArrangeService', 'createMarriageArrange', payload);
    },
    getMarriageMakePairsDetails(id, actionType, data) {
        const { primaryKey } = data.entity;
        const primaryKeyValue = data.entityData[primaryKey];
        const pathQuery = `(${primaryKeyValue})`;
        this.dvaActions.dispatch(this.serviceName, "getMarriageMakePairsDetails", { pathQuery, action: this.getAction(id, actionType) });
    },
    getMarriageMakePairsDetails2(id, actionType, data) {
        const { primaryKey } = data.entity;
        const primaryKeyValue = data.entityData[primaryKey];
        const pathQuery = `(${primaryKeyValue})`;
        this.dvaActions.dispatch(this.serviceName, "getMarriageMakePairsDetails2", { pathQuery, action: this.getAction(id, actionType) });
    }
}