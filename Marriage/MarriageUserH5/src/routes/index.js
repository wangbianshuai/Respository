import { EntityPageEdit } from "PageTemplates";

export default EntityPageEdit("index", "MarriageUser", '连理缘-注册', 100, {
    expandInit() {

    },
    saveEntityDataCallback() {
        this.alertSuccess('注册成功', () => {
            this.toPage('/mine/index');
        });
    }
});