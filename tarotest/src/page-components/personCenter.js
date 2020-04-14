import Taro, { useMemo } from "@tarojs/taro";
import { List } from 'Components';
import { Button2 } from 'Controls';
import { Common } from 'UtilsCommon';
import { View, Image } from "@tarojs/components";

import headerIcon from '../assets/defaultHeader.jpg';

const _ButtonProperty = {
  buttonType: 'primary',
  className: 'button1',
  eventActionName: 'signout',
  id: 'signout1',
  text: 'Sign out'
}

const PersonCenter = (props) => {
  const { pageId } = props;

  let imageUrl = useMemo(() => {
    const weChatUserInfo = Common.getStorage('WeChatUserInfo');
    if (weChatUserInfo) return JSON.parse(weChatUserInfo).avatarUrl;

    return headerIcon;
  }, []);

  const property = useMemo(() => {
    const loginUserInfo = Common.getStorage('LoginUserInfo');
    if (!loginUserInfo) return {};

    const { LoginName, UserName, LastLoginDate } = JSON.parse(loginUserInfo);

    return {
      itemList: [
        { title: 'Login Name', extraText: LoginName },
        { title: 'User Name', extraText: UserName },
        { title: 'Last Login Date', extraText: LastLoginDate }
      ],
    }
  }, []);

  return (
    <View className='personCenter'>
      <View style='text-align: center'>
        <Image className='userImage' src={imageUrl} />
      </View>
      <List property={property} pageId={pageId} view={{}} />
      <Button2 property={_ButtonProperty} pageId={pageId} view={{}} />
    </View>
  )
}

PersonCenter.options = { addGlobalClass: true };

export default PersonCenter;
