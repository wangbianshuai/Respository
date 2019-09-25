import BaseIndex from "./BaseIndex";

export default class DataListView extends BaseIndex {

    Add(props, action) {
        if (!action.Parameters) this.InitAddAction(props, action);

        const { DataListView, SelectDataProperty } = action.Parameters;

        let data = {};
        if (SelectDataProperty) {
            data = SelectDataProperty.GetSelectData();
            if (!data) return;

            SelectDataProperty.SetValue(null);
        }

        //自定义扩展添加数据
        if (action.ExpandAdd) action.ExpandAdd(props, action)
        else DataListView.Add(data);
    }

    Remove(props, action) {
        if (!action.Parameters) this.InitRemoveAction(props, action);

        const { DataListView } = action.Parameters;

        //自定义扩展移除数据
        if (action.ExpandRemove) action.ExpandRemove(props, action)
        else DataListView.Remove(props.Property.DataId);
    }

    InitRemoveAction(props, action) {
        const { EventActions } = props;
        const DataListView = EventActions.GetComponent(action.DataListView);

        action.Parameters = { DataListView }
    }

    InitAddAction(props, action) {
        const { EventActions } = props;
        const DataListView = EventActions.GetComponent(action.DataListView);
        const SelectDataProperty = EventActions.GetControl(action.SelectDataProperty);

        action.Parameters = { DataListView, SelectDataProperty }
    }

}