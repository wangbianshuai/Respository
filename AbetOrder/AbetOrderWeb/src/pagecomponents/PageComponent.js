import React from "react";
import OrderDetail from "./OrderDetail"
import OrderImage from "./OrderImage"

export default (view, props) => {
    switch (view.PageComponentName) {
        case "OrderDetail": return <OrderDetail {...props} />
        case "OrderImage": return <OrderImage {...props} />
        default: return null;
    }
};