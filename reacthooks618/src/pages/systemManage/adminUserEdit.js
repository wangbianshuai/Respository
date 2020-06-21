import { EntityPageEdit } from "PageTemplates";
import { Common, Md5 } from "UtilsCommon";

const adminUserEdit = {
    expandSetAdminUserData: function ({ entityData, props, view }) {
        const isUpdate = view.entityData && view.entityData.AdminUserId;
        if (!isUpdate && Common.isNullOrEmpty(entityData.LoginPassword)) {
            this.alert("登录密码不能为空！"); return;
        }

        if (!Common.isNullOrEmpty(entityData.LoginPassword) && !Common.isEquals(entityData.LoginPassword, entityData.LoginAgainPassword)) {
            this.alert("登录密码与确认密码不一致！")
            return false;
        }

        if (entityData.LoginPassword) entityData.LoginPassword = Md5(entityData.LoginPassword);
        else delete entityData.LoginPassword;

        return entityData;
    }
};

export default EntityPageEdit("systemManage_adminUserEdit", "AdminUser", 4400, adminUserEdit);
