import BaseIndex from "./BaseIndex";

export default class ComplexDataGrid extends BaseIndex {

    remove(props, action) {
        if (!action.Parameters) this.InitremoveAction(props, action);

        const { ComplexDataGridView } = action.Parameters;

        ComplexDataGridView.remove(props.property.DataId);
    }

    InitremoveAction(props, action) {
        const { pageAxis } = props;
        const ComplexDataGridView = pageAxis.getComponent(action.ComplexDataGridView);

        action.Parameters = { ComplexDataGridView }
    }
}