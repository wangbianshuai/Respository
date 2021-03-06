import { useEffect, useMemo } from 'react';
import useProcessData from './useProcessData';
import useConnectDataAction from './useConnectDataAction'
import useDvaData from './useDvaData';
import usePageAxis from './usePageAxis';
import useGetPageConfig from './useGetPageConfig';
import useGetLoginUser from './useGetLoginUser';
import { Common } from 'UtilsCommon';

export default (name, props, mapStateToProps, init, dataActionOptions, wxUser) => {
  const id = useMemo(() => Common.createGuid(), []);

  const pageName = dataActionOptions && dataActionOptions.name ? dataActionOptions.name : name;
  //1、 使用dva数据
  const [dispatch, dispatchAction, setActionState, state] = useDvaData(props.app, mapStateToProps);

  //2、 使用链接数据行为
  const [invokeDataAction, actionTypes, actionData] = useConnectDataAction(dispatch, dispatchAction, setActionState, name, dataActionOptions);

  //3、 使用处理数据
  const [getStateValue] = useProcessData(id, state, props);

  //4、 使用获取页面配置
  const pageConfig = useGetPageConfig(pageName, dispatchAction);

  //5、 使用页线，作用贯穿整个流程
  const pageAxis = usePageAxis(id, pageName, pageConfig, invokeDataAction, actionTypes, dispatch, props,
    dispatchAction, setActionState, getStateValue, init, wxUser
  );

  //6、 使用获取登录用户
  const token = useGetLoginUser(wxUser, dispatchAction);

  //没有登录信息，跳转注册页面
  useEffect(() => {
    if (pageAxis && !token) pageAxis.toRegister();
    else if (pageAxis && token && pageAxis.hasTokenCallback) pageAxis.hasTokenCallback(token);
  }, [pageAxis, token]);

  //7、 接收行为数据
  useEffect(() => {
    pageAxis && pageAxis.receiveActionData(actionData)
  }, [pageAxis, actionData]);

  //8、扩展接收数据
  useEffect(() => {
    pageAxis && pageAxis.receiveState && pageAxis.receiveState(state)
  }, [pageAxis, state]);

  useEffect(() => {
    pageAxis && pageAxis.componentDidmount && pageAxis.componentDidmount();
  }, [pageAxis]);

  if (pageAxis === null) return null;

  return pageAxis;
}
