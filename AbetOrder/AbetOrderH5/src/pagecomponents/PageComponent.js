import React from "react";
import DealingsBillDataView from "./DealingsBillDataView"

export default (view, props) => {
    const name = view.PageComponentName || view.DataViewComponentName

    switch (name) {
        case "DealingsBillDataView": return <DealingsBillDataView {...props} />
        default: return null;
    }
};