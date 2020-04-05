import Taro, { useEffect, useMemo  } from "@tarojs/taro";
import { PageAxis, useRootPage, useConnectAction } from "PageCommon";
import { Common } from "UtilsCommon";
import { PropertyItem } from 'Components';

const EntityPage = (props) => {
  const { name, pageConfig, params } = props;

  const [invoke, actionTypes, actionData] = useConnectAction(name, pageConfig.actionOptions);
  const pageId = useMemo(() => Common.createGuid(), []);
  const pageAxis = PageAxis.getPageAxis(pageId);

  useRootPage(mapStateToProps(pageConfig.actionNames, pageConfig.entityName, pageConfig.stateNames), pageAxis, props);

  pageAxis.initSet(pageConfig.pageName, invoke, actionTypes, () => {
    if (pageConfig.pageExpand) pageAxis.expandMethod(pageConfig.pageExpand);
  }, params);

  useEffect(() => { return () => PageAxis.removePageAxis(pageId) }, [pageId]);

  useEffect(() => pageAxis.receiveActionData(actionData), [pageAxis, actionData]);

  return <PropertyItem property={pageAxis.pageConfig} pageId={pageId} />
}

EntityPage.defaultProps = { name: '', pageConfig: { actionOptions: { name: '' } } };

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
