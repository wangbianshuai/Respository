import React, { useEffect, useMemo } from "react";
import { PageAxis, useRootPage, useConnectDataAction, useGetPageConfig } from "UseHooks";
import { Common } from "UtilsCommon";
import { PropertyItem } from 'Components';

const EntityPage = (props) => {
  const { name, config, params, page } = props;

  const [invoke, actionTypes, actionData] = useConnectDataAction(name, config.actionOptions);
  const pageId = useMemo(() => Common.createGuid(), []);
  const pageAxis = PageAxis.getPageAxis(pageId);
  const pageConfig = useGetPageConfig(config.pageName);

  useRootPage(mapStateToProps(config.actionNames, config.entityName, config.stateNames), pageAxis, props);

  pageConfig && pageAxis.initset(config.pageName, pageConfig, invoke, actionTypes, () => {
    if (config.pageexpand) pageAxis.expandMethod(config.pageexpand);
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
