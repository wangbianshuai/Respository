import React, { useEffect } from "react";
import { usePage } from "UseHooks";
import Components from "Components";

function init(pageExpand) {
  return function () {
    if (pageExpand) for (var key in pageExpand) this[key] = pageExpand[key];
    this.expandInit && this.expandInit();
  }
}

export default (name, config) => (props) => {
  const pageAxis = usePage(name, props, mapStateToProps(config.actionNames, config.entityName, config.stateNames),
    init(config.pageExpand), config.dataActionOptions);

  useEffect(() => {
    if (config.title) document.title = config.title;
  }, []);

  useEffect(() => {
    if (pageAxis && pageAxis.pageData.title) document.title = pageAxis.pageData.title;
  }, [pageAxis]);

  if (pageAxis === null) return null;

  if (pageAxis.pageConfig.dialogViews) {
    return (
      <React.Fragment>
        <Components.PropertyItem property={pageAxis.pageConfig} pageId={pageAxis.id} />
        <Components.ModalDialogList property={pageAxis.modalDialog} />
      </React.Fragment>
    )
  }

  return (
    <Components.PropertyItem property={pageAxis.pageConfig} pageId={pageAxis.id} />
  )
}

function mapStateToProps(actionNames, entityName, stateNames) {
  if (!actionNames) return () => ({});

  return (state) => {
    const props = { loading: false };
    actionNames.forEach(a => {
      const names = a.split('/');
      const actionName = names.length === 2 ? names[1] : a;
      const serviceName = names.length === 2 ? names[0] : entityName + 'Service';
      const stateName = stateNames && stateNames[actionName] ? stateNames[actionName] : actionName;
      props[actionName] = state[serviceName][stateName];
      if (state[serviceName][stateName + '_loading']) props.loading = true;
    });

    return props;
  }
}