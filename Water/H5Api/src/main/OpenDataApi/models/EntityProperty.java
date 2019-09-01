package OpenDataApi.models;

import OpenDataAccess.Entity.EntityModel;
import OpenDataAccess.Entity.IEntity;
import OpenDataAccess.Entity.ITablePropertyAttribute;


@ITablePropertyAttribute(Name = "t_d_Entity_Property",PrimaryKey = "Id")
public class EntityProperty extends EntityModel implements IEntity {
    public String Id = null;
    public String Entity_Id = null;
    public String Name = null;
    public String Type = null;
}