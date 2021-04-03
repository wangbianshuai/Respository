import BaseIndex from './baseIndex';
import { Common } from "UtilsCommon";

export default class DataGridView extends BaseIndex {

    searchQuery(props, action) {
        if (!action.parameters) this.initSearchQueryAction(props, action);

        else action.isSearch = props.property.type !== "DataGridView";

        this.searchData(props, action.parameters, props.pageIndex || 1, props.pageSize || 10, action.isClearQuery);
    }

    static _CurrentDataGridViewData = {};

    initSearchQueryAction(props, action) {
        const { property, pageAxis } = props;

        //判断props.property 是 查询按钮或搜索框 还是DataGridView
        const dataGridView = property.type === "DataGridView" ? property : pageAxis.getProperty(action.dataGridView);
        const searchButton = property.type === "DataGridView" ? pageAxis.getProperty(action.searchButton) : property;
        const searchView = pageAxis.getProperty(action.searchView);
        const alertMessage = pageAxis.getProperty(action.alertMessage);
        const expandSearchQueryLoad = pageAxis.getFunction(action.expandSearchQueryLoad)

        DataGridView._CurrentDataGridViewData[dataGridView.id] = DataGridView._CurrentDataGridViewData[dataGridView.id] || {};
        dataGridView.currentData = DataGridView._CurrentDataGridViewData[dataGridView.id];
        dataGridView.currentData.isInit = true;

        action.parameters = { dataGridView, searchButton, searchView, alertMessage, expandSearchQueryLoad }
    }

    searchData(props, parameters, pageIndex, pageSize, isClearQuery) {
        const { dataGridView, searchButton } = parameters;
        const { actionTypes, invokeDataAction, entitySearchQuery } = dataGridView;
        const { searchQuery } = actionTypes;
        const { pageAxis, isData } = props;

        const { currentData } = dataGridView;

        const isInit = currentData.isInit;
        if (currentData.isInit) {
            currentData.isInit = false;
            if (currentData.pageIndex !== undefined) pageIndex = currentData.pageIndex;
            if (currentData.pageSize !== undefined) pageSize = currentData.pageSize;
            if (currentData.conditions) this.setConditionList(parameters, currentData.conditions);
        }
        else {
            currentData.pageIndex = pageIndex;
            currentData.pageSize = pageSize;
        }

        const conditionList = this.getConditionList(parameters, isClearQuery, currentData, isInit);
        if (conditionList === false) return;

        const queryInfo = this.getQueryInfo(dataGridView);
        queryInfo.WhereFields = conditionList;

        dataGridView.searchButton = searchButton;
        dataGridView.setDataLoading(true);
        dataGridView.queryInfo = queryInfo;
        dataGridView.pageSize = pageSize;
        searchButton && searchButton.setDisabled(true);

        const data = { entitySearchQuery, entity: dataGridView.entity, isData, pageIndex, pageSize, queryInfo, pageData: pageAxis.pageData }

        invokeDataAction(searchQuery, data);
    }

    receivesearchQuery(data, props) {
        const { pageAxis, property, isData } = props;
        const action = pageAxis.getEventAction(property.eventActionName);
        if (!action.parameters) this.initSearchQueryAction(props, action);
        const { alertMessage, expandSearchQueryLoad } = action.parameters;

        const searchButton = property.searchButton || action.parameters.searchButton;

        let pageRecord = data.pageRecord || 0;
        if (data.pageInfo) pageRecord = data.pageInfo.pageRecord;

        //设置提示信息
        let msg = ""
        if (data.isSuccess === false) {
            msg = data.message;
            if (!alertMessage) this.alert(msg, pageAxis.showMessage);
        }
        else if ((action.isSearch || !action.isQuery) && !isData) msg = `符合当前查询条件的结果总计${pageRecord}条！`;

        action.isQuery = true;

        if (msg && alertMessage) alertMessage.setValue(msg);

        //设置搜索按钮
        searchButton && searchButton.setDisabled(false);

        if (expandSearchQueryLoad) expandSearchQueryLoad({ data, props })
    }


    setConditionList(parameters, conditions) {
        const { searchView } = parameters;
        if (!searchView) return {};

        searchView.properties.forEach(p => {
            if (p.isCondition) {
                const value = conditions[p.name];
                if (p.setValue) p.setValue(value);
                p.value = value;
            }
        });
    }

