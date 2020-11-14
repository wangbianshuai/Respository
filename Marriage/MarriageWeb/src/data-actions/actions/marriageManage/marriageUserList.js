import { Common } from 'UtilsCommon';

export default {
  updateStatus(id, actionType, data) {
    const primaryKey = data.selectRowKeys[0];
    const { RowVersion } = data.rowDataList[0];
    const { selectData } = data;

    if (selectData.Status !== 2) selectData.NoPassReason = '';
    else if (Common.isNullOrEmpty(selectData.NoPassReason)) {
      this.dispatch(id, actionType, { isSuccess: false, message: '审核不通过时，不通过原因不能为空' });
      return;
    }

    const entityData = { ...selectData, RowVersion, UserId: primaryKey }

    const pathQuery = `(${primaryKey})`;
    this.dvaActions.dispatch(this.serviceName, "updateStatus", { pathQuery, Matchmaker: entityData, action: this.getAction(id, actionType) });
  },
  getViewEntityData(id, actionType, data) {
    const { primaryKey, expandMethods } = data.entity;
    const method = expandMethods && expandMethods.getEntityData ? "/" + expandMethods.getEntityData : "";
    const primaryKeyValue = data.entityData[primaryKey];
    const pathQuery = `${method}(${primaryKeyValue})`;
    this.dvaActions.dispatch(this.serviceName, "getViewEntityData", { pathQuery, action: this.getAction(id, actionType) });
  }
}