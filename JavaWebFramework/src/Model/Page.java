package Model;


import OpenDataAccess.Entity.*;
import OpenDataAccess.LambdaInterface.IFunction2;

import java.util.Date;
import java.util.List;

@ITablePropertyAttribute(Name = "t_d_Page", PrimaryKey = "PageId")
public class Page extends EntityModel implements IEntity {
    public String PageId = null;
    public String PageName = null;
    public String ApplicationId = null;
    public String ViewId = null;
    public String PageHeadId = null;
    public String ExpandJsClassName = null;
    public String ExpandJsPath = null;
    public String ExpandJsCode = null;
    public String ExpandHead = null;
    public String Title = null;
    public String Remark = null;
    public Date CreateDate = null;

    public List<View> ViewList = null;

    @Override
    public void InsertValidate(List<IFunction2<IValidate, IEntityData, String>> validateList) {
        validateList.add(this.ValidateExists(Page.class, "ApplicationId=@ApplicationId and PageName=@PageName", "对不起，该页面名已存在！", true));
    }

    @Override
    public void UpdateValidate(List<IFunction2<IValidate, IEntityData, String>> validateList) {
        validateList.add(this.ValidateExists(Page.class, "EventId=@EventId and PageName=@PageName", "true", true));
        validateList.add(this.ValidateExists(Page.class, "ApplicationId=@ApplicationId and PageName=@PageName", "对不起，该页面名已存在！", true));
    }
}