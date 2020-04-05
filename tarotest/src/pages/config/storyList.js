import Taro, { useEffect, useMemo } from "@tarojs/taro";
import { View } from '@tarojs/components';
import { PageAxis } from "PageCommon";
import { Common } from "UtilsCommon";

const StoryList = () => {
  const pageId = useMemo(() => Common.createGuid(), []);
  PageAxis.getPageAxis(pageId);

  useEffect(() => { return () => PageAxis.removePageAxis(pageId) }, [pageId]);

  return (
    <View>
      <View>Story List</View>
    </View>
  )
}

StoryList.config = {
  navigationBarTitleText: 'Story List'
};


export default StoryList;