    getConditionList(parameters, isClearQuery, currentData, isInit) {
        const { searchView } = parameters;
        if (!searchView) return {};

        const conditionList = [];
        const conditions = {};
        searchView.properties.forEach(p => {
            const name = p.propertyName || p.name;
            if (p.isCondition && p.getValue) {
                let value = null;
                if (currentData.conditions && isInit && currentData.conditions[p.name] !== undefined) value = currentData.conditions[p.name];
                else value = this.getPropertyValues(p, isClearQuery);
                conditionList.push({
                    Name: name, Label: p.label, OperateLogic: p.operateLogic || "=",
                    DataType: p.dataType || "string", Value: value
                });
                conditions[p.name] = value;
            }
        });

        if (Common.isArray(searchView.DefaultConditions)) {
            searchView.DefaultConditions.forEach(p => {
                var condition = {
                    Name: p.name,
                    Label: p.label,
                    OperateLogic: p.OperateLogic || "=",
                    DataType: p.dataType || "string",
                    Value: p.defaultValue
                }
                if (p.isCurrentUser) condition.value = Common.getStorage("loginUserId");

                if (!Common.isNullOrEmpty(condition.value)) conditionList.push(condition)
            });
        }

        currentData.conditions = conditions;

        return conditionList;
    }

    getPropertyValues(p, isClearQuery) {
        if (isClearQuery) {
            p.setValue(p.defaultValue);
            return p.defaultValue;
        }
        return p.getValue();
    }

    getQueryInfo(dataGridView) {
        const primaryKey = dataGridView.entity.primaryKey;
        var property = null, isGroupBy = false, hasPrimaryKey = false, name = "";
        var queryInfo = {}, orderByList = [], groupByFieldList = [], groupByList = [], selectFieldList = [];
        var firstFieldOrderBy = "";
        for (var i = 0; i < dataGridView.properties.length; i++) {
            property = dataGridView.properties[i];
            if (dataGridView.isGroupByQuery && property.isVisible === false) continue;

            name = property.propertyName || property.name;
            if (name === primaryKey) hasPrimaryKey = true;
            if (Common.isNullOrEmpty(property.GroupByExpression)) {
                selectFieldList.push(name);
                if (!Common.isNullOrEmpty(property.OrderByType)) {
                    orderByList.push(name + " " + property.OrderByType);
                }
                groupByList.push(name);

                if (!firstFieldOrderBy) firstFieldOrderBy = name + (property.OrderByType || " desc");
            }
            else {
                isGroupBy = true;
                groupByFieldList.push(property.GroupByExpression + " as " + name);
                if (!Common.isNullOrEmpty(property.OrderByType)) {
                    orderByList.push(property.GroupByExpression + " " + property.OrderByType);
                }

                if (!firstFieldOrderBy) firstFieldOrderBy = property.GroupByExpression + (property.OrderByType || " desc");
            }
        }

        if (!isGroupBy) {
            groupByList = [];
            if (!hasPrimaryKey) selectFieldList.splice(0, 0, primaryKey);
        }
        else if (orderByList.length === 0) orderByList.push(firstFieldOrderBy);

        queryInfo.HasLabel = selectFieldList.length === 0;
        queryInfo.FieldSql = selectFieldList.join(",");
        queryInfo.OrderBySql = orderByList.join(",");
        queryInfo.GroupBySql = groupByList.join(",");
        queryInfo.GroupByFieldSql = groupByFieldList.join(",");

        return queryInfo;
    }

    getConditions(parameters) {
        const { searchView } = parameters;
        if (!searchView) return [];

        const condition = {};
        searchView.properties.forEach(p => {
            const name = p.propertyName || p.name;
            if (p.isCondition && p.getValue) condition[name] = p.getValue();
        });

        return condition;
    }

    setOrderBy() {

    }

    selectRowToPage(props, action) {
        if (!action.parameters) this.selectRowToPageAction(props, action);

        const { dataGridView, alertMessage, setPageUrl } = action.parameters;
        const { pageAxis, property } = props;

        var data = null;
        if (property.params) data = property.params;
        else {
            const selectDataList = dataGridView.getSelectDataList();
            if (selectDataList.length === 0) {
                this.alert("请选择记录再操作！", pageAxis.showMessage, alertMessage)
                return;
            }

            if (selectDataList.length > 0 && alertMessage) alertMessage.setValue("")

            data = selectDataList[0];
        }

        if (action.isLocalData) {
            const editData = {};
            editData[dataGridView.entity.name] = data;
            Common.setStorage("EditEntityData", JSON.stringify(editData));
        }

        let url = ""
        if (setPageUrl) {
            url = setPageUrl({ data, props, action });
            if (url === false) return false;
        }
        else url = Common.replaceDataContent(data, action.pageUrl, true);

        const expandSetPageUrl = pageAxis.getFunction(action.expandSetPageUrl);
        if (expandSetPageUrl) url = expandSetPageUrl(url);

        if (action.isOpenUrl) pageAxis.openPage(url)
        else pageAxis.toPage(url)
    }

