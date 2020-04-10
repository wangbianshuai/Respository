import Taro, { usePullDownRefresh, useReachBottom, useMemo } from "@tarojs/taro";
import { EntityPageList } from "PageTemplates";
import { Common } from 'UtilsCommon';

const WorkingHoursList = () => {
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
    name='work_workingHoursList'
    entityName='WorkingHours' minActionType={700}
    page={obj}
  />
}

WorkingHoursList.config = {
  navigationBarTitleText: 'Working Hours List',
  enablePullDownRefresh: true,
};

export default WorkingHoursList;
