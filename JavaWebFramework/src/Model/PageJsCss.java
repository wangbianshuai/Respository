package Model;

import OpenDataAccess.Entity.EntityModel;
import OpenDataAccess.Entity.IEntity;
import OpenDataAccess.Entity.TablePropertyAttribute;

@TablePropertyAttribute(Name = "t_d_Page_JsCss")
public class PageJsCss extends EntityModel implements IEntity {
    public String PageId = null;
    public String Id = null;
    public int DisplayIndex = 0;
}