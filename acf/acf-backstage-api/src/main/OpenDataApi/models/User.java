package OpenDataApi.models;

import OpenDataAccess.Entity.*;
import OpenDataAccess.LambdaInterface.IFunction2;

import java.util.Date;
import java.util.List;

@ITablePropertyAttribute(Name = "acf_user", PrimaryKey = "User_Id")
public class User extends EntityModel implements IEntity {
    public String User_Id = null;
    public String User_Name = null;
    public String Login_Name = null;
    public String Login_Password = null;
    public Date Last_Login_Date = null;
    public String Create_User = null;
    public Date Create_Date = null;
    public String Update_User = null;
    public Date Update_Date = null;
    public String Row_Version = null;

    public String Token = null;

    @Override
    public void InsertValidate(List<IFunction2<IValidate, IEntityData, String>> validateList) {
        validateList.add(this.InsertValidateUnique(User.class, "Login_Name", "对不起，该登录名已存在！"));
    }

    @Override
    public void UpdateValidate(List<IFunction2<IValidate, IEntityData, String>> validateList) {
        validateList.add(this.UpdateValidateUnique(User.class, "Login_Name", "对不起，该登录名已存在！"));
    }
}