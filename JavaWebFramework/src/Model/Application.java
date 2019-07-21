package Model;

import OpenDataAccess.Entity.*;
import OpenDataAccess.LambdaInterface.IFunction2;

import java.util.Date;
import java.util.List;

@TablePropertyAttribute(Name = "t_d_Application", PrimaryKey = "ApplicationId")
public class Application extends EntityModel implements IEntity {
    public String ApplicationId = null;
    public String ApplicationName = null;
    public Date CreateDate = null;
    public String ConnectionString = null;
    public String Remark = null;

    @Override
    public void InsertValidate(List<IFunction2<IValidate, IEntityData, String>> validateList) {
        validateList.add(this.InsertValidateUnique(Application.class, "ApplicationName", "对不起，该应用名已存在！"));
    }

    @Override
    public void UpdateValidate(List<IFunction2<IValidate, IEntityData, String>> validateList) {
        validateList.add(this.UpdateValidateUnique(Application.class, "ApplicationName", "对不起，该应用名已存在！"));
    }
}