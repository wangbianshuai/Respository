import BaseIndex from "./BaseIndex";

export default class ComplexDataGrid extends BaseIndex {

    Remove(props, action) {
        if (!action.Parameters) this.InitRemoveAction(props, action);

        const { ComplexDataGridView } = action.Parameters;

        ComplexDataGridView.Remove(props.Property.DataId);
    }

    InitRemoveAction(props, action) {
        const { EventActions } = props;
        const ComplexDataGridView = EventActions.GetComponent(action.ComplexDataGridView);

        action.Parameters = { ComplexDataGridView }
    }
}