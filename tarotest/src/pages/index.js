import Taro, { useEffect, useMemo, useState } from "@tarojs/taro";
import { View } from '@tarojs/components';
import { PageAxis } from "PageCommon";
import { Common } from "UtilsCommon";
import { TabBar } from 'Controls';
import { WorkMenu, ConfigMenu } from 'PageComponents';

const _Property = {
  fixed: true,
  eventActionName: 'setTabBarIndex',
  tabList: [{ title: "Work", iconType: 'bullet-list' },
  { title: "Config", iconType: 'bullet-list' },
  { title: "User", iconType: 'user' }]
};

const Index = () => {
  const pageId = useMemo(() => Common.createGuid(), []);
  const pageAxis = PageAxis.getPageAxis(pageId);
  const [current, setCurrent] = useState(0);

  useEffect(() => { return () => PageAxis.removePageAxis(pageId) }, [pageId]);

  if (!pageAxis.setTabBarIndex) pageAxis.setTabBarIndex = ({ property }) => setCurrent(property.current);

  return (
    <View>
      {current === 0 && <WorkMenu pageId={pageId} />}
      {current === 1 && <ConfigMenu pageId={pageId} />}
      {current === 2 && <View>user</View>}
      <TabBar property={_Property} pageId={pageId} view={{}} />
    </View>
  )
}

Index.config = {
  navigationBarTitleText: 'Work Report'
};


export default Index;
