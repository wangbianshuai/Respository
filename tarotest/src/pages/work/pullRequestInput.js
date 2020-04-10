import Taro, { useRouter } from "@tarojs/taro";
import { EntityPageEdit } from "PageTemplates";

const PullRequestInput = () => {
  const router = useRouter();
  const { params } = router;

  return <EntityPageEdit name='work_pullrequestInput' entityName='PullRequest' minActionType={1000} expandActionNames={['StoryService/getStorys']} params={params} />
}

PullRequestInput.config = {
  navigationBarTitleText: 'Pull Request Input'
};

export default PullRequestInput;
