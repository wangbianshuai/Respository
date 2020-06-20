import React from "react";
import { usePage } from "UseHooks";
import Components from "Components";

function init(pageExpand) {
  return function () {
    if (pageExpand) for (var key in pageExpand) this[key] = pageExpand[this];
  }
}

export default (name, config) => (props) => {
  const pageAxis = usePage(name, props, mapStateToProps(config.actionNames, config.entityName, config.stateNames),
    init(config.pageExpand), config.dataActionOptions);

  if (pageAxis === null) return null;

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
      if (state[serviceName].loading) props.loading = true;
    });

    return props;
  }
}