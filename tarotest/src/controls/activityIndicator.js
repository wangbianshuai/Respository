import Taro, { useMemo, useState } from '@tarojs/taro';
import { View } from '@tarojs/components';
import { AtActivityIndicator } from 'taro-ui';
import { Common } from 'UtilsCommon';

const ActivityIndicator = (props) => {
  const { property } = props;
  const [loading, setLoading] = useState(false);

  const obj = useMemo(() => ({
    id: Common.createGuid(),
  }), []);

  init(obj, property, setLoading);

  return (
    <View>
      {loading && <View className='activityIndicator'><AtActivityIndicator mode='normal' content='Loading...' /></View>}
    </View>
  );
};

function init(obj, property, setLoading) {
  if (property.id && !obj.isInit) obj.isInit = true; else return;

  property.setLoading = setLoading;
}

ActivityIndicator.defaultProps = { property: {}, view: {} };
ActivityIndicator.options = { addGlobalClass: true };

export default ActivityIndicator;
