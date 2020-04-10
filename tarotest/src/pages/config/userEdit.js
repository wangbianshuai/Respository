import Taro, { useRouter } from "@tarojs/taro";
import { EntityPageEdit } from "PageTemplates";
import { Common, Md5 } from "UtilsCommon";

const _PageExpand = {
  expandSetEntityData({ entityData, props, view }) {
    const isUpdate = view.entityData && view.entityData.UserId;
    if (!isUpdate && Common.isNullOrEmpty(entityData.LoginPassword)) {
      props.pageAxis.alert("Login password cannot be empty!"); return;
    }

    if (!Common.isNullOrEmpty(entityData.LoginPassword) && !Common.isEquals(entityData.LoginPassword, entityData.LoginAgainPassword)) {
      props.pageAxis.alert("The login password is different from the confirmation password!")
      return false;
    }

    if (entityData.LoginPassword) entityData.LoginPassword = Md5(entityData.LoginPassword);
    else delete entityData.LoginPassword;

    return entityData;
  }
};

const UserEdit = () => {
  const router = useRouter();
  const { params } = router;

  return <EntityPageEdit name='config_userEdit' pageExpand={_PageExpand} entityName='User' minActionType={4400} params={params} />
}

UserEdit.config = {
  navigationBarTitleText: 'User Edit'
};

export default UserEdit;
