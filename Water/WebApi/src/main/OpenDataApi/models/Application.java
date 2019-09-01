package OpenDataApi.models;

import OpenDataAccess.Entity.*;
import OpenDataAccess.LambdaInterface.IFunction2;

import java.util.Date;
import java.util.List;

@ITablePropertyAttribute(Name = "t_d_Application2", PrimaryKey = "Application_Id")
public class Application extends EntityModel implements IEntity {
    public String Application_Id = null;
    public String Name = null;
    public Date Create_Date = null;
    public String Connection_String = null;
    public String Remark = null;
    public String Db_User = null;
    public String Db_Password = null;

    @Override
    public void InsertValidate(List<IFunction2<IValidate, IEntityData, String>> validateList) {
    validateList.add(this.InsertValidateUnique(Application.class, "Name", "对不起，该应用名已存在！"));
}

    @Override
    public void UpdateValidate(List<IFunction2<IValidate, IEntityData, String>> validateList) {
        validateList.add(this.UpdateValidateUnique(Application.class, "Name", "对不起，该应用名已存在！"));
    }
}