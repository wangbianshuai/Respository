package Model;

import OpenDataAccess.Entity.*;
import OpenDataAccess.LambdaInterface.IFunction2;

import java.util.Date;
import java.util.List;

@ITablePropertyAttribute(Name = "t_d_View", PrimaryKey = "ViewId")
public class View  extends EntityModel implements IEntity {
    public String ViewId = null;
    public String ViewName = null;
    public String TableName = null;
    public String ApplicationId = null;
    public String EntityName = null;
    public String PrimaryKey = null;
    public byte IsDataView = 0;
    public String ExpandJsClassName = null;
    public String ExpandJsPath = null;
    public String ExpandJsCode = null;
    public int Width = 0;
    public int Height = 0;
    public String GetEntityUrl = null;
    public String Properties = null;
    public String Remark = null;
    public Date CreateDate = null;

    @Override
    public void InsertValidate(List<IFunction2<IValidate, IEntityData, String>> validateList) {
        validateList.add(this.ValidateExists(View.class, "ApplicationId=@ApplicationId and ViewName=@ViewName", "对不起，该视图名已存在！", true));
    }

    @Override
    public void UpdateValidate(List<IFunction2<IValidate, IEntityData, String>> validateList) {
        validateList.add(this.ValidateExists(View.class, "EventId=@EventId and ViewName=@ViewName", "true", true));
        validateList.add(this.ValidateExists(View.class, "ApplicationId=@ApplicationId and ViewName=@ViewName", "对不起，该视图名已存在！", true));
    }
}