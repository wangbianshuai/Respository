import { EntityPageEdit } from "PageTemplates";

export default EntityPageEdit("detail_activity", "Spectral", '', 900, {
    expandInit() {
        this.favoritesStartProperty = this.getProperty('favoritesStart');
        this.activityContentPageProperty = this.getProperty('activityContentPage');
        this.activityEditProperty = this.getProperty('activityEdit');
    },
    setGetEntityDataLoad({ data, props, action }) {
        this.entityData = data;

        if (!this.pageData.title) document.title = data.ActivityName;

        if (data.WeixinPageUID) {
            this.activityContentPageProperty.setValue(data.WeixinPageUID);
            this.props.location.pageData.setBottomVisible(false);
        }
        else this.props.location.pageData.setBottomButtonVisibles({ signup: true });
    },
    signup() {
        if (!this.judgeLogin()) return;
        window.open(this.entityData.Links);
    },
    //收藏
    collect({ isCollect }) {
        if (!this.judgeLogin()) return;

        if (this.entityData.UID) {
            this.eventActions.page.collect({ isCollect, actionType: 902, favoritesStart: this.favoritesStartProperty, pageAxis: this }, {});
        }
    }
}, ['UserService/collect', 'ActivityService/getContentPage']);