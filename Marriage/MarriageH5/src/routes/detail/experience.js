import { EntityPageEdit } from "PageTemplates";

export default EntityPageEdit("detail_experience", "Spectral", '科研经验详情', 1000, {
    expandInit() {
        this.favoritesStartProperty = this.getProperty('favoritesStart');
    },
    setGetEntityDataLoad({ data, props, action }) {
        this.entityData = data;
        this.props.location.pageData.setBottomButtonVisibles({});
    },
    //收藏
    collect({ isCollect }) {
        if (!this.judgeLogin()) return;

        if (this.entityData.UID) {
            this.eventActions.page.collect({ isCollect, actionType: 1002, favoritesStart: this.favoritesStartProperty, pageAxis: this }, {});
        }
    }
}, ['UserService/collect']);