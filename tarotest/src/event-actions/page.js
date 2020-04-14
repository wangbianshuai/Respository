import { Common } from "UtilsCommon";
import BaseIndex from "./baseIndex";

export default class Page extends BaseIndex {

  toPage(props, action) {
    const { pageAxis } = props;
    var url = Common.replaceDataContent(pageAxis.pageData, action.pageUrl, true);
    pageAxis.toPage(url)
  }

  weChatLogin(props, action) {
    if (!action.parameters) this.initWeChatLogin(props, action);

    const { actionType, entityData, pageAxis } = props;

    pageAxis.receives[actionType] = (d) => this.receiveWeChatLogin(d, props, action);

    pageAxis.invokeDataAction(actionType, { entityData });
  }

  receiveWeChatLogin(data, props, action) {
    const { successCallback } = action.parameters;

    const { pageAxis } = props;
    if (this.isSuccessNextsProps(data, pageAxis.alert, null)) {

      if (successCallback) successCallback({ data, props, action });
    }

    return false;
  }

  initWeChatLogin(props, action) {
    const { pageAxis } = props;
    const successCallback = pageAxis.getFunction(action.successCallback);

    action.parameters = { successCallback };
  }
}
