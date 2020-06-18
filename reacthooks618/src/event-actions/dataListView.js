import BaseIndex from "./BaseIndex";

export default class DataListView extends BaseIndex {

    Add(props, action) {
        if (!action.Parameters) this.InitAddAction(props, action);

        const { DataListView, SelectDataProperty } = action.Parameters;

        let data = {};
        if (SelectDataProperty) {
            data = SelectDataProperty.getSelectData();
            if (!data) return;

            SelectDataProperty.setValue(null);
        }

        //自定义扩展添加数据
        if (action.expandAdd) action.expandAdd(props, action)
        else DataListView.Add(data);
    }

    remove(props, action) {
        if (!action.Parameters) this.InitremoveAction(props, action);

        const { DataListView } = action.Parameters;
        
        var id = props.property.DataId;
        if (props.property.Params) id = props.property.Params[DataListView.Entity.PrimaryKey]

        //自定义扩展移除数据
        if (action.expandremove) action.expandremove(props, action)
        else DataListView.remove(id);
    }

    InitremoveAction(props, action) {
        const { pageAxis } = props;
        const DataListView = pageAxis.getComponent(action.DataListView);

        action.Parameters = { DataListView }
    }

    InitAddAction(props, action) {
        const { pageAxis } = props;
        const DataListView = pageAxis.getComponent(action.DataListView);
        const SelectDataProperty = pageAxis.getControl(action.SelectDataProperty);

        action.Parameters = { DataListView, SelectDataProperty }
    }

}