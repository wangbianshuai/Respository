import { Common } from "UtilsCommon";
import BaseIndex from "./baseIndex";

export default class Page extends BaseIndex {

  ToPage(props, action) {
    const { pageAxis } = props;
    var url = Common.replaceDataContent(pageAxis.pageData, action.pageUrl, true);
    pageAxis.ToPage(url)
  }
}