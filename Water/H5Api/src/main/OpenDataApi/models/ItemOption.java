package OpenDataApi.models;

import OpenDataAccess.Entity.EntityModel;
import OpenDataAccess.Entity.IEntity;
import OpenDataAccess.Entity.ITablePropertyAttribute;


@ITablePropertyAttribute(Name = "t_d_Item_Option",PrimaryKey = "Id")
public class ItemOption extends EntityModel implements IEntity {
    public String Id = null;
    public String Data_Source_Id = null;
    public String Value = null;
    public String Text = null;
    public String ParentValue = null;
}