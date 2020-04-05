import Taro, { useEffect, useMemo } from "@tarojs/taro";
import { View } from '@tarojs/components';
import { PageAxis } from "PageCommon";
import { Common } from "UtilsCommon";

const WeekList = () => {
  const pageId = useMemo(() => Common.createGuid(), []);
  PageAxis.getPageAxis(pageId);

  useEffect(() => { return () => PageAxis.removePageAxis(pageId) }, [pageId]);

  return (
    <View>
      <View>Week List</View>
    </View>
  )
}

WeekList.config = {
  navigationBarTitleText: 'Week List'
};


export default WeekList;
