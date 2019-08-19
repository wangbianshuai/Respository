package OpenDataApi.models;

import OpenDataAccess.Entity.EntityModel;
import OpenDataAccess.Entity.IEntity;
import OpenDataAccess.Entity.ITablePropertyAttribute;

@ITablePropertyAttribute(Name = "t_d_Action",PrimaryKey = "Id")
public class Action extends EntityModel implements IEntity {
    public String Id = null;
    public String Action_Name = null;
    public String Dva_Model_Id = null;
    public String Url = null;
    public String State_Name = null;
    public String Method = null;
    public String Data_Key = null;
    public boolean Is_Token = false;
    public boolean Is_Operation = false;
    public boolean Has_Token = false;

}