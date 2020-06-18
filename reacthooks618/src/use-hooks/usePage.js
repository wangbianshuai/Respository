import { useEffect } from 'react';
import useProcessData from './useProcessData';
import useConnectAction from './useConnectAction'
import useDvaData from './useDvaData';
import usePageAxis from './usePageAxis';
import useGetPageConfig from './useGetPageConfig';

export default (name, props, mapStateToProps, init) => {
  //1、 使用dva数据
  const [dispatch, dispatchAction, setActionState, state] = useDvaData(mapStateToProps);

  //2、 使用链接数据行为
  const [invoke, actionTypes, actionData, dispatchActionData] = useConnectAction(name);

  //3、 使用处理数据
  const [getStateValue] = useProcessData(state, dispatchActionData);

  //4、 使用获取页面配置
  const pageConfig = useGetPageConfig(name, dispatchAction);

  //5、 使用页线，作用贯穿整个流程
  const pageAxis = usePageAxis(
    name, pageConfig, invoke, actionTypes, dispatch, props,
    dispatchAction, setActionState, getStateValue, init
  );

  //6、 接收行为数据
  useEffect(() => {
    pageAxis && pageAxis.receiveActionData(actionData)
  }, [pageAxis, actionData]);

  if (pageAxis === null) return null;

  return pageAxis;
}
