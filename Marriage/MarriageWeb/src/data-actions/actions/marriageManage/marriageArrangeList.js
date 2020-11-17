import { Common } from 'UtilsCommon';

export default {
  updateStatus(id, actionType, data) {
    const primaryKey = data.selectRowKeys[0];
    const { RowVersion } = data.rowDataList[0];
    const { selectData } = data;

    let message = '';
    const { Status } = selectData;
    if (Status === 0 || Status === 1 || Status === 3) {
      selectData.IsManAgree = 0;
      selectData.NoManAgreeRemark = '';
      selectData.IsWomanAgree = 0;
      selectData.NoWomanAgreeRemark = '';
      selectData.CancelReason = '';
      selectData.BookMarryDate = null;
      selectData.MarryDate = null;
      selectData.BreakUpDate = null;
      selectData.BreakUpReason = '';
    }
    else if (Status === 2) {
      selectData.CancelReason = '';
      selectData.BookMarryDate = null;
      selectData.MarryDate = null;
      selectData.BreakUpDate = null;
      selectData.BreakUpReason = '';

      if (selectData.IsManAgree === 0 && Common.isNullOrEmpty(selectData.NoManAgreeRemark)) {
        message = "当男方不同意时，需输入不同意原因！";
      }
      else if (selectData.IsWomanAgree === 0 && Common.isNullOrEmpty(selectData.NoWomanAgreeRemark)) {
        message = "当女主不同意时，需输入不同意原因！";
      }
      else if (selectData.IsManAgree === 1 && selectData.IsWomanAgree === 1) {
        message = "当状态为无意向时，男女双方不能选择都同意！";
      }
      else {
        if (selectData.IsManAgree) selectData.NoManAgreeRemark = '';
        if (selectData.IsWomanAgree) selectData.NoWomanAgreeRemark = '';
      }
    }
    else if (Status === 4) {
      selectData.IsManAgree = 0;
      selectData.NoManAgreeRemark = '';
      selectData.IsWomanAgree = 0;
      selectData.NoWomanAgreeRemark = '';
      selectData.CancelReason = '';
      selectData.BreakUpDate = null;
      selectData.BreakUpReason = '';

      if (Common.isNullOrEmpty(selectData.BookMarryDate)) {
        message = "请选择订婚日期！";
      }
    }
    else if (Status === 5) {
      selectData.IsManAgree = 0;
      selectData.NoManAgreeRemark = '';
      selectData.IsWomanAgree = 0;
      selectData.NoWomanAgreeRemark = '';
      selectData.CancelReason = '';
      selectData.BreakUpDate = null;
      selectData.BreakUpReason = '';

      if (Common.isNullOrEmpty(selectData.MarryDate)) {
        message = "请选择结婚日期！";
      }
    }
    else if (Status === 6) {
      selectData.IsManAgree = 0;
      selectData.NoManAgreeRemark = '';
      selectData.IsWomanAgree = 0;
      selectData.NoWomanAgreeRemark = '';
      selectData.CancelReason = '';

      if (Common.isNullOrEmpty(selectData.BreakUpDate)) {
        message = "请选择分手日期！";
      }
      else if (Common.isNullOrEmpty(selectData.BreakUpReason)) {
        message = '请输入分手原因！'
      }
    }
    else if (Status === 7) {
      if (Common.isNullOrEmpty(selectData.CancelReason)) {
        message = '请输入取消原因！'
      }
    }

    if (message) {
      this.dispatch(id, actionType, { isSuccess: false, message });
      return;
    }

    const entityData = { ...selectData, RowVersion, MarriageArrangeId: primaryKey }

    const pathQuery = `(${primaryKey})`;
    this.dvaActions.dispatch(this.serviceName, "updateStatus", { pathQuery, MarriageArrange: entityData, action: this.getAction(id, actionType) });
  },
  getViewEntityData(id, actionType, data) {
    const { primaryKey, expandMethods } = data.entity;
    const method = expandMethods && expandMethods.getEntityData ? "/" + expandMethods.getEntityData : "";
    const primaryKeyValue = data.entityData[primaryKey];
    const pathQuery = `${method}(${primaryKeyValue})`;
    this.dvaActions.dispatch(this.serviceName, "getViewEntityData", { pathQuery, action: this.getAction(id, actionType) });
  },
  getMarriageFee(id, actionType, data) {
    const { primaryKey, expandMethods } = data.entity;
    const method = expandMethods && expandMethods.getEntityData ? "/" + expandMethods.getEntityData : "";
    const primaryKeyValue = data.entityData[primaryKey];
    const pathQuery = `${method}(${primaryKeyValue})`;
    this.dvaActions.dispatch(this.serviceName, "getMarriageFee", { pathQuery, action: this.getAction(id, actionType) });
  },
  updateFee(id, actionType, data) {
    const { name, primaryKey } = data.entity;
    const primaryKeyValue = data.oldEntityData && data.oldEntityData[primaryKey] ? data.oldEntityData[primaryKey] : null;

    var pathQuery = method;
    if (primaryKeyValue) {
        data.entityData[primaryKey] = primaryKeyValue;
        pathQuery = `${method}(${primaryKeyValue})`;
    }

    const payload = { action: this.getAction(id, actionType) };
    payload[name] = data.entityData;
    payload.pathQuery = pathQuery

    this.dvaActions.dispatch(this.serviceName, serviceName, payload);
}
}