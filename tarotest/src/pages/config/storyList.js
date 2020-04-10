import Taro, { usePullDownRefresh, useReachBottom, useMemo } from "@tarojs/taro";
import { EntityPageList } from "PageTemplates";
import { Common } from 'UtilsCommon';

const StoryList = () => {
  const obj = useMemo(() => ({ id: Common.createGuid(), }), []);

  usePullDownRefresh(() => {
    if (obj.isPullDownRefresh || obj.isReachBottom) return;
    obj.isPullDownRefresh = true;
    if (obj.pullDownRefresh) obj.pullDownRefresh();
  });

  useReachBottom(() => {
    if (obj.isPullDownRefresh || obj.isReachBottom) return;
    obj.isReachBottom = true;
    if (obj.reachBottom) obj.reachBottom();
  });

  return <EntityPageList
    name='config_storyList'
    entityName='Story' minActionType={500}
    page={obj}
  />
}

StoryList.config = {
  navigationBarTitleText: 'Story List',
  enablePullDownRefresh: true,
};

export default StoryList;
