package OpenDataApi.models;

import OpenDataAccess.Entity.*;
import OpenDataAccess.LambdaInterface.IFunction2;

import java.util.Date;
import java.util.List;

@ITablePropertyAttribute(Name = "t_d_Data_Source", PrimaryKey = "Id")
public class DataSource extends EntityModel implements IEntity {
    public String Id = null;
    public String Name = null;
    public Date Create_Date = null;
    public String Entity_Name = null;
    public String Remark = null;
    public String Value_Name = null;
    public String Text_Name = null;
    public String Parent_Name = null;
    public String Action_Id = null;

    @Override
    public void InsertValidate(List<IFunction2<IValidate, IEntityData, String>> validateList) {
        validateList.add(this.InsertValidateUnique(DataSource.class, "Name", "对不起，该数据源已存在！"));
    }

    @Override
    public void UpdateValidate(List<IFunction2<IValidate, IEntityData, String>> validateList) {
        validateList.add(this.UpdateValidateUnique(DataSource.class, "Name", "对不起，该数据源已存在！"));
    }
}