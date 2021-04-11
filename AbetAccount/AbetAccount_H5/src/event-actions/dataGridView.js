import BaseIndex from './baseIndex';
import { Common } from "UtilsCommon";

export default class DataGridView extends BaseIndex {

    searchQuery(props, action) {
        if (!action.parameters) this.initSearchQueryAction(props, action);

        else action.isSearch = props.property.type !== "DataGridView";

        this.searchData(props, action.parameters, props.pageIndex || 1, props.pageSize || 10, action.isClearQuery);
    }

    initSearchQueryAction(props, action) {
        const { property, pageAxis } = props;

        //判断props.property 是 查询按钮或搜索框 还是DataGridView
        const dataGridView = property.type === "DataGridView" ? property : pageAxis.getProperty(action.dataGridView);
        const searchButton = property.type === "DataGridView" ? pageAxis.getProperty(action.searchButton) : property;
        const searchView = pageAxis.getProperty(action.searchView);
        const dialogView = pageAxis.getProperty(action.dialogView);
        const alertMessage = pageAxis.getProperty(action.alertMessage);
        const expandSearchQueryLoad = pageAxis.getFunction(action.expandSearchQueryLoad)
        const expandGetConditions = pageAxis.getFunction(action.expandGetConditions)
        action.parameters = { dataGridView, searchButton, searchView, dialogView, alertMessage, expandSearchQueryLoad, expandGetConditions }
    }

