import Taro from "@tarojs/taro";
import { List } from 'Components';
import { PageAxis } from "PageCommon";

const _Property = {
  eventActionName: 'toSelectPage',
  itemList: [
  getItem('WeChat User Info', '/pages/kevin/index', 'list'),
  getItem('Camera & Scan QR Code', '/pages/cameraModel/ScanNavi/scanNavi', 'list'),
  ],
};

function getItem(title, pageUrl, icon) {
  return {
    title, arrow: 'right', pageUrl, iconInfo: {
      size: 20, color: '#78A4FA', value: icon,
    },
  }
}

const DemoMenu = (props) => {
  const { pageId } = props;

  if (pageId) {
    const pageAxis = PageAxis.getPageAxis(pageId);
    if (!pageAxis.toSelectPage) pageAxis.toSelectPage = toSelectPage
  }

  return (
    <List property={_Property} pageId={pageId} view={{}} />
  )
}

function toSelectPage({ property, pageAxis }) {
  pageAxis.toPage(property.selectItem.pageUrl);
}

export default DemoMenu;
