import { Common } from 'UtilsCommon';

export default {
  getUserStatusByMatchmaker(id, actionType, data) {
    const payload = { action: this.getAction(id, actionType) };
    payload.UserId = data.pageData.userId;
    this.dvaActions.dispatch(this.serviceName, "getUserStatusByMatchmaker", payload);
  },
  updateUserStatusByMatchmaker(id, actionType, data) {
    const payload = { action: this.getAction(id, actionType) };
    const { entityData, pageData } = data;
    payload.UserId = pageData.userId;
    payload.Status = entityData.Status;
    if (entityData.Status !== 2) payload.NoPassReason = '';
    else {
      if (Common.isNullOrEmpty(entityData.NoPassReason)) {
        this.dispatch(id, actionType, { isSuccess: false, message: '当选择审核不通过时，需填不通过原因' })
        return;
      }
      payload.NoPassReason = entityData.NoPassReason;
    }
    this.dvaActions.dispatch(this.serviceName, "updateUserStatusByMatchmaker", payload);
  }
}