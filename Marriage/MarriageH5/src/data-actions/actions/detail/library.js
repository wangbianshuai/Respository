export default {
    collect(id, actionType, data) {
        const { isCollect, articleType, articleUID } = data;

        const act = isCollect ? 'Favorites_Delete' : 'Favorites_Create';

        const formData = {
            Param: JSON.stringify({ ArticleType: articleType, ArticleUID: articleUID }),
            Act: act
        };

        const action = this.getAction(id, actionType);

        this.dvaActions.dispatch("UserService", 'collect', { action, formData });
    },
    consult(id, actionType, data) {
        const { entityData } = data;

        entityData.LibraryUID = data.pageData.UID;
        const formData = {
            Param: JSON.stringify(entityData),
            Act: 'Library_Consult'
        };

        const action = this.getAction(id, actionType);

        this.dvaActions.dispatch(this.serviceName, 'consult', { action, formData });
    }
}