package Model;

import OpenDataAccess.Entity.EntityModel;
import OpenDataAccess.Entity.IEntity;
import OpenDataAccess.Entity.ITablePropertyAttribute;

@ITablePropertyAttribute(Name = "t_d_Event_Parameter")
public class EventParameter extends EntityModel implements IEntity {
    public String EventId = null;
    public String Name = null;
    public String Label = null;
    public String DataType = null;
    public String ControlType = null;
    public int LabelWidth = 0;
    public int ControlWidth = 0;
    public int X = 0;
    public int Y = 0;
    public String CacheId = null;
    public byte IsNullable = 0;
}