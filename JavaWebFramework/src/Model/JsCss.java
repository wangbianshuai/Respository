package Model;


import OpenDataAccess.Entity.*;
import OpenDataAccess.LambdaInterface.IFunction2;

import java.util.Date;
import java.util.List;

@ITablePropertyAttribute(Name = "t_d_JsCss", PrimaryKey = "Id")
public class JsCss extends EntityModel implements IEntity {
    public String Id = null;
    public String Name = null;
    public byte Type = 0;
    public String Path = null;
    public String Remark = null;
    public Date CreateDate = null;

    @Override
    public void InsertValidate(List<IFunction2<IValidate, IEntityData, String>> validateList) {
        validateList.add(this.InsertValidateUnique(JsCss.class, "Name", "对不起，该名称已存在！"));
    }

    @Override
    public void UpdateValidate(List<IFunction2<IValidate, IEntityData, String>> validateList) {
        validateList.add(this.UpdateValidateUnique(JsCss.class, "Name", "对不起，该名称已存在！"));
    }
}