    searchData(props, parameters, pageIndex, pageSize, isClearQuery) {
        const { dataGridView, searchButton, expandGetConditions, dialogView } = parameters;
        const { actionTypes, invokeDataAction, entitySearchQuery } = dataGridView;
        const { searchQuery } = actionTypes;
        const { pageAxis, isData } = props;

        const conditionList = this.getConditionList(parameters, isClearQuery, pageAxis);
        if (conditionList === false) return;

        const queryInfo = this.getQueryInfo(dataGridView);
        queryInfo.WhereFields = conditionList;

        dataGridView.searchButton = searchButton;
        dataGridView.setDataLoading(true);
        dataGridView.queryInfo = queryInfo;
        dataGridView.pageSize = pageSize;
        searchButton && searchButton.setDisabled(true);

        let conditions = dataGridView.conditions;
        if (expandGetConditions) conditions = expandGetConditions({ dataGridView, conditions });

        const data = { entitySearchQuery, conditions, actionName: dataGridView.actionName, entity: dataGridView.entity, isData, pageIndex, pageSize, queryInfo, pageData: pageAxis.pageData }

        invokeDataAction(searchQuery, data);

        if (dialogView && dialogView.modalDialog) dialogView.modalDialog.setVisible(false);
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

    getConditionList(parameters, isClearQuery, pageAxis) {
        const { searchView, dataGridView } = parameters;
        if (!searchView) return [];

        const isQueryInfo = searchView.isKeywordView && dataGridView.queryInfo;
        const conditionList = isQueryInfo ? dataGridView.queryInfo.WhereFields : [];

        if (searchView.keywordName && !searchView.keywordProperty) {
            searchView.keywordProperty = pageAxis.getProperty(searchView.keywordName);
        }

        searchView.properties.forEach(p => {
            const name = p.propertyName || p.name;
            if (p.isCondition && p.getValue) {
                let whereField = null;
                if (isQueryInfo) {
                    whereField = Common.arrayFirst(dataGridView.queryInfo.WhereFields, f => f.Name === name);
                }
                if (whereField) {
                    whereField.Value = this.getPropertyValues(p, isClearQuery);
                    whereField.Text = this.getPropertyValueText(p, isClearQuery);
                }
                else {
                    whereField = {
                        Name: name, Label: p.label, OperateLogic: p.operateLogic || "=",
                        DataType: p.dataType || "string", Value: this.getPropertyValues(p, isClearQuery),
                        Text: this.getPropertyValueText(p, isClearQuery),
                    };
                    conditionList.push(whereField);
                }
                if (searchView.keywordProperty && p.propertyName === searchView.keywordProperty.propertyName) {
                    searchView.keywordProperty.setValue && searchView.keywordProperty.setValue(whereField.Value);
                    searchView.keywordProperty.value = whereField.Value;
                }
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

                if (!Common.isNullOrEmpty(condition.value)) conditionList.push(condition)
            });
        }
        return conditionList;
    }

    getPropertyValues(p, isClearQuery) {
        if (isClearQuery) {
            p.setValue(p.defaultValue);
            return p.defaultValue;
        }
        return p.getValue();
    }

    getPropertyValueText(p, isClearQuery) {
        if (isClearQuery) {
            p.setValue(p.defaultValue);
            return p.defaultValueText || p.defaultValue;
        }
        else if (p.getText) return p.getText();
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
            if (Common.isNullOrEmpty(property.groupByExpression)) {
                selectFieldList.push(name);
                if (!Common.isNullOrEmpty(property.orderByType)) {
                    orderByList.push(name + " " + property.orderByType);
                }
                groupByList.push(name);

                if (!firstFieldOrderBy) firstFieldOrderBy = name + (property.orderByType || " desc");
            }
            else {
                isGroupBy = true;
                groupByFieldList.push(property.groupByExpression + " as " + name);
                if (!Common.isNullOrEmpty(property.orderByType)) {
                    orderByList.push(property.groupByExpression + " " + property.orderByType);
                }

                if (!firstFieldOrderBy) firstFieldOrderBy = property.groupByExpression + (property.orderByType || " desc");
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
        if (!searchView) return {};

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
        var url = window.routerBase + `download/${title}.xlsx?fn=${fileName}`;
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

            pageAxis.invokeDataAction(dataActionType);
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

    setDataGridShowColumns(props, action) {
        if (!action.parameters) this.initSetDataGridShowColumnsAction(props, action);
        const { pageAxis } = props;

        const { dataGridView } = action.parameters;

        if (!action.parameters.columnsView) action.parameters.columnsView = this.initColumnsView(dataGridView.name, dataGridView.properties);

        const { columnsView } = action.parameters;

        const value = dataGridView.properties.filter(f => f.isVisible !== false).map(m => m.name);
        const allSelect = columnsView.properties[0];
        allSelect.isChanged = false;
        const colPropertery = columnsView.properties[1];
        colPropertery.isChanged = false;
        if (colPropertery.setValue) colPropertery.setValue(value);
        colPropertery.value = value;

        const allSelected = value.length === dataGridView.properties.length;
        if (allSelect.setValue) allSelect.setValue(allSelected);
        allSelect.value = allSelected;

        var colSelected = false, allSelected2 = false;
        const nameList = dataGridView.properties.map(m => m.name);
        allSelect.valueChange = (v) => {
            if (!allSelect.isChanged) return;
            if (colSelected) { colSelected = false; return; }

            allSelected2 = true;
            colPropertery.setValue(v ? nameList : []);
        };

        colPropertery.valueChange = (v) => {
            if (!colPropertery.isChanged) return;
            if (allSelected2) { allSelected2 = false; return; }

            colSelected = true;
            allSelect.setValue(v.length === nameList.length);
        };

        const onOk = (e, p) => this.setSelectShowColumns(e, p, props, action);
        this.showdialog(action, pageAxis, columnsView, onOk);
    }

    setSelectShowColumns(e, p, props, action) {
        const { pageAxis } = props;
        const { columnsView, dataGridView } = action.parameters;
        const colPropertery = columnsView.properties[1];
        const value = colPropertery.getValue();

        if (value.length === 0) { this.alert("最少需选择一列！", pageAxis.alert); return; }
        dataGridView.setColumnsVisible2(value);

        action.modalDialog.setVisible(false);
    }

    initSetDataGridShowColumnsAction(props, action) {
        const { pageAxis } = props;
        const dataGridView = pageAxis.getProperty(action.dataGridView);

        action.parameters = { dataGridView }
    }

    initColumnsView(name, properties) {
        const dataSource = properties.map(m => { return { value: m.name, text: m.label } })
        return {
            name: name + "columnsView",
            type: "View",
            isList: true,
            className: "divColumsView",
            id: Common.createGuid(),
            dialogId: Common.createGuid(),
            dialogTitle: "自定义显示列",
            properties: [{
                id: Common.createGuid(),
                name: name + "AllSelect",
                type: "CheckBox",
                checkedValue: true,
                unCheckedValue: false,
                text: "全选",
                spanClassName: 'spanAllSelect',
                isListItem: true,
                style: { borderTop: "1px solid #e8e8e8", color: "#1890ff", background: "#fafafa" }
            }, {
                id: Common.createGuid(),
                name: name + "Columns",
                type: "CheckBoxGroup",
                dataSource
            }]
        }
    }
}