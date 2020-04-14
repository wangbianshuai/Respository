import Taro, { useEffect, useMemo, useCallback, useState, useDidShow } from "@tarojs/taro";
import { View } from '@tarojs/components';
import { PageAxis, useRootPage, useConnectAction, useGetPageConfig } from "PageCommon";
import { Common } from "UtilsCommon";
import { PropertyItem } from 'Components';
import { AtButton } from 'taro-ui';
import '../style/login.scss';

const _Name = "login";

const Login = (props) => {
  const [invoke, actionTypes, actionData] = useConnectAction(_Name);
  const pageId = useMemo(() => Common.createGuid(), []);
  const pageAxis = PageAxis.getPageAxis(pageId);
  const pageConfig = useGetPageConfig(_Name);
  const [loginText, setLoginText] = useState('');
  const [loading, setLoading] = useState(false);

  useRootPage(mapStateToProps, pageAxis, props);

  pageConfig && pageAxis.initSet(_Name, pageConfig, invoke, actionTypes, init);

  useEffect(() => { return () => PageAxis.removePageAxis(pageId) }, [pageId]);

  useEffect(() => pageAxis.receiveActionData(actionData), [pageAxis, actionData]);

  const onGetUserInfo = useCallback((res) => {
    if (!res.detail.userInfo && loading) return;

    setLoading(true);

    Common.setStorage('WeChatUserInfo', res.detail.rawData);

    Taro.login().then(loginInfo => {
      const { userInfo } = res.detail;

      const entityData = { LoginCode: loginInfo.code, UserName: userInfo.nickName, IsWeChat: true }
      pageAxis.invokeEventAction('weChatLogin', { actionType: pageAxis.pageConfig.saveEntityDataActionType, entityData, pageAxis });
    });
  }, [pageAxis, loading]);

  useDidShow(() => {
    Taro.getSetting().then(data => {
      setLoginText(data.authSetting["scope.userInfo"] ? '微信登录' : '微信授权并登录');
    });
  });

  if (!loginText) return <View />

  return (
    <View className='container'>
      <View className='login'>
        <PropertyItem property={pageAxis.pageConfig} pageId={pageId} />
      </View>
      <AtButton openType='getUserInfo' lang='zh_CN' loading={loading} onGetUserInfo={onGetUserInfo} type='secondary'>{loginText}</AtButton>
    </View >
  )
}

Login.config = {
  navigationBarTitleText: 'Login'
};

function init(pageAxis) {
  Common.removeStorage("Token");
  pageAxis.setActionState("ApiService", "Login");

  pageAxis.expandMethod({ loginSuccess });
  return pageAxis;
}

function loginSuccess({ data, props }) {
  const { pageAxis } = props;
  Common.setStorage("LoginUserInfo", JSON.stringify(data))
  Common.setStorage("LoginUserId", data.UserId)
  pageAxis.openPage("/pages/index");
}

function mapStateToProps(state) {
  return {
    login: state.UserService.login
  }
}

export default Login;
