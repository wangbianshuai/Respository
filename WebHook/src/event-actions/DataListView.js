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
        
        var id = props.Property.DataId;
        if (props.Property.Params) id = props.Property.Params[DataListView.Entity.PrimaryKey]

        //自定义扩展移除数据
        if (action.ExpandRemove) action.ExpandRemove(props, action)
        else DataListView.Remove(id);
    }

    InitRemoveAction(props, action) {
        const { PageAxis } = props;
        const DataListView = PageAxis.GetComponent(action.DataListView);

        action.Parameters = { DataListView }
    }

    InitAddAction(props, action) {
        const { PageAxis } = props;
        const DataListView = PageAxis.GetComponent(action.DataListView);
        const SelectDataProperty = PageAxis.GetControl(action.SelectDataProperty);

        action.Parameters = { DataListView, SelectDataProperty }
    }

}