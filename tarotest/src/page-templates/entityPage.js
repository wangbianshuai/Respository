import Taro, { useEffect, useMemo } from "@tarojs/taro";
import { PageAxis, useRootPage, useConnectAction, useGetPageConfig } from "PageCommon";
import { Common } from "UtilsCommon";
import { PropertyItem } from 'Components';

const EntityPage = (props) => {
  const { name, config, params, page } = props;

  const [invoke, actionTypes, actionData] = useConnectAction(name, config.actionOptions);
  const pageId = useMemo(() => Common.createGuid(), []);
  const pageAxis = PageAxis.getPageAxis(pageId);
  const pageConfig = useGetPageConfig(config.pageName);

  useRootPage(mapStateToProps(config.actionNames, config.entityName, config.stateNames), pageAxis, props);

  pageConfig && pageAxis.initSet(config.pageName, pageConfig, invoke, actionTypes, () => {
    if (config.pageExpand) pageAxis.expandMethod(config.pageExpand);
    pageAxis.getPage = () => page;
  }, params);

  useEffect(() => { return () => PageAxis.removePageAxis(pageId) }, [pageId]);

  useEffect(() => pageAxis.receiveActionData(actionData), [pageAxis, actionData]);

  return <PropertyItem property={pageAxis.pageConfig} pageId={pageId} />
}

EntityPage.defaultProps = { name: '', config: { actionOptions: { name: '' } } };

function mapStateToProps(actionNames, entityName, stateNames) {
  if (!actionNames) return () => ({});

  return (state) => {
    const props = {};
    actionNames.forEach(a => {
      const names = a.split('/');
      const actionName = names.length === 2 ? names[1] : a;
      const serviceName = names.length === 2 ? names[0] : entityName + 'Service';
      const stateName = stateNames && stateNames[actionName] ? stateNames[actionName] : actionName;
      props[actionName] = state[serviceName][stateName];
    });

    return props;
  }
}

export default EntityPage;
