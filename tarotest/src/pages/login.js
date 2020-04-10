import Taro, { useEffect, useMemo } from "@tarojs/taro";
import { View } from '@tarojs/components';
import { PageAxis, useRootPage, useConnectAction, useGetPageConfig } from "PageCommon";
import { Common } from "UtilsCommon";
import { PropertyItem } from 'Components';
import '../style/login.scss';

const _Name = "login";

const Login = (props) => {
  const [invoke, actionTypes, actionData] = useConnectAction(_Name);
  const pageId = useMemo(() => Common.createGuid(), []);
  const pageAxis = PageAxis.getPageAxis(pageId);
  const pageConfig = useGetPageConfig(_Name);

  useRootPage(mapStateToProps, pageAxis, props);

  pageConfig && pageAxis.initSet(_Name, pageConfig, invoke, actionTypes, init);

  useEffect(() => { return () => PageAxis.removePageAxis(pageId) }, [pageId]);

  useEffect(() => pageAxis.receiveActionData(actionData), [pageAxis, actionData]);

  return (
    <View className='container'>
      <View className='login'>
        <PropertyItem property={pageAxis.pageConfig} pageId={pageId} />
      </View>
    </View>
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