    alertByRowData(props, action) {
        if (!action.parameters) this.alertByRowDataAction(props, action);

        const { dataGridView, alertMessage } = action.parameters;
        const { pageAxis } = props;

        const selectDataList = dataGridView.getSelectDataList();
        if (selectDataList.length === 0) {
            this.alert("请选择记录再操作！", pageAxis.showMessage, alertMessage)
            return;
        }

        const data = selectDataList[0];

        const { statusName, statusValue, nullTipMessage } = action;
        if (statusName && statusValue) {
            if (!Common.isEquals(data[statusName], statusValue)) {
                pageAxis.alert(nullTipMessage);
                return;
            }
        }

        const msg = Common.replaceDataContent(data, action.TipMessage);
        pageAxis.alert(msg, action.title)
    }

    selectRowToPageAction(props, action) {
        const { pageAxis } = props;
        const dataGridView = pageAxis.getProperty(action.dataGridView);
        const alertMessage = pageAxis.getProperty(action.alertMessage);
        const setPageUrl = pageAxis.getFunction(action.setPageUrl);

        action.parameters = { dataGridView, alertMessage, setPageUrl }
    }

    alertByRowDataAction(props, action) {
        const { pageAxis } = props;
        const dataGridView = pageAxis.getProperty(action.dataGridView);
        const alertMessage = pageAxis.getProperty(action.alertMessage);

        action.parameters = { dataGridView, alertMessage }
    }

    excelExport(props, action) {
        if (!action.parameters) this.initExcelExportActoin(props, action);

        const { dataGridView } = action.parameters;
        const { pageAxis } = props;

        if (dataGridView.getPageRecord() > 30000) { pageAxis.alert("对不起，您要导出的数据量超过3万条，请先进行相应的数据筛选！"); return; }

        pageAxis.confirm("确定将数据Excel导出吗？", () => this.execExcelExport(props, action));
    }

    execExcelExport(props, action) {
        const { dataGridView, expandSetExcelExportQueryInfo } = action.parameters;
        const { pageAxis, property } = props;

        const { actionTypes, invokeDataAction, entityExcelExport } = dataGridView;
        const { excelExport } = actionTypes;

        const title = dataGridView.title || dataGridView.entity.name;

        const properties = dataGridView.getExcelExportProperties();
        var headerList = [];
        var header = {}, p = null;
        for (var i = 0; i < properties.length; i++) {
            p = properties[i];
            if (p.isData !== false) {
                header = {};
                header.Label = p.label;
                header.Name = p.name;
                header.width = p.columnWidth || 0;
                headerList.push(header);
            }
        }

        let queryInfo = Common.clone(dataGridView.queryInfo);
        queryInfo.HeaderInfos = headerList;

        if (expandSetExcelExportQueryInfo) queryInfo = expandSetExcelExportQueryInfo(queryInfo);
        if (queryInfo === false) return;

        property && property.setDisabled(true);
        dataGridView.excelExportButton = property;

        const data = { entityExcelExport, title, entity: dataGridView.entity, pageIndex: 1, pageSize: dataGridView.pageSize, queryInfo, pageData: pageAxis.pageData }

        invokeDataAction(excelExport, data);
    }

    initExcelExportActoin(props, action) {
        const { pageAxis } = props;
        const dataGridView = pageAxis.getProperty(action.dataGridView);

        const expandSetExcelExportQueryInfo = pageAxis.getFunction(action.expandSetExcelExportQueryInfo);

        action.parameters = { dataGridView, expandSetExcelExportQueryInfo }
    }

    receiveexcelExport(data, props) {
        const { pageAxis, property } = props;

        //设置导出按钮
        property.excelExportButton.setDisabled(false);

        if (data.isSuccess === false || !data.FileName) {
            this.alert(data.message || "导出失败！", pageAxis.showMessage);
            return;
        }

        this.downLoad(property.excelExportButton.title, data.FileName)
    }

    downLoad(title, fileName) {
        title += "_" + Common.createGuid().substr(0, 8).toUpperCase();
        var url = window.publicPath + `download/${title}.xlsx?fn=${fileName}`;
        window.open(url, "_self");
    }

    syncData(props, action) {
        if (!action.parameters) this.initSyncDataAction(props, action);
        const { pageAxis, property } = props;

        const { dataActionType } = property;

        //设置接收数据行数返回数据
        pageAxis.receives[dataActionType] = (d) => this.receiveSyncDataList(d, props, action)

        const onOk = () => {
            property.setDisabled && property.setDisabled(true);

            pageAxis.invokeDataAction(dataActionType, {});
        };

        if (property.confirmTip) pageAxis.confirm(property.confirmTip, onOk);
        else onOk();
    }

    receiveSyncDataList(data, props, action) {
        const { dataGridView } = action.parameters;
        const { pageAxis, property } = props;

        property.setDisabled && property.setDisabled(false);

        if (this.isSuccessNextsProps(data, pageAxis.alert)) {
            this.alert(property.successTip, pageAxis.showMessage)
            //刷新查询
            dataGridView.refresh();
        }
        return false;
    }

    initSyncDataAction(props, action) {
        const { pageAxis } = props;
        const dataGridView = pageAxis.getProperty(action.dataGridView);

        action.parameters = { dataGridView };
    }

}