import Taro from "@tarojs/taro";
import { EntityPageList } from "PageTemplates";

const DailyList = () => {
  return <EntityPageList
    name='work_dailyList'
    entityName='Daily' minActionType={1100}
    expandActionNames={['StoryService/getStorys', 'UserService/getUsers']}
  />
}

DailyList.config = {
  navigationBarTitleText: 'Daily List'
};

export default DailyList;
