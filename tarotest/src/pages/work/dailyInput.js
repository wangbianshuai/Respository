import Taro, { useRouter } from "@tarojs/taro";
import { EntityPageEdit } from "PageTemplates";

const pageExpand = {
  navigateBack: ({ pageAxis }) => pageAxis.toPage('/pages/index'),
};

const DailyInput = () => {
  const router = useRouter();
  const { params } = router;

  return <EntityPageEdit name='work_dailyInput' entityName='Daily' minActionType={1200} pageExpand={pageExpand} expandActionNames={['StoryService/getStorys']} params={params} />
}

DailyInput.config = {
  navigationBarTitleText: 'Daily Input'
};

export default DailyInput;
