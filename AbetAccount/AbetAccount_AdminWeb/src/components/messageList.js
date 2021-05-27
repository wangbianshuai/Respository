import React from "react"
import DataGrid from "./dataGrid";
import Base from './base';

export default React.memo((props) => {
    const { property, pageAxis } = Base.getProps(props);

    const { primaryKey, dataList, dataProperties } = property;

    return (<DataGrid pageAxis={pageAxis} primaryKey={primaryKey} dataList={dataList} isPartPaging={false}
        isPaging={false} pageId={pageAxis.id}
        property={property}
        dataProperties={dataProperties} />)
});