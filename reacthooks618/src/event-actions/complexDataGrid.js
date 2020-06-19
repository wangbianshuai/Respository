import BaseIndex from "./BaseIndex";

export default class ComplexDataGrid extends BaseIndex {

    remove(props, action) {
        if (!action.parameters) this.initRemoveAction(props, action);

        const { complexDataGridView } = action.parameters;

        complexDataGridView.remove(props.property.dataId);
    }

    initRemoveAction(props, action) {
        const { pageAxis } = props;
        const complexDataGridView = pageAxis.getProperty(action.complexDataGridView);

        action.parameters = { complexDataGridView }
    }
}