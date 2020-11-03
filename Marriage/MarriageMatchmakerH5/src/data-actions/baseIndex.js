import { Common } from "UtilsCommon";

export default class Index {
  constructor(props) {
    this.receives = {};
    this.minActionType = 0;
    this.maxActionType = 0;
    for (let key in props) this[key] = props[key];
  }

  init() {
    if (!this.actionTypes) this.actionTypes = this.getActionTypes(this.name);
    this.actionTypeKeys = this.getActionTypeKeys();
  }

  getActionTypeKeys() {
    const actionTypeKeys = {};
    for (let key in this.actionTypes) actionTypeKeys[this.actionTypes[key]] = key;
    return actionTypeKeys;
  }

  invoke(id, actionType, data) {
    const key = this.actionTypeKeys[actionType];
    if (this[key]) this[key](id, actionType, data);
    else this.dispatch(id, actionType, data);
  }

  dispatch(id, actionType, data) {
    data = this.setResponseData(id, actionType, data);
    if (data === false) return;
    this.dispatchToReceive(id, actionType, data);
  }

  dispatchToReceive(id, actionType, data) {
    if (id && this.receives[id]) this.receives[id](actionType, data);
    else for (let key in this.receives) this.receives[key](actionType, data);
  }

  setSearchQueryResponse(data, dataName) {
    data = this.setApiResponse(data);
    if (data.length > 0) {
      const res1 = data[0];
      if (res1.isSuccess === false) return res1;
      const dataList = res1[dataName] || (res1 || []);
      var pageInfo = null, groupByInfo = null;
      if (data.length === 2) {
        const { PageIndex, PageSize, PageCount, PageRecord } = data[1].PageInfo
        pageInfo = { pageIndex: PageIndex, pageSize: PageSize, pageCount: PageCount, pageRecord: PageRecord };
        groupByInfo = data[1].GroupByInfo;
      }
      return { dataList, pageInfo, groupByInfo };
    }
    else if (data[dataName] !== undefined) {
      const dataList = data[dataName] || [];
      const pageRecord = dataList.length;
      return { pageRecord, dataList }
    }
    else if (data.List !== undefined) {
      const dataList = data.List;
      const pageInfo = {
        pageIndex: data.PageNumber || 1,
        pageSize: data.PageSize || 0,
        pageCount: data.PageTotal || 0,
        pageRecord: data.TotalCount || 0
      }
      return { dataList, pageInfo }
    }
    return data;
  }

  setApiResponse(data) {
    if (data.action && data.data) {
      data = data.data;
      if (data.code !== undefined) {
        if (Common.isEquals(data.code, 0)) return { isSuccess: true, data: data }
        else return { isSuccess: false, message: data.message }
      }
    }
    return data;
  }

  setResponseData(id, actionType, data) {
    if (data && data.action && data.action.isCheckedId && !this.receives[id]) return false;
    const key = "set" + this.actionTypeKeys[actionType];
    if (this[key]) return this[key](id, actionType, data);
    else return this.setApiResponse(data);
  }

  receive(id, fn) {
    this.receives[id] = fn;
  }

  removeReceive(id) {
    if (this.receives[id]) delete this.receives[id];
  }

  getAction(id, actionType, isCheckedId) {
    isCheckedId = isCheckedId === undefined ? true : isCheckedId;
    return { id, actionType, time: new Date().getTime(), isCheckedId: isCheckedId };
  }

  judgeNullable(data, entity) {
    var msg = "";
    for (var key in entity) {
      if (Common.isNullOrEmpty(data[key])) {
        msg = entity[key];
        break;
      }
    }
    return msg;
  }
}
