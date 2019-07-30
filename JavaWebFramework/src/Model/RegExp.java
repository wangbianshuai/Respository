package Model;

import OpenDataAccess.Entity.*;
import OpenDataAccess.LambdaInterface.IFunction2;

import java.util.Date;
import java.util.List;

@ITablePropertyAttribute(Name = "t_d_RegExp", PrimaryKey = "RegExpId")
public class RegExp extends EntityModel implements IEntity {
    public String RegExpId = null;
    public String RegExpName = null;
    public String Expression = null;
    public String Message = null;
    public Date CreateDate = null;

    @Override
    public void InsertValidate(List<IFunction2<IValidate, IEntityData, String>> validateList) {
        validateList.add(this.InsertValidateUnique(RegExp.class, "RegExpName", "对不起，该名称已存在！"));
    }

    @Override
    public void UpdateValidate(List<IFunction2<IValidate, IEntityData, String>> validateList) {
        validateList.add(this.UpdateValidateUnique(RegExp.class, "RegExpName", "对不起，该名称已存在！"));
    }
}