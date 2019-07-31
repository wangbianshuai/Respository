package Model;

import OpenDataAccess.Entity.EntityModel;
import OpenDataAccess.Entity.IEntity;
import OpenDataAccess.Entity.ITablePropertyAttribute;

@ITablePropertyAttribute(Name = "view_PageHead_JsCss")
public class ViewPageHeadJsCss  extends EntityModel implements IEntity {
    public String PageHeadId = null;
    public String Id = null;
    public int DisplayIndex = 0;
    public String Name = null;
    public byte Type = 0;
    public String Path = null;
}