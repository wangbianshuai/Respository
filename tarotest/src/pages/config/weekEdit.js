import Taro, { useRouter } from "@tarojs/taro";
import { EntityPageEdit } from "PageTemplates";

const WeekEdit = () => {
  const router = useRouter();
  const { params } = router;

  return <EntityPageEdit name='config_weekEdit' entityName='Week' minActionType={400} params={params} />
}

WeekEdit.config = {
  navigationBarTitleText: 'Week Edit'
};

export default WeekEdit;
