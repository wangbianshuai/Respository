import Taro, { usePullDownRefresh, useReachBottom, useMemo } from "@tarojs/taro";
import { EntityPageList } from "PageTemplates";
import { Common } from 'UtilsCommon';

const PullRequestList = () => {
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
    name='work_pullRequestList'
    entityName='PullRequest' minActionType={900}
    page={obj}
  />
}

PullRequestList.config = {
  navigationBarTitleText: 'Pull Request List',
  enablePullDownRefresh: true,
};

export default PullRequestList;
