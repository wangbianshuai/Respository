import Taro, { useRouter } from "@tarojs/taro";
import { EntityPageEdit } from "PageTemplates";
import { Common } from 'UtilsCommon';

const _PageExpand = {
  expandSetEntityData({ entityData, props }) {
    if (Common.isNullOrEmpty(entityData.StoryId) && Common.isNullOrEmpty(entityData.Content)) {
      props.pageAxis.alert("Please select story or input content!"); return false;
    }

    return entityData;
  }
};

const WorkingHoursInput = () => {
  const router = useRouter();
  const { params } = router;

  return <EntityPageEdit name='work_workingHoursInput' pageExpand={_PageExpand} entityName='WorkingHours'
    minActionType={800} expandActionNames={['StoryService/getStorys', 'WeekService/getWeeks']} params={params}
  />
}

WorkingHoursInput.config = {
  navigationBarTitleText: 'Daily Input'
};

export default WorkingHoursInput;
