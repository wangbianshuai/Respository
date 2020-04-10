import Taro, { usePullDownRefresh, useReachBottom, useMemo } from "@tarojs/taro";
import { EntityPageList } from "PageTemplates";
import { Common } from 'UtilsCommon';

const WeekList = () => {
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
    name='config_weekList'
    entityName='Week' minActionType={200}
    page={obj}
  />
}

WeekList.config = {
  navigationBarTitleText: 'Week List',
  enablePullDownRefresh: true,
};

export default WeekList;
