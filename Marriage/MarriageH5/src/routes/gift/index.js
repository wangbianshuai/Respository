import { EntityPageList } from "PageTemplates";

export default EntityPageList('gift_index', "Gift", '积分商城', 2600, {
    createOrderSuccess() {
        this.toPage('/gift/index?tabPage=2');
    }
}, ['searchOrder', 'createOrder', 'getGiftCart', 'removeCart']);