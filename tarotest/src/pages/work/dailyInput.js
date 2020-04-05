import Taro, { useRouter } from "@tarojs/taro";
import { EntityPageEdit } from "PageTemplates";

const DailyInput = () => {
  const router = useRouter();
  const { params } = router;

  return <EntityPageEdit name='work_dailyInput' entityName='Daily' minActionType={1200} expandActionNames={['StoryService/getStorys']} params={params} />
}

DailyInput.config = {
  navigationBarTitleText: 'Daily Input'
};

export default DailyInput;
