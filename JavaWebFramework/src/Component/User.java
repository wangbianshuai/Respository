package Component;

import OpenDataAccess.Data.*;
import OpenDataAccess.Entity.EntityData;
import OpenDataAccess.Entity.IEntityData;
import OpenDataAccess.Entity.Property;
import OpenDataAccess.Service.EntityRequest;
import OpenDataAccess.Service.Request;

import java.util.ArrayList;
import java.util.List;

public class User extends EntityRequest {
    public User() {
    }

    public User(Request request) {
        super(request);
    }

    private boolean ChangePassword(String userId, String password) {
        IEntityData entityData = new EntityData(this.GetRequest().Entity);
        entityData.SetValue("LoginPassword", password);
        return this.UpdateEntityByPrimaryKey(userId, entityData, null);
    }

    private Model.User GetEntityByName(String loginName) throws IllegalAccessException, InstantiationException, Exception {
        Property loginNameProperty = this.GetRequest().Entity.GetProperty("LoginName");
        loginNameProperty.Value = loginName;
        IQuery query = new Query(this.GetRequest().Entity.TableName, this.GetRequest().Entity.Name);
        IDataParameterList parameterList = new DataParameterList();
        parameterList.Set(loginNameProperty.Name, loginNameProperty.Value);
        query.Where(" where LoginName=@LoginName", parameterList);
        return (Model.User) this.SelectEntity(query).ToEntity(Model.User.class);
    }

    public Object GetChangePassword() {
        String message = "";
        try {
            String oldPassword = this.GetRequest().GetParameterValue("OldPassword");
            String newPassword = this.GetRequest().GetParameterValue("NewPassword");
            String loginName = this.GetRequest().GetParameterValue("LoginName");
            Model.User model = this.GetEntityByName(loginName);
            if (model != null) {
                if (model.LoginPassword != oldPassword) {
                    message = "对不起，原密码不正确！";
                } else {
                    if (this.ChangePassword(model.UserId, newPassword)) {
                        message = "Succeed";
                    } else {
                        message = "操作失败！";
                    }
                }
            } else {
                message = "对不起，该用户已删除！";
            }

        } catch (Exception ex) {
            message = "操作异常！";
        }
        if (message == "Succeed") {
            return this.GetBoolDict(true);
        } else {
            return this.GetMessageDict(message);
        }
    }

    public Object GetLogin() {
        try {
            String loginName = this.GetRequest().GetParameterValue("LoginName");
            String loginPassword = this.GetRequest().GetParameterValue("LoginPassword");
            Property loginNameProperty = this.GetEntityType().GetProperty("LoginName");
            loginNameProperty.Value = loginName;
            Property loginPasswordProperty = this.GetEntityType().GetProperty("LoginPassword");
            loginPasswordProperty.Value = loginPassword;
            IQuery query = new Query("t_d_User", this.GetEntityType().Name);
            List<String> fieldList = new ArrayList();
            fieldList.add("*");
            List<WhereStatement> whereList = new ArrayList<>();

            whereList.add(new WhereStatement("LoginName", "=", "@LoginName"));
            whereList.add(new WhereStatement("and LoginPassword", "=", "@LoginPassword"));

            IDataParameterList parameterList = new DataParameterList();
            parameterList.Set(loginNameProperty.Name, loginNameProperty.Value);
            parameterList.Set(loginPasswordProperty.Name, loginPasswordProperty.Value);
            query.Select(fieldList).Where(whereList, parameterList);
            IEntityData entityData = this.SelectEntity(query);
            if (entityData != null) {
                Object userId = entityData.GetValue("UserId");
                IEntityData updateEntityData = new EntityData(this.GetEntityType());
                updateEntityData.SetValue("LastLoginDate", new java.sql.Timestamp(System.currentTimeMillis()));
                this.UpdateEntityByPrimaryKey(userId, updateEntityData, null);
            }
            return entityData;
        } catch (Exception ex) {
            ExHandling(ex);
            return null;
        }
    }
}