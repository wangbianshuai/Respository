package OpenDataApi.models;

import OpenDataAccess.Entity.EntityModel;
import OpenDataAccess.Entity.IEntity;
import OpenDataAccess.Entity.ITablePropertyAttribute;


@ITablePropertyAttribute(Name = "t_d_Entity_Property",PrimaryKey = "Id")
public class KeyValue extends EntityModel implements IEntity {
    public String Id = null;
    public String Name = null;
    public String Value = null;
    public String Data_Id = null;
}