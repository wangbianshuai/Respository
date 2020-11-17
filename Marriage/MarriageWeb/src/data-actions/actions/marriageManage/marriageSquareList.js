export default {
  createMarriageArrange(id, actionType, data) {
    const { name } = data.entity;

    data.entityData.ManMatchmakerId = data.oldEntityData.ManMatchmakerId;
    data.entityData.WomanMatchmakerId = data.oldEntityData.WomanMatchmakerId;
    data.entityData.ManUserId = data.oldEntityData.ManUserId;
    data.entityData.WomanUserId = data.oldEntityData.WomanUserId;
    data.entityData.SourceType = 2;

    const payload = { action: this.getAction(id, actionType) };
    payload[name] = data.entityData;

    this.dvaActions.dispatch('MarriageArrangeService', 'createMarriageArrange', payload);
  }
}