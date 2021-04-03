import BaseIndex from './baseIndex';

export default class DataListView extends BaseIndex {

    add(props, action) {
        if (!action.parameters) this.initAddAction(props, action);

        const { dataListView, selectDataProperty } = action.parameters;

        let data = {};
        if (selectDataProperty) {
            data = selectDataProperty.getSelectData();
            if (!data) return;

            selectDataProperty.setValue(null);
        }

        //自定义扩展添加数据
        if (action.expandAdd) action.expandAdd(props, action)
        else dataListView.add(data);
    }

    remove(props, action) {
        if (!action.parameters) this.initRemoveAction(props, action);

        const { dataListView } = action.parameters;
        
        var id = props.property.dataId;
        if (props.property.params) id = props.property.params[dataListView.entity.primaryKey]

        //自定义扩展移除数据
        if (action.expandRemove) action.expandRemove(props, action)
        else dataListView.remove(id);
    }

    initRemoveAction(props, action) {
        const { pageAxis } = props;
        const dataListView = pageAxis.getProperty(action.dataListView);

        action.parameters = { dataListView }
    }

    initAddAction(props, action) {
        const { pageAxis } = props;
        const dataListView = pageAxis.getProperty(action.dataListView);
        const selectDataProperty = pageAxis.getProperty(action.selectDataProperty);

        action.parameters = { dataListView, selectDataProperty }
    }

}