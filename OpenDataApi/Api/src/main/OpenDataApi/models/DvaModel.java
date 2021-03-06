package OpenDataApi.models;

import OpenDataAccess.Entity.*;
import OpenDataAccess.LambdaInterface.IFunction2;

import java.util.Date;
import java.util.List;


@ITablePropertyAttribute(Name = "t_d_Dva_Model", PrimaryKey = "Id")
public class DvaModel extends EntityModel implements IEntity {
    public String Id = null;
    public String Name = null;
    public Date Create_Date = null;
    public String Service_Name = null;
    public String Remark = null;

    @Override
    public void InsertValidate(List<IFunction2<IValidate, IEntityData, String>> validateList) {
        validateList.add(this.InsertValidateUnique(DvaModel.class, "Name", "对不起，该名称已存在！"));
    }

    @Override
    public void UpdateValidate(List<IFunction2<IValidate, IEntityData, String>> validateList) {
        validateList.add(this.UpdateValidateUnique(DvaModel.class, "Name", "对不起，该名称已存在！"));
    }
}