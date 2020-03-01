import { EntityPageEdit } from "PageTemplates";
import { WorkingHours } from "ModelsConfigs";
import { Common } from "UtilsCommon";

export default EntityPageEdit("WorkReportManage_WorkingHoursEdit", "WorkingHours", 800, {
  ExpandSetEntityData({ entityData, props, view }) {
    if (Common.IsNullOrEmpty(entityData.StoryId) && Common.IsNullOrEmpty(entityData.Content)) {
      this.Alert("Please select story or input content!"); return false;
    }

    return entityData;
  }
}, WorkingHours);