package Model;


import OpenDataAccess.Entity.*;
import OpenDataAccess.LambdaInterface.IFunction2;

import java.util.Date;
import java.util.List;

@ITablePropertyAttribute(Name = "t_d_PageHead", PrimaryKey = "PageHeadId")
public class PageHead extends EntityModel implements IEntity {
    public String PageHeadId = null;
    public String PageHeadName = null;
    public String ExpandHead = null;
    public String Remark = null;
    public Date CreateDate = null;

    @Override
    public void InsertValidate(List<IFunction2<IValidate, IEntityData, String>> validateList) {
        validateList.add(this.InsertValidateUnique(PageHead.class, "PageHeadName", "对不起，该页头名称已存在！"));
    }

    @Override
    public void UpdateValidate(List<IFunction2<IValidate, IEntityData, String>> validateList) {
        validateList.add(this.UpdateValidateUnique(PageHead.class, "PageHeadName", "对不起，该页头名称已存在！"));
    }
}