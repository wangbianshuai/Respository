package Model;

import OpenDataAccess.Entity.EntityModel;
import OpenDataAccess.Entity.IEntity;
import OpenDataAccess.Entity.ITablePropertyAttribute;

@ITablePropertyAttribute(Name = "t_d_PageHead_JsCss")
public class PageHeadJsCss  extends EntityModel implements IEntity {
    public String PageHeadId = null;
    public String Id = null;
    public int DisplayIndex = 0;
}