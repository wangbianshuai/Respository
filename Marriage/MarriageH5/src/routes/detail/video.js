import { EntityPageEdit } from "PageTemplates";

export default EntityPageEdit("detail_video", "Spectral", '云课堂详情', 1100, {
    expandInit() {
        this.recommendReadProperty = this.getProperty('recommendRead');
        this.favoritesStartProperty = this.getProperty('favoritesStart');
    },
    setGetEntityDataLoad({ data, props, action }) {
        this.entityData = data;
        const { ApplicationUIDs, UID } = data;
        if (!UID) return;

        this.props.location.pageData.setBottomButtonVisibles({});

        let ApplicationUID = '';

        if (ApplicationUIDs) {
            const ids = ApplicationUIDs.split(',');
            if (ids.length = 1) ApplicationUID = ids[0];
            else {
                const index = Math.floor(Math.random() * ids.length);
                ApplicationUID = ids[index];
            }
        }

        const param = {
            VideoIndex: "ClicksDesc", PageSize: 4, PageNumber: 1,
            ApplicationUID
        };

        const payload = {
            formData: {
                Param: JSON.stringify(param),
                Act: 'OpticalSchool_GetVideosList'
            }
        };

        this.dispatchAction('SpectralService', 'getVideoRelations', payload).then(res => {
            if (this.isSuccessProps(res)) {
                this.recommendReadProperty.dataSource = res.List.filter(f => f.UID !== UID);
                this.recommendReadProperty.refreshOptions();
            }
        });
    },
    //收藏
    collect({ isCollect }) {
        if (!this.judgeLogin()) return;

        if (this.entityData.UID) {
            this.eventActions.page.collect({ isCollect, actionType: 1102, favoritesStart: this.favoritesStartProperty, pageAxis: this }, {});
        }
    }
}, ['UserService/collect','getVideoRelations']);