package OpenDataApi.models;

import OpenDataAccess.Entity.*;
import OpenDataAccess.LambdaInterface.IFunction2;

import java.util.Date;
import java.util.List;


@ITablePropertyAttribute(Name = "acf_Entity", PrimaryKey = "Id")
public class Entity extends EntityModel implements IEntity {
    public String Id = null;
    public String Entity_Name = null;
    public String Name = null;
    public String Table_Name = null;
    public String With_Sql = null;
    public String Primary_Key = null;
    public String No_Select_Names = null;
    public byte Is_Get = 0;
    public byte Is_Post = 0;
    public byte Is_Put = 0;
    public byte Is_Delete = 0;
    public byte Is_Get_log = 0;
    public byte Is_Post_Log = 0;
    public byte Is_Post_Query_Log = 0;
    public byte Is_Put_Log = 0;
    public byte Is_Delete_log = 0;
    public String Remark = null;
    public Date Create_Date = null;
    public String Row_Version = null;

    @Override
    public void InsertValidate(List<IFunction2<IValidate, IEntityData, String>> validateList) {
        validateList.add(this.InsertValidateUnique(Entity.class, "Name", "对不起，该实体名已存在！"));
    }

    @Override
    public void UpdateValidate(List<IFunction2<IValidate, IEntityData, String>> validateList) {
        validateList.add(this.UpdateValidateUnique(Entity.class, "Name", "对不起，该实体名已存在！"));
    }
}