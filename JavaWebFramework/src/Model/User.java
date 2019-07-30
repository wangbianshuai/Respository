package Model;

import OpenDataAccess.Entity.*;
import OpenDataAccess.LambdaInterface.IFunction2;

import java.util.Date;
import java.util.List;

@ITablePropertyAttribute(Name = "t_d_User", PrimaryKey = "UserId")
public class User extends EntityModel implements IEntity {
        public String UserId = null;
        public String UserName = null;
        public String LoginName = null;
        public String LoginPassword = null;
        public Date LastLoginDate = null;
        public Date CreateDate = null;

        @Override
        public void InsertValidate(List<IFunction2<IValidate, IEntityData, String>> validateList) {
                validateList.add(this.InsertValidateUnique(User.class, "LoginName", "对不起，该登录名已存在！"));
        }

        @Override
        public void UpdateValidate(List<IFunction2<IValidate, IEntityData, String>> validateList) {
                validateList.add(this.UpdateValidateUnique(User.class, "LoginName", "对不起，该登录名已存在！"));
        }
}