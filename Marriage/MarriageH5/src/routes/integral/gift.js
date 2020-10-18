import { EntityPageEdit } from "PageTemplates";

export default EntityPageEdit("integral_gift", 'Gift', '礼品详情', 2700, {
    addCartSuccess({ data, props, action }) {
        this.toPage('/gift/index?tabPage=1');
    }
}, ['addCart']);