import Taro from "@tarojs/taro";
import { List } from 'Components';
import { PageAxis } from "PageCommon";


const _Property = {
  eventActionName: 'toSelectPage',
  itemList: [
    getItem('Daily Input', '/pages/work/dailyInput', 'edit'),
    getItem('Daily List', '/pages/work/dailyList', 'list'),
    getItem('Pull Request Input', '/pages/work/pullRequestInput', 'edit'),
    getItem('Pull Request List', '/pages/work/pullRequestList', 'list'),
    getItem('Working Hours Input', '/pages/work/workingHoursInput', 'edit'),
    getItem('Working Hours List', '/pages/work/workingHoursList', 'list'),
  ],
};

function getItem(title, pageUrl, icon) {
  return {
    title, arrow: 'right', pageUrl, iconInfo: {
      size: 20, color: '#78A4FA', value: icon,
    },
  }
}

const WorkMenu = (props) => {
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

export default WorkMenu;
