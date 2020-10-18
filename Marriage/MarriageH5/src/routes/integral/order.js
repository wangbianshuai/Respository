import { EntityPageEdit } from "PageTemplates";

export default EntityPageEdit('integral_order', 'Order', '订单详情', 2800, {
    setGetEntityDataLoad({ data, props, action }) {
        this.orderEditProperty = this.getProperty('orderEdit');

        this.orderEditProperty.properties.forEach(p => {
            if (p.name !== 'Gifts' && p.name !== 'whiteSpace30') {
                if (p.name == 'Remark' || p.name === 'Status') p.setVisible(true);
                else p.setVisible(data.NeedDelivery)
            }
        });
    }
});