import React from "react";
import OrderDetail from "./OrderDetail"
import OrderImage from "./OrderImage"
import DealingsBillDataView from "./DealingsBillDataView"

export default (view, props) => {
    const name = view.PageComponentName || view.DataViewComponentName

    switch (name) {
        case "OrderDetail": return <OrderDetail {...props} />
        case "OrderImage": return <OrderImage {...props} />
        case "DealingsBillDataView": return <DealingsBillDataView {...props} />
        default: return null;
    }
};