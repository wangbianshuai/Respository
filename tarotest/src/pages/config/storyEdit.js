import Taro, { useRouter } from "@tarojs/taro";
import { EntityPageEdit } from "PageTemplates";

const StoryEdit = () => {
  const router = useRouter();
  const { params } = router;

  return <EntityPageEdit name='config_storyEdit' entityName='Story' minActionType={600} params={params} />
}

StoryEdit.config = {
  navigationBarTitleText: 'Story Edit'
};

export default StoryEdit;
